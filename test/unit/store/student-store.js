import StudentStore from '../../../.dist/store/student-store';
import ItemStore from '../../../.dist/store/item-store';
import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('StudentStore', () => {

    let model;
    let items = [];
    let student;

    before(() => {
        addAction('CLEAR_ALL_DATA');
        return addAction('NEW_MODEL', {
            name: 'Resistor'
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
            for (let i = 0; i < 3; i++) {
                addAction('NEW_ITEM', {
                    modelAddress: model.address
                }).then(actionId => {
                    items.push(ItemStore.getItemByActionId(actionId));
                });
            }
        });
    });

    it('should instantiate without any students', () => {
        assert.lengthOf(StudentStore.getStudents(), 0);
    });

    it('should create a student', () => {
        addAction('NEW_STUDENT', {
            id: '123456',
            name: 'John von Neumann'
        }).then(actionId => {
            student = StudentStore.getStudentByActionId(actionId);
        });
        assert.lengthOf(StudentStore.getStudents(), 1);
    });

    it('should retrieve a student by id', () => {
        assert.strictEqual(StudentStore.getStudentById(student.id), student);
    });

    it('should add more students', () => {
        addAction('NEW_STUDENT', {
            id: '111111',
            name: 'Alice'
        });
        assert.lengthOf(StudentStore.getStudents(), 2);
        addAction('NEW_STUDENT', {
            id: '222222',
            name: 'Bob'
        });
        assert.lengthOf(StudentStore.getStudents(), 3);
    });

    it('should add items upon checkout', () => {
        addAction('NEW_CHECKOUT', {
            studentId: student.id,
            itemAddresses: [items[0].address, items[2].address]
        });
        assert.include(student.items, items[0]);
        assert.notInclude(student.items, items[1]);
        assert.include(student.items, items[2]);
    });

    it('should remove an item upon checkin', () => {
        addAction('CHECKIN', {
            studentId: student.id,
            itemAddress: items[0].address
        });
        assert.notInclude(student.items, items[0]);
        assert.notInclude(student.items, items[1]);
        assert.include(student.items, items[2]);
    });

    it('should remove another item upon checkin', () => {
        addAction('CHECKIN', {
            studentId: student.id,
            itemAddress: items[2].address
        });
        assert.notInclude(student.items, items[0]);
        assert.notInclude(student.items, items[1]);
        assert.notInclude(student.items, items[2]);
    });

});
