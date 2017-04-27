import { initData } from '../../../.dist/lib/data-setup';
import ModelStore from '../../../.dist/store/model-store';
import ItemStore from '../../../.dist/store/item-store';
import StudentStore from '../../../.dist/store/student-store';
import { assert } from 'chai';

describe('Data Setup', () => {

    it('should generate default data', () => {
        initData();
        let students = StudentStore.getStudents();
        let models = ModelStore.getModels();
        let items = ItemStore.getItems();

        assert.lengthOf(students, 3);
        assert.lengthOf(models, 2);
        assert.lengthOf(items, 3);

        assert(StudentStore.hasOverdueItem(111111));
    });

});
