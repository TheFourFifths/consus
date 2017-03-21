import server from './lib/server';
import { initData } from './lib/data-setup';

// Capture an optional port from the command line args
const PORT = process.argv.reduce((port, arg) => {
    return (arg.match(/^--port=(\d+)$/) || [0, port])[1];
}, 80);

server.start(PORT).then(() => {
    /* eslint-disable no-console */
    console.log(`The consus server is now listening on port ${PORT}.`);
    initData();
});
