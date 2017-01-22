import express from 'express';
import { addAction } from '../lib/database';

let app = express();

app.post('/', (req, res) => {
    if (typeof req.body.studentId !== 'string') {
        return res.status(400).failureJson('A student id is required.');
    }
    if (typeof req.body.itemAddresses !== 'object'
        || typeof req.body.itemAddresses[0] !== 'string') {
        return res.failureJson('An array of item addresses is required.');
    }
    addAction('NEW_CHECKOUT', {
        studentId: req.body.studentId,
        itemAddresses: req.body.itemAddresses,
        adminCode: req.body.adminCode
    })
    .then(() => {
        res.successJson();
    })
    .catch(e => {
        res.status(400).failureJson(e.message);
    });
});

export default app;
