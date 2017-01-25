import CheckinStore from '../../../.dist/store/checkin-store';
import ModelStore from '../../../.dist/store/model-store';
import ItemStore from '../../../.dist/store/item-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('CheckinStore', () => {

    let model;
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
                equipmentAddresses: [items[0].address, items[2].address]
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

});
