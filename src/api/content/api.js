import content from './content';
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
            req.body.owner = req.user._id;
            return respond.send(res, await content.create(req.body));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Content'));
        }
    },
}