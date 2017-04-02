import { assert } from 'chai';
import { addAction } from '../util/database';
import { patch } from '../util/mock-client';
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
        return addAction('CLEAR_ALL_DATA').then(() => {
            return Promise.all([
                addAction("NEW_STUDENT", {
                    name: "Tom",
                    id: 123456,
                    status: "C - Current",
                    email: "",
                    major: "",
                    rfid: 123456
                }),
                addAction("NEW_STUDENT", {
                    name: "Bob",
                    id: 111111,
                    status: "C - Current",
                    email: "",
                    major: "",
                }),
            ]);
        });
    });

    it('should setup data correctly', () => {
        assert.lengthOf(StudentStore.getStudents(), 2, "Failure During Setup");
        assert.strictEqual(StudentStore.getStudentById(123456).rfid, 123456);
        assert.isUndefined(StudentStore.getStudentById(111111).rfid);
    });

    it('should add rfid to a student', () => {
        let rfid = 159753;
        assert.isUndefined(StudentStore.getStudentByRFID(rfid));
        let studentToEdit = StudentStore.getStudentById(111111);
        let qs = {
            studentId: studentToEdit.id
        };
        let body = {
            rfid
        };
        return patch('student/rfid', qs, body).then(() => {
            let postStudent = StudentStore.getStudentByRFID(rfid);
            assert.strictEqual(postStudent.rfid, rfid);
        });
    });

    it('should warn of missing studentId', () => {
        let rfid = 159753;
        let qs = {

        };
        let body = {
            rfid
        };
        return patch('student/rfid', qs, body).then(assert.fail).catch(e => {
            assert.strictEqual(e.message, 'Numeric student ID required when associating a studentId and RFID');
        });
    });

    it('should warn of missing rfid', () => {
        let rfid = 159753;
        assert.isUndefined(StudentStore.getStudentByRFID(rfid));
        let studentToEdit = StudentStore.getStudentById(111111);
        let qs = {
            studentId: studentToEdit.id
        };
        let body = {

        };
        return patch('student/rfid', qs, body).then(assert.fail).catch(e => {
            assert.strictEqual(e.message, 'Rfid number required when associating a studentId and RFID');
        });
    });

    it('should warn that student does not exist', () => {
        let rfid = 159753;
        assert.isUndefined(StudentStore.getStudentByRFID(rfid));
        let qs = {
            studentId: -1
        };
        let body = {
            rfid: rfid
        };
        return patch('student/rfid', qs, body).then(assert.fail).catch(e => {
            assert.strictEqual(e.message, 'The student ID does not exist.');
        });
    });

    it('should warn that rfid is not unique', () => {
        let rfid = 123456;
        let studentToEdit = StudentStore.getStudentById(123456);
        let qs = {
            studentId: studentToEdit.id
        };
        let body = {
            rfid: rfid
        };
        return patch('student/rfid', qs, body).then(assert.fail).catch(e => {
            assert.strictEqual(e.message, 'The rfid is already associated with a student.');
        });
    });

});
