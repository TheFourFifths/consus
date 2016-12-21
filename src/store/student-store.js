import { Store } from 'consus-core/flux';
import ItemStore from './item-store';
import ModelStore from './model-store';
import CheckoutStore from './checkout-store';
import CheckinStore from './checkin-store';
import { readAddress } from 'consus-core/identifiers';

let students = new Object(null);
students[123456] = {
    id: 123456,
    name: 'John von Neumann',
    items: [],
    models: []
};

students[111111] = {
    id: 111111,
    name: 'Boaty McBoatface',
    items: [{
        address:'iGwEZVeaT',
        modelAddress: 'm8y7nFLsT',
        timestamp: 0
    }],
    models: []
};

let studentsByActionId = new Object(null);

class StudentStore extends Store {

    getStudents() {
        return Object.keys(students).map(key => students[key]);
    }

    getStudentById(id) {
        return students[id];
    }

    getStudentByActionId(actionId) {
        return studentsByActionId[actionId];
    }

    hasOverdueItem(id){
        return students[id].items.some(item => {
            let now = Math.floor(Date.now() / 1000);
            return item.timestamp < now;
        });
    }

}

const store = new StudentStore();

store.registerHandler('CLEAR_ALL_DATA', () => {
    students = new Object(null);
    studentsByActionId = new Object(null);
});

store.registerHandler('NEW_STUDENT', data => {
    let student = {
        id: data.id,
        name: data.name,
        items: [],
        models: []
    };
    studentsByActionId[data.actionId] = student;
    students[data.id] = student;
});

store.registerHandler('NEW_CHECKOUT', data => {
    store.waitFor(CheckoutStore);

    let student = store.getStudentById(data.studentId);

    data.equipmentAddresses.forEach(address => {
        let result = readAddress(address);
        if(result.type == 'item'){
            student.items.push(ItemStore.getItemByAddress(address));
        }
        else if (result.type == 'model') {
            student.models.push(ModelStore.getModelByAddress(address));
        }
    });
});

store.registerHandler('CHECKIN', data => {
    store.waitFor(CheckinStore);
    if (typeof CheckinStore.getCheckinByActionId(data.actionId) !== 'object') {
        return;
    }
    let student = store.getStudentById(data.studentId);
    let item = ItemStore.getItemByAddress(data.itemAddress);
    student.items.splice(student.items.indexOf(item), 1);
});

export default store;
