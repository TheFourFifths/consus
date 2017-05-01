import { assert } from 'chai';
import { addAction } from '../util/database';
import { patch } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ItemStore from '../../.dist/store/item-store';
import ModelStore from '../../.dist/store/model-store';

describe('Edit model', () => {
    let model;
    // base64 encoding of test/assets/img/photo.jpeg
    let b64SamplePhoto = '/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAAPAA8DAREAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUH/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAB3gSPLJ//xAAZEAACAwEAAAAAAAAAAAAAAAADBQAEBhT/2gAIAQEAAQUC0zciivnWhG1Jiu7yT//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8BH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8BH//EACQQAAIBAwIGAwAAAAAAAAAAAAECAwQREgATEBQiMTJRQmGh/9oACAEBAAY/AqRknpqYTVAiaaqF0QYsb+S+venlk22xlaNZYQQkoHyX61RNuYctOJ+18uki37w//8QAHRAAAQQCAwAAAAAAAAAAAAAAAQAhMUERURBhcf/aAAgBAQABPyEyZH5fIDYI9Jy05DmESXRJguVolSpbNfPXH//aAAwDAQACAAMAAAAQgE//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAEDAQE/EB//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAECAQE/EB//xAAbEAEBAQACAwAAAAAAAAAAAAABESEAMUFRsf/aAAgBAQABPxBdS10SDSFQa7zgbqThYUpR6dkEefckIrG/c8JtOf/Z';

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
            frequency: 0,
            manufacturer: 'New manufacturer',
            vendor: 'New vendor',
            location: 'New location',
            allowCheckout: false,
            price: 3.50,
            count: 20,
            inStock: 20,
            photo: b64SamplePhoto
        };
        return patch('model', {
            address: model.address
        }, newModel).then(response => {
            newModel.address = model.address;
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
            allowCheckout: false,
            price: 3.50
        };
        return patch('model', {}, newModel).then(() => {
            throw new Error('Unexpected success');
        }).catch(e => {
            assert.strictEqual(e.message, 'A model address is required.');
        });
    });

});
