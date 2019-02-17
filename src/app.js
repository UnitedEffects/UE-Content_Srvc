import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import tools from './apiTools/';

import index from './index';
import api from './api/api_v2';

const respond = tools.respond;
const send = tools.send;
const app = express();
const debug = Debug('ue-content:app');
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/swagger', express.static(path.join(__dirname, '../public/swagger')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, DELETE, PUT, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, api_key, Authorization');
    next();
});

app.use('/', index);
app.use('/api/', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    respond.send(res, send.set(err.status || 500, err.message || 'unknown error'));
});

// Handle uncaughtException
let uncaught = 0;

process.on('uncaughtException', (err) => {
    debug('Caught exception: %j', err);
    uncaught += 1;
    if (uncaught < 20) {
        console.error({ error: `UNCAUGHT EXCEPTION - Uncaught #: ${uncaught}. Notifications will stop after 20 exceptions. Restart this container after that.`, stack: err.stack || err.message });
    } else process.exit(1);
});

export default app;
