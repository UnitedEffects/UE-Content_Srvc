/**
 * Created by borzou on 9/28/16.
 */
var callbackFactory = {
    success: function(message){
        return {
            err: null,
            data: (message) ? message : 'success'
        }
    },
    successSaved: function(saved){
        return {
            err: null,
            data: {
                id: saved._id,
                key: saved.key,
                name: saved.name,
                username: saved.username,
                domains: saved.domains,
                users: saved.users,
                email: saved.email,
                created: saved.created,
                expires: saved.expires,
                code: saved.code,
                slug: saved.slug,
                token: saved.token,
                redirectUrl: saved.redirectUrl,
                product: saved.product,
                licenseId: saved.licenseId,
                plan_name: saved.plan_name,
                meta: saved.meta,
                stripe_customer: saved.stripe_customer_id,
                next_payment_due: saved.payment_due,
                next_payment_amount: saved.payment_amount,
                patched: saved.patched,
                active: saved.active
            }
        }
    },
    fail: function(code, message){
        return {
            err: code,
            data: message
        }
    },
    fail400: function(message){
        return {
            err: 400,
            data: (message) ? message : 'There was a problem with one of your inputs.'
        }
    },
    fail401: function(){
        return {
            err: 401,
            data: 'Unauthorized'
        }
    },
    fail403: function(message){
        return {
            err: 403,
            data: (message) ? message : 'Request forbidden'
        }
    },
    fail404: function(message){
        return {
            err: 404,
            data: (message) ? message : 'Resource not found.'
        }
    },
    fail417: function(message){
        return {
            err: 417,
            data: (message) ? message : 'Some of the data you submitted is incorrect.'
        }
    },
    fail409: function(message){
        return {
            err: 409,
            data: (message) ? message : 'There was a data conflict with your input.'
        }
    },
    fail500: function(message){
        return {
            err: 500,
            data: (message) ? message : 'There was an unknown server error.'
        }
    },
    failErr: function(err){
        return {
            err: 500,
            data: {
                code: err.code,
                message: err.message
            }
        }
    }
};

module.exports = callbackFactory;