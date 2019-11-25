const express = require('express');
const app = express();

const port = 8580;

function Home(req, res) {
    res.send('Home');
}

function Question(req, res) {
res.send('Question');
}

function Analytic(req, res) {
    res.send('Analytic');
}

function Answer(req, res) {
    res.send('Ansvare');
}

app.get('/', Home);
app.get('/variants', Question);
app.post('/stat', Analytic);
app.post('/vote', Answer);
app.listen(port);