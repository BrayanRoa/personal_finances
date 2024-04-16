1. Install node module

2. clone the .env.template file and copy all the data into a new file called .env

3. run the container docker ```docker compose up -d```

4. execute the following commands, execute the second command only if you want to create the tables from the prisma.schema file

```npx prisma init --datasource-provider postgresql```

```npx prisma migrate dev --name init```

