/**
 * Created by borzou on 9/28/16.
 */
import tools from '../../apiTools';
import auth from './auth';
import ac from './roleAccess';
import log from '../log/logs';

const respond = tools.respond;
const config = require('../../config');

async function checkRole(type, access, role, method, resource, userId = null, resourceOwner = null) {
    try {
        switch (type) {
        case 'any':
            switch (method) {
            case 'GET':
                if (!access) return (ac.can(role).readAny(resource).granted);
                return access;
            case 'PATCH':
            case 'PUT':
                if (!access) return (ac.can(role).updateAny(resource).granted);
                return access;
            case 'DELETE':
                if (!access) return (ac.can(role).deleteAny(resource).granted);
                return access;
            case 'POST':
                if (!access) return (ac.can(role).createAny(resource).granted);
                return access;
            default:
                return access;
            }
        case 'own':
            switch (method) {
            case 'GET':
                if (!access) {
                    return (ac.can(role).readOwn(resource).granted && userId === resourceOwner);
                }
                return access;
            case 'PATCH':
            case 'PUT':
                if (!access) {
                    return (ac.can(role).updateOwn(resource).granted && userId === resourceOwner);
                }
                return access;
            case 'DELETE':
                if (!access) {
                    return (ac.can(role).deleteOwn(resource).granted && userId === resourceOwner);
                }
                return access;
            case 'POST':
                if (!access) {
                    return (ac.can(role).createOwn(resource).granted && userId === resourceOwner);
                }
                return access;
            default:
                return access;
            }
        default:
            return access;
        }
    } catch (error) {
        log.error(error.message);
        return false;
    }
}

export default {
    async middleAny(req, res, next) {
        try {
            const roles = await getRole(req.user, getDomain(req));
            let resource = req.path.split('/')[1];
            if (resource === '') resource = 'root';
            let access = false;
            for (let i = 0; i < roles.length; i++) {
                if (access === false) {
                    access = await checkRole('any', access, roles[i], req.method, resource);
                }
            }
            if (access) return next();
            return respond.sendUnauthorized(res);
        } catch (error) {
            log.error(error);
            return respond.sendUnauthorized(res);
        }
    },
    async own(req, resourceOwner) {
        try {
            const roles = await getRole(req.user, getDomain(req));
            const userId = req.user._id;
            let resource = req.path.split('/')[1];
            if (resource === '') resource = 'root';
            let access = false;
            for (let i = 0; i < roles.length; i++) {
                if (access === false) {
                    access = await checkRole('own', access, roles[i], req.method, resource, userId, resourceOwner);
                }
            }
            return access;
        } catch (error) {
            log.error(error);
            throw error;
        }
    },
    isBearerAuthenticated: auth.isBearerAuthenticated,
    isOptionalAuthenticated: auth.isOptionalAuthenticated,
    isWebHookAuthorized(req, res, next) {
        if (req.query.code === config.WEBHOOK) return next();
        return respond.sendUnauthorized(res);
    }
};

function getRole(user, domain) {
    try {
        const role = [];
        if (user.role === 1) role.push('superAdmin');
        if (user.permissions) {
            if (user.permissions.product) {
                if (user.permissions.product[config.PRODUCT_SLUG]) {
                    if (user.permissions.product[config.PRODUCT_SLUG].admin) role.push('productAdmin');
                }
            }
        }
        if (domain) {
            if (user.permissions) {
                if (user.permissions.domain) {
                    if (user.permissions.domain[domain]) {
                        if (user.permissions.domain[domain].admin) role.push('domainAdmin');
                    }
                }
            }
        }
        if (role.length === 0) role.push('guest');
        return Promise.resolve(role);
    } catch (e) {
        return Promise.reject(e);
    }
}

function getDomain(req) {
    try {
        if (req.params.domain) return req.params.domain;
        if (req.query.domain) return req.query.domain;
        if (req.body.domain) return req.body.domain;
        if (req.headers.domain) return req.headers.domain;
        if (req.params.domain_slug) return req.params.domain_slug;
        if (req.query.domain_slug) return req.query.domain_slug;
        if (req.body.domain_slug) return req.body.domain_slug;
        if (req.headers.domain_slug) return req.headers.domain_slug;
        if (req.params.domainSlug) return req.params.domainSlug;
        if (req.query.domainSlug) return req.query.domainSlug;
        if (req.body.domainSlug) return req.body.domainSlug;
        if (req.headers.domainSlug) return req.headers.domainSlug;
        return undefined;
    } catch (e) {
        throw e;
    }
}
