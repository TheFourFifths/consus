import { assert } from 'chai';
import { addAction } from '../util/database';
import { get } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ModelStore from '../../.dist/store/model-store';


describe('Get all models', () => {

    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return Promise.all([
                addAction("NEW_MODEL", {
                    name: 'Widget',
                    description: 'A widget',
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    isFaulty: false,
                    faultDescription: '',
                    price: 3.50,
                    count: 0
                }),
                addAction("NEW_MODEL", {
                    name: 'OtherThing',
                    description: 'Not a widget',
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    isFaulty: false,
                    faultDescription: '',
                    price: 3.50,
                    count: 0
                })
            ]);
        });
    });

    it('should get all models', () => {
        assert.lengthOf(ModelStore.getModels(), 2, "Failure During Setup");
        return get('model/all').then(response => {
            response.models.forEach(ele => {
                delete ele.address;
            });
            assert.deepEqual(response.models, [
                {
                    name: 'Widget',
                    description: 'A widget',
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    isFaulty: false,
                    faultDescription: '',
                    price: 3.50,
                    count: 0
                },
                {
                    name: 'OtherThing',
                    description: 'Not a widget',
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    isFaulty: false,
                    faultDescription: '',
                    price: 3.50,
                    count: 0
                }
            ]);
        });
    });

});