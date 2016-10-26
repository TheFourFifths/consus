import { Store } from 'consus-core/flux';
import CheckinStore from './checkin-store';
import ItemStore from './item-store';

let students = {};
students[123456] = {
    id: 123456,
    name: 'John von Neumann',
    items: []
};
let studentsByActionId = new Object(null);

class StudentStore extends Store {

    getStudentById(id) {
        return students[id];
    }

    getStudentByActionId(actionId) {
        return studentsByActionId[actionId];
    }

}

const store = new StudentStore();

store.registerHandler('NEW_STUDENT', data => {
    let student = {
        id: students.length,
        name: data.name,
        items: []
    };
    studentsByActionId[data.actionId] = student;
    students.push(student);
});

store.registerHandler('NEW_CHECKOUT', data => {
    let student = store.getStudentById(data.studentId);
    let items = data.itemAddresses.map(address => ItemStore.getItemByAddress(address));
    student.items = student.items.concat(items);
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
