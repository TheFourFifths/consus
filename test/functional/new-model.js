import { assert } from 'chai';
import { addAction } from '../util/database';
import server from '../../.dist/lib/server';

describe('New model', () => {

    before(() => {
        return server.start();
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA');
    });

});
