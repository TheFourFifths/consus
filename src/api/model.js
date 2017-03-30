import fs from 'fs';
import express from 'express';
import { addAction } from '../lib/database';
import ModelStore from '../store/model-store';
import ItemStore from '../store/item-store';

let app = express();

function getModelPhoto(address) {
    let bitmap = fs.readFileSync(ModelStore.getPhotoPath(address));
    return Buffer.from(bitmap).toString('base64');
}

app.get('/', (req, res) => {
    let model = ModelStore.getModelByAddress(req.query.address);
    model.photo = getModelPhoto(model.address);
    res.successJson(model);
});

app.get('/all', (req, res) => {
    let models = ModelStore.getModels();

    models.forEach(model => {
        model.photo = getModelPhoto(model.address);
    });
    res.successJson({
        models
    });
});

app.get('/children', (req, res) => {
    res.successJson({
        model: ModelStore.getModelByAddress(req.query.modelAddress),
        items: ItemStore.getChildrenOfModel(req.query.modelAddress)
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
        count: req.body.count,
        photo: req.body.photo
    }).then(actionId => {
        let model = ModelStore.getModelByActionId(actionId);
        model.photo = getModelPhoto(model.address);
        res.successJson(model);
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.patch('/', (req, res) => {
    if (typeof req.query.address !== 'string') {
        return res.failureJson('A model address is required.');
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
        inStock: req.body.inStock,
        photo: req.body.photo
    }).then(() => {
        let modelUpdated = ModelStore.getRecentlyUpdatedModel();
        modelUpdated.photo = getModelPhoto(modelUpdated.address);
        res.successJson(modelUpdated);
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.patch('/instock', (req, res) => {
    if (typeof req.query.modelAddress !== 'string') {
        return res.failureJson('A model address is required.');
    }
    addAction('INCREMENT_STOCK', {
        modelAddress: req.query.modelAddress
    }).then(() => {
        res.successJson(ModelStore.getRecentlyUpdatedModel());
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.delete('/', (req, res) => {
    if (typeof req.query.modelAddress !== 'string') {
        return res.failureJson('A model address is required.');
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
