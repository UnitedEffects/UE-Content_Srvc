/**
 * Created by borzou on 9/27/16.
 */
var passport = require('passport');
var Promise = require('bluebird');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var Token = Promise.promisifyAll(require('../model/auth'));
var moment = require('moment');
var request = Promise.promisify(require('request'));
Promise.promisifyAll(request);
//var basicAuth = require('basic-auth'); //may not need this
var config = require('../../../config');
var helper = require('../../helper');
var send = require('../../callback');

passport.use('basicWithCode', new BasicStrategy({
    passReqToCallback: true
},
    function(req, username, password, callback) {
        var vCode = (req.query.code) ? req.query.code : null;
        if(vCode===null) {
            vCode = (req.body.code) ? req.body.code : null;
        }
        if(!vCode) return callback(null, false);
        var reqOptions = {
            method: 'GET',
            uri: config.userApiServer+'/api/validate?code='+vCode,
            auth: {
                user: username,
                pass: password
            }
        };
        request(reqOptions)
            .then(function(response){
                if(response.statusCode===200){
                    if(helper.isJson(response.body)){
                        var returned = JSON.parse(response.body);
                        try{
                            return callback(null, returned.data.user);
                        }catch(err){
                            return callback(err, null);
                        }
                    }else callback(null, false);
                } else return callback(null, false);
            })
            .catch(function(error){
                console.log(error);
                return callback(error, null);
            });

    }
));

passport.use('social', new BearerStrategy(
    function(accessToken, callback) {
        try {
            if (!accessToken) return callback(null, false);
            var lookup = accessToken.split('.');
            if (!lookup.length >= 2) return callback(null, false);
            var userId = (lookup[0]) ? Buffer.from(lookup[0], 'base64').toString('ascii') : null;
            var tokenVal = (lookup[1]) ? Buffer.from(lookup[1], 'base64').toString('ascii') : null;
            Token.findOneAsync({user_id: userId})
                .then(function (token) {
                    if (!token) {
                        var reqOptions = {
                            method: 'GET',
                            uri: config.userApiServer + '/api/bearer',
                            auth: {
                                bearer: accessToken
                            }
                        };
                        request(reqOptions)
                            .then(function (response) {
                                if (response.statusCode === 200) {
                                    if (helper.isJson(response.body)) {
                                        var returned = JSON.parse(response.body);
                                        try {
                                            authFactory.saveToken(returned.data, tokenVal, function (err, saved) {
                                                if (err) console.log('validated token but could not save - moving on.');
                                                return callback(null, returned.data);
                                            });
                                        } catch (err) {
                                            return callback(null, false);
                                        }
                                    } else callback(null, false);
                                } else return callback(null, false);
                            })
                            .catch(function (error) {
                                return callback(null, false);
                            });
                    } else {
                        token.verifyToken(tokenVal, function (err, isMatch) {
                            if (err) return callback(null, false);
                            if (isMatch) {
                                token.user["token"] = accessToken;
                                token.user["expires"] = moment(token.created).add(12, 'hours');
                                token.user["token_created"] = token.created;
                                return callback(null, token.user);
                            } else {
                                console.log('no match');
                                var reqOptions = {
                                    method: 'GET',
                                    uri: config.userApiServer + '/api/bearer',
                                    auth: {
                                        bearer: accessToken
                                    }
                                };
                                request(reqOptions)
                                    .then(function (response) {
                                        if (response.statusCode === 200) {
                                            if (helper.isJson(response.body)) {
                                                var returned = JSON.parse(response.body);
                                                try {
                                                    authFactory.saveToken(returned.data, tokenVal, function (err, saved) {
                                                        if (err) console.log('validated token but could not save - moving on.');
                                                        return callback(null, returned.data);
                                                    });
                                                } catch (err) {
                                                    return callback(null, false);
                                                }
                                            } else callback(null, false);
                                        } else return callback(null, false);
                                    })
                                    .catch(function (error) {
                                        return callback(null, false);
                                    });
                            }

                        })
                    }
                })
                .catch(function (error) {
                    return callback(null, false);
                });
        }catch(error){
            return callback(null, false);
        }
    }
));


