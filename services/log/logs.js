/**
 * Created by bmotlagh on 10/23/17.
 */
import moment from 'moment';
import responder from '../response';
import Log from './model';

export default {
    /**
     * Allows you to pass a data object which is recorded as a log entry.
     * @param data
     * @returns {Promise}
     */
    writeLog(data) {
        const logData = data;
        logData.logTimestamp = moment().format();
        logData.logCode = data.logCode.toUpperCase();
        return new Promise((resolve, reject) => {
            const log = new Log(logData);
            console.info(logData);
            log.save()
                .then(result => resolve(responder.set200(result, 'Log')))
                .catch((error) => {
                    console.error(error);
                    return reject(responder.fail500(error))
                });
        });
    },
    /**
     * returns all logs from the DB
     * @returns {Promise}
     */
    getLogs() {
        return new Promise((resolve, reject) => {
            Log.find({})
                .then(result => resolve(responder.set200(result, 'Log')))
                .catch((err) => {
                    console.error(err);
                    return reject(responder.fail500(err));
                });
        });
    },
    /**
     * Return all logs of a single code: ERROR, NOTIFY, SUCCESS
     * @param code
     * @returns {Promise}
     */
    getLogByCode(code) {
        return new Promise((resolve, reject) => {
            Log.find({ logCode: code })
                .then(result => resolve(responder.set200(result, 'Log')))
                .catch((err) => {
                    console.error(err);
                    return reject(responder.fail500(err));
                });
        });
    },
    /**
     * Return a single log with code and timestamp
     * @param code
     * @param timestamp
     * @returns {Promise}
     */
    getLog(code, timestamp) {
        return new Promise((resolve, reject) => {
            Log.findOne({ logCode: code, logTimestamp: timestamp })
                .then(result => resolve(responder.set200(result, 'Log')))
                .catch((err) => {
                    console.error(err);
                    return reject(responder.fail500(err));
                });
        });
    },
    /**
     * This method is async and does not return anything. It logs an error.
     * @param message
     */
    error(message) {
        const data = {
            logCode: 'ERROR',
            logTimestamp: moment().format(),
            message
        };
        console.error(data);
        const log = new Log(data);
        log.save()
            .then(result => console.info(result))
            .catch(error => console.error(error));
    },
    /**
     * This method is async and does not return anything.
     * It records a notification message in the log.
     * @param message
     */
    notify(message) {
        const data = {
            logCode: 'NOTIFY',
            logTimestamp: moment().format(),
            message
        };
        console.info(data);
        const log = new Log(data);
        log.save()
            .then(result => console.info(result))
            .catch(error => console.error(error));
    },
    /**
     * This method is async and does not return anything. It logs a success message.
     * @param message
     */
    success(message) {
        const data = {
            logCode: 'SUCCESS',
            logTimestamp: moment().format(),
            message
        };
        console.info(data);
        const log = new Log(data);
        log.save()
            .then(result => console.info(result))
            .catch(error => console.error(error));
    },
    /**
     * This method is async and does not return anything.
     * It logs your choice of ERROR, NOTIFY, or SUCCESS with details.
     * @param code
     * @param message
     * @param detail
     */
    detail(code, message, detail) {
        const data = {
            logCode: code,
            logTimestamp: moment().format(),
            message,
            details: detail
        };
        console.info(data);
        const log = new Log(data);
        log.save()
            .then(result => console.info(result))
            .catch(error => console.error(error));
    }
};