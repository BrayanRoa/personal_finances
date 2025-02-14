# Usa una imagen Debian para mejor compatibilidad con Prisma
FROM node:18-bullseye

# Instalar OpenSSL 1.1 y sus dependencias
RUN apt-get update && apt-get install -y libssl1.1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# 🔥 Asegúrate de compilar el código TypeScript antes de ejecutar la app
RUN npm run build  

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/app.js"]
