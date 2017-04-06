import StudentStore from '../../../.dist/store/student-store';
import ItemStore from '../../../.dist/store/item-store';
import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';
import sinon from 'sinon';
import * as clock from '../../../.dist/lib/clock';
import moment from 'moment-timezone';
import config from 'config';

describe('StudentStore', () => {

    let model;
    let items = [];
    let models = [];
    let student;

    beforeEach(() => {
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
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
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
            models.push(ModelStore.getModelByActionId(actionId));
            return addAction('NEW_STUDENT', {
                id: '123456',
                name: 'John von Neumann',
                email: 'neumannj@msoe.edu',
                status: 'C - Current',
                major: 'Hyperspace Engineer'
            });
        }).then(actionId => {
            student = StudentStore.getStudentByActionId(actionId);
        });
    });

    it.skip('should update student items on edit item date', () => {
        let tomorrow = moment().tz(config.get('timezone'));
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: items[0].address
                },
                {
                    address: items[2].address
                }
            ]
        }).then(() => {
            assert.lengthOf(student.items, 2);
            tomorrow.add(2, 'd');
            return addAction('CHANGE_ITEM_DUEDATE', {
                dueDate: tomorrow.format('YYYY-MM-DD'),
                studentId: student.id,
                itemAddress: items[0].address
            });
        }).then(() => {
            tomorrow.hour(config.get('checkin.due_hour')).minute(config.get('checkin.due_minute')).second(0);
            assert.lengthOf(student.items, 2);
            assert.strictEqual(items[0].timestamp, parseInt(tomorrow.format('X')));
            tomorrow.add(-2, 'd');
            assert.strictEqual(items[2].timestamp, parseInt(tomorrow.format('X')));
        });
    });

    it('should create a student', () => {
        return addAction('NEW_STUDENT', {
            id: '786459',
            name: 'Loopy doo'
        }).then(() => {
            assert.lengthOf(StudentStore.getStudents(), 2);
        });
    });

    it('should retrieve a student by id', () => {
        assert.strictEqual(StudentStore.getStudentById(student.id), student);
    });

    it('should add more students', () => {
        return addAction('NEW_STUDENT', {
            id: 111111,
            name: 'Alice'
        }).then(() => {
            assert.lengthOf(StudentStore.getStudents(), 2);
            return addAction('NEW_STUDENT', {
                id: '222222',
                name: 'Bob'
            });
        }).then(() => {
            assert.lengthOf(StudentStore.getStudents(), 3);
        });
    });

    it('should add items and models upon checkout', () => {
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
                    address: models[0].address,
                    quantity: 1
                }
            ]
        }).then(() => {
            assert.strictEqual(student.items[0].address, items[0].address);
            assert.notInclude(student.items, items[1]);
            assert.strictEqual(student.items[1].address, items[2].address);
            assert.strictEqual(student.models[0].address, models[0].address);
        });
    });

    it('should remove an item upon checkin', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: items[0].address
                },
                {
                    address: items[2].address
                }
            ]
        }).then(() => {
            return addAction('CHECKIN', {
                studentId: student.id,
                itemAddress: items[0].address
            });
        }).then (() => {
            assert.notInclude(student.items, items[0]);
            assert.notInclude(student.items, items[1]);
            assert.strictEqual(student.items[0].address, items[2].address);
        });
    });

    it('should remove a model upon checkin', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: models[1].address,
                    quantity: 2
                }
            ]
        }).then(() => {
            assert.strictEqual(student.models.find(m => m.address === models[1].address).quantity, 2);
            return addAction('CHECKIN_MODELS', {
                studentId: student.id,
                modelAddress: models[1].address,
                quantity: 1
            });
        }).then (() => {
            assert.strictEqual(student.models.find(m => m.address === models[1].address).quantity, 1);
        });
    });

    it('should verify current student', () => {
        assert.isTrue(StudentStore.isCurrentStudent(student));
        student.status = 'dead';
        assert.isFalse(StudentStore.isCurrentStudent(student));
    });

    it('should verify new student', () => {
        assert.isFalse(StudentStore.isNewStudent(student));
        let newStudent = {
            id: 1
        };
        assert.isTrue(StudentStore.isNewStudent(newStudent));
    });

    it('should update existing student', () => {
        let newName = 'BoomPow';
        let newMajor = 'Reverse Engineer';
        let newEmail = 'wopmoob.msoe.edu';
        let updatedStudentInfo = {
            id: student.id,
            name: newName,
            major: newMajor,
            email: newEmail
        };
        return addAction('UPDATE_STUDENT', updatedStudentInfo).then(() => {
            assert.lengthOf(StudentStore.getStudents(), 1);
            let updatedStudent = StudentStore.getStudentById(student.id);
            assert.strictEqual(updatedStudent.name, newName);
            assert.strictEqual(updatedStudent.email, newEmail);
            assert.strictEqual(updatedStudent.major, newMajor);
        });
    });

    it('should keep checked out items after updating existing student', () => {
        let newName = 'BoomPow';
        let newMajor = 'Reverse Engineer';
        let newEmail = 'wopmoob.msoe.edu';
        let updatedStudentInfo = {
            id: student.id,
            name: newName,
            major: newMajor,
            email: newEmail
        };
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: items[0].address
                }
            ]
        }).then(() => {
            assert.strictEqual(student.items[0].address, items[0].address);
            return addAction('UPDATE_STUDENT', updatedStudentInfo);
        }).then(() => {
            assert.lengthOf(StudentStore.getStudents(), 1);
            let updatedStudent = StudentStore.getStudentById(student.id);
            assert.strictEqual(updatedStudent.name, newName);
            assert.strictEqual(updatedStudent.email, newEmail);
            assert.strictEqual(updatedStudent.major, newMajor);
            assert.strictEqual(updatedStudent.items[0].address, items[0].address);
        });
    });

    it('should remove items from students items list when model is deleted', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: items[0].address
                },
                {
                    address: items[2].address
                }
            ]
        }).then(() => {
            assert.lengthOf(student.items, 2);
            return addAction('DELETE_MODEL', {
                modelAddress: items[0].modelAddress
            });
        }).then(() => {
            assert.lengthOf(student.items, 0);
        });
    });

    it('should get students with overdue items', () => {
        let stub = sinon.stub(clock, 'isBeforeNow');
        stub.returns(true);
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: items[0].address
                }
            ]
        }).then(() => {
            let students = StudentStore.getStudentsWithOverdueItems();
            assert.lengthOf(students, 1);
        });
    });

    it('should remove item from students items list when item is deleted', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: items[0].address
                },
                {
                    address: items[2].address
                }
            ]
        }).then(() => {
            assert.lengthOf(student.items, 2);
            return addAction('DELETE_ITEM', {
                itemAddress: items[0].address,
                modelAddress: items[0].modelAddress
            });
        }).then(() => {
            assert.lengthOf(student.items, 1);
        });
    });

    it('should save a model', () => {
        return addAction('NEW_CHECKOUT', {
            equipment: [
                {
                    address: ModelStore.getModels()[1].address,
                    quantity: 1
                }
            ],
            studentId: student.id
        }).then(() => {
            return addAction('SAVE_MODEL', {
                modelAddress: ModelStore.getModels()[1].address,
                studentId: 123456
            });
        }).then(() => {
            assert.strictEqual(StudentStore.getStudentById(123456).models[0].status, 'SAVED');
        });
    });

    it('should require a model address to save a model', () => {
        return addAction('SAVE_MODEL', {
            modelAddress: ItemStore.getItems()[0].address,
            studentId: 123456
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Address is not a model.');
        });
    });

    it('should require a valid student to save a model', () => {
        return addAction('SAVE_MODEL', {
            modelAddress: ModelStore.getModels()[1].address,
            studentId: 314159
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Student could not be found.');
        });
    });

    it('should require the student to have the model checked out to save a model', () => {
        return addAction('NEW_STUDENT', {
            id: '786459',
            name: 'Loopy doo'
        }).then(() => {
            return addAction('SAVE_MODEL', {
                modelAddress: ModelStore.getModels()[1].address,
                studentId: 786459
            });
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Student does not have this model checked out.');
        });
    });

    it('should not save a saved model', () => {
        return addAction('NEW_CHECKOUT', {
            equipment: [
                {
                    address: ModelStore.getModels()[1].address,
                    quantity: 1
                }
            ],
            studentId: student.id
        }).then(() => {
            return addAction('SAVE_MODEL', {
                modelAddress: ModelStore.getModels()[1].address,
                studentId: 123456
            });
        }).then(() => {
            return addAction('SAVE_MODEL', {
                modelAddress: ModelStore.getModels()[1].address,
                studentId: 123456
            });
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Student already saved this model.');
        });
    });

    it('should retrieve a model', () => {
        return addAction('NEW_CHECKOUT', {
            equipment: [
                {
                    address: ModelStore.getModels()[1].address,
                    quantity: 1
                }
            ],
            studentId: student.id
        }).then(() => {
            return addAction('SAVE_MODEL', {
                modelAddress: ModelStore.getModels()[1].address,
                studentId: 123456
            });
        }).then(() => {
            assert.strictEqual(StudentStore.getStudentById(123456).models[0].status, 'SAVED');
        }).then(() => {
            return addAction('RETRIEVE_MODEL', {
                modelAddress: ModelStore.getModels()[1].address,
                studentId: 123456
            });
        }).then(() => {
            assert.strictEqual(StudentStore.getStudentById(123456).models[0].status, 'CHECKED_OUT');
        });
    });

    it('should require a model address to retrieve a model', () => {
        return addAction('RETRIEVE_MODEL', {
            modelAddress: ItemStore.getItems()[0].address,
            studentId: 123456
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Address is not a model.');
        });
    });

    it('should require a valid student to retrieve a model', () => {
        return addAction('RETRIEVE_MODEL', {
            modelAddress: ModelStore.getModels()[1].address,
            studentId: 314159
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Student could not be found.');
        });
    });

    it('should require the student to have the model saved or checked out to retrieve a model', () => {
        return addAction('NEW_STUDENT', {
            id: '786459',
            name: 'Loopy doo'
        }).then(() => {
            return addAction('RETRIEVE_MODEL', {
                modelAddress: ModelStore.getModels()[1].address,
                studentId: 786459
            });
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Student does not have this model saved or checked out.');
        });
    });

    it('should require the student to have the model saved to retrieve a model', () => {
        return addAction('NEW_STUDENT', {
            id: '786459',
            name: 'Loopy doo'
        }).then(() => {
            return addAction('NEW_CHECKOUT', {
                equipment: [
                    {
                        address: ModelStore.getModels()[1].address,
                        quantity: 1
                    }
                ],
                studentId: student.id
            });
        }).then(() => {
            return addAction('RETRIEVE_MODEL', {
                modelAddress: ModelStore.getModels()[1].address,
                studentId: 786459
            });
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'Student does not have this model saved or checked out.');
        });
    });

});
