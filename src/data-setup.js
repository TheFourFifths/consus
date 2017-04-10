import path from 'path';
import config from 'config';
import { initData } from './lib/data-setup';
import { setDataDirectory } from './lib/database';

let dataDirectory = config.get('database.data_directory');
if (dataDirectory === '') {
    dataDirectory = path.join(__dirname, '../');
}

setDataDirectory(dataDirectory);

initData();
