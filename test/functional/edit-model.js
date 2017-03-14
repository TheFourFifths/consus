import { assert } from 'chai';
import { addAction } from '../util/database';
import { patch } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';

describe('Edit model', () => {
    let model;
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
                isFaulty: false,
                faultDescription: '',
                price: 10.50,
                count: 20
            }).then(actionId => {
                model = ModelStore.getModelByActionId(actionId);
            });
        });
    });

    it('should edit a model', () => {
        assert.lengthOf(ItemStore.getItems(), 0);
        let newModel = {
            name: 'New name',
            description: 'New description',
            manufacturer: 'New manufacturer',
            vendor: 'New vendor',
            location: 'New location',
            isFaulty: true,
            faultDescription: 'it is not working',
            price: 3.50,
            photo: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
        };
        return patch('model', {
            address: model.address
        }, newModel).then(response => {
            newModel.address = model.address;
            newModel.count = model.count;
            assert.deepEqual(response, newModel);
            assert.deepEqual(model, newModel);
        });
    });

    it('should require a model address', () => {
        assert.lengthOf(ItemStore.getItems(), 0);
        let newModel = {
            name: 'New name',
            description: 'New description',
            manufacturer: 'New manufacturer',
            vendor: 'New vendor',
            location: 'New location',
            isFaulty: true,
            faultDescription: 'it is not working',
            price: 3.50
        };
        return patch('model', {}, newModel).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'A model address is required.');
        });
    });

});
