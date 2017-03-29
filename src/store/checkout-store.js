import { Store } from 'consus-core/flux';
import AuthStore from './auth-store';
import ItemStore from './item-store';
import ModelStore from './model-store';
import StudentStore from './student-store';
import { readAddress } from 'consus-core/identifiers';

let checkouts = Object.create(null);
let checkoutErrors = Object.create(null);
let longtermCheckouts = Object.create(null);
class CheckoutStore extends Store {

    getCheckouts() {
        return Object.keys(checkouts).map(key => checkouts[key]);
    }

    getCheckoutErrors() {
        return Object.keys(checkoutErrors).map(key => checkoutErrors[key]);
    }
    getLongtermCheckouts(){
        return Object.keys(longtermCheckouts).map(key => longtermCheckouts[key]);
    }
    getCheckoutByActionId(actionId) {
        return checkouts[actionId];
    }

    getCheckoutErrorByActionId(actionId) {
        return checkoutErrors[actionId];
    }

}

const store = new CheckoutStore();

function verifyEquipmentAvailability(equipment){
    equipment.forEach(equip => {
        let address = equip.address;
        let result = readAddress(address);
        if (result.type === 'item') {
            if (ItemStore.getItemByAddress(address).status !== 'AVAILABLE') {
                throw new Error('An item in the cart is not available for checkout.');
            }
        }
        if (result.type === 'model') {
            let model = ModelStore.getModelByAddress(address);
            if(!model.allowCheckout || model.inStock < equip.quantity) {
                throw new Error('A model in the cart is not available for checkout.');
            }
        }
    });
}

store.registerHandler('CLEAR_ALL_DATA', () => {
    checkouts = Object.create(null);
    checkoutErrors = Object.create(null);
});

store.registerHandler('NEW_CHECKOUT', data => {
    let checkout = {
        studentId: data.studentId,
        equipment: data.equipment
    };

    verifyEquipmentAvailability(data.equipment);

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

store.registerHandler('NEW_LONGTERM_CHECKOUT', data => {
    let longtermCheckout = {
        studentId: data.studentId,
        equipment: data.equipment,
        dueDate: data.dueDate,
        professor: data.professor
    };

    verifyEquipmentAvailability(data.equipment);

    if (data.adminCode){
        if(AuthStore.verifyAdmin(data.adminCode)) {
            longtermCheckouts[data.actionId] = longtermCheckout;
        } else {
            throw new Error('Invalid Admin');
        }
    } else if (StudentStore.hasOverdueItem(data.studentId)) {
        throw new Error('Student has overdue item');
    } else {
        longtermCheckouts[data.actionId] = longtermCheckout;
    }
});

export default store;
