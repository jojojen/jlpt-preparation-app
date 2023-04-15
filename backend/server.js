/* server.js */
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');
const yamlPath = path.join(__dirname, 'swagger.yaml');
// const swaggerDocument = yaml.load(yamlPath);
require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');
const fs = require('fs');

// Connect to MongoDB
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create an express app
const app = express();
app.use(express.json());

// Update host in swagger.yaml based on environment
const swaggerContent = fs.readFileSync(yamlPath, 'utf8');
const host = process.env.NODE_ENV === 'production' ? 'jlpt-app-backend.vercel.app' : 'jlpt-app-backend-jojojen.vercel.app';
const updatedSwaggerContent = swaggerContent.replace(/host: .*/, `host: ${host}`);
const swaggerDocument = yaml.parse(updatedSwaggerContent);

// Setup swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CORS settings
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Use CORS with the specified options
app.use(cors(corsOptions));

// Use routes
app.use(routes);

module.exports = app;
