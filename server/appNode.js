const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./configDB/db');

const port = process.env.PORT || 4000;

// console.clear();

const app = express();
app.use(express.json());
app.use(cors());

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const { startUserRoutes } = require('./routes/user.routes.js');
const { startQuestionRoutes } = require('../server/routes/question.routes.js');
const { startAnswerRoutes } = require('../server/routes/answer.routes.js');
const { verifyToken } = require('./utils/functions');

startUserRoutes(app);
startQuestionRoutes(app);
startAnswerRoutes(app);

// Heartbeat route
app.get('/version', (req, res) => {
    console.log(verifyToken(req.headers['token']));
    console.log('praejo');
    res.status(200).json({ version: 'Q&A v1.0.4' });
});

app.listen(port, () => {
    console.log('Server is listening at port ' + port);
});
