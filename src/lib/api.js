import express from 'express';
import model from '../api/model';
import item from '../api/item';

let app = express();

/**
 * Middleware that adds success/failure responses
 */
app.use((req, res, next) => {
    res.successJson = data => {
        res.json(Object.assign({
            status: 'success'
        }, data));
    };
    res.failureJson = message => {
        res.json({
            status: 'failure',
            message
        });
    };
    next();
});

app.use('/model', model);
app.use('/item', item);

export default app;
