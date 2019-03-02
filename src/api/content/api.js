import uuid from 'uuidv4';
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
    },
    async addImage(req, res) {
        try {
            if (req.body.owner && !auth.validAdmin(req.user)) respond.sendUnauthorized(res);
            if (!req.body.owner) req.body.owner = req.user._id;
            const s3Client = new AWS.S3({
                accessKeyId: config.S3_KEY,
                secretAccessKey: config.S3_SECRET
            });
            const guid = uuid();
            return s3Client.upload({
                Bucket: config.S3_BUCKET,
                Key: guid,
                ACL: 'public-read',
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            }, async (error, data) => {
                if (error) throw error;
                const options = {
                    name: req.body.name,
                    guid,
                    description: req.body.description,
                    product: req.body.product,
                    domain: req.body.domain,
                    url: data.Location,
                    owner: req.body.owner || req.user._id,
                    labels: req.body.labels.split(','),
                    meta: data
                };
                if (fs.existsSync(req.file.path)) {
                    console.info(`File Found. Deleting ${req.file.path} as cleanup now.`);
                    fs.unlinkSync(req.file.path);
                }
                return respond.send(res, await images.addImage(options));
            });
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Image'));
        }
    },
    async updateImage(req, res) {
        try {
            const query = {
                guid: req.params.guid
            };
            const update = req.body;
            if (!auth.validAdmin(req.user)) query.owner = req.user._id;
            return respond.send(res, await images.patchOne(query, update));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Image'));
        }
    },
    async removeImage(req, res) {
        try {
            const query = {
                guid: req.params.guid,
                domain: req.query.domain,
                product: req.query.product
            };
            if (!auth.validAdmin(req.user)) query.owner = req.user._id;
            if (!query.domain || !query.product) return respond.send(res, send.fail400('Domain and Product query params are required for delete'));
            return respond.send(res, await images.deleteOne(query));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Image'));
        }
    },
    async getImage(req, res) {
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
            const theImage = await images._getOne(query);
            if (req.user.anon === true && theImage.authRequired === true) {
                return respond.send(res, send.fail404(query));
            }
            return respond.send(res, send.set200(theImage, 'Image'));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Image'));
        }
    },
    async getImages(req, res) {
        try {
            const query = JSON.parse(JSON.stringify(req.query));
            if (!query.domain && !auth.validAdmin(req.user)) {
                return respond.send(res, send.fail400('Unless you are an admin, you must specify a domain'));
            }
            if (!query.product && !auth.validAdmin(req.user)) {
                return respond.send(res, send.fail400('Unless you are an admin, you must specify a product'));
            }
            if (!req.query.owner && !auth.validAdmin(req.user)) {
                return respond.send(res, send.fail400('Unless you are an admin, you must specify 1 owner at a time for this method'));
            }
            if (req.user.anon === true) {
                query.authRequired = false;
            }
            return respond.send(res, await images.returnAll(query));
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Images'));
        }
    },
    async imageProxy(req, res) {
        try {
            const query = {
                guid: req.params.guid
            };
            const image = await images._getOne(query);
            if (image.authRequired === true && req.user.anon) {
                return respond.send(res, send.fail404());
            }
            const img = await axios({
                method: 'get',
                url: image.url,
                responseType: 'stream'
            });
            return img.data.pipe(res);
        } catch (error) {
            return respond.send(res, (error.code) ? error : send.error(error.message, 'Image'));
        }

    },
};
