import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';

describe('Retrieve Item', () => {

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
                allowCheckout: false,
                price: 10.50,
                count: 20
            });
        }).then(() => {
            return addAction('NEW_ITEM', {
                modelAddress: ModelStore.getModels()[0].address
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
                        address: ItemStore.getItems()[0].address
                    }
                ],
                studentId: 987987
            });
        }).then(() => {
            return addAction('SAVE_ITEM', {
                itemAddress: ItemStore.getItems()[0].address
            });
        });
    });

    it('should retrieve an item', () => {
        return post('item/retrieve', {
            itemAddress: ItemStore.getItems()[0].address
        }).then(() => {
            assert.strictEqual(ItemStore.getItems()[0].status, 'CHECKED_OUT');
        });
    });

    it('should fail to retrieve an item with no item address', () => {
        return post('item/retrieve', {}).then(() => {
            throw new Error('Promise unexpectedly fulfilled');
        }).catch(e => {
            assert.strictEqual(e.message, 'Item address required to retrieve');
        });
    });


});
