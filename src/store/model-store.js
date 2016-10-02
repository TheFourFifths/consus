import Model from '../model/model';
import { Store } from 'consus-flux';
import { assert } from 'chai';

let models = {};

class ModelStore extends Store {

    getModelById(id) {
        return models[id];
    }

}

const store = new ModelStore();

store.registerHandler('NEW_MODEL', data => {
    assert.isString(data.id, 'A model id must be a string.');
    assert.isString(data.name, 'A model name must be a string.');
    assert.isUndefined(items[data.id], 'A model with that id already exists.');
    models[data.id] = new Model(data.id, data.name);
});

export default store;
