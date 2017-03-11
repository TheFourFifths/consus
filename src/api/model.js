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
    }).then(actionId => {
        let model = ModelStore.getModelByActionId(actionId);
        res.successJson(model);
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.patch('/', (req, res) => {
    if (typeof req.query.address !== 'string') {
        return res.status(400).failureJson('A model address is required.');
    }
    addAction('EDIT_MODEL', {
        address: req.query.address,
        name: req.body.name,
        description: req.body.description,
        manufacturer: req.body.manufacturer,
        vendor: req.body.vendor,
        location: req.body.location,
        allowCheckout: req.body.allowCheckout,
        price: req.body.price,
        count: req.body.count,
        changeStock: req.body.changeStock,
        inStock: req.body.inStock
    }).then(() => {
        let modelUpdated = ModelStore.getRecentlyUpdatedModel();
        res.successJson(modelUpdated);
    }).catch(e => {
        res.failureJson(e.message);
    });

});

app.delete('/', (req, res) => {
    if (typeof req.query.modelAddress !== 'string') {
        return res.status(400).failureJson('A model address is required.');
    }
    addAction('DELETE_MODEL', {
        modelAddress: req.query.modelAddress
    }).then(() => {
        res.successJson({
            deletedModel: ModelStore.getDeletedModel()
        });
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
