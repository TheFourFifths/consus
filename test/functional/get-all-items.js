import { assert } from 'chai';
import { addAction } from '../util/database';
import { get } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ModelStore from '../../.dist/store/model-store';
import ItemStore from '../../.dist/store/item-store';


describe('Get all items', () => {

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
                    count: 10
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
                    count: 10
                })
            ]).then(() => {
                let modAddr1 = ModelStore.getModels()[0].address;
                let modAddr2 = ModelStore.getModels()[1].address;
                return Promise.all([
                    addAction("NEW_ITEM", {
                        modelAddress: modAddr1
                    }),
                    addAction("NEW_ITEM", {
                        modelAddress: modAddr1
                    }),
                    addAction("NEW_ITEM", {
                        modelAddress: modAddr2
                    })
                ]);
            });
        });
    });

    it('should get all items', () => {
        assert.lengthOf(ItemStore.getItems(), 3, "Failure During Setup");
        return get('item/all').then(response => {
            assert.deepEqual(response.items, ItemStore.getItems());
        });
    });

});
