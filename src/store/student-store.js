import config from 'config';
import { Store } from 'consus-core/flux';
import { readAddress } from 'consus-core/identifiers';
import ItemStore from './item-store';
import ModelStore from './model-store';
import CheckoutStore from './checkout-store';
import CheckinStore from './checkin-store';
import { isBeforeNow } from '../lib/clock';

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

function updateStudent(student){
    let studentToUpdate = students[student.id];
    for (let key in student){
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

store.registerHandler('CHECKIN_MODELS', data => {
    store.waitFor(CheckinStore);
    if (typeof CheckinStore.getCheckinByActionId(data.actionId) !== 'object') {
        return;
    }
    let student = store.getStudentById(data.studentId);
    let model = ModelStore.getModelByAddress(data.modelAddress);

    let modelsRemoved = 0;
    for(let i = 0; i < student.models.length && modelsRemoved < data.quantity; i++){
        if(student.models[i].address === model.address){
            student.models.splice(i, 1);
            i--;
            modelsRemoved++;
        }
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
export default store;
