import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import ItemStore from './item-store';

let checkins = new Object(null);
let checkinErrors = new Object(null);

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
    checkins = new Object(null);
    checkinErrors = new Object(null);
});

store.registerHandler('CHECKIN', data => {
    let student = StudentStore.getStudentById(data.studentId);
    if (typeof student !== 'object') {
        return checkinErrors[data.actionId] = 'Student could not be found.';
    }
    let item = ItemStore.getItemByAddress(data.itemAddress);
    if (typeof item !== 'object') {
        return checkinErrors[data.actionId] = 'Item could not be found.';
    }
    if (student.items.indexOf(item) === -1) {
        return checkinErrors[data.actionId] = 'This item is not checked out by the student.';
    }
    checkins[data.actionId] = {
        student,
        item
    };
});

export default store;
