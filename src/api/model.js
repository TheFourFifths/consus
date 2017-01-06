import express from 'express';
import { addAction } from '../lib/database';
import ModelStore from '../store/model-store';

let app = express();

app.get('/', (req, res) => {
    let model = ModelStore.getModelByAddress(req.query.address);
    res.successJson(model);
});
app.get('/all', (req, res) => {
    res.successJson({
        models: ModelStore.getModels()
    });
});
app.post('/', (req, res) => {
    addAction('NEW_MODEL', {
        name: req.body.name,
        description: req.body.description,
        manufacturer: req.body.manufacturer,
        vendor: req.body.vendor,
        location: req.body.location,
        allowCheckout: req.body.allowCheckout,
        price: req.body.price,
        count: req.body.count
    })
        .then(actionId => {
            let model = ModelStore.getModelByActionId(actionId);
            res.successJson(model);
        })
        .catch(e => {
            res.failureJson(e.message);
        });
});

export default app;
