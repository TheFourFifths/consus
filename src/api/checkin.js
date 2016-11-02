import express from 'express';
import { addAction } from '../lib/database';
import CheckinStore from '../store/checkin-store.js';

let app = express();

app.post('/', (req, res) => {
    addAction('CHECKIN', {
        studentId: req.body.studentId,
        itemAddress: req.body.itemAddress
    }).then(actionId => {
        CheckinStore.getCheckinByActionId(actionId);
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
