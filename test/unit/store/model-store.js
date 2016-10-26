import { Dispatcher } from 'consus-core/flux';
import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';

describe('ModelStore', () => {

    before(() => {
        Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any models', () => {
        assert.lengthOf(ModelStore.getModels(), 0);
    });

});
