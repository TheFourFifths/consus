import { Store } from 'consus-core/flux';
import StudentStore from './student-store';
import ItemStore from './item-store';

let checkouts = [];
let checkoutsByActionId = new Object(null);

class CheckoutStore extends Store {

    getCheckoutByActionId(actionId) {
        return checkoutsByActionId[actionId];
    }

}

const store = new CheckoutStore();

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
    if (StudentStore.hasOverdueItem(data.studentId)) {
        throw new Error('Student has overdue item');
    } else {
        checkoutsByActionId[data.actionId] = checkout;
        checkouts.push(checkout);
    }
});

export default store;
