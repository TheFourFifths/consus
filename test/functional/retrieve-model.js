import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import StudentStore from '../../.dist/store/student-store';
import ModelStore from '../../.dist/store/model-store';

describe('Retrieve Model', () => {

    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Resistor',
                description: 'V = IR',
                manufacturer: 'Pancakes R\' Us',
                vendor: 'Mouzer',
                location: 'Shelf 14',
                allowCheckout: true,
                price: 10.50,
                count: 20
            });
        }).then(() => {
            return addAction('NEW_STUDENT', {
                id: 987987,
                name: 'John Goodenough',
                email: 'goodenough@msoe.edu',
                major: 'Mechanical Engineering',
                status: 'C - Current'
            });
        }).then(() => {
            return addAction('NEW_CHECKOUT', {
                equipment: [
                    {
                        address: ModelStore.getModels()[0].address,
                        quantity: 3
                    }
                ],
                studentId: 987987
            });
        }).then(() => {
            return addAction('SAVE_MODEL', {
                modelAddress: ModelStore.getModels()[0].address,
                studentId: 987987
            });
        });
    });

    it('should retrieve a model', () => {
        return post('model/retrieve', {
            modelAddress: ModelStore.getModels()[0].address,
            studentId: 987987
        }).then(() => {
            assert.strictEqual(StudentStore.getStudentById(987987).models[0].status, 'CHECKED_OUT');
        });
    });

    it('should fail to retrieve a model with no model address', () => {
        return post('model/retrieve', {
            studentId: 987987
        }).then(() => {
            throw new Error("Promise unexpectedly fulfilled");
        }).catch(e => {
            assert.strictEqual(e.message, "Model address required to retrieve");
        });
    });

    it('should fail to retrieve a model with no student ID', () => {
        return post('model/retrieve', {
            modelAddress: ModelStore.getModels()[0].address
        }).then(() => {
            throw new Error("Promise unexpectedly fulfilled");
        }).catch(e => {
            assert.strictEqual(e.message, "Student ID required to retrieve");
        });
    });

});
