import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('ModelStore', () => {

    let model;

    before(() => {
        addAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any models', () => {
        assert.lengthOf(ModelStore.getModels(), 0);
    });

    it('should create a model an retrieve it by the action id', () => {
        addAction('NEW_MODEL', {
            name: 'Transistor'
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
        });
        assert.lengthOf(ModelStore.getModels(), 1);
    });

    it('should retrieve a model by address', () => {
        assert.strictEqual(ModelStore.getModelByAddress(model.address), model);
    });

    it('should create more models', () => {
        addAction('NEW_MODEL', {
            name: 'Resistor'
        });
        assert.lengthOf(ModelStore.getModels(), 2);
        addAction('NEW_MODEL', {
            name: 'Wire'
        });
        assert.lengthOf(ModelStore.getModels(), 3);
    });

});
