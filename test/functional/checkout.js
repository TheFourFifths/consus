import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import CheckoutStore from '../../.dist/store/checkout-store';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';
import StudentStore from '../../.dist/store/student-store';


describe('Check out items and models', () => {

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
        });
    });

    it('should check out an item', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 1);
        return post('checkout', {
            studentId: 123456,
            equipmentAddresses: [
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
            equipmentAddresses: [
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
            equipmentAddresses: [
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

    it('should check out a model', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 1);
        assert.strictEqual(ModelStore.getModelByAddress('m8y7nFLsT').count, 100);
        assert.strictEqual(ModelStore.getModelByAddress('m8y7nFLsT').inStock, 100);
        return post('checkout', {
            studentId: 123456,
            equipmentAddresses: [
                'm8y7nFLsT'
            ]
        }).then(data => {
            assert.isUndefined(data);
            assert.lengthOf(CheckoutStore.getCheckouts(), 2);
            assert.strictEqual(ModelStore.getModelByAddress('m8y7nFLsT').count, 100);
            assert.strictEqual(ModelStore.getModelByAddress('m8y7nFLsT').inStock, 99);
            assert.strictEqual(StudentStore.getStudentById('123456').models[0].address, 'm8y7nFLsT');
        });
    });

    it('should not check out a serialized model', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 2);
        assert.strictEqual(ModelStore.getModelByAddress('m8y7nEtAe').allowCheckout, false);
        return post('checkout', {
            studentId: 123456,
            equipmentAddresses: [
                'm8y7nEtAe'
            ]
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'A model in the cart is not available for checkout.');
            assert.lengthOf(CheckoutStore.getCheckouts(), 2);
            assert.lengthOf(StudentStore.getStudentById('123456').models, 1);
        });
    });

    it('should not check out an out of stock model', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 2);
        assert.strictEqual(ModelStore.getModelByAddress('m8y7nFnMs').allowCheckout, true);
        assert.strictEqual(ModelStore.getModelByAddress('m8y7nFnMs').inStock, 0);
        return post('checkout', {
            studentId: 123456,
            equipmentAddresses: [
                'm8y7nFnMs'
            ]
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'A model in the cart is not available for checkout.');
            assert.lengthOf(CheckoutStore.getCheckouts(), 2);
            assert.lengthOf(StudentStore.getStudentById('123456').models, 1);
        });
    });
});