passport.use('bearer', new BearerStrategy(
    function(accessToken, callback) {
        if (!accessToken) return callback(null, false);
        var lookup = accessToken.split('.');
        if (!lookup.length >= 2) return callback(null, false);
        var userId = (lookup[0]) ? Buffer.from(lookup[0], 'base64').toString('ascii') : null;
        var tokenVal = (lookup[1]) ? Buffer.from(lookup[1], 'base64').toString('ascii') : null;
        Token.findOneAsync({ user_id: userId })
            .then(function(token){
                if(!token) {
                    var reqOptions = {
                        method: 'GET',
                        uri: config.authApiServer+'/api/validate',
                        auth: {
                            bearer: accessToken
                        }
                    };
                    request(reqOptions)
                        .then(function(response){
                            if(response.statusCode===200){
                                if(helper.isJson(response.body)){
                                    var returned = JSON.parse(response.body);
                                    try{
                                        authFactory.saveToken(returned.data, tokenVal, function(err, saved){
                                            if(err) console.log('validated token but could not save - moving on.');
                                            return callback(null, returned.data);
                                        });
                                    }catch(err){
                                        return callback(null, false);
                                    }
                                }else callback(null, false);
                            } else return callback(null, false);
                        })
                        .catch(function(error){
                            //console.log(error);
                            return callback(null, false);
                        });
                }else {
                    token.verifyToken(tokenVal, function (err, isMatch) {
                        if (err) return callback(err, null);
                        if (isMatch) {
                            token.user["token"] = accessToken;
                            token.user["expires"] = moment(token.created).add(12, 'hours');
                            token.user["token_created"] = token.created;
                            return callback(null, token.user);
                        }else{
                            console.log('no match');
                            var reqOptions = {
                                method: 'GET',
                                uri: config.authApiServer+'/api/validate',
                                auth: {
                                    bearer: accessToken
                                }
                            };
                            request(reqOptions)
                                .then(function(response){
                                    if(response.statusCode===200){
                                        if(helper.isJson(response.body)){
                                            var returned = JSON.parse(response.body);
                                            try{
                                                authFactory.saveToken(returned.data, tokenVal, function(err, saved){
                                                    if(err) console.log('validated token but could not save - moving on.');
                                                    return callback(null, returned.data);
                                                });
                                            }catch(err){
                                                return callback(null, false);
                                            }
                                        }else callback(null, false);
                                    } else return callback(null, false);
                                })
                                .catch(function(error){
                                    //console.log(error);
                                    return callback(null, false);
                                });
                        }

                    })
                }
            })
            .catch(function(error){
                return callback(error, false);
            });
    }
));

passport.use('isAdmin', new BearerStrategy(
    function(accessToken, callback) {
        var lookup = accessToken.split('.');
        if(lookup.length<2) return callback(null, false);
        //var userId = Buffer.from(lookup[0], 'base64').toString('ascii');
        //var tokenVal = Buffer.from(lookup[1], 'base64').toString('ascii');
        var reqOptions = {
            method: 'GET',
            uri: config.userApiServer+'/api/bearer/admin',
            auth: {
                bearer: accessToken
            }
        };
        request(reqOptions)
            .then(function(response){
                if(response.statusCode===200){
                    if(helper.isJson(response.body)){
                        var returned = JSON.parse(response.body);
                        return callback(null, returned.data);
                    }else callback(null, false);
                } else return callback(null, false);
            })
            .catch(function(error){
                console.log(error);
                return callback(error, false);
            });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var authFactory = {
    isBearerAuthenticated: passport.authenticate('bearer', { session: false }),
    isBearerAdmin: passport.authenticate('isAdmin', { session: false }),
    isAuthenticated: passport.authenticate('basicWithCode', { session : false}),
    isChainedSocialBearer: passport.authenticate(['social','bearer'], {session: false}),
    saveToken: function (user, tokenVal, callback){
        Token.findOneAndRemoveAsync({user_id:user._id})
            .then(function(result){
                var tCreated = user.token_created;

                var temp = JSON.parse(JSON.stringify(user));
                delete temp.token;
                delete temp.token_created;
                delete temp.expires;

                var token = new Token({
                    value: tokenVal,
                    user_id: user._id,
                    user: temp,
                    created: tCreated
                });

                token.saveAsync()
                    .then(function (saved) {
                        callback(null, saved);
                    })
                    .catch(function (error) {
                        callback(error, null);
                    });
            })
            .catch(function(error){
                callback(error, null);
            })

    }
};

module.exports = authFactory;