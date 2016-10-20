import server from './lib/server';

server.start()
.then(PORT => {
    /* eslint-disable no-console */
    console.log('The consus server is now listening on port ' + PORT + '.');
});
