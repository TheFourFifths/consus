import { assert } from 'chai';
import { addAction } from '../util/database';
import server from '../../.dist/lib/server';
import { patch } from '../util/mock-client';
import StudentStore from '../../.dist/store/student-store';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';
import moment from 'moment-timezone';
import config from 'config';
import { dueDateToTimestamp } from '../../.dist/lib/clock';
describe('Edit item duedate', () => {
    let student;
    let item;
    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction("NEW_MODEL", {
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Pancakes R\' Us',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                allowCheckout: false,
                price: 10.50,
                count: 20
            }).then(actionId => {
                let createdModel = ModelStore.getModelByActionId(actionId);
                return addAction('NEW_ITEM', {
                    modelAddress: createdModel.address
                });
            }).then(actionId => {
                item = ItemStore.getItemByActionId(actionId);
                return addAction('NEW_STUDENT', {
                    id: 159753,
                    name: 'Toaster',
                    email: 'email@email.com',
                    major: 'Major',
                    status: 'C - Current'
                });
            }).then(actionId => {
                student = StudentStore.getStudentByActionId(actionId);
            });
        });
    });
    it("should create data correctly", () => {
        assert.lengthOf(ItemStore.getItems(), 1);
        assert.lengthOf(StudentStore.getStudents(), 1);
        assert.lengthOf(ModelStore.getModels(), 1);
    });

    it('should notice missing itemAddress', () => {
        let today = moment();
        let qs = undefined;
        let body = {
            dueDate: today,
            studentId: student.id
        };
        return patch('item/duedate', qs, body).then(() => {}).then(assert.fail).catch(e => {
            assert.strictEqual(e.message, `Item address required to update item's dueDate.`);
        });
    });

    it('should warn of missing dueDate', () => {
        let qs = {
            itemAddress: item.address
        };
        let body = {
            studentId: student.id
        };
        return patch('item/duedate', qs, body).then(assert.fail).catch(e => {
            assert.strictEqual(e.message, `A due date is required to update item's dueDate.`);
        });
    });

    it('should warn of missing studentId', () => {
        let today = moment();
        let qs = {
            itemAddress: item.address
        };
        let body = {
            dueDate: today,
        };
        return patch('item/duedate', qs, body).then(() => {}).then(assert.fail).catch(e => {
            assert.strictEqual(e.message, `A studentId required to update item's dueDate.`);
        });
    });

    it('should edit item duedate', () => {
        let today = moment.tz(config.get('timezone'));
        let qs = {
            itemAddress: item.address
        };
        let body = {
            dueDate: today.format('YYYY-MM-DD'),
            studentId: student.id
        };
        return patch('item/duedate', qs, body).then(() => {
            let t = dueDateToTimestamp(today.format('YYYY-MM-DD'));
            assert.strictEqual(item.timestamp, t);
        });
    });
});
