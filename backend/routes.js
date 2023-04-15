// routes.js
const express = require('express');
const router = express.Router();
const { getQuestion, createQuestion, updateQuestion, deleteQuestion } = require('./controllers/questionController');

router.post('/question', createQuestion);
router.get('/question/:id', getQuestion);
router.put('/question/:id', updateQuestion);
router.delete('/question/:id', deleteQuestion);

module.exports = router;
