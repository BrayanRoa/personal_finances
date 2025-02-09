// import dotenv from 'dotenv';
// import path from 'path';
// import { get } from 'env-var';

// // Determina el entorno y carga el archivo .env correspondiente
// const env = get('NODE_ENV').required().asString();

// let envPath;

// if (env === 'development') {
//   envPath = path.resolve(process.cwd(), '.env');
// } else {
//   envPath = path.resolve(process.cwd(), `.env.${env}`);
// }
// console.log(env);
// dotenv.config({
//   path: envPath,
// });

// // Después de esto, puedes seguir utilizando env-var como lo haces actualmente:
// export const envs = {
//   PORT: get("PORT").required().default(3000).asInt(),
//   PUBLIC_PATH: get("PUBLIC_PATH").default("public").asString(),
//   JWT_SEED: get("JWT_SEED").required().asString(),
//   MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
//   MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),
//   MAILER_EMAIL: get("MAILER_EMAIL").required().asEmailString(),
//   WEB_SERVICE_URL: get("WEB_SERVICE_URL").required().asString()
// }


import dotenv from 'dotenv';
import { get } from 'env-var';

// Aquí no necesitas cargar un archivo .env.production
dotenv.config();  // Solo carga el archivo .env si estás en desarrollo, ya que las variables en producción están configuradas en Railway

export const envs = {
  PORT: get("PORT").required().asInt(),
  PUBLIC_PATH: get("PUBLIC_PATH").default("public").asString(),
  JWT_SEED: get("JWT_SEED").required().asString(),
  MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
  MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),
  MAILER_EMAIL: get("MAILER_EMAIL").required().asEmailString(),
  WEB_SERVICE_URL: get("WEB_SERVICE_URL").required().asString()
}
