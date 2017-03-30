import config from 'config';
import server from './lib/server';
import { initData } from './lib/data-setup';

// Capture an optional port from the command line args
const PORT = process.argv.reduce((port, arg) => {
    return (arg.match(/^--port=(\d+)$/) || [0, port])[1];
}, config.get('server.port'));

server.start(PORT).then(() => {
    initData();
});
