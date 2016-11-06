import { Store } from 'consus-core/flux';
import { createAddress, readAddress } from 'consus-core/identifiers';

let items = [
    {
        address: 'iGwEZUvfA',
        modelAddress: 'm8y7nEtAe',
        status: 'AVAILABLE'
    },
    {
        address: 'iGwEZVHHE',
        modelAddress: 'm8y7nFLsT',
        status: 'AVAILABLE'
    },
    {
        address: 'iGwEZVeaT',
        modelAddress: 'm8y7nFLsT',
        status: 'AVAILABLE'
    }
];
let itemsByActionId = new Object(null);

class ItemStore extends Store {

    getItemByAddress(address) {
        let result = readAddress(address);
        if (result.type !== 'item') {
            throw new Error('Address is not an item.');
        }
        return items[result.index];
    }

    getItemByActionId(actionId) {
        return itemsByActionId[actionId];
    }

}

const store = new ItemStore();

store.registerHandler('NEW_ITEM', data => {
    let item = {
        address: createAddress(items.length, 'item'),
        modelAddress: data.modelAddress,
        status: 'AVAILABLE'
    };
    itemsByActionId[data.actionId] = item;
    items.push(item);
});

store.registerHandler('NEW_CHECKOUT', data => {
    data.itemAddresses.forEach(address => {
        store.getItemByAddress(address).status = 'CHECKED_OUT';

        let timestamp = new Date(data.timestamp);
        timestamp.setUTCHours(16);//Set the time to 5pm

        store.getItemByAddress(address).timestamp = timestamp;
    });
});

export default store;
