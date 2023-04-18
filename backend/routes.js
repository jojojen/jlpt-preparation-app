const express = require('express');
const router = express.Router();
const questionController = require('./controllers/questionController');
const userController = require('./controllers/userController');

router.post('/question', questionController.createQuestion);
router.get('/question/:id', questionController.getQuestion);
router.put('/question/:id', questionController.updateQuestion);
router.delete('/question/:id', questionController.deleteQuestion);

router.post('/question/:id/comment', questionController.addComment);
router.get('/questions/top', questionController.getTopQuestions);
router.get('/questions/random', questionController.getRandomQuestions);

router.post('/user/login', userController.loginOrCreateUser);

// user
router.get('/user/:id', userController.getUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
