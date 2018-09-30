/**
 * Created by borzou on 9/28/16.
 */

var helper = require('../../helper');
var Promise = require('bluebird');
var auth = Promise.promisifyAll(require('./auth'));

var authApi = {
    authorize: function(req, res){
        if(!req.body.code || !req.body.redirect_uri || !req.body.domain || !req.body.product) return helper.sendJson(res, {err: 417, data: "code, redirectUrl, domain, and product are all required elements of the body."});
        auth.requestTokenAsync(req.body, req.user)
            .then(function (output) {
                helper.sendJson(res, output);
            })
            .catch(function (error) {
                if (error.stack) console.log(error.stack);
                if(error.err===401) helper.sendUnauthorized(res);
                else helper.sendJson(res, error);
            });
    },
    validate: function(req, res){
        delete req.user.password;
        helper.sendJson(res, {err:null, data: req.user});
    },
    isAuthenticated: auth.isAuthenticated,
    isAuthenticatedLicId: auth.isAuthenticatedLicId,
    isBearerAuthenticated: auth.isBearerAuthenticated,
    isBearerAdmin: auth.isBearerAdmin,
    isWebHookAuthenticated: auth.isWebHookAuthenticated,
    isChainedSocialBearer: auth.isChainedSocialBearer
};

module.exports = authApi;