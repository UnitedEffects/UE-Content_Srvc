import content from './content';
import auth from '../auth/auth';
import images from './images';
import AWS from 'aws-sdk';
import fs from 'fs';
import axios from 'axios';

import log from '../log/logs';
import tools from '../../apiTools';

const respond = tools.respond;
const send = tools.send;
const config = require('../../config');

export default {
    async create(req, res) {
        try {
            if (req.body.owner && !auth.validAdmin(req.user)) respond.sendUnauthorized(res);
            if (!req.body.owner) req.body.owner = req.user._id;
            return respond.send(res, await content.create(req.body));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Content'));
        }
    },
    async returnAll(req, res) {
        try {
            const query = JSON.parse(JSON.stringify(req.query));
            if (!query.domain && !auth.validAdmin(req.user)) {
                return respond.send(res, send.fail400('Unless you are an admin, you must specify a domain'));
            }
            if (!query.product && !auth.validAdmin(req.user)) {
                return respond.send(res, send.fail400('Unless you are an admin, you must specify a product'));
            }
            if (!auth.validAdmin(req.user)) {
                query.published = true;
            }
            if (req.user.anon === true) {
                query.authRequired = false;
            }
            if (query.owner !== undefined && req.user._id === query.owner) {
                delete query.published;
            }
            return respond.send(res, await content.returnAll(query));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Content'));
        }
    },
    async returnOne(req, res) {
        try {
            const query = {
                guid: req.params.guid
            };
            if (req.query.domain !== undefined) query.domain = req.query.domain;
            if (req.query.product !== undefined) query.product = req.query.product;
            if (!query.domain && !auth.validAdmin(req.user)) {
                return respond.send(res, send.fail400('Unless you are an admin, you must specify a domain'));
            }
            if (!query.product && !auth.validAdmin(req.user)) {
                return respond.send(res, send.fail400('Unless you are an admin, you must specify a product'));
            }
            const theContent = await content._getOne(query);
            if (req.user.anon === true) {
                if (theContent.published === false) {
                    return respond.send(res, send.fail404(query));
                }
                if (theContent.authRequired === true) {
                    return respond.send(res, send.fail404(query));
                }
            }
            if (!auth.validAdmin(req.user)) {
                if (theContent.owner !== req.user._id) {
                    if (theContent.published === false) {
                        return respond.send(res, send.fail404(query));
                    }
                }
            }
            return respond.send(res, send.set200(theContent, 'Content'));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Content'));
        }
    },
    async patchOne(req, res) {
        try {
            const query = {
                guid: req.params.guid
            };
            const update = req.body;
            if (!auth.validAdmin(req.user)) query.owner = req.user._id;
            return respond.send(res, await content.patchOne(query, update));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Content'));
        }
    },
    async deleteOne(req, res) {
        try {
            const query = {
                guid: req.params.guid,
                domain: req.query.domain,
                product: req.query.product
            };
            if (!auth.validAdmin(req.user)) query.owner = req.user._id;
            if (!query.domain || !query.product) return respond.send(res, send.fail400('Domain and Product are required for delete'));
            return respond.send(res, await content.deleteOne(query));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Content'));
        }
    }
}