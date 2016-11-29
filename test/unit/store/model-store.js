import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('ModelStore', () => {

    let model;

    before(() => {
        return addAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any models', () => {
        assert.lengthOf(ModelStore.getModels(), 0);
    });

    it('should create a model and retrieve it by the action id', () => {
        return addAction('NEW_MODEL', {
            name: 'Transistor'
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
            assert.lengthOf(ModelStore.getModels(), 1);
        });
    });

    it('should retrieve a model by address', () => {
        assert.strictEqual(ModelStore.getModelByAddress(model.address), model);
    });

    it('should create more models', () => {
        return addAction('NEW_MODEL', {
            name: 'Resistor'
        }).then(() => {
            assert.lengthOf(ModelStore.getModels(), 2);
            return addAction('NEW_MODEL', {
                name: 'Wire'
            });
        }).then(() => {
            assert.lengthOf(ModelStore.getModels(), 3);
        });
    });

    it('should provide correct model data', () =>{
        return addAction('NEW_MODEL', {
            name: 'tester',
            description: 'desc',
            manufacturer: 'Us',
            vendor: 'Fromer',
            location: 'Area 52',
            isFaulty: false,
            faultDescription: '',
            price: 11.50,
            count: 14
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
            assert.lengthOf(ModelStore.getModels(), 4);
            assert.isNotNull(model.address);
            assert.strictEqual(model.name, 'tester');
            assert.strictEqual(model.description, 'desc');
            assert.strictEqual(model.manufacturer, 'Us');
            assert.strictEqual(model.vendor, 'Fromer');
            assert.strictEqual(model.location, 'Area 52');
            assert.strictEqual(model.isFaulty, false);
            assert.strictEqual(model.faultDescription, '');
            assert.strictEqual(model.price, 11.50);
            assert.strictEqual(model.count, 14);
        });
    });

});
