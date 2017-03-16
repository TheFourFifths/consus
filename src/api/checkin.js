import express from 'express';
import { addAction } from '../lib/database';
import CheckinStore from '../store/checkin-store';
import ItemStore from '../store/item-store';
import ModelStore from '../store/model-store';

let app = express();

app.post('/', (req, res) => {
    if (!req.body.studentId) {
        return res.failureJson('Numeric student ID required when checking in an item');
    }
    if (!req.body.itemAddress) {
        return res.failureJson('Item address required when checking in an item');
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

app.post('/model', (req, res) => {
    if (!req.body.studentId) {
        return res.status(400).failureJson('Numeric student ID required when checking in a model');
    }
    if (!req.body.modelAddress) {
        return res.status(400).failureJson('Model address required when checking in a model');
    }
    if (!req.body.quantity) {
        return res.status(400).failureJson('A quantity is required when checking in a model');
    }

    addAction('CHECKIN_MODELS', {
        studentId: req.body.studentId,
        modelAddress: req.body.modelAddress,
        quantity: req.body.quantity
    }).then(actionId => {
        let checkin = CheckinStore.getCheckinByActionId(actionId);
        res.successJson({
            modelAddress: checkin.model.address,
            modelName: checkin.model.name,
            quantity: checkin.quantity
        });
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
