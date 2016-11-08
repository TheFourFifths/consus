import express from 'express';
import { addAction } from '../lib/database';
import ModelStore from '../store/model-store';

let app = express();

app.get('/', (req, res) => {
    let model = ModelStore.getModelById(req.query.id);
    res.successJson({
        model: {
            address: model.address,
            name: model.name,
            description: model.description,
            manufacturer: model.manufacturer,
            vendor: model.vendor,
            location: model.location,
            isFaulty: model.isFaulty,
            faultDescription: model.faultDescription,
            price: model.price,
            count: model.count
        }
    });
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
        isFaulty: req.body.isFaulty,
        faultDescription: req.body.faultDescription,
        price: req.body.price,
        count: req.body.count
    })
        .then(actionId => {
            let model = ModelStore.getModelByActionId(actionId);
            res.successJson({
                address: model.address,
                name: model.name,
                description: model.description,
                manufacturer: model.manufacturer,
                vendor: model.vendor,
                location: model.location,
                isFaulty: model.isFaulty,
                faultDescription: model.faultDescription,
                price: model.price,
                count: model.count

            });
        })
        .catch(e => {
            res.failureJson(e.message);
        });
});

export default app;
