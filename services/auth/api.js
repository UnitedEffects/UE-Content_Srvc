/**
 * Created by borzou on 9/28/16.
 */
import respond from '../responder';
import auth from './auth';
const config = require('../../config');

export default {
    superAndProductAdminsOnly (req, res, next) {
        if(auth.validProductAdmin(req.user)) return next();
        return respond.sendUnauthorized(res);
    },
    superAndThisProductAdminsOnly (req, res, next) {
        let product = '';
        if(req.params.product_slug) product = req.params.product_slug;
        else if(req.params.slug) product = req.params.slug;
        else if(req.body.product_slug) product = req.body.product_slug;
        else if(req.body.slug) product = req.body.slug;
        else if(req.query.product_slug) product = req.query.product_slug;
        else if(req.query.slug) product = req.query.slug;
        if(auth.thisValidProductAdmin(req.user, product)) return next();
        return respond.sendUnauthorized(res);
    },
    superAdminOnly (req, res, next) {
        if(req.user.role === 1) return next();
        return respond.sendUnauthorized(res);
    },
    anyAdmin (req, res, next) {
        if(auth.validAdmin(req.user)) return next();
        return respond.sendUnauthorized(res);
    },
    superAndDomainAdminsOnly (req, res, next) {
        if(auth.validDomainAdmin(req.user)) return next();
        return respond.sendUnauthorized(res);
    },
    superAndThisDomainAdminsOnly (req, res, next) {
        let domain = '';
        if(req.params.domain_slug) domain = req.params.domain_slug;
        else if(req.params.slug) domain = req.params.slug;
        else if(req.body.domain_slug) domain = req.body.domain_slug;
        else if(req.body.slug) domain = req.body.slug;
        else if(req.query.domain_slug) domain = req.query.domain_slug;
        else if(req.query.slug) domain = req.query.slug;
        if(auth.thisValidDomainAdmin(req.user, domain)) return next();
        return respond.sendUnauthorized(res);
    },
    isBearerAuthenticated: auth.isBearerAuthenticated,
    isProductAdmin (req, res, next) {
        if(auth.thisValidProductAdmin(req.user, config.PRODUCT_SLUG)) return next();
        return respond.sendUnauthorized(res);
    },
};
