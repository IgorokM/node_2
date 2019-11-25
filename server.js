const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8580;
const pathToStatic = `${__dirname}/view`;

app.use(bodyParser.json());

app.use(express.static(pathToStatic));

function Question(req, res) {
    
}

function Analytic(req, res) {
    
}

function Answer(req, res) {
    res.send(req.body.answer);
}

app.get('/variants', Question);
app.post('/stat', Analytic);
app.post('/vote', Answer);
app.listen(port);