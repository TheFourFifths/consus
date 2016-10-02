import { assert } from 'chai';
import Item from '../../../.dist/model/item';

describe('Item', () => {

    let item;

    beforeEach(() => {
        item = new Item('123');
    });

    describe('#constructor', () => {

        it('should instantiate an Item', () => {
            assert.instanceOf(item, Item);
        });

        it('should initially have the provided id', () => {
            assert.strictEqual(item.id, '123');
        });

        it('should initially be available', () => {
            assert.strictEqual(item.status, 'AVAILABLE');
        });

    });

});
