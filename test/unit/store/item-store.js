import ItemStore from '../../../.dist/store/item-store';
import ModelStore from '../../../.dist/store/model-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('ItemStore', () => {

    let student;
    let model;
    let items = [];

    before(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Resistor'
            });
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
            return addAction('NEW_STUDENT', {
                id: '123456',
                name: 'John von Neumann'
            });
        }).then(actionId => {
            student = StudentStore.getStudentByActionId(actionId);
        });
    });

    it('should instantiate without any items', () => {
        assert.lengthOf(ItemStore.getItems(), 0);
    });

    it('should create an item', () => {
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            assert.lengthOf(ItemStore.getItems(), 1);
        });
    });

    it('should create more items', () => {
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            assert.lengthOf(ItemStore.getItems(), 3);
        });
    });

    it('should check out multiple items', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address, items[2].address]
        }).then(() => {
            assert.strictEqual(items[0].status, 'CHECKED_OUT');
            assert.strictEqual(items[1].status, 'AVAILABLE');
            assert.strictEqual(items[2].status, 'CHECKED_OUT');
        });
    });

    it('should check an item in', () => {
        return addAction('CHECKIN', {
            studentId: student.id,
            itemAddress: items[0].address
        }).then(() => {
            assert.strictEqual(items[0].status, 'AVAILABLE');
            assert.strictEqual(items[1].status, 'AVAILABLE');
            assert.strictEqual(items[2].status, 'CHECKED_OUT');
        });
    });

    it('should delete an item', () => {
        assert.strictEqual(items.length, 3);
        return addAction('DELETE_ITEM', {
            itemAddress: items[0].address
        }).then(() => {
            items = ItemStore.getItems();
            assert.strictEqual(items.length, 2);
        });
    });

    it('should fail to delete an item', () =>{
        assert.strictEqual(items.length, 2);
        return addAction('DELETE_ITEM', {
            itemAddress: 'This is not an address'
        }).then(() => {
            throw new Error('Expected to catch error since there was not a valid address given to delete item');
        }).catch(() => {
            assert.isTrue(true);
        });
    });

});
