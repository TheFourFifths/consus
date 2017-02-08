import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import ItemStore from './item-store';

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

export default store;
