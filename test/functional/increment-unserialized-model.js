import { assert } from 'chai';
import { addAction } from '../util/database';
import { patch } from '../util/mock-client';
import server from '../../.dist/lib/server';
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
                allowCheckout: true,
                price: 10.50,
                count: 20
            }).then(actionId => {
                model = ModelStore.getModelByActionId(actionId);
            });
        });
    });

    it('should increment a model', () => {
        let newModel = {
            name: 'Resistor',
            description: 'V = IR',
            manufacturer: 'Pancakes R\' Us',
            vendor: 'Mouzer',
            location: 'Shelf 14',
            allowCheckout: true,
            price: 10.50,
            count: 21,
            inStock: 21
        };
        return patch('model/instock', {
            modelAddress: model.address
        }, newModel).then(response => {
            newModel.address = model.address;
            assert.deepEqual(response, newModel);
            assert.deepEqual(model, newModel);
        });
    });

    it('should not accept a non-string address', () => {
        return patch('model/instock', {
        }).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.match(e.message, /A model address is required./);
        });
    });

});
