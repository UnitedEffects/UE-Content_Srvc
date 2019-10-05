/**
 * Created by bmotlagh on 10/19/17.
 */
import log from '../api/log/logs';

function mongoDuplicate (response) {
    if (response.code === 11000) {
        const output = JSON.parse(JSON.stringify(response));
        output.code = 409;
        output.data = response.errmsg.split('E11000 duplicate key error collection: ').join('');
        return output;
    }
    return response;
}

export default {
    send(res, input) {
        let output = mongoDuplicate(input);
        let status;
        if (!output) {
            output = {
                code: 500,
                data: 'unknown error'
            };
        }
        if (output.code) status = output.code;
        if (output.stack) status = 500;

        const resp = {
            code: output.code || status,
            type: output.type,
            data: output.data || output.stack,
            message: output.message
        };
        if (output.stack) log.detail('ERROR', 'Error Sending Response', resp);
        return res.status(status || 200).json(resp);
    },
    send200(res, message, type) {
        return res.json({ type, data: message || 'success' });
    },
    sendUnauthorized(res) {
        return res.status(401).send('unauthorized');
    }
};