import express from 'express';
import { addAction } from '../lib/database';
import ModelStore from '../store/model-store';

let app = express();

app.get('/', (req, res) => {
    let model = ModelStore.getModelById(req.query.id);
    if (typeof model === 'undefined') {
        return res.failureJson('Model not found.');
    }
    res.successJson({
        model: {
            id: model.id,
            name: model.name
        }
    });
});

app.post('/', (req, res) => {
    addAction({
        type: 'NEW_MODEL',
        data: {
            id: req.body.id,
            name: req.body.name
        }
    })
    .then(() => {
        res.successJson();
    })
    .catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
