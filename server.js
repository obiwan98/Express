const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const groupRoutes = require('./routes/group');
const bookRoutes = require('./routes/book');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { MONGODB_URI, PORT } = process.env;

mongoose.connect(MONGODB_URI, {
  ssl: true,
  tlsAllowInvalidCertificates: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Swagger 설정
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation with Swagger',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'],  // 주석이 포함된 파일 경로
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
