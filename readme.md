1. Install node module

2. clone the .env.template file and copy all the data into a new file called .env

3. run the container docker ```docker compose up -d```

4. execute the following commands, execute the second command only if you want to create the tables from the prisma.schema file

```npx prisma init --datasource-provider postgresql```

```npx prisma migrate dev --name init```

5. execute the following commands
```npm run seed```

```npx run dev``

## if you want to create or update your image in dockerhub, execute the following commands

```docker build -t user-name/name-of-image:latest .```

```docker push bryanmiusuario/miproyecto:latest```