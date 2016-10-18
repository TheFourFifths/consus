import { Store } from 'consus-core/flux';
import { createAddress, readAddress } from 'consus-core/identifiers';

let models = [];
let modelsByActionId = new Object(null);

class ModelStore extends Store {

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

store.registerHandler('NEW_MODEL', data => {
    let model = {
        address: createAddress(models.length, 'model'),
        name: data.name
    };
    modelsByActionId[data.actionId] = model;
    models.push(model);
});

export default store;
