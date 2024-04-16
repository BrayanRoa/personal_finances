import nodemailer, { Transporter } from 'nodemailer';
import { envs } from '../../config/envs';
import { JwtAdapter } from '../jwt/jwt';
import path from 'path';

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



    async sendEmailToTransport(options: SendEmailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachements = [] } = options;
        const data = await this.transporter.sendMail(
            { to, subject, html: htmlBody, attachments: attachements }
        )
        console.log(data);
        return true
    }

    async welcomeEmail(id:string, email:string) {

        const token = await JwtAdapter.generateToken({ id });

        const file = path.resolve(__dirname, "../../../public/assets/heroes/dc-arrow.jpg")
        const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`
        // const htmlFilePath = path.resolve(__dirname, "../../../templates/email/email-template.html");
        const options = {
            to: email,
            subject: "This is a test",
            htmlBody: `
                <div class="welcome-card">
                    <img class="card-image" src="welcome.jpg" alt="Card Image">
                    <h2 class="card-title">¡Bienvenido a Nuestra Aplicación!</h2>
                    <p class="card-description">Estamos emocionados de tenerte aquí. Empieza a explorar todas nuestras características.</p>
                    <a href=${link}>validate-token</a>
                </div>`,
            attachments: [
                {
                    filename: "hero.jpg",
                    path: file
                }
            ]
        }
        // Lee el contenido del archivo
        await this.sendEmailToTransport(options)
    }
}