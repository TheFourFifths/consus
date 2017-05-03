import path from 'path';
import config from 'config';
import server from './lib/server';
import { setDataDirectory } from './lib/database';

// Capture an optional port from the command line args
const PORT = process.argv.reduce((port, arg) => {
    return (arg.match(/^--port=(\d+)$/) || [0, port])[1];
}, config.get('server.port'));

let dataDirectory = config.get('database.data_directory');
if (!path.isAbsolute(dataDirectory)) {
    dataDirectory = path.join(__dirname, '../', dataDirectory);
}

setDataDirectory(dataDirectory);

server.start(PORT).then(() => {
    /* eslint-disable no-console */
    let host = config.get('server.ip');
    console.log(`The consus server is now listening at ${host}:${PORT}.`);
});
