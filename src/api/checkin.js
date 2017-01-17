import express from 'express';
import { addAction } from '../lib/database';
import CheckinStore from '../store/checkin-store';
import ItemStore from '../store/item-store';
import ModelStore from '../store/model-store';

let app = express();

app.post('/', (req, res) => {
    if (!req.body.studentId) {
        return res.status(400).failureJson('Numeric student ID required when checking in an item');
    }
    if (!req.body.itemAddress) {
        return res.status(400).failureJson('Item address required when checking in an item');
    }

    addAction('CHECKIN', {
        studentId: req.body.studentId,
        itemAddress: req.body.itemAddress
    }).then(actionId => {
        let checkin = CheckinStore.getCheckinByActionId(actionId);
        res.successJson({
            itemAddress: checkin.item.address,
            modelName: ModelStore.getModelByAddress(ItemStore.getItemByAddress(checkin.item.address).modelAddress).name
        });
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
