import Item from '../model/item';
import { Store } from 'consus-flux';
import { assert } from 'chai';

let items = {};

class ItemStore extends Store {

    getItemById(id) {
        return items[id];
    }

}

const store = new ItemStore();

store.registerHandler('NEW_ITEM', data => {
    assert.isString(data.id, 'An item id must be a string.');
    assert.isUndefined(items[data.id], 'An item with that id already exists.');
    items[data.id] = new Item(data.id);
});

export default store;
