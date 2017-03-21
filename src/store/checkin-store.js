import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import ItemStore from './item-store';
import ModelStore from './model-store';

let checkins = Object.create(null);
let checkinErrors = Object.create(null);

class CheckinStore extends Store {

    getCheckins() {
        return Object.keys(checkins).map(key => checkins[key]);
    }

    getCheckinErrors() {
        return Object.keys(checkinErrors).map(key => checkinErrors[key]);
    }

    getCheckinByActionId(actionId) {
        return checkins[actionId];
    }

    getCheckinErrorByActionId(actionId) {
        return checkinErrors[actionId];
    }

}

const store = new CheckinStore();

store.registerHandler('CLEAR_ALL_DATA', () => {
    checkins = Object.create(null);
    checkinErrors = Object.create(null);
});

store.registerHandler('CHECKIN', data => {
    let student = StudentStore.getStudentById(data.studentId);
    if (typeof student !== 'object') {
        let msg = 'Student could not be found.';
        checkinErrors[data.actionId] = msg;
        throw new Error(msg);
    }
    let item = ItemStore.getItemByAddress(data.itemAddress);
    if (typeof item !== 'object') {
        let msg = 'Item could not be found.';
        checkinErrors[data.actionId] = msg;
        throw new Error(msg);
    }
    if (student.items.indexOf(item) === -1) {
        let msg = 'This item is not checked out by that student.';
        checkinErrors[data.actionId] = msg;
        throw new Error(msg);
    }
    checkins[data.actionId] = {
        student,
        item
    };
});

store.registerHandler('CHECKIN_MODELS', data => {
    let student = StudentStore.getStudentById(data.studentId);
    if (typeof student !== 'object') {
        let msg = 'Student could not be found.';
        checkinErrors[data.actionId] = msg;
        throw new Error(msg);
    }
    let model = ModelStore.getModelByAddress(data.modelAddress);
    if (typeof model !== 'object') {
        let msg = 'Model could not be found.';
        checkinErrors[data.actionId] = msg;
        throw new Error(msg);
    }
    if (!student.models.includes(model)) {
        let msg = 'This model is not checked out by that student.';
        checkinErrors[data.actionId] = msg;
        throw new Error(msg);
    }

    checkins[data.actionId] = {
        student: student,
        model: model,
        quantity: data.quantity
    };
});

export default store;
