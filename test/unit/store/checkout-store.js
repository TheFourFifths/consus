import ModelStore from '../../../.dist/store/model-store';
import ItemStore from '../../../.dist/store/item-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('CheckoutStore', () => {

    let model;
    let items = [];
    let student;

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Resistor'
            });
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(() => {
            return addAction('NEW_STUDENT', {
                id: '123456',
                name: 'John von Neumann'
            });
        }).then(actionId => {
            student = StudentStore.getStudentByActionId(actionId);
        });
    });

    it('should fail to checkout with an overdue item.', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address]
        }).then(() => {
            student.items[0].timestamp = 0;
            assert.isTrue(StudentStore.hasOverdueItem(student.id));
            addAction('NEW_CHECKOUT', {
                studentId:student.id,
                itemAddresses:[items[1].address]
            }).catch(e => {
                assert.strictEqual(e.message, 'Student has overdue item');
            });
        });
    });

});
