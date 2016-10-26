import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import ItemStore from './item-store';

let checkins = [];
let checkinsByActionId = new Object(null);
let checkinErrorsByActionId = new Object(null);

class CheckinStore extends Store {

    getCheckinByActionId(actionId) {
        return checkinsByActionId[actionId];
    }

    getCheckinErrorByActionId(actionId) {
        return checkinErrorsByActionId[actionId];
    }

}

const store = new CheckinStore();

store.registerHandler('CHECKIN', data => {
    let student = StudentStore.getStudentById(data.studentId);
    if (typeof student !== 'object') {
        return checkinErrorsByActionId.push('Student could not be found.');
    }
    let item = ItemStore.getItemByAddress(data.itemAddress);
    if (typeof item !== 'object') {
        return checkinErrorsByActionId.push('Item could not be found.');
    }
    if (student.items.indexOf(item) === -1) {
        return checkinErrorsByActionId.push('This item is not checked out by the student.');
    }
    let checkin = {
        student,
        item
    };
    checkinsByActionId[data.actionId] = checkin;
    checkins.push(checkin);
});

export default store;
