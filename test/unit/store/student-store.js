import { Dispatcher } from 'consus-core/flux';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';

describe('StudentStore', () => {

    before(() => {
        Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any students', () => {
        assert.lengthOf(StudentStore.getStudents(), 0);
    });

});
