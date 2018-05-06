"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = db => {
    let handler = (res, qsql) => {
        let handler = recordset => {
            //   console.log(recordset);
            res.json({ data: recordset["recordset"] });
        };

        let errHandler = err => {
            res.status(400).send(err);
        };

        db(qsql, handler, errHandler);
    };

    let postHandler = (res, qsql) => {
        let handler = recordset => {
            //   console.log(recordset);
            res.sendStatus(202);
        };

        let errHandler = err => {
            res.status(400).send(err);
        };

        db(qsql, handler, errHandler);
    };

    let router = express.Router();

    router.use(bodyParser.json()); // support json encoded bodies
    router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    // select proposal ids in stage2(grade)
    router.get("/grade/p", (req, res) => {
        let qsql = `SELECT proposal_id FROM stage.stage2`;
        handler(res, qsql);
    });

    // update proposal ids in stage2(grade)
    router.post("/grade/p", (req, res) => {
        let ps = req.body.ps;
        let qsql = `BEGIN DELETE FROM stage.stage2; `;
        for (let p of ps) {
            qsql += ` INSERT INTO stage.stage2 (proposal_id, grade_final) VALUES ('${p}', 0); `
        }
        qsql += `END`
        postHandler(res, qsql);
    });

    // select proposal ids in stage3(vote)
    router.get("/vote/p", (req, res) => {
        let qsql = `SELECT proposal_id FROM stage.stage3`;
        handler(res, qsql);
    });

    // update proposal ids in stage3(grade)
    router.post("/vote/p", (req, res) => {
        let ps = req.body.ps;
        console.log(ps);
        let qsql = `BEGIN DELETE FROM stage.stage3; `;
        for (let p of ps) {
            qsql += ` INSERT INTO stage.stage3 (proposal_id, score_by_vote) VALUES ('${p}', 0); `
        }
        qsql += `END`
        postHandler(res, qsql);
    });

    // select proposal ids in stage4(display)
    router.get("/display/p", (req, res) => {
        let qsql = `SELECT proposal_id FROM stage.stage4`;
        handler(res, qsql);
    });

    // update proposal ids in stage4(display)
    router.post("/display/p", (req, res) => {
        let ps = req.body.ps;
        let qsql = `BEGIN DELETE FROM stage.stage4; `;
        for (let p of ps) {
            qsql += ` INSERT INTO stage.stage4 (proposal_id) VALUES ('${p}'); `
        }
        qsql += `END`
        postHandler(res, qsql);
    });

    return router;
};
