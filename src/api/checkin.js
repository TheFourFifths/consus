import express from 'express';
import { addAction } from '../lib/database';
import CheckinStore from '../store/checkin-store.js';

let app = express();

app.post('/', (req, res) => {
    addAction('CHECKIN', {
        studentId: req.body.studentId,
        itemAddress: req.body.itemAddress
    }).then(actionId => {
        let checkin = CheckinStore.getCheckinByActionId(actionId);
        res.successJson({
            itemAddress: checkin.item.address
        });
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;