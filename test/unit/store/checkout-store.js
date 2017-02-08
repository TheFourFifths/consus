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
                assert.strictEqual(student.items.length, 1);
            });
        });
    });

    it('should fail to override checkout with an overdue item if admin code is invalid.', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address]
        }).then(() => {
            student.items[0].timestamp = 0;
            assert.isTrue(StudentStore.hasOverdueItem(student.id));
            addAction('NEW_CHECKOUT', {
                studentId:student.id,
                itemAddresses:[items[1].address],
                adminCode: '2000'
            }).catch(e => {
                assert.strictEqual(e.message, 'Invalid Admin');
                assert.strictEqual(student.items.length, 1);
            });
        });
    });
    it('should allow for admin to override failure to checkout due to overdue item', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address]
        }).then(() => {
            student.items[0].timestamp = 0;
            assert.isTrue(StudentStore.hasOverdueItem(student.id));
            addAction('NEW_CHECKOUT', {
                studentId: student.id,
                itemAddresses: [items[1].address],
                adminCode: '112994'
            }).then(() => {
                assert.strictEqual(student.items.length, 2);
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

    it('should allow for admin to override failure to longterm-checkout due to overdue item', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address]
        }).then(() => {
            student.items[0].timestamp = 0;
            assert.isTrue(StudentStore.hasOverdueItem(student.id));
            addAction('NEW_LONGTERM_CHECKOUT', {
                studentId: student.id,
                itemAddresses: [items[1].address],
                adminCode: '112994',

            }).then(() => {
                assert.strictEqual(student.items.length, 2);
            });
        });
    });

    it('should fail to check out an unavailable item', () => {
        return addAction('NEW_LONGTERM_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address, items[1].address],
            longtermDueDate: '2017-11-5',
            longtermProfessor: 'Professor Vroom'
        }).then(() => {
            return addAction('NEW_LONGTERM_CHECKOUT', {
                studentId: student.id,
                itemAddresses: [items[0].address],
                longtermDueDate: '2017-11-5',
                longtermProfessor: 'Professor Vroom'
            });
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'An item in the cart is not available for checkout.');
        });
    });

    it('should create a longterm checkout', () => {
        return addAction('NEW_LONGTERM_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address, items[1].address],
            longtermDueDate: '2017-11-5',
            longtermProfessor: 'Professor Vroom'
        }).then(actionId => {
            assert.lengthOf(CheckoutStore.getLongTermCheckouts(), 1);
            let checkout = CheckoutStore.getLongTermCheckoutByActionId(actionId);
            assert.strictEqual(checkout.studentId, student.id);
            assert.strictEqual(checkout.itemAddresses[0], items[0].address);
            assert.strictEqual(checkout.itemAddresses[1], items[1].address);
            assert.strictEqual(checkout.longtermProfessor, 'Professor Vroom');
        });
    });

});
