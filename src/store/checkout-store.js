import { Store } from 'consus-core/flux';
import AuthStore from './auth-store';
import ItemStore from './item-store';
import ModelStore from './model-store';
import StudentStore from './student-store';
import { readAddress } from 'consus-core/identifiers';

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
    let checkout = {
        studentId: data.studentId,
        equipmentAddresses: data.equipmentAddresses
    };

    data.equipmentAddresses.forEach(address => {
        let result = readAddress(address);
        if(result.type == 'item'){
            if (ItemStore.getItemByAddress(address).status !== 'AVAILABLE') {
                throw new Error('An item in the cart is not available for checkout.');
            }
        }
        if(result.type == 'model'){
            let model = ModelStore.getModelByAddress(address);
            if(!model.allowCheckout || model.instock <= 0) {
                throw new Error('A model in the cart is not available for checkout.');
            }
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
