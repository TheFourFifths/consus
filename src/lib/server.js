import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import config from 'config';
import api from './api';

let server = null;

function start(port) {
    return new Promise((resolve, reject) => {
        if (server !== null) {
            reject(new Error('The server is already running.'));
        }
        let app = express();
        app.use(express.static(path.join(__dirname, '../public')));
        app.use(bodyParser.json({ limit: config.get('server.max_payload_size') }));
        app.use('/api', api);
        let host = config.get('server.ip');
        server = app.listen(port, host, () => {
            /* eslint-disable no-console */
            console.log(`The consus server is now listening at ${host}:${port}.`);
            resolve();
        });
    });
}

function stop() {
    return new Promise((resolve, reject) => {
        if (server === null) {
            reject(new Error('The server is not running.'));
        }
        server.close(() => {
            server = null;
            resolve();
        });
    });
}

export default {
    start,
    stop
};
