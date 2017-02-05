import { Store } from 'consus-core/flux';
import AuthStore from './auth-store';
import ItemStore from './item-store';
import StudentStore from './student-store';

let checkouts = Object.create(null);
let checkoutErrors = Object.create(null);

class CheckoutStore extends Store {

    getCheckouts() {
        return Object.keys(checkouts).map(key => checkouts[key]);
    }

    getCheckoutErrors() {
        return Object.keys(checkoutErrors).map(key => checkoutErrors[key]);
    }

    getCheckoutByActionId(actionId) {
        return checkouts[actionId];
    }

    getCheckoutErrorByActionId(actionId) {
        return checkoutErrors[actionId];
    }

}

const store = new CheckoutStore();

store.registerHandler('CLEAR_ALL_DATA', () => {
    checkouts = Object.create(null);
    checkoutErrors = Object.create(null);
});

store.registerHandler('NEW_CHECKOUT', data => {
    let checkout = {
        studentId: data.studentId,
        itemAddresses: data.itemAddresses
    };

    data.itemAddresses.forEach(itemAddress => {
        if (ItemStore.getItemByAddress(itemAddress).status !== 'AVAILABLE') {
            throw new Error('An item in the cart is not available for checkout.');
        }
    });

    if (data.adminCode){
        if(AuthStore.verifyAdmin(data.adminCode)) {
            checkouts[data.actionId] = checkout;
        } else {
            throw new Error('Invalid Admin');
        }
    } else if (StudentStore.hasOverdueItem(data.studentId)) {
        throw new Error('Student has overdue item');
    } else {
        checkouts[data.actionId] = checkout;
    }
});

export default store;
