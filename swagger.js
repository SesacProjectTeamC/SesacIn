// Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./swaggerDefinition.json'); // JSON 파일 불러오기

// Swagger 정의 옵션 설정
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec, swaggerDefinition };
