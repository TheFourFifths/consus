import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ModelStore from '../../.dist/store/model-store';

describe('New model', () => {

    before(() => {
        return server.start();
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

});
