/**
 * Created by bmotlagh on 10/19/17.
 */
const callbackFactory = {
    set200(message, type) {
        return {
            type,
            data: (message) || 'success'
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
        return {
            code: 400,
            type,
            data: error
        };
    },
    fail400(message) {
        return {
            code: 400,
            data: (message) || 'There was a problem with one of your inputs.'
        };
    },
    fail401(message) {
        return {
            code: 401,
            data: (message) || 'Unauthorized'
        };
    },
    fail403(message) {
        return {
            code: 403,
            data: (message) || 'Request forbidden'
        };
    },
    fail404(message) {
        return {
            code: 404,
            data: (message) || 'Not found.'
        };
    },
    fail405(message) {
        return {
            code: 405,
            data: (message) || 'Method not allowed'
        };
    },
    fail409(message) {
        return {
            code: 409,
            data: (message) || 'There was a data conflict with your input.'
        };
    },
    fail422(message) {
        return {
            code: 422,
            data: (message) || 'Unprocessable Entity'
        }
    },
    fail500(message) {
        return {
            code: 500,
            data: (message) || 'There was an unknown server code.'
        };
    },
};

export default callbackFactory;