import crypto from 'crypto';
import { Dispatcher } from 'consus-core/flux';
import Oak from 'oak-lite';

let database;
let rack;
let promises = new Map();

export function setDataDirectory(dataDirectory) {
    database = Oak.configure({
        dataDirectory
    });
    rack = database.selectRack('actions');
    rack.subscribe(action => {
        let actionId = action.data.actionId;
        try {
            Dispatcher.handleAction(action.type, action.data);
            if (promises.has(actionId)) {
                promises.get(actionId).resolve(actionId);
                promises.delete(actionId);
            }
        } catch (e) {
            if (promises.has(actionId)) {
                promises.get(actionId).reject(e);
                promises.delete(actionId);
            }
        }
    });
}

export function addAction(type, data) {
    data.actionId = crypto.randomBytes(32).toString('hex');
    data.timestamp = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
        if (database === undefined) {
            Dispatcher.handleAction(type, data);
            resolve(data.actionId);
        } else {
            promises.set(data.actionId, {
                resolve,
                reject
            });
            rack.publish({
                type,
                data
            });
        }
    });
}
