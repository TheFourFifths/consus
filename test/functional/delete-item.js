import { assert } from 'chai';
import { addAction } from '../util/database';
import { del } from '../util/mock-client';
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

    it('should delete an item', () => {
        assert.lengthOf(ItemStore.getItems(), 3, "Failure During Setup");
        let item = ItemStore.getItems()[0];
        let count = ModelStore.getModelByAddress(item.modelAddress).count;
        return del('item', {
            itemAddress: item.address,
            modelAddress: item.modelAddress
        }).then(() => {
            assert.notInclude(ItemStore.getItems(), item);
            assert.lengthOf(ItemStore.getItems(), 2);
            assert.strictEqual(ModelStore.getModelByAddress(item.modelAddress).count, count - 1);
        });
    });

    it('should fail to delete without an item address', () => {
        return del('item', {
            modelAddress: ModelStore.getModels()[0].address
        }).then(() => {
            throw new Error("Unexpected Success");
        }).catch(e => {
            assert.strictEqual(e.message, "Item address required to delete");
        });
    });

    it('should fail to delete without a model address', () => {
        return del('item', {
            itemAddress: ItemStore.getItems()[0].address
        }).then(() => {
            throw new Error("Unexpected Success");
        }).catch(e => {
            assert.strictEqual(e.message, "Model address required to delete");
        });
    });

});
