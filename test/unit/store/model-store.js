import ModelStore from '../../../.dist/store/model-store';
import ItemStore from '../../../.dist/store/item-store';
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
            name: 'Transistor',
            description: 'Something used in computers',
            manufacturer: 'Vroom Industries',
            vendor: 'Fankserrogatoman Inc',
            location: 'Shelf 2',
            isFaulty: false,
            faultDescription: '',
            price: 4.00,
            count: 10
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
            name: 'Resistor',
            description: 'V = IR',
            manufacturer: 'Pancakes R\' Us',
            vendor: 'Mouzer',
            location: 'Shelf 14',
            isFaulty: false,
            faultDescription: '',
            price: 10.50,
            count: 20
        }).then(() => {
            assert.lengthOf(ModelStore.getModels(), 2);
            return addAction('NEW_MODEL', {
                name: 'Wire',
                description: 'Thin',
                manufacturer: 'A factory',
                vendor: 'A store',
                location: 'A shelf',
                isFaulty: true,
                faultDescription: 'Shattered into a million pieces',
                price: 3.50,
                count: 1000000
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

    it('should inc/dec the count for item creation/deletion', () =>{
        assert.strictEqual(model.count, 14);
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(actionId => {
            let item = ItemStore.getItemByActionId(actionId);
            assert.strictEqual(model.count, 15);
            return addAction('DELETE_ITEM', {
                itemAddress: item.address,
                modelAddress: model.address
            }).then(() => {
                assert.strictEqual(model.count, 14);
            });
        });
    });

});
