import crypto from 'crypto';
import { Dispatcher } from 'consus-core/flux';


// Mock adding an action to the database
export function addAction(type, data = Object.create(null)) {
    data.actionId = crypto.randomBytes(32).toString('hex');
    data.timestamp = Math.floor(Date.now() / 1000);
    return new Promise(resolve => {
        Dispatcher.handleAction(type, data);
        resolve(data.actionId);
    });
}
