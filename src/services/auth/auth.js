/**
 * UE Auth authentication strategy
 * Copyright 2018 United Effects LLC
 */
import passport from 'passport';
import promisify from 'es6-promisify';
import rq from 'request';
const request = promisify(rq);
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import moment from 'moment';

import Token from './model';
import log from '../log/logs';
import config from '../../config';
import helper from '../helper';

function findToken (tokens, val) {
    return new Promise(async (resolve, reject) => {
        let theToken = null;
        await Promise.all(tokens.map(async (token) => {
            await token.verifyToken(val, (err, isMatch) => {
                if(err) return reject(err);
                if(isMatch) theToken = token;
            });
        }));
        return resolve(theToken);
    })
}

passport.use('bearer', new BearerStrategy(
    (accessToken, callback) => {
        try {
            if (!accessToken) return callback(null, false);
            const fullToken = Buffer.from(accessToken.replace(/%3D/g, '='), 'base64').toString('ascii');
            const lookup = fullToken.split('.');
            if (!lookup.length >= 2) return callback(null, false);
            const userId = (lookup[0]) ? lookup[0] : null;
            const tokenVal = (lookup[1]) ? lookup[1] : null;
            const product =  (lookup[2]) ? lookup[2] : null;
            const domain = (lookup[3]) ? lookup[3] : null;

            if(!product) return callback(null, false);
            if(!domain) return callback(null, false);
            Token.find({ user_id: userId, product_slug: product, domain_slug: domain })
                .then((token) => {
                    if(token.length===0) return null;
                    return findToken(token, tokenVal);
                })
                .then(token => {
                    if (!token) {
                        getBearerToken(accessToken, (err, result) => callback(err, result));
                    } else {
                        token.verifyToken(tokenVal, (err, isMatch) => {
                            if (err) return callback(null, false);
                            if (isMatch) {
                                token.user['token'] = accessToken;
                                token.user['expires'] = moment(token.created).add(12, 'hours');
                                token.user['token_created'] = token.created;
                                return callback(null, token.user);
                            } else {
                                //getting token
                                getBearerToken(accessToken, (err, result) => callback(err, result));
                            }

                        });
                    }
                })
                .catch(error => {
                    error['detail']='Bearer Auth Validation Error';
                    return callback(error, false);
                });
        }catch(error){
            error['detail']='Unhandled Error caught at Bearer Auth';
            log.error('Unhandled Error caught at Bearer Auth');
            return callback(error, false);
        }
    }
));

function getBearerToken(accessToken, callback){
    const fullToken = Buffer.from(accessToken.replace(/%3D/g, '='), 'base64').toString('ascii');
    const lookup = fullToken.split('.');
    const reqOptions = {
        method: 'GET',
        uri: `${config.UEAUTH}/api/validate`,
        auth: {
            bearer: accessToken
        }
    };
    request(reqOptions)
        .then(response => {
            if (response.statusCode !== 200) return callback(null, false);
            const returned = (helper.isJson(response.body)) ? JSON.parse(response.body) : response.body;
            try {
                if(returned.data.role !== 1 && returned.data.activity.product!==config.PRODUCT_SLUG) return callback(null, false);
                authFactory.saveToken(returned.data, {product: lookup[2] || null, domain: lookup[3] || null}, lookup[1], err => {
                    if(err) log.error('Unable to cache the token after validation.');
                    return callback(null, returned.data);
                });

            } catch (err) {
                log.error('Unhandled error saving token from UEAUTH');
                return callback(null, false);
            }
        })
        .catch(error => {
            error['detail'] = 'Bearer Auth from Domain Service';
            return callback(error, false);
        });
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const authFactory = {
    isBearerAuthenticated: passport.authenticate('bearer', { session: false }),
    saveToken(user, access, tokenVal, callback) {
        Token.find({user_id: user._id, product_slug: access.product, domain_slug: access.domain})
            .then((toks) => {
                if(toks.length>5) return Token.remove({_id: toks[0]._id});
                return true;
            })
            .then(() => {
                const tCreated = user.token_created;

                const temp = JSON.parse(JSON.stringify(user));
                delete temp.token;
                delete temp.token_created;
                delete temp.expires;


                const token = new Token({
                    value: tokenVal,
                    user_id: user._id,
                    product_slug: access.product,
                    domain_slug: access.domain,
                    user: temp,
                    created: tCreated
                });

                token.save()
                    .then(saved => {
                        callback(null, saved);
                    })
                    .catch(error => {
                        error['detail'] = 'Error Saving Token';
                        log.detail('ERROR', 'Error Saving Token', error);
                        callback(error, null);
                    });
            })
            .catch(error => {
                error['detail'] = 'Error Saving Token';
                log.detail('ERROR', 'Error Saving Token', error);
                callback(error, null);
            });

    },
    validProductAdmin (user) {
        if(user.role === 1) return true;
        else if(user.activity) if (user.activity.product) if(user.permissions) if(user.permissions.product) if(user.permissions.product[user.activity.product]) {
            if(user.permissions.product[user.activity.product].admin || user.permissions.product[user.activity.product].manager) return true;
        }
        return false;
    },
    validDomainAdmin (user) {
        if(user.role === 1) return true;
        else if(user.activity) if (user.activity.domain) if(user.permissions) if(user.permissions.domain) if(user.permissions.domain[user.activity.domain]) {
            if(user.permissions.domain[user.activity.domain].admin || user.permissions.domain[user.activity.domain].manager) return true;
        }
        return false;
    },
    validAdmin (user) {
        if(user.role === 1) return true;
        else if(this.validProductAdmin(user)) return true;
        else if(this.validDomainAdmin(user)) return true;
        return false;
    },
    thisValidProductAdmin (user, product) {
        if(user.role === 1) return true;
        else if(user.permissions) if(user.permissions.product) if(user.permissions.product[product]) {
            if(user.permissions.product[product].admin || user.permissions.product[product].manager) return true;
        }
        return false;
    },
    thisValidDomainAdmin (user, domain) {
        if(user.role === 1) return true;
        else if(user.permissions) if(user.permissions.domain) if(user.permissions.domain[domain]) {
            if(user.permissions.domain[domain].admin || user.permissions.domain[domain].manager) return true;
        }
        return false;
    },
};

export default authFactory;