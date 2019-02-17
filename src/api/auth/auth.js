import passport from 'passport';
import promisify from 'es6-promisify';
import rq from 'request';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import moment from 'moment';
import Token from './model';
import log from '../log/logs';
import config from '../../config';
import tools from '../../apiTools';

const helper = tools.help;
const request = promisify(rq);

passport.use('bearer', new BearerStrategy(
    async (accessToken, callback) => {
        try {
            if (!accessToken) return callback(null, false);
            const fullToken = Buffer.from(accessToken.replace(/%3D/g, '='), 'base64').toString('ascii');
            const lookup = fullToken.split('.');
            if (!lookup.length >= 2) return callback(null, false);
            const userId = (lookup[0]) ? lookup[0] : null;
            const tokenVal = (lookup[1]) ? lookup[1] : null;
            const product = (lookup[2]) ? lookup[2] : null;
            const domain = (lookup[3]) ? lookup[3] : null;

            if (!product) return callback(null, false);
            if (!domain) return callback(null, false);

            const tokens = await Token.find({
                user_id: userId,
                product_slug: product,
                domain_slug: domain
            });
            const token = await authFactory.findToken(tokens, tokenVal, accessToken);
            if (!token) return getBearerToken(accessToken, (err, result) => callback(err, result));
            return callback(null, token.user);
        } catch (error) {
            error.detail = 'Unhandled Error caught at Bearer Auth';
            log.error('Unhandled Error caught at Bearer Auth');
            return callback(error, false);
        }
    }
));

passport.use('bearerOptional', new BearerStrategy(
    async (accessToken, callback) => {
        try {
            if (!accessToken) return callback(null, false);
            if (accessToken === 'anon') return callback(null, { anon: true });
            const fullToken = Buffer.from(accessToken.replace(/%3D/g, '='), 'base64').toString('ascii');
            const lookup = fullToken.split('.');
            if (!lookup.length >= 2) return callback(null, false);
            const userId = (lookup[0]) ? lookup[0] : null;
            const tokenVal = (lookup[1]) ? lookup[1] : null;
            const product = (lookup[2]) ? lookup[2] : null;
            const domain = (lookup[3]) ? lookup[3] : null;

            if (!product) return callback(null, false);
            if (!domain) return callback(null, false);

            const tokens = await Token.find({
                user_id: userId,
                product_slug: product,
                domain_slug: domain
            });
            const token = await authFactory.findToken(tokens, tokenVal, accessToken);
            if (!token) return getBearerToken(accessToken, (err, result) => callback(err, result));
            return callback(null, token.user);
        } catch (error) {
            error.detail = 'Unhandled Error caught at Bearer Auth';
            log.error('Unhandled Error caught at Bearer Auth');
            return callback(error, false);
        }
    }
));

