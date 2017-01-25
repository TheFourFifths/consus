import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import CheckinStore from '../../.dist/store/checkin-store';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';


describe('Checkin items', () => {

    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA').then(() => {
            return Promise.all([
                addAction('NEW_MODEL', {
                    name: 'Widget',
                    description: 'A widget',
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    allowCheckout: false,
                    price: 3.50,
                    count: 10
                }),
                addAction('NEW_MODEL', {
                    name: 'OtherThing',
                    description: 'Not a widget',
                    manufacturer: 'The Factory',
                    vendor: 'The Store',
                    location: 'The shelf',
                    allowCheckout: false,
                    price: 3.50,
                    count: 10
                }),
                addAction('NEW_STUDENT', {
                    id: '123456',
                    name: 'John von Neumann',
                    email: 'jvn@example.com',
                    major: 'Checmical Engineering & Mathematics',
                    status: 'C - Current'
                }),
                addAction('NEW_STUDENT', {
                    id: '111111',
                    name: 'Boaty McBoatface',
                    email: 'mcboatface@example.com',
                    major: 'Conservational Biology',
                    status: 'C - Current'
                })
            ]).then(() => {
                let modAddr1 = ModelStore.getModels()[0].address;
                let modAddr2 = ModelStore.getModels()[1].address;
                return Promise.all([
                    addAction('NEW_ITEM', {
                        modelAddress: modAddr1
                    }),
                    addAction('NEW_ITEM', {
                        modelAddress: modAddr1
                    }),
                    addAction('NEW_ITEM', {
                        modelAddress: modAddr2
                    })
                ]);
            }).then(() => {
                return Promise.all([
                    addAction('NEW_CHECKOUT', {
                        equipmentAddresses: [ItemStore.getItems()[0].address],
                        studentId: '111111'
                    }),
                    addAction('NEW_CHECKOUT', {
                        equipmentAddresses: [ItemStore.getItems()[1].address],
                        studentId: '123456'
                    })
                ]);
            });
        });
    });

    it('should checkin an item', () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 1);

        let chkdInItem = ItemStore.getItems()[1];
        return post('checkin', {
            studentId: '123456',
            itemAddress: chkdInItem.address
        }).then(data => {
            assert.lengthOf(CheckinStore.getCheckins(), 1);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 1);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 2);
            // assert response data
            assert.deepEqual(data, {
                itemAddress: chkdInItem.address,
                modelName: 'Widget'
            });
        });
    });

    it('should checkin all items', () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 1);

        return Promise.all([
            post('checkin', {
                studentId: '111111',
                itemAddress: ItemStore.getItems()[0].address
            }),
            post('checkin', {
                studentId: '123456',
                itemAddress: ItemStore.getItems()[1].address
            })
        ]).then(() => {
            assert.lengthOf(CheckinStore.getCheckins(), 2);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 0);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'AVAILABLE'), 3);
        });
    });

    it('should fail when missing itemAddress', () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);

        return post('checkin', {
            studentId: '123456'
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.match(e.message, /Item address required/);
            assert.lengthOf(CheckinStore.getCheckins(), 0);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);
        });
    });

    it('should fail when missing studentId', () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);

        return post('checkin', {
            itemAddress: ItemStore.getItems()[0].address
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.match(e.message, /student ID required/);
            assert.lengthOf(CheckinStore.getCheckins(), 0);
            assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);
        });
    });

    it("fails when student doesn't exist", () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);

        return post('checkin', {
            studentId: '666666',
            itemAddress: ItemStore.getItems()[0].address
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.match(e.message, /Student could not be found/);
        });
    });

    it('should fail when itemAddress is invalid', () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);

        return Promise.all([
            post('checkin', {
                studentId: '123456',
                itemAddress: 'bad'
            }).then(() => {
                throw new Error('Unexpected success');
            }).catch(e => {
                assert.match(e.message, /Unknown type/);
            }),

            post('checkin', {
                studentId: '123456',
                itemAddress: ModelStore.getModels()[0].address
            }).then(() => {
                throw new Error('Unexpected success');
            }).catch(e => {
                assert.match(e.message, /not an item/);
            }),
        ]);
    });

    it('fails when item is not checked out by student', () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);

        return post('checkin', {
            studentId: '123456',
            itemAddress: ItemStore.getItems()[0].address
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.match(e.message, /not checked out by that student/);
        });
    });

    it('fails when an item does not exist', () => {
        assert.lengthOf(CheckinStore.getCheckins(), 0);
        assert.lengthOf(ItemStore.getItems().filter(item => item.status === 'CHECKED_OUT'), 2);

        return post('checkin', {
            studentId: '123456',
            itemAddress: 'iGwEZVvgu'
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.match(e.message, /Item could not be found/);
        });
    });

});
