import config from 'config';
import { Store } from 'consus-core/flux';
import { readAddress } from 'consus-core/identifiers';
import ItemStore from './item-store';
import CheckoutStore from './checkout-store';
import CheckinStore from './checkin-store';
import ModelStore from './model-store';
import { isBeforeNow, dueDateToTimestamp } from '../lib/clock';

const ACTIVE_STATUS = config.get('student.active_status');

let students = Object.create(null);
let studentsByActionId = Object.create(null);

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

    getStudentsWithOverdueItems() {
        return Object.keys(students).map(id => students[id]).filter(student => {
            return student.items.some(item => {
                return isBeforeNow(item.timestamp);
            });
        });
    }

    hasOverdueItem(id) {
        return students[id].items.some(item => {
            let now = Math.floor(Date.now() / 1000);
            return item.timestamp < now;
        });
    }

    isCurrentStudent(student) {
        return student.status === ACTIVE_STATUS;
    }

    isNewStudent(student) {
        return this.getStudentById(student.id) === undefined;
    }

}

const store = new StudentStore();

function updateStudent(student) {
    let studentToUpdate = students[student.id];
    for (let key in student) {
        studentToUpdate[key] = student[key];
    }
    delete studentToUpdate.actionId;
    delete studentToUpdate.timestamp;
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

function addItemsToStudent(studentId, equipment, dueDateTime) {
    let student = students[studentId];
    equipment.forEach(equip => {
        let address = equip.address;
        let type = readAddress(address).type;
        if (type === 'item') {
            student.items.push(ItemStore.getItemByAddress(address));
        } else if (type === 'model') {
            let model = student.models.find(model => model.address === address);
            let m = ModelStore.getModelByAddress(address);
            if (model === undefined) {
                model = {
                    address,
                    name: m.name,
                    quantity: 0,
                    timestamp: m.timestamp,
                    status: 'CHECKED_OUT'
                };
                student.models.push(model);
            }
            model.quantity += equip.quantity;
            model.dueDate = dueDateToTimestamp(dueDateTime);
        }
    });
}

store.registerHandler('CLEAR_ALL_DATA', () => {
    students = Object.create(null);
    studentsByActionId = Object.create(null);
});

store.registerHandler('NEW_STUDENT', data => {
    let studentId = parseInt(data.id);
    let student = {
        id: studentId,
        name: data.name,
        status: data.status,
        email: data.email,
        major: data.major,
        items: [],
        models: []
    };
    studentsByActionId[data.actionId] = student;
    students[data.id] = student;
});

store.registerHandler('NEW_CHECKOUT', data => {
    store.waitFor(CheckoutStore);
    addItemsToStudent(data.studentId, data.equipment, data.timestamp);
});

store.registerHandler('NEW_LONGTERM_CHECKOUT', data => {
    store.waitFor(CheckoutStore);
    addItemsToStudent(data.studentId, data.equipment, data.dueDate);
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

store.registerHandler('CHECKIN_MODELS', data => {
    store.waitFor(CheckinStore);
    if (typeof CheckinStore.getCheckinByActionId(data.actionId) !== 'object') {
        return;
    }
    let student = students[data.studentId];
    let index = student.models.findIndex(m => m.address === data.modelAddress);
    let model = student.models[index];
    model.quantity -= data.quantity;
    if (model.quantity === 0) {
        student.models.splice(index, 1);
    }
});

store.registerHandler('UPDATE_STUDENT', student => {
    updateStudent(student);
});

store.registerHandler('DELETE_ITEM', data => {
    removeItemFromAllStudents(data.itemAddress);
});

store.registerHandler('DELETE_MODEL', data => {
    removeModelFromAllStudents(data.modelAddress);
});

store.registerHandler('SAVE_MODEL', data => {
    let result = readAddress(data.modelAddress);
    if (result.type !== 'model' ) {
        throw new Error('Address is not a model.');
    }
    let student = students[data.studentId];
    if (!student) {
        throw new Error('Student could not be found.');
    }
    let model = student.models.find(m => m.address === data.modelAddress);
    if (!model) {
        throw new Error('Student does not have this model checked out.');
    }
    if (model.status === 'SAVED') {
        throw new Error('Student already saved this model.');
    }
    model.status = 'SAVED';
});

store.registerHandler('RETRIEVE_MODEL', data => {
    let result = readAddress(data.modelAddress);
    if (result.type !== 'model' ) {
        throw new Error('Address is not a model.');
    }
    let student = students[data.studentId];
    if (!student) {
        throw new Error('Student could not be found.');
    }
    let model = student.models.find(m => m.address === data.modelAddress);
    if (!model) {
        throw new Error('Student does not have this model saved or checked out.');
    }
    if (model.status !== 'SAVED') {
        throw new Error('Student does not have this model saved.');
    }
    model.status = 'CHECKED_OUT';
});

store.registerHandler('CHANGE_ITEM_DUEDATE', data => {
    store.waitFor(ItemStore);
    let updatedItem = ItemStore.getItemByAddress(data.itemAddress);
    let student = students[data.studentId];
    for (let i = 0; i < student.items.length; i++) {
        if (student.items[i].address === updatedItem.address) {
            student.items[i] = updatedItem;
        }
    }
});

export default store;
