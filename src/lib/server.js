import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import api from './api';

let server = null;

function start(port) {
    return new Promise((resolve, reject) => {
        if (server !== null) {
            reject(new Error('The server is already running.'));
        }
        let app = express();
        app.use(express.static(path.join(__dirname, '../public')));
        app.use(bodyParser.json({ limit: '1MB' }));
        app.use('/api', api);
        server = app.listen(port, () => {
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
