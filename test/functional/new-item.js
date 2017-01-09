import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';

describe('New Item', () => {

    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction("NEW_MODEL", {
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Pancakes R\' Us',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                isFaulty: false,
                faultDescription: '',
                price: 10.50,
                count: 20
            });
        });
    });

    it('should add an item', () => {
        assert.lengthOf(ItemStore.getItems(), 0);
        return post('item', {
            modelAddress: ModelStore.getModels()[0].address
        }).then(response => {
            assert.lengthOf(ItemStore.getItems(), 1);
            let item = ItemStore.getItemByAddress(response.address);
            delete response.address;
            assert.deepEqual(response, {
                modelName: "Resistor"
            });
            delete item.address;
            assert.deepEqual(item, {
                modelAddress: ModelStore.getModels()[0].address,
                status: "AVAILABLE"
            });
        });
    });

    it('should fail to add an item with no model address', () => {
        return post('item', {}).then(() => {
            throw new Error("Promise unexpectedly fulfilled");
        }).catch(e => {
            assert.strictEqual(e.message, "Cannot read property 'slice' of undefined");
        });
    });


});
