import express from 'express';
import { addAction } from '../lib/database';
import ModelStore from '../store/model-store';

let app = express();

app.get('/', (req, res) => {
    let model = ModelStore.getModelById(req.query.id);
    res.successJson({
        model: {
            address: model.address,
            name: model.name
        }
    });
});

app.post('/', (req, res) => {
    addAction('NEW_MODEL', {
        name: req.body.name
    })
    .then(actionId => {
        let model = ModelStore.getModelByActionId(actionId);
        res.successJson({
            address: model.address
        });
    })
    .catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
