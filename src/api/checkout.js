import express from 'express';
import { addAction } from '../lib/database';

let app = express();

app.post('/', (req, res) => {
    addAction('NEW_CHECKOUT', {
        studentId: req.body.studentId,
        equipmentAddresses: req.body.equipmentAddresses,
        adminCode: req.body.adminCode
    })
    .then(() => {
        res.successJson();
    })
    .catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
