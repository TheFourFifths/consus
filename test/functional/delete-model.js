import { assert } from 'chai';
import { addAction } from '../util/database';
import { del } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ModelStore from '../../.dist/store/model-store';
import ItemStore from '../../.dist/store/item-store';


describe('Delete model', () => {

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
            }).then(() => {
                return addAction('NEW_MODEL', {
                    name: 'OtherThing',
                    description: 'Not a widget',
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    allowCheckout: false,
                    price: 3.50,
                    count: 10
                });
            }).then(() => {
                return addAction('NEW_ITEM', {
                    modelAddress: 'm8y7nEtAe'
                });
            });
        });
    });

    it('should delete a model', () => {
        assert.lengthOf(ModelStore.getModels(), 2);
        assert.lengthOf(ItemStore.getItems(), 1);
        return del('model', {
            modelAddress: 'm8y7nFLsT'
        }).then(() => {
            assert.lengthOf(ModelStore.getModels(), 1);
            assert.lengthOf(ItemStore.getItems(), 1);
        });
    });

    it('should delete a model and its items', () => {
        assert.lengthOf(ModelStore.getModels(), 1);
        assert.lengthOf(ItemStore.getItems(), 1);
        return del('model', {
            modelAddress: 'm8y7nEtAe'
        }).then(() => {
            assert.lengthOf(ModelStore.getModels(), 0);
            assert.lengthOf(ItemStore.getItems(), 0);
        });
    });

    it('should require a model address', () => {
        return del('model', {}).then(() => {
            throw new Error('Unexpected Success');
        }).catch(e => {
            assert.strictEqual(e.message, 'A model address is required.');
        });
    });

});
