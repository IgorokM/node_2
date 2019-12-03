const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const util = require('util');
const app = express();
const port = 8580;
const pathToStatic = `${__dirname}/view`;
const dbConnect = {
    user: 'node',
    password: '1234',
    database: 'node_2'
};


app.use(bodyParser.json());
app.use(express.urlencoded());
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

async function selectToMysql(query) {
    let db = null;
    let result = null;
    try {
        db = Db(dbConnect);
        result = await db.query(query);
    } catch (e) {
        result = {
            error: e.message,
            code: e.code
        };
    } finally {
        db.close();
    }
    db = null;
    return result;
}

async function updateInsertToMysql(query) {
    let db = null;
    let result = null;
    try {
        db = Db(dbConnect);
        await db.beginTransaction();
        result = await db.query(query);
        db.commit();
    } catch (e) {
        db.rollback();
        result = {
            error: e.message,
            code: e.code
        };
    } finally {
        db.close();
    }
    db = null;
    return result;
}


async function Question(req, res) {
    const data = await selectToMysql('SELECT name FROM answer');
    if (data.hasOwnProperty('error')) {
        res.status(400).send(data);
    } else {
        res.send(data);
    }

}

async function Analytic(req, res) {
    const data = await selectToMysql('SELECT name, count FROM answer');
    if (data.hasOwnProperty('error')) {
        res.status(400).send(data);
    } else {
        res.send(data);
    }
}

async function DownloadAnalytic(req, res) {
    const data = await selectToMysql('SELECT name, count FROM answer');
    let result = '';
    if (data.hasOwnProperty('error')) {
        res.status(400).send(data);
    } else {
        const accept = req.body.accept;
        switch (accept) {
            case 'text/html':
                if (Array.isArray(data)) {
                    res.set('Content-Type', 'text/html');
                    for (let row of data) {
                        result += `<p style="color:white;background-color:black;font-size:3rem">${row.name}: <span style="color:red">${row.count}</span></p>`
                    }
                }
                break;
            case 'application/xml':
                result = '<data>';
                res.set('Content-Type', 'application/xml');
                if (Array.isArray(data)) {
                    for (let row of data) {
                        result += `<name>${row.name}:</name><count>${row.count}</count>`;
                    }
                }
                result += '</data>';
                break;
            case 'application/json':
                res.set('Content-Type', 'application/json');
                result = data;
            break;
        }
        res.set('Content-Disposition', 'attachment;');
        res.send(result);
    }
}

async function Answer(req, res) {
    const answer = req.body.answer;
    let data = await selectToMysql(`SELECT count FROM answer WHERE name = '${answer}'`);
    console.log(data);
    const count = ++data[0].count;
    const result = {
        count: 0,
        result: false
    };
    data = await updateInsertToMysql(`UPDATE answer SET count = ${count} WHERE name = '${answer}'`);
    if (data.changedRows) {
        result.count = count;
        result.result = true;
    }
    res.send(result);
}

app.get('/variants', Question);
app.post('/dowloadStat', DownloadAnalytic);
app.post('/stat', Analytic);
app.post('/vote', Answer);
app.listen(port);