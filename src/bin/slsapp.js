/**
 * Module dependencies.
 */

// enables ES6 ('import'.. etc) in Node
// require('babel-core/register');
require('babel-polyfill');

const sls = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../app').default;
// const debug = require('debug')('ue-content:app');
// const http = require('http');
const config = require('../config');

const mongoConnect = config.MONGO;

if (!mongoConnect) {
    console.error('Mongo Connection not set. Exiting.');
    process.exit(1);
}

console.info(`Connection string: ${mongoConnect}`);

const mongoOptions = {
    keepAlive: 300000,
    connectTimeoutMS: 30000,
    useMongoClient: true
};

if (process.env.NODE_ENV==='production') mongoOptions.replicaSet = config.REPLICA;

function connectionM() {
    mongoose.connect(`${mongoConnect}?authSource=admin`, mongoOptions, (err) => {
        if (err) {
            console.info('********************************************ERROR*******************************************');
            console.info('Unable to connect to the database - this service will not persist data');
            console.info(`DB attempted:  ${mongoConnect}`);
            console.info('Please check that the database is running and try again.');
            console.info('DETAILED ERROR BELOW');
            console.info(err);
            console.info('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ERROR^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            setTimeout(() => {
                connectionM();
            }, 2000);
        }
    });
}

connectionM();

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
