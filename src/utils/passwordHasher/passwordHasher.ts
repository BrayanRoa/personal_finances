

export abstract class PasswordHasher {
    abstract hashPassword(password: string): Promise<string>;
    abstract verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}