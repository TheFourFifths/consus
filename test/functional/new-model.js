import { assert } from 'chai';
import { addAction } from '../util/database';
import { post } from '../util/mock-client';
import server from '../../.dist/lib/server';
import ModelStore from '../../.dist/store/model-store';

describe('New model', () => {

    // base64 encoding of test/assets/img/photo.jpeg
    let b64SamplePhoto = '/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAAPAA8DAREAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUH/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAB3gSPLJ//xAAZEAACAwEAAAAAAAAAAAAAAAADBQAEBhT/2gAIAQEAAQUC0zciivnWhG1Jiu7yT//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8BH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8BH//EACQQAAIBAwIGAwAAAAAAAAAAAAECAwQREgATEBQiMTJRQmGh/9oACAEBAAY/AqRknpqYTVAiaaqF0QYsb+S+venlk22xlaNZYQQkoHyX61RNuYctOJ+18uki37w//8QAHRAAAQQCAwAAAAAAAAAAAAAAAQAhMUERURBhcf/aAAgBAQABPyEyZH5fIDYI9Jy05DmESXRJguVolSpbNfPXH//aAAwDAQACAAMAAAAQgE//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAEDAQE/EB//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAECAQE/EB//xAAbEAEBAQACAwAAAAAAAAAAAAABESEAMUFRsf/aAAgBAQABPxBdS10SDSFQa7zgbqThYUpR6dkEefckIrG/c8JtOf/Z';

    before(() => {
        return server.start(8080);
    });

    after(() => {
        return server.stop();
    });

    beforeEach(() => {
        return addAction('CLEAR_ALL_DATA');
    });

    it('should add a model', () => {
        assert.lengthOf(ModelStore.getModels(), 0);
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            allowCheckout: false,
            price: 3.50,
            count: 10,
            photo: b64SamplePhoto
        }).then(response => {
            assert.lengthOf(ModelStore.getModels(), 1);
            let model = ModelStore.getModelByAddress(response.address);
            assert.deepEqual(response, model);
            delete response.address;
            assert.deepEqual(response, {
                name: 'Widget',
                description: 'A widget',
                manufacturer: 'The Factory',
                vendor: 'The Store',
                location: 'The shelf',
                allowCheckout: false,
                price: 3.50,
                count: 10,
                inStock: 10,
                photo: b64SamplePhoto
            });
        });
    });

    it('should fail without a name', () => {
        return post('model', {
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            allowCheckout: false,
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model name must be a string: expected undefined to be a string');
        });
    });

    it('should fail without a description', () => {
        return post('model', {
            name: 'Widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            allowCheckout: false,
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model description must be a string: expected undefined to be a string');
        });
    });

    it('should fail without a manufacturer', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            vendor: 'The Store',
            location: 'The shelf',
            allowCheckout: false,
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model manufacturer must be a string: expected undefined to be a string');
        });
    });

    it('should fail without a vendor', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            location: 'The shelf',
            allowCheckout: false,
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model vendor must be a string: expected undefined to be a string');
        });
    });

    it('should fail without a location', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            allowCheckout: false,
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model location must be a string: expected undefined to be a string');
        });
    });

    it('should fail without allowCheckout', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            price: 3.50,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model allowCheckout must be a boolean: expected undefined to be a boolean');
        });
    });

    it('should fail without a price', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            allowCheckout: false,
            count: 10
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model price must be a number: expected undefined to be a number');
        });
    });

    it('should fail without a count', () => {
        return post('model', {
            name: 'Widget',
            description: 'A widget',
            manufacturer: 'The Factory',
            vendor: 'The Store',
            location: 'The shelf',
            allowCheckout: false,
            price: 3.50
        }).then(() => {
            throw new Error('Promise was unexpectedly fulfilled.');
        }).catch(e => {
            assert.strictEqual(e.message, 'The model count must be a number: expected undefined to be a number');
        });
    });

});
