import { Store } from 'consus-core/flux';
import ItemStore from './item-store';
import CheckoutStore from './checkout-store';
import CheckinStore from './checkin-store';

let students = new Object(null);
const ACTIVE_STATUS = 'C - Current';
students[123456] = {
    id: 123456,
    name: 'John von Neumann',
    status: ACTIVE_STATUS,
    email: 'neumannJ@msoe.edu',
    major: 'Software Engineering',
    items: []
};

students[111111] = {
    id: 111111,
    name: 'Boaty McBoatface',
    status: ACTIVE_STATUS,
    email: 'mcboatfaceb@msoe.edu',
    major: 'Hyperdimensional Nautical Machines Engineering',
    items: [{
        address:'iGwEZVeaT',
        modelAddress: 'm8y7nFLsT',
        timestamp: 0
    }]
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

    isCurrentStudent(student){
        return student.status === ACTIVE_STATUS;
    }

    isNewStudent(student) {

        return this.getStudentById(student.id) === undefined;
    }

}

const store = new StudentStore();

function updateStudent(id, name, email, major){
    let student = students[id];
    student.name = name;
    student.email = email;
    student.major = major;
}

function removeModelFromAllStudents(modelAddress) {
    let studentsJSON = store.getStudents();
    for (let key in studentsJSON) {
        if (studentsJSON.hasOwnProperty(key)) {
            let s = studentsJSON[key];
            s.items = s.items.filter(item => item.modelAddress !== modelAddress);
        }
    }
}

function removeItemFromAllStudents(itemAddress) {
    let studentsJSON = store.getStudents();
    for (let key in studentsJSON) {
        if (studentsJSON.hasOwnProperty(key)) {
            let s = studentsJSON[key];
            s.items = s.items.filter(item => item.address !== itemAddress);
        }
    }
}

store.registerHandler('CLEAR_ALL_DATA', () => {
    students = new Object(null);
    studentsByActionId = new Object(null);
});

store.registerHandler('NEW_STUDENT', data => {
    let student = {
        id: data.id,
        name: data.name,
        status: data.status,
        email: data.email,
        major: data.major,
        items: []
    };
    studentsByActionId[data.actionId] = student;
    students[data.id] = student;
});

store.registerHandler('NEW_CHECKOUT', data => {
    store.waitFor(CheckoutStore);

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

store.registerHandler('UPDATE_STUDENT', student => {
    updateStudent(student.id, student.name, student.email, student.major);
});

store.registerHandler('DELETE_ITEM', data => {
    removeItemFromAllStudents(data.itemAddress);
});

store.registerHandler('DELETE_MODEL', data => {
    removeModelFromAllStudents(data.modelAddress);
});
export default store;
