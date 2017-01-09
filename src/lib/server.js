import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import api from './api';

const PORT = 80;

let server = null;

function start() {
    return new Promise((resolve, reject) => {
        if (server !== null) {
            reject(new Error('The server is already running.'));
        }
        let app = express();
        app.use(express.static(path.join(__dirname, '../public')));
        app.use(bodyParser.json());
        app.use('/api', api);
        server = app.listen(PORT, () => {
            resolve(PORT);
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
