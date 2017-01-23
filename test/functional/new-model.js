import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ModelStore from '../../.dist/store/model-store';

describe('New model', () => {

    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA');
    });

    it('should add a model', () => {
        assert.lengthOf(ModelStore.getModels(), 0);
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            isFaulty: false,
            faultDescription: '',
            price: 3.50,
            count: 10
        }).then(response => {
            assert.lengthOf(ModelStore.getModels(), 1);
            let model = ModelStore.getModelByAddress(response.address);
            assert.deepEqual(response, model);
            delete response.address;
            assert.deepEqual(response, {
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
        });
    });

    it('should fail without a name', () => {
        return post('model', {
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            isFaulty: false,
            faultDescription: '',
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model name must be a string: expected undefined to be a string');
        });
    });

    it('should fail without a description', () => {
        return post('model', {
            name: 'Widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            isFaulty: false,
            faultDescription: '',
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model description must be a string: expected undefined to be a string');
        });
    });

    it('should fail without a manufacturer', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            vendor: 'The Store',
            location: 'The shelf',
            isFaulty: false,
            faultDescription: '',
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model manufacturer must be a string: expected undefined to be a string');
        });
    });

    it('should fail without a vendor', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            location: 'The shelf',
            isFaulty: false,
            faultDescription: '',
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model vendor must be a string: expected undefined to be a string');
        });
    });

    it('should fail without a location', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            isFaulty: false,
            faultDescription: '',
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model location must be a string: expected undefined to be a string');
        });
    });

    it('should fail without "isFaulty"', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            faultDescription: '',
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model "isFaulty" must be a boolean: expected undefined to be a boolean');
        });
    });

    it('should fail without a fault description', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            isFaulty: false,
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model fault description must be a string: expected undefined to be a string');
        });
    });

    it('should fail without a price', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            isFaulty: false,
            faultDescription: '',
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model price must be a number: expected undefined to be a number');
        });
    });

    it('should fail without a count', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            isFaulty: false,
            faultDescription: '',
            price: 3.50
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model count must be a number: expected undefined to be a number');
        });
    });

});
