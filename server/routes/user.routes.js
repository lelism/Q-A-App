require('../models/user.model.js');

const startUserRoutes = (app) => {
    const users = require ('../controllers/user.controller.js');
    const router = require('express').Router();

    router.post('/signup', users.signUp);
    router.post('/login', users.login);
    router.post('/details', users.getDetails);
    
    app.use('/users', router);
}

module.exports = { startUserRoutes };