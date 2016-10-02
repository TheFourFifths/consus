import { assert } from 'chai';
import Model from '../../../.dist/model/model';

describe('Model', () => {

    let model;

    beforeEach(() => {
        model = new Model('abc', 'Transistor');
    });

    describe('#constructor', () => {

        it('should instantiate a Model', () => {
            assert.instanceOf(model, Model);
        });

        it('should initially have the provided id', () => {
            assert.strictEqual(model.id, 'abc');
        });

        it('should initially have the provided name', () => {
            assert.strictEqual(model.name, 'Transistor');
        });

    });

});
