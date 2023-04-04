const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
require('dotenv').config();
const cors = require('cors');

// Connect to MongoDB
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create feedback schema and model
const feedbackSchema = new mongoose.Schema({
  uid: String,
  questionJSON: String,
  feedback: String,
  comment: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Create an express app
const app = express();
app.use(express.json());

// Setup swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// cors
app.use(cors());

// POST feedback endpoint
app.post('/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).send(feedback);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
