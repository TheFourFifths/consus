import express from 'express';
import { addAction } from '../lib/database';

let app = express();

app.post('/', (req, res) => {
    if (typeof req.body.studentId !== 'number') {
        return res.failureJson('A student id is required.');
    }
    if (typeof req.body.equipment !== 'object') {
        return res.failureJson('An array of equipment is required.');
    }
    addAction('NEW_CHECKOUT', {
        studentId: req.body.studentId,
        equipment: req.body.equipment,
        adminCode: req.body.adminCode
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.post('/longterm', (req, res) => {
    if (typeof req.body.studentId !== 'number') {
        return res.failureJson('A student id is required.');
    }
    if (typeof req.body.equipment !== 'object') {
        return res.failureJson('An array of equipment is required.');
    }
    if (typeof req.body.professor !== 'string') {
        return res.failureJson('A professor is required.');
    }
    addAction('NEW_LONGTERM_CHECKOUT', {
        studentId: req.body.studentId,
        equipment: req.body.equipment,
        dueDate: req.body.dueDate,
        professor: req.body.professor,
        adminCode: req.body.adminCode
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
