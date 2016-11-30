import CheckoutStore from '../../../.dist/store/checkout-store';
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

    it('should fail to check out with an overdue item', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address]
        }).then(() => {
            student.items[0].timestamp = 0;
            assert.isTrue(StudentStore.hasOverdueItem(student.id));
            return addAction('NEW_CHECKOUT', {
                studentId:student.id,
                itemAddresses:[items[1].address]
            }).catch(e => {
                assert.strictEqual(e.message, 'Student has overdue item');
            });
        });
    });

    it('should instantiate without any checkouts', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 0);
    });

    it('should instantiate without any checkout errors', () => {
        assert.lengthOf(CheckoutStore.getCheckoutErrors(), 0);
    });

    it('should create a checkout', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address, items[1].address]
        }).then(() => {
            assert.lengthOf(CheckoutStore.getCheckouts(), 1);
        });
    });

    it('should fail to check out an unavailable item', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address, items[1].address]
        }).then(() => {
            return addAction('NEW_CHECKOUT', {
                studentId: student.id,
                itemAddresses: [items[0].address]
            });
        }).catch(e => {
            assert.strictEqual(e.message, 'An item in the cart is not available for checkout.');
        });
    });

});
