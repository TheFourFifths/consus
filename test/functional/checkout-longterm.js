import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import CheckoutStore from '../../.dist/store/checkout-store';
import ItemStore from '../../.dist/store/item-store';
import StudentStore from '../../.dist/store/student-store';
import moment from 'moment-timezone';

describe('Check out longterm', () => {
    let items = [];
    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Widget',
                description: 'A widget',
                manufacturer: 'The Factory',
                vendor: 'The Store',
                location: 'The shelf',
                allowCheckout: false,
                price: 3.50,
                count: 10
            });
        }).then(() => {
            return addAction('NEW_MODEL', {
                name: 'Thingamajig',
                description: 'A Thingamajig',
                manufacturer: 'The Thing Factory',
                vendor: 'The Market',
                location: 'The other shelf',
                allowCheckout: true,
                price: 0.50,
                count: 100
            });
        }).then(() => {
            return addAction('NEW_MODEL', {
                name: 'Thingamajig 2',
                description: 'Another Thingamajig',
                manufacturer: 'The Thing Factory',
                vendor: 'The Market',
                location: 'The same shelf',
                allowCheckout: true,
                price: 0.75,
                count: 0
            });
        }).then(() => {
            return addAction('NEW_STUDENT', {
                id: 123456,
                name: 'John von Neumann',
                email: 'jvn@example.com',
                major: 'Chemical Engineering & Mathematics',
                status: 'C - Current'
            });
        }).then(() => {
            return addAction('NEW_STUDENT', {
                id: 111111,
                name: 'Latey McLateface',
                email: 'mclatefacel@msoe.edu',
                major: 'Underwater Basket Weaving',
                status: 'C - Current'
            });
        }).then(() => {
            return addAction('NEW_ITEM', {
                modelAddress: 'm8y7nEtAe'
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
        }).then(() => {
            return addAction('NEW_ITEM', {
                modelAddress: 'm8y7nEtAe'
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
        });
    });

    it('should check out equipment longterm', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 2);
        let timestamp = moment();
        return post('checkout/longterm', {
            studentId: 123456,
            equipment: [
                {
                    address: 'iGwEZUvfA'
                }
            ],
            dueDate: timestamp,
            professor: 'Professor'
        }).then(data => {
            assert.isUndefined(data);
            assert.lengthOf(CheckoutStore.getLongtermCheckouts(), 1);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 1);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 1);
            assert.strictEqual(StudentStore.getStudentById('123456').items[0].address, 'iGwEZUvfA');
        });
    });

    it('should allow for admin to override failure to longterm checkout due to overdue item', () => {
        let student = StudentStore.getStudentById(123456);
        let timestamp = moment();
        return addAction('NEW_LONGTERM_CHECKOUT', {
            studentId: 123456,
            equipment: [
                {
                    address: items[0].address
                }
            ],
            dueDate: timestamp,
            professor: 'test'
        }).then(() => {
            student.items[0].timestamp = 0;
            assert.isTrue(StudentStore.hasOverdueItem(student.id));
            addAction('NEW_LONGTERM_CHECKOUT', {
                studentId: student.id,
                equipment: [
                    {
                        address: items[1].address
                    }
                ],
                adminCode: '112994',
                dueDate: timestamp,
                professor: 'test'
            }).then(() => {
                assert.strictEqual(student.items.length, 2);
            });
        });
    });

    it('should notice missing studentId', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 2);
        let timestamp = moment();
        return post('checkout/longterm', {
            equipment: [
                {
                    address: 'iGwEZUvfA'
                }
            ],
            dueDate: timestamp,
            professor: 'Professor'
        }).then(() => {
            assert.fail();
        }).catch(e => {
            assert.strictEqual(e.message, 'A student id is required.');
        });
    });

    it('should notice missing equipment', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 2);
        let timestamp = moment();
        return post('checkout/longterm', {
            studentId: 123456,
            dueDate: timestamp,
            professor: 'Professor'
        }).then(() => {
            assert.fail();
        }).catch(e => {
            assert.strictEqual(e.message, 'An array of equipment is required.');
        });
    });

    it('should notice missing professor', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 2);
        let timestamp = moment();
        return post('checkout/longterm', {
            studentId: 123456,
            equipment: [
                {
                    address: 'iGwEZUvfA'
                }
            ],
            dueDate: timestamp,
        }).then(() => {
            assert.fail();
        }).catch(e => {
            assert.strictEqual(e.message, 'A professor is required.');
        });
    });
});
