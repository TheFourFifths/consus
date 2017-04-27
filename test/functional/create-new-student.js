import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import StudentStore from '../../.dist/store/student-store';


describe('Add rfid to student', () => {

    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA');
    });

    it('should setup data correctly', () => {
        assert.lengthOf(StudentStore.getStudents(), 0, "Failure During Setup");
    });

    it('should create a new student', () => {
        assert.lengthOf(StudentStore.getStudents(), 0);
        let rfid = 159753;
        let studentId = 123456;
        let name = 'test';
        let email = 'email';
        let major = 'major';
        let body = {
            rfid,
            studentId,
            name,
            email,
            major
        };
        return post('student', body).then(() => {
            assert.lengthOf(StudentStore.getStudents(), 1);
            let student = StudentStore.getStudentByRfid(rfid);
            assert.strictEqual(student.id, studentId);
            assert.strictEqual(student.name, name);
            assert.strictEqual(student.rfid, rfid);
            assert.strictEqual(student.major, major);
            assert.strictEqual(student.email, email);
        });
    });

    it('should warn of missing rfid', () => {
        assert.lengthOf(StudentStore.getStudents(), 0);
        let studentId = 123456;
        let name = 'test';
        let email = 'email';
        let major = 'major';
        let body = {
            studentId,
            name,
            email,
            major
        };
        return post('student', body).then(() => {
            assert.fail;
        }).catch(e => {
            assert.strictEqual(e.message, 'A rfid is required to make a new Student');
        });
    });

    it('should warn of missing studentId', () => {
        assert.lengthOf(StudentStore.getStudents(), 0);
        let name = 'test';
        let email = 'email';
        let major = 'major';
        let rfid = 123456;
        let body = {
            rfid,
            name,
            email,
            major
        };
        return post('student', body).then(() => {
            assert.fail;
        }).catch(e => {
            assert.strictEqual(e.message, 'A studentId is required to make a new Student');
        });
    });
    it('should warn of missing name', () => {
        assert.lengthOf(StudentStore.getStudents(), 0);
        let studentId = 123456;
        let email = 'email';
        let major = 'major';
        let rfid = 123456;
        let body = {
            studentId,
            rfid,
            email,
            major
        };
        return post('student', body).then(() => {
            assert.fail;
        }).catch(e => {
            assert.strictEqual(e.message, 'A name is required to make a new Student');
        });
    });
    it('should warn of missing email', () => {
        assert.lengthOf(StudentStore.getStudents(), 0);
        let studentId = 123456;
        let name = 'test';
        let major = 'major';
        let rfid = 123456;
        let body = {
            studentId,
            name,
            rfid,
            major
        };
        return post('student', body).then(() => {
            assert.fail;
        }).catch(e => {
            assert.strictEqual(e.message, 'An email is required to make a new Student');
        });
    });
    it('should warn of missing major', () => {
        assert.lengthOf(StudentStore.getStudents(), 0);
        let studentId = 123456;
        let name = 'test';
        let email = 'email';
        let rfid = 123456;
        let body = {
            studentId,
            name,
            email,
            rfid
        };
        return post('student', body).then(() => {
            assert.fail;
        }).catch(e => {
            assert.strictEqual(e.message, 'A major is required to make a new Student');
        });
    });


});
