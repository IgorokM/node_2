const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const util = require('util');
const app = express();
const port = 8580;
const pathToStatic = `${__dirname}/view`;
const dbConnect = { user: 'node', password: '1234', database: 'node_2' };


app.use(bodyParser.json());
app.use(express.static(pathToStatic));


function Db(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        },
        beginTransaction() {
            return util.promisify(connection.beginTransaction)
                .call(connection);
        },
        commit() {
            return util.promisify(connection.commit)
                .call(connection);
        },
        rollback() {
            return util.promisify(connection.rollback)
                .call(connection);
        }
    };
}

// function Question(req, res) {

// }

async function Analytic(req, res) {
    let db = null;
    try {
        db = Db(dbConnect);
        await db.beginTransaction();
        res.send(await db.query(`SELECT name, count FROM answer`));
    } catch (e) {
        db.rollback();
        res.status(400).send({ error: e.message, code: e.code });
    }finally{
        db.close();
    }
    db = null;
}

async function Answer(req, res) {
    let db = null;
    try {
        db = Db(dbConnect);
        await db.beginTransaction();
        const answer = req.body.answer;
        const data = await db.query(`SELECT count FROM answer WHERE name = ${answer}`);
        const count = ++data[0].count;
        const resuilt = await db.query(`UPDATE answer SET count = ${count} WHERE name = ${answer}`);
        db.commit();
        if (resuilt.changedRows) {
            res.send({ name: answer, result: true });
        } else {
            res.send({ name: answer, result: false });
        }
    } catch (e) {
        db.rollback();
        res.status(400).send({ error: e.message, code: e.code });
    } finally {
        db.close();
    }
    db = null;
}

//app.get('/variants', Question);
app.post('/stat', Analytic);
app.post('/vote', Answer);
app.listen(port);