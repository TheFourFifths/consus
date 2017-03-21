import request from 'request';

const PROTOCOL = 'http';
const HOST = 'localhost';
const PORT = 8080;

function call(endpoint, method, qs, json) {
    let options = {
        uri: `${PROTOCOL}://${HOST}:${PORT}/api/${endpoint}`,
        method
    };
    if (typeof qs !== 'undefined') {
        options.qs = qs;
    }
    if (typeof json !== 'undefined') {
        options.json = json;
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
            if (body.status === 'success') {
                resolve(body.data);
            } else {
                reject(new Error(body.message));
            }
        });
    });
}

export function del(endpoint, data) {
    return call(endpoint, 'DELETE', data);
}

export function get(endpoint, data) {
    return call(endpoint, 'GET', data);
}

export function post(endpoint, data) {
    return call(endpoint, 'POST', undefined, data);
}

export function patch(endpoint, qs, data) {
    return call(endpoint, 'PATCH', qs, data);
}
