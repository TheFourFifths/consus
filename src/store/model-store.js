import { Store } from 'consus-core/flux';
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

export default store;
