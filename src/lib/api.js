import express from 'express';
import model from '../api/model';
import item from '../api/item';
import student from '../api/student';
import checkout from '../api/checkout';

let app = express();

/**
 * Middleware that adds success/failure responses
 */
app.use((req, res, next) => {
    res.successJson = data => {
        let response = {
            status: 'success'
        };
        if (typeof data === 'object') {
            response.data = data;
        }
        res.json(response);
    };
    res.failureJson = message => {
        let response = {
            status: 'failure'
        };
        if (typeof message === 'string') {
            response.message = message;
        }
        res.json(response);
    };
    next();
});

app.use('/model', model);
app.use('/item', item);
app.use('/student', student);
app.use('/checkout', checkout);

export default app;
