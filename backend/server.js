const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');
const yamlPath = path.join(__dirname, 'swagger.yaml');
const swaggerDocument = yaml.load(yamlPath);
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

// CORS settings
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Use CORS with the specified options
app.use(cors(corsOptions));

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

// NEW: GET all feedbacks with "good" feedback
app.get('/feedback/good-uids', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ feedback: 'good' }).select('uid');
    const uidList = feedbacks.map(feedback => feedback.uid);
    res.status(200).send(uidList);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// GET questionJSON by uid
app.get('/feedback/question/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const feedback = await Feedback.findOne({ uid });
    if (feedback) {
      res.status(200).send({ questionJSON: feedback.questionJSON });
    } else {
      res.status(404).send({ error: 'Feedback not found' });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


// local testing
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });
module.exports = app;
