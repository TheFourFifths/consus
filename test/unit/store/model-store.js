import ModelStore from '../../../.dist/store/model-store';
import ItemStore from '../../../.dist/store/item-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';
import { createAddress } from 'consus-core/identifiers';

describe('ModelStore', () => {

    let model;
    let models = [];
    let unserializedModel;
    let student;

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Transistor',
                description: 'desc',
                manufacturer: 'man',
                vendor: 'vend',
                location: 'loc',
                allowCheckout: true,
                price: 1.00,
                count: 20
            });
        }).then(actionId => {
            unserializedModel = ModelStore.getModelByActionId(actionId);
            return addAction('NEW_MODEL', {
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Pancakes R\' Us',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                allowCheckout: false,
                price: 10.50,
                count: 20,
                items: ['iGwEZUvfA', 'iGwEZVHHE', 'iGwEZVeaT']
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
        });
    });

    it('should create a model and retrieve it by the action id', () => {
        return addAction('NEW_MODEL', {
            name: 'Bangarang',
            description: 'Something used in computers',
            manufacturer: 'Vroom Industries',
            vendor: 'Fankserrogatoman Inc',
            location: 'Shelf 2',
            allowCheckout: false,
            price: 4.00,
            count: 10
        }).then(actionId => {
            let testModel = ModelStore.getModelByActionId(actionId);
            assert.strictEqual(testModel.name, 'Bangarang');
            assert.lengthOf(ModelStore.getModels(), 3);
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
            allowCheckout: false,
            price: 10.50,
            count: 20
        }).then(() => {
            assert.lengthOf(ModelStore.getModels(), 3);
            return addAction('NEW_MODEL', {
                name: 'Wire',
                description: 'Thin',
                manufacturer: 'A factory',
                vendor: 'A store',
                location: 'A shelf',
                allowCheckout: false,
                price: 3.50,
                count: 1000000
            });
        }).then(() => {
            assert.lengthOf(ModelStore.getModels(), 4);
        });
    });

    it('should provide correct model data', () => {
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
            assert.lengthOf(ModelStore.getModels(), 3);
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
        assert.strictEqual(model.count, 20);
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(actionId => {
            let item = ItemStore.getItemByActionId(actionId);
            assert.strictEqual(model.count, 21);
            return addAction('DELETE_ITEM', {
                itemAddress: item.address,
                modelAddress: model.address
            }).then(() => {
                assert.strictEqual(model.count, 20);
            });
        });
    });

    it('should check out models', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipmentAddresses: [unserializedModel.address]
        }).then(() => {
            assert.strictEqual(unserializedModel.inStock, 19);
        });
    });

    it('should delete a model', () => {
        let deleteModelAddress = models[0].address;
        return addAction('DELETE_MODEL', {
            modelAddress: models[0].address
        }).then(models => {
            models = ModelStore.getModels();
            let array = models.filter(t => t.address === deleteModelAddress);
            assert.lengthOf(array, 0);
            assert.strictEqual(models.length, 1);
        });

    });

    it('should fail to delete a model', () => {
        assert.strictEqual(models.length, 2);
        return addAction('DELETE_MODEL', {
            modelAddress: 'This is not an address'
        }).then(assert.fail).catch(e => {
            assert.strictEqual(e.message, 'Unknown type.');
            assert.strictEqual(models.length, 2);
        });
    });

    it('should notice invalid modelAddress', () => {
        assert.strictEqual(models.length, 2);
        let address = createAddress(100, 'model');
        return addAction('DELETE_MODEL', {
            modelAddress: address
        }).then(assert.fail).catch(e => {
            assert.strictEqual(e.message, `Model address (${address}) does not exist`);
            assert.strictEqual(models.length, 2);
        });
    });

    it('should update a model with new information', () => {
        return addAction('EDIT_MODEL', {
            address: model.address,
            name: 'computer',
            description: 'WHAT A DESCRIPTION',
            manufacturer: 'Change it up',
            vendor: 'vendor',
            location: 'Neptune',
            allowCheckout: false,
            price: 11.50,
            count: 20,
            changeStock: false,
            inStock: 20
        }).then(() => {
            let modifiedModel = ModelStore.getRecentlyUpdatedModel();
            assert.strictEqual('computer', modifiedModel.name);
            assert.strictEqual('WHAT A DESCRIPTION', modifiedModel.description);
            assert.strictEqual('Change it up', modifiedModel.manufacturer);
            assert.strictEqual('vendor', modifiedModel.vendor);
            assert.strictEqual('Neptune', modifiedModel.location);
            assert.strictEqual(false, modifiedModel.allowCheckout);
            assert.strictEqual(11.50, modifiedModel.price);
            assert.strictEqual(20, modifiedModel.count);
        });
    });
});
