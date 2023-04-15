// controllers/questionController.js
const Question = require('../models/question');

const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (question) {
      res.status(200).send(question);
    } else {
      res.status(404).send({ error: 'Question not found' });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).send(question);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndUpdate(id, req.body, { new: true });
    if (question) {
      res.status(200).send(question);
    } else {
      res.status(404).send({ error: 'Question not found' });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    if (question) {
      res.status(200).send({ message: 'Question deleted' });
    } else {
      res.status(404).send({ error: 'Question not found' });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const question = await Question.findById(id);

    if (question) {
      question.feedbacks.push({ rating, comment });
      await question.save();
      res.status(200).send(question);
    } else {
      res.status(404).send({ error: 'Question not found' });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getTopQuestions = async (req, res) => {
  const n = parseInt(req.query.n);

  if (isNaN(n) || n <= 0) {
    return res.status(400).json({ message: 'Invalid value for parameter "n"' });
  }

  try {
    const topQuestions = await Question.find({
      'feedbacks.rating': 1,
    })
      .limit(n)
      .exec();

    res.status(200).json(topQuestions);
  } catch (error) {
    res.status(500).json({ message: 'Error while retrieving questions', error });
  }
};

module.exports = {
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  addComment,
  getTopQuestions
};
