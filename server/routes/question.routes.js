require('../models/question.model.js');

const startQuestionRoutes = (app) => {
    const questions = require ('../controllers/question.controller.js');
    const router = require('express').Router();

    router.post('/new-question', questions.create);
    router.post('/receive-all', questions.getAll);
    router.delete('/delete/:id', questions.deleteById);
    router.patch('/update/:id', questions.update);
    router.get('/count-answers/:id', questions.countAnswers);
    
    app.use('/questions', router);
}

module.exports = { startQuestionRoutes };