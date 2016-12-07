import express from 'express';
import { addAction } from '../lib/database';
import ItemStore from '../store/item-store';
import ModelStore from '../store/model-store';

let app = express();

app.get('/', (req, res) => {
    let regex = new RegExp("^[a-zA-Z0-9]+$");
    if(!regex.test(req.query.id)){
        return res.failureJson('Invalid Characters in item address');
    }
    let item = ItemStore.getItemByAddress(req.query.address);
    res.successJson(item);
});

app.post('/', (req, res) => {
    addAction('NEW_ITEM', {
        modelAddress: req.body.modelAddress
    })
    .then(actionId => {
        let item = ItemStore.getItemByActionId(actionId);
        res.successJson({
            address: item.address,
            modelName: ModelStore.getModelByAddress(ItemStore.getItemByAddress(item.address).modelAddress).name
        });
    })
    .catch(e => {
        res.failureJson(e.message);
    });
});

app.get('/all', (req, res) => {
    res.successJson({
        items: ItemStore.getItems()
    });
});

export default app;
