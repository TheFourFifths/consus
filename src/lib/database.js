import { Dispatcher } from 'consus-flux';

export function addAction(action) {
    // TODO: Write to persistent database
    // TODO: Write to backup database
    return new Promise(resolve => {
        Dispatcher.handleAction(action);
        resolve();
    });
}
