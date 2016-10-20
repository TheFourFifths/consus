import crypto from 'crypto';
import { Dispatcher } from 'consus-core/flux';

export function addAction(type, data) {
    // TODO: Write to persistent database
    // TODO: Write to backup database
    data.actionId = crypto.randomBytes(32).toString('hex');
    data.timestamp = Math.floor(Date.now() / 1000);
    return new Promise(resolve => {
        Dispatcher.handleAction(type, data);
        resolve(data.actionId);
    });
}
