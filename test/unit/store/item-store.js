import ItemStore from '../../../.dist/store/item-store';
import ModelStore from '../../../.dist/store/model-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';
import { addAction } from '../../util/database';
import moment from 'moment-timezone';
import config from 'config';

describe('ItemStore', () => {

    let student;
    let model;
    let items = [];

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
        }).then(actionId => {
            model = ModelStore.getModelByActionId(actionId);
            return addAction('NEW_STUDENT', {
                id: '123456',
                name: 'John von Neumann'
            });
        }).then(actionId => {
            student = StudentStore.getStudentByActionId(actionId);
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(() => {
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(() => {
            items = ItemStore.getItems();
        });
    });

    it('should clear all data', () => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            assert.lengthOf(ItemStore.getItems(), 0);
        });
    });

    it('should create an item', () => {
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            assert.lengthOf(ItemStore.getItems(), 3);
        });
    });

    it('should create more items', () => {
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            return addAction('NEW_ITEM', {
                modelAddress: model.address
            });
        }).then(actionId => {
            items.push(ItemStore.getItemByActionId(actionId));
            assert.lengthOf(ItemStore.getItems(), 4);
        });
    });

    it('should check out multiple items', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: items[0].address
                },
                {
                    address: items[1].address
                }
            ]
        }).then(() => {
            assert.strictEqual(items[0].status, 'CHECKED_OUT');
            assert.strictEqual(items[1].status, 'CHECKED_OUT');
        });
    });

    it('should check out a single item', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: items[0].address
                }
            ]
        }).then(() => {
            assert.strictEqual(items[0].status, 'CHECKED_OUT');
            assert.strictEqual(items[1].status, 'AVAILABLE');
        });
    });

    it('should check an item in', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: student.id,
            equipment: [
                {
                    address: items[0].address
                }
            ]
        }).then(() => {
            return addAction('CHECKIN', {
                studentId: student.id,
                itemAddress: items[0].address
            });
        }).then(() => {
            assert.strictEqual(items[0].status, 'AVAILABLE');
        });
    });

    it('should fail to delete an item', () => {
        assert.strictEqual(items.length, 2);
        let modelAddress = items[0].modelAddress;
        return addAction('DELETE_ITEM', {
            itemAddress: 'This is not an address',
            modelAddress: modelAddress
        }).then(assert.fail)
            .catch(e => {
                assert.strictEqual(e.message, 'Unknown type.');
                assert.strictEqual(items.length, 2);
            });
    });

    it('should delete an item', () => {
        assert.strictEqual(items.length, 2);
        let deletedItemAddress = items[0].address;
        let modelAddress = items[0].modelAddress;
        return addAction('DELETE_ITEM', {
            itemAddress: deletedItemAddress,
            modelAddress: modelAddress
        }).then(items => {
            items = ItemStore.getItems();
            let array = items.filter(t => t.address === deletedItemAddress);
            assert.lengthOf(array, 0);
            assert.strictEqual(items.length, 1);
        });
    });

    it('should get 0 overdue items when no items are overdue', () => {
        return addAction('NEW_CHECKOUT', {
            studentId: 123456,
            equipment: [
                {
                    address: items[0].address
                }
            ]
        }).then(() => {
            assert.lengthOf(ItemStore.getOverdueItems(), 0);
        });
    });
    //Note: There should probably be a test that it does get overdue items, but we can't just
    //give a student an overdue item so that's untestable right now.

    it('should get all items of a given model', () => {
        items = ItemStore.getChildrenOfModel(model.address);
        assert.lengthOf(items, 2);
        items.forEach(item => {
            assert.strictEqual(item.modelAddress, model.address);
        });
    });

    it('should save an item', () => {
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(() => {
            return addAction('NEW_CHECKOUT', {
                equipment: [
                    {
                        address: ItemStore.getItems()[2].address
                    }
                ],
                studentId: 123456
            });
        }).then(() => {
            return addAction('SAVE_ITEM', {
                itemAddress: ItemStore.getItems()[2].address
            });
        }).then(() => {
            assert.strictEqual(ItemStore.getItems()[2].status, 'SAVED');
        });
    });

    it('should not be able to save an item with a model address', () => {
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(() => {
            return addAction('SAVE_ITEM', {
                itemAddress: ModelStore.getModels()[0].address
            });
        }).then(() => {
            throw new Error('Should not have saved the item.');
        }).catch(e => {
            assert.strictEqual(e.message, 'Address is not an item.');
        });
    });

    it('should not be able to save a saved item', () => {
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(() => {
            return addAction('NEW_CHECKOUT', {
                equipment: [
                    {
                        address: ItemStore.getItems()[2].address
                    }
                ],
                studentId: 123456
            });
        }).then(() => {
            return addAction('SAVE_ITEM', {
                itemAddress: ItemStore.getItems()[2].address
            });
        }).then(() => {
            assert.strictEqual(ItemStore.getItems()[2].status, 'SAVED');
            return addAction('SAVE_ITEM', {
                itemAddress: ItemStore.getItems()[2].address
            });
        }).then(() => {
            throw new Error('Should not have saved the item.');
        }).catch(e => {
            assert.strictEqual(e.message, 'Item is already saved.');
        });
    });

    it('should not be able to save an available item', () => {
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(() => {
            return addAction('SAVE_ITEM', {
                itemAddress: ItemStore.getItems()[2].address
            });
        }).then(() => {
            throw new Error('Should not have saved the item.');
        }).catch(e => {
            assert.strictEqual(e.message, 'Item is not checked out.');
        });
    });

    it('should add and remove a fault to an item', () => {
        let itemAddress = ItemStore.getItems()[0].address;
        let timestamp = Math.floor(Date.now() / 1000);
        return addAction("ADD_ITEM_FAULT", {
            itemAddress,
            description: "Is Brokeded"
        }).then(() => {
            let item = ItemStore.getItemByAddress(itemAddress);
            assert.lengthOf(item.faultHistory, 1);
            assert.isTrue(item.isFaulty);
            assert.strictEqual(item.faultHistory[0].timestamp, timestamp);
            assert.strictEqual(item.faultHistory[0].description, "Is Brokeded");
        }).then(() => {
            return addAction("REMOVE_FAULT", {itemAddress});
        }).then(() => {
            let item = ItemStore.getItemByAddress(itemAddress);
            assert.lengthOf(item.faultHistory, 1);
            assert.isFalse(item.isFaulty);
            assert.strictEqual(item.faultHistory[0].description, "Is Brokeded");
        });
    });

    it('should change an items duedate', () => {
        let tomorrow = moment().tz(config.get('timezone'));
        let item;
        tomorrow.add(1, 'd');
        return addAction('NEW_ITEM', {
            modelAddress: model.address
        }).then(actionId => {
            item = ItemStore.getItemByActionId(actionId);
            return addAction('CHANGE_ITEM_DUEDATE', {
                itemAddress: item.address,
                dueDate: tomorrow.format('YYYY-MM-DD'),
                studentId: student.id
            });
        }).then(() => {
            tomorrow.hour(17).minute(0).second(0);
            assert.strictEqual(item.timestamp, parseInt(tomorrow.format('X')));
        });
    });

});
