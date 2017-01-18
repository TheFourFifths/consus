import express from 'express';
import { addAction } from '../lib/database';

let app = express();

app.post('/', (req, res) => {
    addAction('NEW_CHECKOUT', {
        studentId: req.body.studentId,
        itemAddresses: req.body.itemAddresses,
        adminCode: req.body.adminCode
    })
    .then(() => {
        res.successJson();
    })
    .catch(e => {
        res.failureJson(e.message);
    });
});

app.post('/longterm', (req, res) => {
    addAction('NEW_LONGTERM_CHECKOUT', {
        studentId: req.body.studentId,
        itemAddresses: req.body.itemAddresses,
        adminCode: req.body.adminCode,
        longtermDueDate: req.body.longtermDueDate,
        longtermProfessor: req.body.longtermProfessor
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
