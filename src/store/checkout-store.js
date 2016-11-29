import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import ItemStore from './item-store';

let checkouts = new Object(null);
let checkoutErrors = new Object(null);

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
    checkouts = new Object(null);
    checkoutErrors = new Object(null);
});

store.registerHandler('NEW_CHECKOUT', data => {
    if (StudentStore.hasOverdueItem(data.studentId)) {
        throw new Error('Student has overdue item');
    }
    data.itemAddresses.forEach(itemAddress => {
        if (ItemStore.getItemByAddress(itemAddress).status !== 'AVAILABLE') {
            throw new Error('An item in the cart is not available for checkout.');
        }
    });
    if (StudentStore.hasOverdueItem(data.studentId)) {
        throw new Error('Student has overdue item');
    }
    checkouts[data.actionId] = {
        studentId: data.studentId,
        itemAddresses: data.itemAddresses
    };
});

export default store;
