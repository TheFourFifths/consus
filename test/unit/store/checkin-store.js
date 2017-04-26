import CheckinStore from '../../../.dist/store/checkin-store';
import ModelStore from '../../../.dist/store/model-store';
import ItemStore from '../../../.dist/store/item-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';
import { createAddress } from 'consus-core/identifiers';

describe('CheckinStore', () => {

    let model;
    let unserializedModel;
    let items = [];
    let student;

    before(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Pancakes R\' Us',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                allowCheckout: false,
                price: 10.50,
                count: 20
            });
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
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
                name: 'Transistor2',
                description: 'desc2',
                manufacturer: 'man2',
                vendor: 'vend2',
                location: 'loc2',
                allowCheckout: true,
                price: 2.00,
                count: 20
            });
        }).then(() => {
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(() => {
            return addAction('NEW_STUDENT', {
                id: '123456',
                name: 'John von Neumann'
            });
        }).then(actionId => {
            student = StudentStore.getStudentByActionId(actionId);
            return addAction('NEW_CHECKOUT', {
                studentId: student.id,
                equipment: [
                    {
                        address: items[0].address
                    },
                    {
                        address: items[2].address
                    },
                    {
                        address: unserializedModel.address,
                        quantity: 1
                    }
                ]
            });
        });
    });

    it('should instantiate without any checkins', () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
    });

    it('should instantiate with any checkin errors', () => {
        assert.lengthOf(CheckinStore.getCheckinErrors(), 0);
    });

    it('should create a checkin', () => {
        return addAction('CHECKIN', {
            studentId: student.id,
            itemAddress: items[0].address
        }).then(actionId => {
            assert.isObject(CheckinStore.getCheckinByActionId(actionId));
            assert.lengthOf(CheckinStore.getCheckins(), 1);
        });
    });

    it('should create another checkin', () => {
        return addAction('CHECKIN', {
            studentId: student.id,
            itemAddress: items[2].address
        }).then(actionId => {
            assert.isObject(CheckinStore.getCheckinByActionId(actionId));
            assert.lengthOf(CheckinStore.getCheckins(), 2);
        });
    });

    it('should create a checkin for models', () => {
        return addAction('CHECKIN_MODELS', {
            studentId: student.id,
            modelAddress: unserializedModel.address,
            quantity: 1
        }).then(actionId => {
            assert.isObject(CheckinStore.getCheckinByActionId(actionId));
            assert.lengthOf(CheckinStore.getCheckins(), 3);
        });
    });

    it('should not create a checkin for models if studentId is invalid', () => {
        return addAction('CHECKIN_MODELS', {
            studentId: 4,
            modelAddress: unserializedModel.address,
            quantity: 1
        }).then(() => {
            assert.fail('Unnexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Student could not be found.');
            assert.lengthOf(CheckinStore.getCheckins(), 3);
        });
    });

    it('should not create a checkin for models if modelAddress is invalid', () => {
        return addAction('CHECKIN_MODELS', {
            studentId: student.id,
            modelAddress: createAddress(100, 'model'),
            quantity: 1
        }).then(() => {
            assert.fail('Unnexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Model could not be found.');
            assert.lengthOf(CheckinStore.getCheckins(), 3);
        });
    });

    it('should not create a checkin for models if student does not have the model', () => {
        return addAction('CHECKIN_MODELS', {
            studentId: 4,
            modelAddress: ModelStore.getModels()[2].address,
            quantity: 1
        }).then(() => {
            assert.fail('Unnexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Student could not be found.');
            assert.lengthOf(CheckinStore.getCheckins(), 3);
        });
    });

});
