import express from 'express';
import { addAction } from '../lib/database';
import ItemStore from '../store/item-store';

let app = express();

app.get('/', (req, res) => {
    let item = ItemStore.getItemById(req.query.id);
    if (typeof item === 'undefined') {
        return res.failureJson('Item not found.');
    }
    res.successJson({
        item: {
            id: item.id,
            status: item.status
        }
    });
});

app.post('/', (req, res) => {
    addAction({
        type: 'NEW_ITEM',
        data: {
            id: req.body.id
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
