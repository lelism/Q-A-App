const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./configDB/db');

const port = process.env.PORT || 4000;

// console.clear();

const app = express();
app.use(express.json());
app.use(cors());
// app.use(cors({ origin: '*' }));

const { startUserRoutes } = require('./routes/user.routes.js');
const { startQuestionRoutes } = require('../server/routes/question.routes.js');
const { startAnswerRoutes } = require('../server/routes/answer.routes.js');

startUserRoutes(app);
startQuestionRoutes(app);
startAnswerRoutes(app);

// Heartbeat route
app.get('/version', (req, res) => {
    res.status(200).json({ version: 'Q&A v1.0.3' });
});

app.listen(port, () => {
    console.log('Server is listening at port ' + port);
});
