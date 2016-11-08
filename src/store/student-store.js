import { Store } from 'consus-core/flux';
import ItemStore from './item-store';
import CheckinStore from './checkin-store';

let students = new Object(null);
students[123456] = {
    id: 123456,
    name: 'John von Neumann',
    items: []
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
        items: []
    };
    studentsByActionId[data.actionId] = student;
    students[data.id] = student;
});

store.registerHandler('NEW_CHECKOUT', data => {
    let student = store.getStudentById(data.studentId);
    data.itemAddresses.forEach(itemAddress => {
        student.items.push(ItemStore.getItemByAddress(itemAddress));
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
