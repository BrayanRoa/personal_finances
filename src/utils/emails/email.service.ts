import nodemailer, { Transporter } from 'nodemailer';
import { envs } from '../../config/envs';
import { JwtAdapter } from '../jwt/jwt';
import fs from 'fs';
import handlebars from 'handlebars';


interface SendEmailOptions {
    to: string | string[]; // se puede enviar a una sola persona o a muchas
    subject: string,
    htmlBody: string,
    attachements?: Attachement[]
}

interface Attachement {
    filename: string,
    path: string,
    contenType: string
}

interface NodemailerError extends Error {
    errno: number;
    code: string;
    syscall: string;
    path: string;
    command: string;
}

export class EmailService {

    private transporter: Transporter

    constructor(
        mailService: string,
        mailerEmail: string,
        senderEmailPassword: string
    ) {
        this.transporter = nodemailer.createTransport({
            service: mailService,
            auth: {
                user: mailerEmail,
                pass: senderEmailPassword
            }
        });
    }

    async welcomeEmail(id: string, email: string, name: string) {
        fs.readFile('src/templates/welcomeEmail/email-template.html', 'utf-8', async (err, source) => {
            const token = await JwtAdapter.generateToken({ id });
            const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`

            if (err) throw err;

            const template = handlebars.compile(source);
            const replacements = {
                name,
                link
            };
            const htmlToSend = template(replacements);

            const mailOptions = {
                to: email,
                subject: 'Welcome!',
                html: htmlToSend
            };

            this.transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }

    async budgetExceeded(email: string, name: string, budget_name: string, budget_amount: number, current_spending: number) {
        fs.readFile('src/templates/budgetExceeded/budgetExceeded.html', 'utf-8', async (err, source) => {

            if (err) throw err;
            // Formatear las cantidades
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            const formattedBudget = formatter.format(budget_amount);
            const formattedSpending = formatter.format(current_spending);
            const formattedExcess = formatter.format(current_spending - budget_amount);

            const bussines_name = "TO BE DEFINED"
            const template = handlebars.compile(source);
            const replacements = { name, budget_name, bussines_name, budget_amount: formattedBudget, current_spending: formattedSpending, budget_excess: formattedExcess };
            const htmlToSend = template(replacements);

            const mailOptions = {
                to: email,
                subject: 'Exceeded its budget',
                html: htmlToSend
            };

            this.transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }
}