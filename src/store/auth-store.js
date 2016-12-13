import { Store } from 'consus-core/flux';

let users = [
    {
        id:'112994',
        pin:'3214'
    }
];

class AuthStore extends Store {

    verifyAdmin(code){
        if (!code){
            return false;
        }

        return users.some(user => {
            if(user.id === code || user.pin === code){
                return true;
            }
        });
    }

}

const store = new AuthStore();

export default store;
