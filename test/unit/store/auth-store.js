import { assert } from 'chai';
import AuthStore from '../../../.dist/store/auth-store';

describe('AuthStore', () => {
    it('should verify admin by id', () => {
        assert(AuthStore.verifyAdmin('112994'));
        assert(!AuthStore.verifyAdmin('123456'));
    });

    it('should verify admin by pin', () => {
        assert(AuthStore.verifyAdmin('3214'));
        assert(!AuthStore.verifyAdmin('2013'));
    });
});
