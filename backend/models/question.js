// models/question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  _id: String,
  questionJSON: String,
  explain: String,
  feedbacks: [
    {
      rating: Number,
      comment: String,
    },
  ],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
