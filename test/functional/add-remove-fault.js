import { assert } from 'chai';
import { addAction } from '../util/database';
import { post, del } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';
describe('New Item Fault', () => {

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
        });
    });

    it('should add and remove a fault to an item.', () => {
        assert.lengthOf(ItemStore.getItems(), 1);
        assert.lengthOf(ItemStore.getItems()[0].faultHistory, 0);
        let itemAddress = ItemStore.getItems()[0].address;
        return post('item/fault', {
            itemAddress,
            faultDescription: "Oopsies"
        }).then(res => {
            assert.lengthOf(ItemStore.getItems()[0].faultHistory, 1);
            assert.deepEqual(res.item, ItemStore.getItems()[0]);
            assert.isTrue(res.item.isFaulty);
            assert.strictEqual(res.item.faultHistory[0].description, "Oopsies");
        }).then(() => {
            return del('item/fault', {itemAddress});
        }).then(res => {
            assert.lengthOf(ItemStore.getItems()[0].faultHistory, 1);
            assert.deepEqual(res.item, ItemStore.getItems()[0]);
            assert.isFalse(res.item.isFaulty);
            assert.strictEqual(res.item.faultHistory[0].description, "Oopsies");
        });
    });

    it("should fail to clear fault without an item address", () => {
        return del('item/fault', {}).catch( e => {
            assert.strictEqual(e.message, "Item address required to remove fault");
        });
    });

    it("should fail without an item address", () => {
        return post('item/fault', {
            fault: {}
        }).catch(e => {
            assert.strictEqual(e.message, "Item address required to log fault.");
        });
    });

    it("should fail without a fault", () => {
        return post('item/fault', {
            itemAddress: ItemStore.getItems()[0].address
        }).catch(e => {
            assert.strictEqual(e.message, "Missing fault to log to item.");
        });
    });
});
