import jwt from 'jsonwebtoken';
import { envs } from '../../config/envs';


export class JwtAdapter {

    static async generateToken(payload: any, duration: string = '2h') {
        return new Promise((resolve) => {
            jwt.sign(payload, envs.JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null)
                return resolve(token)
            });
        })
    };

    static async decodeToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, envs.JWT_SEED, (err, decoded) => {
                if (err) return resolve(null)
                resolve(decoded as T)
            })
            return resolve
        })
    }
}