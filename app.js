const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Habilita CORS para todas as rotas com opções
const corsOptions = {
    origin: '*', // Permite requisições de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
};
app.use(cors(corsOptions));

// Middleware para interpretar JSON
app.use(bodyParser.json());
app.use(express.json());

// Definições do Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Tarefas do EX Ctrl',
            version: '1.0.0',
            description: 'API para gerenciamento de tarefas',
        },
        servers: [
            {
                url: 'http://localhost:4020', // Certifique-se de que a porta está correta
            },
        ],
    },
    apis: ['./routes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Usar as rotas definidas no arquivo routes.js sem o prefixo '/api'
app.use(routes);

// Tratamento de erro genérico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
