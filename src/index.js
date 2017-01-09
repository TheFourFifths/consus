import server from './lib/server';

const PORT = 80;

server.start(PORT).then(() => {
    /* eslint-disable no-console */
    console.log('The consus server is now listening on port 80.');
});
