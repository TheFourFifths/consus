import { Dispatcher } from 'consus-core/flux';
import ItemStore from '../../../.dist/store/item-store';
import { assert } from 'chai';

describe('ItemStore', () => {

    before(() => {
        Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any items', () => {
        assert.lengthOf(ItemStore.getItems(), 0);
    });

});
