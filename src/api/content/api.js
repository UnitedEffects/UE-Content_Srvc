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
            // todo query by owner
            // todo anon vs not
            // todo only published
            const domain = req.params.domain || null;
            const product = req.params.product || null;
            if (!domain && !auth.validAdmin(req.user)) respond.sendUnauthorized(res);
            if (!product && !auth.validAdmin(req.user)) respond.sendUnauthorized(res);
            return respond.send(res, await content.returnAll(product, domain));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Content'));
        }
    }
}