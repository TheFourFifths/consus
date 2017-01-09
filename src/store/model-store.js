import { Store } from 'consus-core/flux';
import { assert } from 'chai';
import { createAddress, readAddress } from 'consus-core/identifiers';

let models = [
    {
        address: 'm8y7nEtAe',
        name: 'Resistor',
        description: 'V = IR',
        manufacturer: 'Pancakes R\' Us',
        vendor: 'Mouzer',
        location: 'Shelf 14',
        isFaulty: false,
        faultDescription: '',
        price: 10.50,
        count: 20,
        items: ['iGwEZUvfA', 'iGwEZVHHE', 'iGwEZVeaT']
    },
    {
        address: 'm8y7nFLsT',
        name: 'Transistor',
        description: 'Something used in computers',
        manufacturer: 'Vroom Industries',
        vendor: 'Fankserrogatoman Inc',
        location: 'Shelf 2',
        isFaulty: false,
        faultDescription: '',
        price: 4.00,
        count: 10,
        items: []

    }
];
let modelsByActionId = new Object(null);

class ModelStore extends Store {

    getModels() {
        return models;
    }

    getModelByAddress(address) {
        let result = readAddress(address);
        if (result.type !== 'model') {
            throw new Error('Address is not an model.');
        }
        return models[result.index];
    }

    getModelByActionId(actionId) {
        return modelsByActionId[actionId];
    }
}

const store = new ModelStore();

store.registerHandler('CLEAR_ALL_DATA', () => {
    models = [];
    modelsByActionId = new Object(null);
});

store.registerHandler('NEW_ITEM', data => {
    let model = store.getModelByAddress(data.modelAddress);
    model.count += 1;
});

store.registerHandler('DELETE_ITEM', data => {
    let model = store.getModelByAddress(data.modelAddress);
    model.count -= 1;
});

store.registerHandler('NEW_MODEL', data => {
    assert.isString(data.name, 'The model name must be a string');
    assert.isString(data.description, 'The model description must be a string');
    assert.isString(data.manufacturer, 'The model manufacturer must be a string');
    assert.isString(data.vendor, 'The model vendor must be a string');
    assert.isString(data.location, 'The model location must be a string');
    assert.isBoolean(data.isFaulty, 'The model "isFaulty" must be a boolean');
    assert.isString(data.faultDescription, 'The model fault description must be a string');
    assert.isNumber(data.price, 'The model price must be a number');
    assert.isNumber(data.count, 'The model count must be a number');
    let model = {
        address: createAddress(models.length, 'model'),
        name: data.name,
        description: data.description,
        manufacturer: data.manufacturer,
        vendor: data.vendor,
        location: data.location,
        isFaulty: data.isFaulty,
        faultDescription: data.faultDescription,
        price: data.price,
        count: data.count
    };
    modelsByActionId[data.actionId] = model;
    models.push(model);
});

export default store;
