import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import api from './api';

const PORT = 80;

let app;

function start() {
    return new Promise(resolve => {
        app = express();
        app.use(express.static(path.join(__dirname, '../public')));
        app.use(bodyParser.json());
        app.use('/api', api);
        app.listen(PORT, () => {
            resolve(PORT);
        });
    });
}

export default {
    start
};
