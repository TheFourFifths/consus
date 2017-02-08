import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import CheckoutStore from '../../.dist/store/checkout-store';
import ItemStore from '../../.dist/store/item-store';
import StudentStore from '../../.dist/store/student-store';


describe('Check out items', () => {

    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    before(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Widget',
                description: 'A widget',
                manufacturer: 'The Factory',
                vendor: 'The Store',
                location: 'The shelf',
                isFaulty: false,
                faultDescription: '',
                price: 3.50,
                count: 10
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
        });
    });

    it('should check out an item', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 1);
        return post('checkout', {
            studentId: 123456,
            itemAddresses: [
                'iGwEZUvfA'
            ]
        }).then(data => {
            assert.isUndefined(data);
            assert.lengthOf(CheckoutStore.getCheckouts(), 1);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 1);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 0);
            assert.strictEqual(StudentStore.getStudentById('123456').items[0].address, 'iGwEZUvfA');
        });
    });

    it('should not be able to check out an unavailable item', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 1);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 1);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 0);
        return post('checkout', {
            studentId: 111111,
            itemAddresses: [
                'iGwEZUvfA'
            ]
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'An item in the cart is not available for checkout.');
        });
    });

    it('should require a student id', () => {
        return post('checkout', {
            itemAddresses: [
                'iGwEZUvfA'
            ]
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'A student id is required.');
        });
    });

    it('should require item addresses', () => {
        return post('checkout', {
            studentId: 111111
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'An array of item addresses is required.');
        });
    });

    it('should do a longterm checkout ', () => {
        let studentId = 123456;
        let adminCode = undefined;
        let longtermDueDate = '12-12-2020';
        let longtermProfessor = 'Professor Dunglebottom';
        return addAction('NEW_ITEM', {
            modelAddress: 'm8y7nEtAe'
        }).then(actionId => {
            let item = ItemStore.getItemByActionId(actionId);
            let itemAddresses = [item.address];
            return post('checkout/longterm', {
                studentId: studentId,
                itemAddresses: itemAddresses,
                adminCode: adminCode,
                longtermDueDate: longtermDueDate,
                longtermProfessor: longtermProfessor
            });
        }).then(() => {
            assert.lengthOf(CheckoutStore.getLongTermCheckouts(), 1);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 0);
            assert.strictEqual(StudentStore.getStudentById('123456').items[0].address, 'iGwEZUvfA');
        });
    });
});
