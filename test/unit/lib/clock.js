import { isBeforeNow } from '../../../.dist/lib/clock';
import { assert } from 'chai';

describe("Clock module", () => {
    it("knows 0 is before now", () => {
        assert.isTrue(isBeforeNow(0));
    });

    it("knows the future is not before now", () => {
        let time = Date.now()/1000;
        time += 1500;
        assert.isFalse(isBeforeNow(time));
    });
});
