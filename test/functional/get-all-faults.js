import { assert } from 'chai';
import { addAction } from '../util/database';
import { get } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';
describe('Get Faulty Items', () => {

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
            return addAction('NEW_ITEM', {
                modelAddress: ModelStore.getModels()[0].address
            });
        }).then(() => {
            return addAction("ADD_ITEM_FAULT", {
                itemAddress: ItemStore.getItems()[0].address,
                description: "STUFF HAS GONE HORRIBRU"
            });
        });
    });

    it('should get all items with faults.', () => {
        return get('item/fault/all').then(res => {
            assert.deepEqual(res.items, ItemStore.getFaultyItems());
        });
    });
});
