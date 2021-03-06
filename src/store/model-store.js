import fs from 'fs';
import path from 'path';
import config from 'config';
import { Store } from 'consus-core/flux';
import { assert } from 'chai';
import CheckoutStore from './checkout-store';
import CheckinStore from './checkin-store';
import { createAddress, readAddress } from 'consus-core/identifiers';

const MODEL_PHOTO_DIR = config.get('assets.model_photo_directory');

let models = [];
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

    /**
     * Returns the path to the model's image, or a placeholder
     * @param {string} address - the address of the model
     * @param {boolean} create - true to always return where the model's image would be, else
     *                           false (default) for a photo that exists now
     * @return {string} The path to a model's photo
     */
    getPhotoPath(address, create = false) {
        let modelPath = path.resolve(MODEL_PHOTO_DIR, `${address}.jpeg`);
        let placeholderPath = path.resolve(MODEL_PHOTO_DIR, 'placeholder.jpeg');
        if (fs.existsSync(modelPath) || create) {
            return modelPath;
        } else {
            return placeholderPath;
        }
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


function updateModel(address, name, description, manufacturer, vendor, location, allowCheckout, price, count, changeStock, inStock, b64PhotoStr){
    let modelToUpdate = store.getModelByAddress(address);
    let originalStock = modelToUpdate.inStock;
    let changeInCount = count - modelToUpdate.count;

    modelToUpdate.name = name;
    modelToUpdate.description = description;
    modelToUpdate.manufacturer = manufacturer;
    modelToUpdate.vendor = vendor;
    modelToUpdate.location = location;
    modelToUpdate.price = price;
    if (allowCheckout){
        modelToUpdate.count = count;
    }
    if (allowCheckout && changeStock) {
        modelToUpdate.inStock = inStock;
    } else {
        modelToUpdate.inStock = originalStock + changeInCount;
    }
    savePhoto(b64PhotoStr, address);
    recentlyUpdatedModel = modelToUpdate;
    return modelToUpdate;
}

function savePhoto(b64Str, address) {
    let bitmap = Buffer.from(b64Str, 'base64');
    let photoPath = store.getPhotoPath(address, true);
    fs.writeFileSync(photoPath, bitmap);
    return photoPath;
}

function checkoutModels(equipment){
    equipment.forEach(equip => {
        let address = equip.address;
        let result = readAddress(address);
        if(result.type == 'model'){
            store.getModelByAddress(address).inStock -= equip.quantity;
        }
    });
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
    assert.isAtLeast(data.count, 0, 'The model count cannot be negative');
    let address = createAddress(models.length, 'model');
    let model = {
        address: address,
        name: data.name,
        description: data.description,
        manufacturer: data.manufacturer,
        vendor: data.vendor,
        location: data.location,
        allowCheckout: data.allowCheckout,
        price: data.price,
        count: data.count,
        inStock: data.count,
        frequency: 0
    };
    if(data.photo){
        savePhoto(data.photo, address);
    }
    modelsByActionId[data.actionId] = model;
    models.push(model);
});

store.registerHandler("INCREMENT_STOCK", data => {
    let modelToInc = store.getModelByAddress(data.modelAddress);
    if (!modelToInc.allowCheckout) {
        throw new Error('Address cannot be a serialized model.');
    }
    modelToInc.count++;
    modelToInc.inStock++;
    recentlyUpdatedModel = modelToInc;
    return modelToInc;
});

store.registerHandler('NEW_CHECKOUT', data => {
    store.waitFor(CheckoutStore);
    checkoutModels(data.equipment);
});

store.registerHandler('NEW_LONGTERM_CHECKOUT', data => {
    store.waitFor(CheckoutStore);
    checkoutModels(data.equipment);
});

store.registerHandler('CHECKIN_MODELS', data => {
    store.waitFor(CheckinStore);
    if (typeof CheckinStore.getCheckinByActionId(data.actionId) !== 'object') {
        return;
    }
    let model = store.getModelByAddress(data.modelAddress);
    // Set model inStock to proper number.
    model.inStock += data.quantity;
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
    assert.isAtLeast(data.count, 0, 'The model count cannot be negative');
    assert.isNumber(data.inStock, 'The model stock amount must be a number');
    assert.isAtLeast(data.inStock, 0, 'The model stock amount cannot be negative');
    updateModel(data.address, data.name, data.description, data.manufacturer, data.vendor, data.location, data.allowCheckout, data.price, data.count, data.changeStock, data.inStock, data.photo);
});

export default store;
