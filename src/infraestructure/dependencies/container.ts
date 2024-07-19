import { createContainer, asClass, InjectionMode, AwilixContainer } from 'awilix';
import { AuthDatasourceImp } from '../datasource/auth.datasource.imp';
import { AuthRepositoryImpl } from '../repositories/auth.repository.imp';
import { BcryptPasswordHasher } from '../../utils/passwordHasher/bcryptPasswordHasher';
import { EmailService } from '../../utils/emails/email.service';
import { envs } from './../../config/envs';
import { CategoryRepositoryImp } from '../repositories/category.repository.imp';
import { CategoryDatasourceImp } from '../datasource/category.datasource.imp';
import { TransactionDatasourceImp } from '../datasource/transaction.datasource.imp';
import { TransactionRepositoryImp } from '../repositories/transaction.repository.imp';
import { UserDatasourceImp } from '../datasource/user.datasource.imp';
import { UserRepositoryImpl } from '../repositories/user.repository.imp';
import { WalletDatasourceImp } from '../datasource/wallet.datasource.imp';
import { WalletRepositoryImp } from '../repositories/wallet.repository.imp';
import { BudgetRepositoryImp } from '../repositories/budget.repository.imp';
import { BudgetDatasourceImp } from '../datasource/budget.datasource.imp';
import { NotificationRepositoryImp } from '../repositories/notification.repository.imp';
import { NotificationDatasourceImp } from '../datasource/notification.datasource.imp';

interface IContainer {
    passwordHasher: BcryptPasswordHasher,
    authDatasource: AuthDatasourceImp,
    authRepository: AuthRepositoryImpl,
    emailService: EmailService,
    categoryDatasource: CategoryDatasourceImp,
    categoryRepository: CategoryRepositoryImp,
    transactionDatasource: TransactionDatasourceImp,
    transactionRepository: TransactionRepositoryImp,
    userDatasource: UserDatasourceImp,
    userRepository: UserRepositoryImpl,
    walletDatasource: WalletDatasourceImp,
    walletRepository: WalletRepositoryImp,
    budgetDatasource: BudgetDatasourceImp,
    budgetRepository: BudgetRepositoryImp,
    notificationDatasource: NotificationDatasourceImp,
    notificationRepository: NotificationRepositoryImp
}

export const container: AwilixContainer<IContainer> = createContainer<IContainer>({
    injectionMode: InjectionMode.CLASSIC,
    strict: true
});
;
container.register({
    passwordHasher: asClass(BcryptPasswordHasher).singleton(),
    authDatasource: asClass(AuthDatasourceImp).singleton(),
    authRepository: asClass(AuthRepositoryImpl).singleton(),
    emailService: asClass(EmailService).singleton().inject(() => ({
        mailService: envs.MAILER_SERVICE,
        mailerEmail: envs.MAILER_EMAIL,
        senderEmailPassword: envs.MAILER_SECRET_KEY
    })),

    categoryDatasource: asClass(CategoryDatasourceImp).singleton(),
    categoryRepository: asClass(CategoryRepositoryImp).singleton(),

    transactionDatasource: asClass(TransactionDatasourceImp).singleton(),
    transactionRepository: asClass(TransactionRepositoryImp).singleton(),

    userDatasource: asClass(UserDatasourceImp).singleton(),
    userRepository: asClass(UserRepositoryImpl).singleton(),

    walletDatasource: asClass(WalletDatasourceImp).singleton(),
    walletRepository: asClass(WalletRepositoryImp).singleton(),

    budgetDatasource: asClass(BudgetDatasourceImp).singleton(),
    budgetRepository: asClass(BudgetRepositoryImp).singleton(),
    notificationDatasource: asClass(NotificationDatasourceImp).singleton(),
    notificationRepository: asClass(NotificationRepositoryImp).singleton()
});