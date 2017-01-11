import ModelStore from '../../../.dist/store/model-store';
import ItemStore from '../../../.dist/store/item-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('ModelStore', () => {

    let model;
    let models = [];
    let student;

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
            price: 11.50,
            allowCheckout: true,
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
            assert.strictEqual(model.price, 11.50);
            assert.strictEqual(model.allowCheckout, true);
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

    it('should check out models', () => {
        // I would pull this into a beforeEach, but it's only used here so far and would mess up the instantiate empty test
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Transistor',
                allowCheckout: true,
                count: 20,
            });
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
            return addAction('NEW_STUDENT', {
                id: '123456',
                name: 'John von Neumann'
            });
        }).then(actionId => {
            student = StudentStore.getStudentByActionId(actionId);
            models = ModelStore.getModels();
        }).then(() => {
            return addAction('NEW_CHECKOUT', {
                studentId: student.id,
                equipmentAddresses: [models[0].address]
            });
        }).then(() => {
            assert.strictEqual(models[0].inStock, 19);
        });
    });

});
