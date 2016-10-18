/* eslint-disable no-unused-vars */
const AVAILABLE = 'AVAILABLE';
const CHECKED_OUT = 'CHECKED_OUT';
/* eslint-enable no-unused-vars */

export default class Item {

    constructor(id) {
        this.id = id;
        this.status = AVAILABLE;
    }

}
