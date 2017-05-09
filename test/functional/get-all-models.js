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
                    allowCheckout: false,
                    price: 3.50,
                    count: 0
                }),
                addAction("NEW_MODEL", {
                    name: 'OtherThing',
                    description: 'Not a widget',
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    allowCheckout: false,
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
                assert.property(ele, 'address');
                delete ele.address;
                assert.property(ele, 'photo');
                delete ele.photo;
            });
            assert.deepEqual(response.models, [
                {
                    name: 'Widget',
                    description: 'A widget',
                    frequency: 0,
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    allowCheckout: false,
                    price: 3.50,
                    count: 0,
                    inStock: 0
                },
                {
                    name: 'OtherThing',
                    description: 'Not a widget',
                    frequency: 0,
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    allowCheckout: false,
                    price: 3.50,
                    count: 0,
                    inStock: 0
                }
            ]);
        });
    });

});
