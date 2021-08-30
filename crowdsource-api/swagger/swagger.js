const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Crowdsource API',
    description: 'Swagger API Documentation for Crowdsource',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger/swagger-output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
