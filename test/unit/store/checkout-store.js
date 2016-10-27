import CheckoutStore from '../../../.dist/store/checkout-store';
import ModelStore from '../../../.dist/store/model-store';
import ItemStore from '../../../.dist/store/item-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('CheckoutStore', () => {

    let items = [];
    let student;

    before(() => {
        addAction('CLEAR_ALL_DATA');
        addAction('NEW_MODEL', {
            name: 'Resistor'
        }).then(actionId => {
            let model = ModelStore.getModelByActionId(actionId);
            for (let i = 0; i < 3; i++) {
                addAction('NEW_ITEM', {
                    modelAddress: model.address
                }).then(actionId => {
                    items.push(ItemStore.getItemByActionId(actionId));
                });
            }
        });
        addAction('NEW_STUDENT', {
            id: '123456',
            name: 'John von Neumann'
        }).then(actionId => {
            student = StudentStore.getStudentByActionId(actionId);
        });
    });

    it('should instantiate without any checkouts', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 0);
    });

    it('should instantiate without any checkout errors', () => {
        assert.lengthOf(CheckoutStore.getCheckoutErrors(), 0);
    });

    it('should create a checkout', () => {
        addAction('NEW_CHECKOUT', {
            studentId: student.id,
            items: [items[0].address, items[1].address]
        }).then(() => {
            assert.lengthOf(CheckoutStore.getCheckouts(), 1);
        });
    });

});
