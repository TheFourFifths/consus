import { addAction } from './database';
import students from '../data/students';
import items from '../data/items';
import models from '../data/models';
import ItemStore from '../store/item-store';

export function initData(){
    students.forEach(student => {
        addAction('NEW_STUDENT', student);
    });

    models.forEach(model => {
        addAction('NEW_MODEL', model);
    });

    items.forEach(item => {
        addAction('NEW_ITEM', item);
    });

    addAction('NEW_CHECKOUT', {
        studentId: students[1].id,
        itemAddresses: [ItemStore.getItems()[2].address]
    });

    ItemStore.getItems()[2].timestamp = 0;
}
