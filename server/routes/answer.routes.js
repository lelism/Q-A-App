require('../models/answer.model.js');

const startAnswerRoutes = (app) => {
    const answers = require ('../controllers/answer.controller.js');
    const router = require('express').Router();

    router.post('/new-answer', answers.create);
    router.post('/get-answers', answers.getAnswers);
    router.delete('/delete/:id', answers.deleteById);
    router.patch('/update/:id', answers.update);
    router.post('/like', answers.like);
    router.post('/isLiked', answers.isLiked);
    router.delete('/delete-like', answers.deleteLike);
    
    app.use('/answers', router);
}

module.exports = { startAnswerRoutes };