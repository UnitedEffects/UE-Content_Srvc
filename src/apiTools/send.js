import log from '../api/log/logs';

export default {
    set200(message, type) {
        return {
            type,
            data: message || 'success'
        };
    },
    set(code, message, type) {
        return {
            code,
            type,
            data: message
        };
    },
    error(error, type) {
        log.detail('ERROR', type, error);
        return {
            code: 400,
            type,
            data: error
        };
    },
    success204(message) {
        return {
            code: 204,
            data: message || 'No Content'
        }
    },
    success206(message) {
        return {
            code: 206,
            data: message || 'Partial Content'
        }
    },
    success201(message) {
        return {
            code: 201,
            data: message || 'Created'
        }
    },
    success202(message) {
        return {
            code: 202,
            data: message || 'Accepted'
        }
    },
    fail400(message) {
        return {
            code: 400,
            data: message || 'There was a problem with one of your inputs.'
        };
    },
    fail401(message) {
        return {
            code: 401,
            data: message || 'Unauthorized'
        };
    },
    fail403(message) {
        return {
            code: 403,
            data: message || 'Request forbidden'
        };
    },
    fail404(message) {
        return {
            code: 404,
            data: message || 'Not found.'
        };
    },
    fail405(message) {
        return {
            code: 405,
            data: message || 'Method not allowed'
        };
    },
    fail409(message) {
        return {
            code: 409,
            data: message || 'There was a data conflict with your input.'
        };
    },
    fail500(message) {
        return {
            code: 500,
            data: message || 'There was an unknown server code.'
        };
    },
};