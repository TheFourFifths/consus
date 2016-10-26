import { Dispatcher } from 'consus-core/flux';
import CheckoutStore from '../../../.dist/store/checkout-store';
import { assert } from 'chai';

describe('CheckoutStore', () => {

    before(() => {
        Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any checkouts', () => {
        assert.lengthOf(CheckoutStore.getCheckouts(), 0);
    });

    it('should instantiate with any checkout errors', () => {
        assert.lengthOf(CheckoutStore.getCheckoutErrors(), 0);
    });

});
