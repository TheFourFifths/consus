import { Store } from 'consus-core/flux';

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
    checkoutsByActionId[data.actionId] = checkout;
    checkouts.push(checkout);
});

export default store;
