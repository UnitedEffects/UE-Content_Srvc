/**
 * Created by bmotlagh on 10/23/17.
 */

import responder from '../responder';
import response from '../response';
import logs from './logs';

const api = {
    writeLog(req, res) {
        console.info(req.body);
        if (!req.body.logCode) {
            return responder.send(res, response.fail405());
        }
        logs.writeLog(req.body)
            .then(result => responder.send(res, result))
            .catch((err) => {
                logs.error(err);
                return responder.send(res, err);
            });
    },
    getLogs(req, res) {
        logs.getLogs()
            .then(result => responder.send(res, result))
            .catch((err) => {
                logs.error(err);
                return responder.send(res, err);
            });
    },
    getLog(req, res) {
        const varCode = req.params.code.toUpperCase();
        logs.getLog(varCode, req.params.timestamp)
            .then(result => responder.send(res, result))
            .catch((err) => {
                logs.error(err);
                return responder.send(res, err);
            });
    },
    getLogByCode(req, res) {
        const varCode = req.params.code.toUpperCase();
        logs.getLogByCode(varCode)
            .then(result => responder.send(res, result))
            .catch((err) => {
                logs.error(err);
                return responder.send(res, err);
            });
    }
};

export default api;