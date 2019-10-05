/**
 * Module dependencies.
 */

require('babel-polyfill');

const sls = require('serverless-http');
const connection = require('./connection').default;
const app = require('./app').default;
const config = require('./config');

const mongoConnect = config.MONGO;

if (!mongoConnect) {
    console.error('Mongo Connection not set. Exiting.');
    process.exit(1);
}

console.info(`Connection string: ${mongoConnect}`);
connection.create(mongoConnect, config.REPLICA);

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3010');
app.set('port', port);


module.exports.handler = sls(app);
