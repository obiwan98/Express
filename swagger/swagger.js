const path = require('path');
const fs = require('fs');
require("dotenv").config();
const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});
// Swagger 설정
const LOCAL_URL = process.env.LOCAL_URL;
const PROD_URL = process.env.PROD_URL;
const SERVER_URL = process.env.NODE_ENV === "production" ? PROD_URL : LOCAL_URL;


console.log('-------------');
console.log(SERVER_URL);

const doc = {
    
    info: {
      title: "BSS API",
      version: "1.0.0",
      description: "BSS에서 사용되는 API 테스트 문서",
    },
    servers: [
      {
        url: SERVER_URL,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
};

const outputFile = "./swagger-output.json";
const routesDirectory = path.join(__dirname, '../routes');
const endpointsFiles = fs.readdirSync(routesDirectory)
  .filter(file => file.endsWith('.js'))  // .js 파일 필터링
  .map(file => path.join(routesDirectory, file));  // 전체 경로로 변환

swaggerAutogen(outputFile, endpointsFiles, doc);