function getBearerToken(accessToken, callback) {
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
        .then((response) => {
            if (response.statusCode !== 200) return callback(null, false);
            const returned = (helper.isJson(response.body))
                ? JSON.parse(response.body) : response.body;
            try {
                if (returned.data.role !== 1
                    && returned.data.activity.product !== config.PRODUCT_SLUG) {
                    return callback(null, false);
                }
                authFactory.saveToken(returned.data,
                    { product: lookup[2] || null, domain: lookup[3] || null }, lookup[1], (err) => {
                        if (err) log.error('Unable to cache the token after validation.');
                        return callback(null, returned.data);
                    });
            } catch (err) {
                log.error('Unhandled error saving token from UEAUTH');
                return callback(null, false);
            }
        })
        .catch((error) => {
            error.detail = 'Bearer Auth from Domain Service';
            return callback(error, false);
        });
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

async function find(arr, val) {
    let result = null;
    for (const elm of arr) {
        if (await elm.verifyTokenAsync(val)) {
            result = elm;
            break;
        }
    }
    return result;
}

const authFactory = {
    async findToken(tokens, val, access) {
        try {
            const theToken = await find(tokens, val);
            if (theToken) {
                theToken.user.token = access;
                theToken.user.expires = moment(theToken.created).add(12, 'hours');
                theToken.user.token_created = theToken.created;
            }
            return theToken;
        } catch (error) {
            log.error(error);
            return null;
        }
    },
    isBearerAuthenticated: passport.authenticate('bearer', { session: false }),
    isOptionalAuthenticated: passport.authenticate('bearerOptional', { session: false }),
    saveToken(user, access, tokenVal, callback) {
        Token.find({ user_id: user._id, product_slug: access.product, domain_slug: access.domain })
            .then((toks) => {
                if (toks.length > 5) return Token.remove({ _id: toks[0]._id });
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
                    .then((saved) => {
                        callback(null, saved);
                    })
                    .catch((error) => {
                        error.detail = 'Error Saving Token';
                        log.detail('ERROR', 'Error Saving Token', error);
                        callback(error, null);
                    });
            })
            .catch((error) => {
                error.detail = 'Error Saving Token';
                log.detail('ERROR', 'Error Saving Token', error);
                callback(error, null);
            });
    },
    validProductAdmin(user) {
        if (user.role === 1) return true;
        else if (user.activity) {
            if (user.activity.product) {
                if (user.permissions) {
                    if (user.permissions.product) {
                        if (user.permissions.product[user.activity.product]) {
                            if (user.permissions.product[user.activity.product].admin
                                || user.permissions.product[user.activity.product].manager) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    validProductAdminOnly(user) {
        if (user.role === 1) return true;
        else if (user.activity) {
            if (user.activity.product) {
                if (user.permissions) {
                    if (user.permissions.product) {
                        if (user.permissions.product[user.activity.product]) {
                            return user.permissions.product[user.activity.product].admin;
                        }
                    }
                }
            }
        }
        return false;
    },
    validDomainAdmin(user) {
        if (user.role === 1) return true;
        else if (user.activity) {
            if (user.activity.domain) {
                if (user.permissions) {
                    if (user.permissions.domain) {
                        if (user.permissions.domain[user.activity.domain]) {
                            if (user.permissions.domain[user.activity.domain].admin
                                || user.permissions.domain[user.activity.domain].manager) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    validDomainAdminOnly(user) {
        if (user.role === 1) return true;
        else if (user.activity) {
            if (user.activity.domain) {
                if (user.permissions) {
                    if (user.permissions.domain) {
                        if (user.permissions.domain[user.activity.domain]) {
                            return user.permissions.domain[user.activity.domain].admin;
                        }
                    }
                }
            }
        }
        return false;
    },
    validAdmin(user) {
        if (user.role === 1) return true;
        else if (this.validProductAdmin(user)) return true;
        else if (this.validDomainAdmin(user)) return true;
        return false;
    },
    validAdminOnly(user) {
        if (user.role === 1) return true;
        else if (this.validProductAdminOnly(user)) return true;
        else if (this.validDomainAdminOnly(user)) return true;
        return false;
    },
    thisValidAdmin(user, product, domain) {
        if (user.role === 1) return true;
        else if (this.thisValidProductAdmin(user, product)) return true;
        else if (this.thisValidDomainAdmin(user, domain)) return true;
        return false;
    },
    thisValidAdminOnly(user, product, domain) {
        if (user.role === 1) return true;
        else if (this.thisValidProductAdminOnly(user, product)) return true;
        else if (this.thisValidDomainAdminOnly(user, domain)) return true;
        return false;
    },
    thisValidProductAdminOnly(user, product) {
        if (user.role === 1) return true;
        else if (user.permissions) {
            if (user.permissions.product) {
                if (user.permissions.product[product]) {
                    return user.permissions.product[product].admin;
                }
            }
        }
        return false;
    },
    thisValidProductAdmin(user, product = config.PRODUCT_SLUG) {
        if (user.role === 1) return true;
        else if (user.permissions) {
            if (user.permissions.product) {
                if (user.permissions.product[product]) {
                    if (user.permissions.product[product].admin
                        || user.permissions.product[product].manager) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    thisValidDomainAdmin(user, domain) {
        if (user.role === 1) return true;
        else if (user.permissions) {
            if (user.permissions.domain) {
                if (user.permissions.domain[domain]) {
                    if (user.permissions.domain[domain].admin
                        || user.permissions.domain[domain].manager) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    thisValidDomainAdminOnly(user, domain) {
        if (user.role === 1) return true;
        else if (user.permissions) {
            if (user.permissions.domain) {
                if (user.permissions.domain[domain]) {
                    return user.permissions.domain[domain].admin;
                }
            }
        }
        return false;
    }
};

export default authFactory;
