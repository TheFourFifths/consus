import { Dispatcher } from 'consus-core/flux';
import CheckinStore from '../../../.dist/store/checkin-store';
import { assert } from 'chai';

describe('CheckinStore', () => {

    before(() => {
        Dispatcher.handleAction('CLEAR_ALL_DATA');
    });

    it('should instantiate without any checkins', () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
    });

    it('should instantiate with any checkin errors', () => {
        assert.lengthOf(CheckinStore.getCheckinErrors(), 0);
    });

});
