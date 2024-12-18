import { WalletDatasource } from "../../domain/datasources/wallet.datasource";
import { CreateWalletDto } from "../../domain/dtos/wallet/create-wallet.dto";
import { UpdateWalletDto } from "../../domain/dtos/wallet/update-wallet.dto";
import { WalletEntity } from "../../domain/entities/wallet/wallet.entity";
import { IMonthlyBalanceByWallet, IncomesAndExpensesByWallet } from "../../domain/interfaces/wallets/wallets.interface";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { DashboardInterface } from "../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../utils/response/custom.response";
// import _ from 'lodash';


export class WalletDatasourceImp extends BaseDatasource implements WalletDatasource {

    constructor() {
        super()
        this.audit_class = "WALLET"
    }
    infoWallet(id: number, userId: string): Promise<DashboardInterface | CustomResponse> {
        return this.handleErrors(async () => {
            let totalIncome = 0;
            let totalExpenses = 0;

            const [income, expenses] = await Promise.all([
                BaseDatasource.prisma.transaction.aggregate({
                    _sum: {
                        amount: true
                    },
                    where: {
                        AND: [
                            { deleted_at: null, userId: userId, type: "INCOME", walletId: id },
                        ],
                    },
                }),
                BaseDatasource.prisma.transaction.aggregate({
                    _sum: {
                        amount: true
                    },
                    where: {
                        AND: [
                            { deleted_at: null, userId: userId, type: "OUTFLOW", walletId: id },
                        ],
                    },
                }),
            ]);

            totalIncome = income._sum.amount ? income._sum.amount : 0;
            totalExpenses = expenses._sum.amount ? expenses._sum.amount : 0;
            return {
                totalIncome,
                totalExpenses,
                availableAmount: (totalIncome - totalExpenses)
            }
        })
    }

    getAll(userId: string): Promise<CustomResponse | WalletEntity[]> {
        return this.handleErrors(async () => {
            const wallets = await BaseDatasource.prisma.wallet.findMany({
                where: {
                    AND: [
                        { deleted_at: null }, { userId }
                    ]
                },
            })
            return wallets.map(item => WalletEntity.fromObject(item))
        })
    }
    create(data: CreateWalletDto, user_audits: string): Promise<WalletEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const exist = await this.exist(data.userId, data.name)
            if (exist) return new CustomResponse(`Already exist wallet with name: ${data.name}`, 400)
            const new_wallet = await BaseDatasource.prisma.wallet.create({ data })
            this.auditSave(new_wallet.id, new_wallet, "CREATE", user_audits)
            return WalletEntity.fromObject(new_wallet)
        })
    }
    delete(id: number, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const data = await BaseDatasource.prisma.wallet.updateMany({
                where: {
                    AND: [{ id, userId: user_audits }]
                },
                data: {
                    deleted_at: new Date()
                }
            })
            if (data.count === 0) return new CustomResponse("Wallet not found", 404)
            this.auditSave(id, { id: id }, "DELETE", user_audits)
            return "Wallet deleted successfully"
        })
    }
    findById(id: number, userId: string): Promise<CustomResponse | WalletEntity> {
        return this.handleErrors(async () => {
            const wallet = await BaseDatasource.prisma.wallet.findUnique({
                where: {
                    id, userId
                },
                include: { transactions: true }
            })
            if (!wallet) return new CustomResponse("Wallet not found", 404)
            return WalletEntity.fromObject(wallet)
        })
    }

    findByIds(id: number[]): Promise<CustomResponse | WalletEntity[]> {
        return this.handleErrors(async () => {
            const wallets = await BaseDatasource.prisma.wallet.findMany({
                where: {
                    id: {
                        in: id
                    }
                },
                include: { transactions: true }
            })
            if (!wallets || wallets.length === 0) return new CustomResponse("Wallet not found", 404)
            return wallets.map(wallet => WalletEntity.fromObject(wallet))
        })
    }
    update(id: number, data: UpdateWalletDto, user_audits: string): Promise<string | CustomResponse> {
        const { userId, ...rest } = data
        return this.handleErrors(async () => {
            const wallet = await BaseDatasource.prisma.wallet.updateMany({
                where: {
                    AND: [{ id }, { userId }]
                },
                data: rest
            })
            if (wallet.count === 0) return new CustomResponse("Wallet not found", 404)
            this.auditSave(id, rest, "UPDATE", user_audits)
            return "Wallet updated successfully"
        })
    }

    async exist(userId: string, param: string): Promise<boolean> {

        const data = await BaseDatasource.prisma.wallet.findFirst({
            where: {
                AND: [
                    { name: param },
                    { userId: userId },
                    { deleted_at: null }
                ]
            }
        });
        return !!data // Esto devolverá true si data no es nulo y false si data es nulo
    }

    totalIncomesAndExpensesByWallet(userId: string): Promise<CustomResponse | IncomesAndExpensesByWallet[]> {
        return this.handleErrors(async () => {
            await this.monthlyBalanceByWallet(userId, 2024)
            const result: IncomesAndExpensesByWallet[] = await BaseDatasource.prisma.$queryRaw`
                SELECT w."name", t."type", SUM(t."amount") AS total
                FROM "Wallet" w
                JOIN "Transaction" t ON t."walletId" = w."id"
                WHERE w."deleted_at" IS NULL AND t."deleted_at" IS NULL AND t."userId" = ${userId}
                GROUP BY w."name", t."type"
                `;
            return result
        })
    }

    // con este metodo obtengo los balances mensuales de cada uno de los bancos segun el año que quiera el usuario
    monthlyBalanceByWallet(userId: string, year: number): Promise<CustomResponse | IMonthlyBalanceByWallet[]> {
        return this.handleErrors(async () => {
            const result: IMonthlyBalanceByWallet[] = await BaseDatasource.prisma.$queryRaw`
                SELECT 
                    month,
                    name,
                    SUM(income) - SUM(outflow) AS balance
                FROM (
                    SELECT 
                        w."name" AS name,
                        to_char(t.date, 'YYYY-MM') AS month,
                        CASE WHEN t."type" = 'INCOME' THEN SUM(t.amount) ELSE 0 END AS income,
                        CASE WHEN t."type" = 'OUTFLOW' THEN SUM(t.amount) ELSE 0 END AS outflow
                    FROM 
                        "Transaction" t
                    JOIN 
                        "Wallet" w ON w.id = t."walletId"
                    WHERE 
                        t.deleted_at IS NULL 
                        AND EXTRACT(YEAR FROM t.date) = ${year}
                        AND t."userId" = ${userId}
                    GROUP BY 
                        w."name", t."type", to_char(t.date, 'YYYY-MM')
                ) AS subquery
                GROUP BY 
                    month, name
                ORDER BY 
                    name;
                `;
            return result
        })
    }
}