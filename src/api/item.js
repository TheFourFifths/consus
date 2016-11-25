import express from 'express';
import { addAction } from '../lib/database';
import ItemStore from '../store/item-store';

let app = express();

app.get('/', (req, res) => {
    let regex = new RegExp("^[a-zA-Z0-9]*$");
    if(!regex.test(req.query.address))return res.failureJson("Invalid Characters");
    let item = ItemStore.getItemByAddress(req.query.address);
    res.successJson({
        item: {
            address: item.address,
            modelAddress: item.modelAddress,
            status: item.status
        }
    });
});

app.post('/', (req, res) => {
    let regex = new RegExp("^[a-zA-Z0-9]*$");
    if(!regex.test(req.query.modelAddress))return res.failureJson("Invalid Characters");
    addAction('NEW_ITEM', {
        modelAddress: req.body.modelAddress
    })
    .then(actionId => {
        let item = ItemStore.getItemByActionId(actionId);
        res.successJson({
            address: item.address
        });
    })
    .catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
