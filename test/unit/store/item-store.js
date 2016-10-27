import ItemStore from '../../../.dist/store/item-store';
import ModelStore from '../../../.dist/store/model-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';

describe('ItemStore', () => {

    let studentId = '123456';
    let modelAddress;
    let itemAddresses = [];

    before(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return addAction('NEW_MODEL', {
                name: 'Resistor'
            });
        }).then(actionId => {
            modelAddress = ModelStore.getModelByActionId(actionId).address;
            return addAction('NEW_STUDENT', {
                id: studentId,
                name: 'John von Neumann'
            });
        });
    });

    it('should instantiate without any items', () => {
        assert.lengthOf(ItemStore.getItems(), 0);
    });

    it('should create an item', () => {
        return addAction('NEW_ITEM', {
            modelAddress
        }).then(actionId => {
            itemAddresses.push(ItemStore.getItemByActionId(actionId).address);
            assert.lengthOf(ItemStore.getItems(), 1);
        });
    });

    it('should create more items', () => {
        return addAction('NEW_ITEM', {
            modelAddress
        }).then(actionId => {
            itemAddresses.push(ItemStore.getItemByActionId(actionId).address);
            return addAction('NEW_ITEM', {
                modelAddress
            });
        }).then(actionId => {
            itemAddresses.push(ItemStore.getItemByActionId(actionId).address);
            assert.lengthOf(ItemStore.getItems(), 3);
        });
    });

    it('should check out multiple items', () => {
        return addAction('NEW_CHECKOUT', {
            studentId,
            itemAddresses: [itemAddresses[0], itemAddresses[2]]
        }).then(() => {
            assert.strictEqual(ItemStore.getItemByAddress(itemAddresses[0]).status, 'CHECKED_OUT');
            assert.strictEqual(ItemStore.getItemByAddress(itemAddresses[1]).status, 'AVAILABLE');
            assert.strictEqual(ItemStore.getItemByAddress(itemAddresses[2]).status, 'CHECKED_OUT');
        });
    });

    it('should check an item in', () => {
        return addAction('CHECKIN', {
            studentId,
            itemAddress: itemAddresses[0]
        }).then(() => {
            assert.strictEqual(ItemStore.getItemByAddress(itemAddresses[0]).status, 'AVAILABLE');
            assert.strictEqual(ItemStore.getItemByAddress(itemAddresses[1]).status, 'AVAILABLE');
            assert.strictEqual(ItemStore.getItemByAddress(itemAddresses[2]).status, 'CHECKED_OUT');
        });
    });

});
