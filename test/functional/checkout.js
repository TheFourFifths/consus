import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import CheckinStore from '../../.dist/store/checkin-store';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';


describe('Check out items', () => {

    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    before(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Widget',
                description: 'A widget',
                manufacturer: 'The Factory',
                vendor: 'The Store',
                location: 'The shelf',
                isFaulty: false,
                faultDescription: '',
                price: 3.50,
                count: 10
            });
        }).then(() => {
            return addAction('NEW_STUDENT', {
                id: '123456',
                name: 'John von Neumann',
                email: 'jvn@example.com',
                major: 'Chemical Engineering & Mathematics',
                status: 'C - Current'
            });
        }).then(() => {
            return addAction('NEW_STUDENT', {
                id: '111111',
                name: 'Latey McLateface',
                email: 'mclatefacel@msoe.edu',
                major: 'Underwater Basket Weaving',
                status: 'C - Current'
            });
        }).then(() => {
            return addAction('NEW_ITEM', {
                modelAddress: 'm8y7nEtAe'
            });
        }).then(() => {
            return addAction('NEW_ITEM', {
                modelAddress: 'm8y7nEtAe'
            });
        }).then(() => {
            return addAction('NEW_ITEM', {
                modelAddress: 'm8y7nEtAe'
            });
        });
    });

});
