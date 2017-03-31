import { assert } from 'chai';
import { addAction } from '../util/database';
import { patch } from '../util/mock-client';
import server from '../../.dist/lib/server';
import StudentStore from '../../.dist/store/student-store';


describe('Update Student', () => {
    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_STUDENT', {
                name: "That Guy",
                id: "111123",
                status: "C - Current",
                email: "",
                major: ""
            });
        });
    });

    it('should update a student', () => {
        assert.lengthOf(StudentStore.getStudents(), 1);
        let newStudent = {
            name: 'Your Mom',
            id: 111123,
            status: "C - Current",
            email: "xx@xy.com",
            major: '',
            rfid: null
        };
        return patch('student', {id: newStudent.id}, newStudent).then(response => {
            newStudent.models = [];
            newStudent.items = [];
            newStudent.major = "";
            return assert.deepEqual(response, newStudent);
        }).then(() => {
            newStudent.name = "Joe Blow";
            return patch('student', {id: newStudent.id}, newStudent);
        }).then(student => {
            newStudent.email = "xx@xy.com";
            return assert.deepEqual(student, newStudent);
        });
    });



});
