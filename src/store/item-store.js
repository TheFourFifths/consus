import { Store } from 'consus-core/flux';
import CheckoutStore from './checkout-store';
import CheckinStore from './checkin-store';
import { createAddress, readAddress } from 'consus-core/identifiers';
import moment from 'moment-timezone';

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

    getItems() {
        return items;
    }

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

store.registerHandler('CLEAR_ALL_DATA', () => {
    items = [];
    itemsByActionId = new Object(null);
});

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
    store.waitFor(CheckoutStore);
    data.itemAddresses.forEach(address => {
        store.getItemByAddress(address).status = 'CHECKED_OUT';
        let timestamp = moment.tz(data.timestamp * 1000, 'America/Chicago');
        let hour = parseInt(timestamp.format('H'));
        let minute = parseInt(timestamp.format('m'));
        // check for times past 4:50pm
        if (hour > 16 || (hour === 16 && minute >= 50)) {
            // increment to the next day
            timestamp = timestamp.add(1, 'd');
        }
        timestamp.hour(17).minute(0).second(0);
        let dueTime = parseInt(timestamp.format('X'));
        store.getItemByAddress(address).timestamp = dueTime;
    });
});

store.registerHandler('CHECKIN', data => {
    store.waitFor(CheckinStore);
    if (typeof CheckinStore.getCheckinByActionId(data.actionId) !== 'object') {
        return;
    }
    store.getItemByAddress(data.itemAddress).status = 'AVAILABLE';
});

export default store;
