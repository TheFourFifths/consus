import crypto from 'crypto';
import path from 'path';
import config from 'config';
import { Dispatcher } from 'consus-core/flux';
import Oak from 'oak-lite';

let dataDirectory = config.get('database.data_directory');
if (dataDirectory === '') {
    dataDirectory = path.join(__dirname, '../../');
}

let database = Oak.configure({
    dataDirectory
});

let rack = database.selectRack('actions');

let promises = new Map();

rack.subscribe(action => {
    Dispatcher.handleAction(action.type, action.data);
    promises.get(action.data.actionId)(action.data.actionId);
    promises.delete(action.data.actionId);
});

export function addAction(type, data) {
    data.actionId = crypto.randomBytes(32).toString('hex');
    data.timestamp = Math.floor(Date.now() / 1000);
    let action = {
        type,
        data
    };
    rack.publish(action);
    return new Promise(resolve => {
        promises.set(data.actionId, resolve);
    });
}
