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
    if(!req.body.modelAddress) return res.failureJson("Model address required to make item");

    addAction('NEW_ITEM', {
        modelAddress: req.body.modelAddress
    }).then(actionId => {
        res.successJson({
            item: ItemStore.getItemByActionId(actionId),
            modelName: ModelStore.getModelByAddress(req.body.modelAddress).name
        });
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.get('/all', (req, res) => {
    res.successJson({
        items: ItemStore.getItems()
    });
});

app.delete('/fault', (req, res) => {
    if(!req.query.itemAddress) return res.failureJson("Item address required to remove fault");
    addAction("REMOVE_FAULT", {
        itemAddress: req.query.itemAddress
    }).then(() => {
        res.successJson({
            item: ItemStore.getItemByAddress(req.query.itemAddress)
        });
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.post('/fault', (req, res) => {
    if(!req.body.itemAddress) return res.failureJson("Item address required to log fault.");
    if(!req.body.faultDescription) return res.failureJson("Missing fault to log to item.");
    addAction("ADD_ITEM_FAULT", {
        itemAddress: req.body.itemAddress,
        description: req.body.faultDescription
    }).then(() => {
        res.successJson({
            item: ItemStore.getItemByAddress(req.body.itemAddress)
        });
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.get('/overdue', (req, res) => {
    res.successJson({
        items: ItemStore.getOverdueItems()
    });
});

app.post('/retrieve', (req, res) => {
    if (!req.body.itemAddress) {
        return res.failureJson('Item address required to retrieve');
    }
    addAction('RETRIEVE_ITEM', {
        itemAddress: req.body.itemAddress
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.post('/save', (req, res) => {
    if (!req.body.itemAddress) {
        return res.failureJson('Item address required to save');
    }
    addAction('SAVE_ITEM', {
        itemAddress: req.body.itemAddress
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.delete('/', (req, res) => {
    if(!req.query.itemAddress) return res.failureJson("Item address required to delete");
    if(!req.query.modelAddress) return res.failureJson("Model address required to delete");
    let model = ModelStore.getModelByAddress(req.query.modelAddress);
    addAction('DELETE_ITEM', {
        itemAddress: req.query.itemAddress,
        modelAddress: req.query.modelAddress
    }).then(() => {
        res.successJson({
            items: ItemStore.getItems(),
            modelName: model.name
        });
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.patch('/duedate', (req, res) => {
    if(!req.query.itemAddress) return res.failureJson("Item address required to update item's dueDate.");
    if(!req.body.dueDate) return res.failureJson("A due date is required to update item's dueDate.");
    if(!req.body.studentId) return res.failureJson("A studentId required to update item's dueDate.");
    addAction('CHANGE_ITEM_DUEDATE', {
        itemAddress: req.query.itemAddress,
        dueDate: req.body.dueDate,
        studentId: req.body.studentId
    }).then(() => {
        let item = ItemStore.getItemByAddress(req.query.itemAddress);
        res.successJson(item);
    });
});

export default app;
