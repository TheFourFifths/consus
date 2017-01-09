import ItemStore from '../../../.dist/store/item-store';
import ModelStore from '../../../.dist/store/model-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('ItemStore', () => {

    let student;
    let model;
    let items = [];

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Pancakes R\' Us',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                isFaulty: false,
                faultDescription: '',
                price: 10.50,
                count: 20
            });
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
            return addAction('NEW_STUDENT', {
                id: '123456',
                name: 'John von Neumann'
            });
        }).then(actionId => {
            student = StudentStore.getStudentByActionId(actionId);
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(() => {
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(() => {
            items = ItemStore.getItems();
        });
    });

    it('should clear all data', () => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            assert.lengthOf(ItemStore.getItems(), 0);
        });
    });

    it('should create an item', () => {
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            assert.lengthOf(ItemStore.getItems(), 3);
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
            assert.lengthOf(ItemStore.getItems(), 4);
        });
    });

    it('should check out multiple items', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address, items[1].address]
        }).then(() => {
            assert.strictEqual(items[0].status, 'CHECKED_OUT');
            assert.strictEqual(items[1].status, 'CHECKED_OUT');
        });
    });

    it('should check an item in', () => {
        return addAction('CHECKIN', {
            studentId: student.id,
            itemAddress: items[0].address
        }).then(() => {
            assert.strictEqual(items[0].status, 'AVAILABLE');
        });
    });

    it('should fail to delete an item', () =>{
        assert.strictEqual(items.length, 2);
        return addAction('DELETE_ITEM', {
            itemAddress: 'This is not an address'
        }).then(assert.fail)
          .catch(e => {
              assert.strictEqual(e.message, 'Unknown type.');
              assert.strictEqual(items.length, 2);
          });
    });

    it('should delete an item', () =>{
        assert.strictEqual(items.length, 2);
        let deletedItemAddress = items[0].address;
        let modelAddress = items[0].modelAddress;
        return addAction('DELETE_ITEM', {
            itemAddress: deletedItemAddress,
            modelAddress: modelAddress
        }).then(items => {
            items = ItemStore.getItems();
            let array = items.filter(t => t.address === deletedItemAddress);
            assert.lengthOf(array, 0);
            assert.strictEqual(items.length, 1);
        });
    });

});
