import { addAction } from './database';
import students from '../data/students';
import items from '../data/items';
import models from '../data/models';
import checkouts from '../data/checkouts';

export function initData() {
    students.forEach(student => addAction('NEW_STUDENT', student));
    models.forEach(model => addAction('NEW_MODEL', model));
    items.forEach(item => addAction('NEW_ITEM', item));
    checkouts.forEach(checkout => addAction('NEW_CHECKOUT', checkout));
    addAction('CHANGE_ITEM_DUEDATE', { studentId: '111111', dueDate: '1995-12-25', itemAddress: 'iGwEZVeaT' })
}
