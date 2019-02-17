import tools from '../../apiTools';
import logs from './logs';
const respond = tools.respond;
const send = tools.send;

const api = {
    writeLog(req, res) {
        if (!req.body.logCode) {
            return respond.send(res, send.fail405());
        }
        logs.writeLog(req.body)
            .then(result => respond.send(res, result))
            .catch((err) => {
                logs.error(err);
                return respond.send(res, err);
            });
    },
    getLogs(req, res) {
        logs.getLogs()
            .then(result => respond.send(res, result))
            .catch((err) => {
                logs.error(err);
                return respond.send(res, err);
            });
    },
    getLog(req, res) {
        const varCode = req.params.code.toUpperCase();
        logs.getLog(varCode, req.params.timestamp)
            .then(result => respond.send(res, result))
            .catch((err) => {
                logs.error(err);
                return respond.send(res, err);
            });
    },
    getLogByCode(req, res) {
        const varCode = req.params.code.toUpperCase();
        logs.getLogByCode(varCode)
            .then(result => respond.send(res, result))
            .catch((err) => {
                logs.error(err);
                return respond.send(res, err);
            });
    }
};

export default api;