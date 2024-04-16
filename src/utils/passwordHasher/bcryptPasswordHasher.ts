import bcrypt from 'bcrypt';
import { PasswordHasher } from './passwordHasher';

export class BcryptPasswordHasher implements PasswordHasher {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
}