const express = require('express');
const router = express.Router();
const {
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    addComment,
    getTopQuestions,
} = require('./controllers/questionController');
const userController = require('./controllers/userController');

router.post('/question', createQuestion);
router.get('/question/:id', getQuestion);
router.put('/question/:id', updateQuestion);
router.delete('/question/:id', deleteQuestion);

router.post('/question/:id/comment', addComment);
router.get('/questions/top', getTopQuestions);

router.post('/user/login', userController.loginOrCreateUser);

// user
router.get('/user/:id', userController.getUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
