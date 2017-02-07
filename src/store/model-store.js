import { Store } from 'consus-core/flux';
import { assert } from 'chai';
import CheckoutStore from './checkout-store';
import { createAddress, readAddress } from 'consus-core/identifiers';

let models = [
    {
        address: 'm8y7nEtAe',
        name: 'Resistor',
        description: 'V = IR',
        manufacturer: 'Pancakes R\' Us',
        vendor: 'Mouzer',
        location: 'Shelf 14',
        allowCheckout: false,
        price: 10.50,
        count: 3,
        items: ['iGwEZUvfA', 'iGwEZVHHE', 'iGwEZVeaT']
    },
    {
        address: 'm8y7nFLsT',
        name: 'Transistor',
        description: 'Something used in computers',
        manufacturer: 'Vroom Industries',
        vendor: 'Fankserrogatoman Inc',
        location: 'Shelf 2',
        allowCheckout: true,
        price: 4.00,
        count: 20,
        inStock: 20,
        items: []
    }
];
let modelsByActionId = Object.create(null);
let deletedModel = null;
let recentlyUpdatedModel = null;

class ModelStore extends Store {

    getModels() {
        return models.filter(model => model !== undefined);
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

    getDeletedModel() {
        return deletedModel;
    }
    getRecentlyUpdatedModel(){
        return recentlyUpdatedModel;
    }
}

const store = new ModelStore();

function deleteModelByAddress(address) {
    let result = readAddress(address);
    if (result.type !== 'model' ) {
        throw new Error('Address is not a model.');
    }
    deletedModel = models[result.index];
    if (deletedModel === null || deletedModel === undefined)
        throw new Error(`Model address (${address}) does not exist`);
    delete models[result.index];
}
function updateModel(address, name, description, manufacturer, vendor, location, allowCheckout, price, count, changeStock, inStock){
    let modelToUpdate = store.getModelByAddress(address);
    let originalStock = modelToUpdate.inStock;
    let changeInCount = count - modelToUpdate.count;

    modelToUpdate.name = name;
    modelToUpdate.description = description;
    modelToUpdate.manufacturer = manufacturer;
    modelToUpdate.vendor = vendor;
    modelToUpdate.location = location;
    modelToUpdate.price = price;
    if(allowCheckout)
        modelToUpdate.count = count;
    if(allowCheckout && changeStock)
        modelToUpdate.inStock = inStock;
    else
        modelToUpdate.inStock = originalStock + changeInCount;

    recentlyUpdatedModel = modelToUpdate;
    return modelToUpdate;
}

store.registerHandler('CLEAR_ALL_DATA', () => {
    models = [];
    modelsByActionId = Object.create(null);
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
    assert.isBoolean(data.allowCheckout, 'The model allowCheckout must be a boolean');
    assert.isNumber(data.price, 'The model price must be a number');
    assert.isNumber(data.count, 'The model count must be a number');
    let model = {
        address: createAddress(models.length, 'model'),
        name: data.name,
        description: data.description,
        manufacturer: data.manufacturer,
        vendor: data.vendor,
        location: data.location,
        allowCheckout: data.allowCheckout,
        price: data.price,
        count: data.count,
        inStock: data.count
    };
    modelsByActionId[data.actionId] = model;
    models.push(model);
});

store.registerHandler('NEW_CHECKOUT', data => {
    store.waitFor(CheckoutStore);
    data.equipmentAddresses.forEach(address => {
        let result = readAddress(address);
        if(result.type == 'model'){
            store.getModelByAddress(address).inStock--;
        }
    });
});

store.registerHandler('DELETE_MODEL', data => {
    deleteModelByAddress(data.modelAddress);
});

store.registerHandler('EDIT_MODEL', data => {
    assert.isString(data.name, 'The model name must be a string');
    assert.isString(data.description, 'The model description must be a string');
    assert.isString(data.manufacturer, 'The model manufacturer must be a string');
    assert.isString(data.vendor, 'The model vendor must be a string');
    assert.isString(data.location, 'The model location must be a string');
    assert.isNumber(data.price, 'The model price must be a number');
    assert.isNumber(data.count, 'The model count must be a number');
    assert.isNumber(data.inStock, 'The model stock amount must be a number');
    updateModel(data.address, data.name, data.description, data.manufacturer, data.vendor, data.location, data.allowCheckout, data.price, data.count, data.changeStock, data.inStock);
});

export default store;
