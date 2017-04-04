import { Store } from 'consus-core/flux';
import CheckoutStore from './checkout-store';
import CheckinStore from './checkin-store';
import StudentStore from './student-store';
import { createAddress, readAddress } from 'consus-core/identifiers';
import { dueDateToTimestamp } from '../lib/clock';

let items = [];
let itemsByActionId = Object.create(null);

class ItemStore extends Store {

    getFaultyItems() {
        return items.filter(item => item.isFaulty);
    }

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
        if (result.type !== 'item') {
            throw new Error('Address is not an item.');
        }
        delete items[result.index];
    }

    getChildrenOfModel(modelAddress) {
        return items.filter(item => item.modelAddress === modelAddress);
    }

}

function checkoutEquipment(equipment, studentId, dueDateTime) {
    equipment.forEach(equip => {
        let address = equip.address;
        let result = readAddress(address);
        if (result.type == 'item') {
            store.getItemByAddress(address).status = 'CHECKED_OUT';
            store.getItemByAddress(address).isCheckedOutTo = studentId;
            let dueTime = dueDateToTimestamp(dueDateTime);
            store.getItemByAddress(address).timestamp = dueTime;
        }
    });
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
        faultHistory: [],
        isCheckedOutTo: null
    };
    itemsByActionId[data.actionId] = item;
    items.push(item);
});

store.registerHandler('NEW_CHECKOUT', data => {
    store.waitFor(CheckoutStore);
    checkoutEquipment(data.equipment, data.studentId, data.timestamp);
});

store.registerHandler('NEW_LONGTERM_CHECKOUT', data => {
    store.waitFor(CheckoutStore);
    checkoutEquipment(data.equipment, data.studentId, data.dueDate);
});

store.registerHandler('CHECKIN', data => {
    store.waitFor(CheckinStore);
    if (typeof CheckinStore.getCheckinByActionId(data.actionId) !== 'object') {
        return;
    }
    store.getItemByAddress(data.itemAddress).status = 'AVAILABLE';
    store.getItemByAddress(data.itemAddress).isCheckedOutTo = null;
});

store.registerHandler('DELETE_ITEM', data => {
    store.deleteItemByAddress(data.itemAddress);
});

store.registerHandler('DELETE_MODEL', data => {
    let itemsOfModel = store.getItems().filter(item => item.modelAddress === data.modelAddress);
    itemsOfModel.forEach(item => store.deleteItemByAddress(item.address));
});

store.registerHandler('ADD_ITEM_FAULT', data => {
    store.getItemByAddress(data.itemAddress).isFaulty = true;
    store.getItemByAddress(data.itemAddress).faultHistory.unshift({
        description: data.description,
        timestamp: data.timestamp
    });
});

store.registerHandler('REMOVE_FAULT', data => {
    store.getItemByAddress(data.itemAddress).isFaulty = false;
});

export default store;
