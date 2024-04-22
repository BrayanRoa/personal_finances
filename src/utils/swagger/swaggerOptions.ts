import swaggerJsdoc from 'swagger-jsdoc';
import { envs } from '../../config/envs';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mi API con Swagger',
            version: '1.0.0',
            description: 'Esta es una documentación de API con Swagger',
        },
        components: {
            securitySchemes: {
                Bearer: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                Bearer: [],
            },
        ],
        servers: [
            {
                url: envs.WEB_SERVICE_URL,  // Aquí colocas la base de tu url
            },
        ],
    },
    // Señala los archivos que incluyen anotaciones Swagger.
    apis: ['**/*.routes.ts'], // Si estás utilizando JavaScript, debería ser ['**/*.routes.js']
};

export const swaggerDocs = swaggerJsdoc(options);