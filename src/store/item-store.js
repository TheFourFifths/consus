import { Store } from 'consus-core/flux';
import CheckoutStore from './checkout-store';
import CheckinStore from './checkin-store';
import StudentStore from './student-store';
import { createAddress, readAddress } from 'consus-core/identifiers';
import moment from 'moment-timezone';

let items = [];
let itemsByActionId = Object.create(null);

class ItemStore extends Store {

    getItems() {
        return items.filter(item => item !== undefined);
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

    getOverdueItems() {
        return StudentStore.getStudents().reduce((overdueItems, student) => {
            return overdueItems.concat(student.items.filter(item => {
                item.student = {
                    name: student.name,
                    id: student.id
                };
                return item.timestamp < Math.floor(Date.now() / 1000);
            }));
        }, []);
    }

    deleteItemByAddress(address){
        let result = readAddress(address);
        if(result.type !== 'item' ){
            throw new Error('Address is not an item.');
        }
        delete items[result.index];
    }

}
const store = new ItemStore();

store.registerHandler('CLEAR_ALL_DATA', () => {
    items = [];
    itemsByActionId = Object.create(null);
});

store.registerHandler('NEW_ITEM', data => {
    let item = {
        address: createAddress(items.length, 'item'),
        modelAddress: data.modelAddress,
        status: 'AVAILABLE',
        isFaulty: false,
        faultDescription: ''
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

store.registerHandler('DELETE_ITEM', data => {
    store.deleteItemByAddress(data.itemAddress);
});

store.registerHandler('DELETE_MODEL', data => {
    let itemsOfModel = store.getItems().filter(item => item.modelAddress === data.modelAddress);
    itemsOfModel.forEach(item => store.deleteItemByAddress(item.address));
});
export default store;
