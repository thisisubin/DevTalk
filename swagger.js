const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DevTalk API',
            version: '1.0.0',
            description: 'DevTalk SNS 프로젝트 API 문서',
            contact: {
                name: 'DevTalk Team',
                email: 'devtalk@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:8001',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        email: { type: 'string', format: 'email' },
                        nick: { type: 'string', maxLength: 15 },
                        provider: { type: 'string', enum: ['local', 'kakao'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Post: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        content: { type: 'string', maxLength: 140 },
                        img: { type: 'string' },
                        UserId: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Hashtag: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string', maxLength: 15 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        './routes/*.js',
        './controllers/*.js',
        './models/*.js'
    ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
