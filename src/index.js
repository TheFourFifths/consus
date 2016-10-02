import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import api from './lib/api';

const PORT = 80;

let app = express();
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.json());
app.use('/api', api);
app.listen(PORT, () => {
    console.log('The consus server is now listening on port ' + PORT + '.');
});
