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
  WEB_SERVICE_URL: get("WEB_SERVICE_URL").required().asString(),
  FIREBASE_PROJECT_ID: get("FIREBASE_PROJECT_ID").required().asString(),
  FIREBASE_PRIVATE_KEY: get("FIREBASE_PRIVATE_KEY").required().asString(),
  FIREBASE_CLIENT_EMAIL: get("FIREBASE_CLIENT_EMAIL").required().asString()
}
