const AVAILABLE = 'AVAILABLE';
const CHECKED_OUT = 'CHECKED_OUT';

export default class Item {

    constructor(id) {
        this.id = id;
        this.status = AVAILABLE;
    }

}
