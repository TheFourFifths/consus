import { assert } from 'chai';
import { addAction } from '../util/database';
import { get } from '../util/mock-client';
import server from '../../.dist/lib/server';
import StudentStore from '../../.dist/store/student-store';


describe('Get all students', () => {

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
                    name: "That Guy",
                    id: "111123",
                    status: "C - Current",
                    email: "",
                    major: ""
                }),
                addAction("NEW_STUDENT", {
                    name: "That Other Guy",
                    id: "111113",
                    status: "C - Current",
                    email: "",
                    major: ""
                }),
            ]);
        });
    });

    it('should get all students', () => {
        assert.lengthOf(StudentStore.getStudents(), 2, "Failure During Setup");
        return get('student/all').then(response => {
            assert.deepEqual(response, [
                {
                    name: "That Other Guy",
                    id: 111113,
                    status: "C - Current",
                    email: "",
                    major: "",
                    items: [],
                    models: [],
                    rfid: null
                },
                {
                    name: "That Guy",
                    id: 111123,
                    status: "C - Current",
                    email: "",
                    major: "",
                    items: [],
                    models: [],
                    rfid: null
                }
            ]);
        });
    });

});
