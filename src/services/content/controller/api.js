import content from './content';
import images from './images';
import AWS from 'aws-sdk';
import fs from 'fs';
import request from 'request';

import log from '../../log/logs';
import response from '../../responder';
import send from '../../response';

const config = require('../../../config');

const contentApi = {
    create(req, res) {
        req.body.owner = req.user._id;
        content.create(req.body)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'CREATE Content', error);
                return response.send(res, error);
            });
    },
    returnOne(req, res, next) {
        content.returnOne(req.params.id)
            .then(output => response.send(res, output))
            .catch(error =>
                // log.detail('ERROR', 'RETURN one content', error);
                next()
            );
    },
    returnOneBySlug(req, res) {
        content.returnOneBySlug(req.params.slug)
            .then((output) => {
                if (output.data.auth_required) if (!req.user) return response.send(res, send.fail401('This content requires authenticated access through a secured endpoint (/api/content/:slug)'));
                return response.send(res, output);
            })
            .catch((error) => {
                log.detail('ERROR', 'Return one content by slug', error);
                return response.send(res, error);
            });
    },
    returnAll(req, res) {
        const tag = req.query.tag || null;
        content.returnAll(tag)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'Return all content', error);
                return response.send(res, error);
            });
    },
    async patchOne(req, res) {
        try {
            if (req.body.categories) delete req.body.categories;
            const cont = await content.returnOne(req.params.id);
            if (req.user.role !== 1 && cont.owner !== req.user._id) {
                return response.send(res, send.fail401());
            }
            return response.send(res, await content.patchOne(req.params.id, req.body));
        } catch (error) {
            log.detail('ERROR', 'Patch one content', error);
            return response.send(res, error);
        }
    },
    async addCategory(req, res) {
        try {
            const cont = await content.returnOne(req.params.id);
            if (req.user.role !== 1 && cont.owner !== req.user._id) {
                return response.send(res, send.fail401());
            }
            const cat = await content.returnOneCategoryByName(req.body.name);
            if (!cat) return send.fail404('The category you are attempting to add, does not exist. Please add it to the system first.');
            return response.send(res, await content.addCategory(req.params.id, {
                name: cat.data.name,
                description: cat.data.description
            }));
        } catch (error) {
            log.detail('ERROR', 'Add Category to content', error);
            return response.send(res, error);
        }
    },
    async removeCategory(req, res) {
        try {
            const cont = await content.returnOne(req.params.id);
            if (req.user.role !== 1 && cont.owner !== req.user._id) {
                return response.send(res, send.fail401());
            }
            return response.send(res, await content.removeCategory(req.params.id, req.params.name));
        } catch (error) {
            log.detail('ERROR', 'Remove Category from content', error);
            return response.send(res, error);
        }
    },
    async deleteOne(req, res) {
        try {
            const cont = await content.returnOne(req.params.id);
            if (req.user.role !== 1 && cont.owner !== req.user._id) {
                return response.send(res, send.fail401());
            }
            return response.send(res, await content.deleteOne(req.params.id));
        } catch (error) {
            log.detail('ERROR', 'Delete Content', error);
            return response.send(res, error);
        }
    },
    getCategories(req, res) {
        content.getCategories(req.params.id)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'Get all Categories for one content id', error);
                return response.send(res, error);
            });
    },
    getContentByCategory(req, res) {
        content.getContentByCategory(req.params.name)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'Get Content by Category', error);
                return response.send(res, error);
            });
    },
    searchContent(req, res) {
        const active = req.query.active || true;
        content.searchContent(req.query.q, active)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'Search Content', error);
                return response.send(res, error);
            });
    },
    returnAllCategories(req, res) {
        content.returnAllCategories()
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'Return all categories', error);
                return response.send(res, error);
            });
    },
    returnOneCategory(req, res) {
        content.returnOneCategory(req.params.id)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'Return one category', error);
                return response.send(res, error);
            });
    },
    returnOneCategoryByName(req, res) {
        content.returnOneCategoryByName(req.params.name)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'returnOneCategoryByName', error);
                return response.send(res, error);
            });
    },
    searchCategory(req, res) {
        content.searchCategory(req.query.q)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'searchCategory', error);
                return response.send(res, error);
            });
    },
    createCategory(req, res) {
        content.createCategory(req.body)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'createCategory', error);
                return response.send(res, error);
            });
    },
    removeOneCategory(req, res) {
        content.removeOneCategory(req.params.id)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'removeOneCategory', error);
                return response.send(res, error);
            });
    },
    publicServe(req, res, next) {
        content.returnOneBySlug(req.params.slug)
            .then(output => res.send(output.data.content))
            .catch((error) => {
                next();
            });
    },
    // images...
    addImage(req, res) {
        try {
            const s3Client = new AWS.S3({
                accessKeyId: config.S3_KEY,
                secretAccessKey: config.S3_SECRET
            });
            const dateNow = `${Date.now()}-${uid(10)}`;
            if (!req.file) response.send(res, { code: 400, data: { message: 'The file you attempted to upload was not defined', fields: req.body } });
            if (!req.body.description) return response.send(res, send.fail422('Missing Description'));
            if (!req.body.name) return response.send(res, send.fail422('Missing Name'));
            return s3Client.upload({
                Bucket: config.S3_BUCKET,
                Key: `${req.user._id}_${req.body.name}_${dateNow}_${req.file.originalname}`,
                ACL: 'public-read',
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            }, async (error, data) => {
                if (error) throw error;
                const options = {
                    name: `${req.user._id}_${req.body.name}_${dateNow}` || `${req.user._id}_${dateNow}`,
                    description: req.body.description || null,
                    product: req.body.product || undefined,
                    domain: req.body.domain || undefined,
                    url: data.Location,
                    owner: req.user._id,
                    tags: req.body.tag,
                    meta: data
                };
                if (fs.existsSync(req.file.path)) {
                    console.info(`File Found. Deleting ${req.file.path} as cleanup now.`);
                    fs.unlinkSync(req.file.path);
                }
                return response.send(res, await images.addImage(options));
            });
        } catch (error) {
            log.detail('ERROR', 'addImage', error);
            return response.send(res, error);
        }
    },
    imageProxy(req, res) {
        images.getImageInfoBySlug(req.params.slug)
            .then(output => request.get(output.data.url).pipe(res))
            .catch((error) => {
                log.detail('ERROR', 'imageProxy', error);
                return response.send(res, error);
            });
    },
    getImage(req, res) {
        images.getImageInfo(req.params.id)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'getImage', error);
                return response.send(res, error);
            });
    },
    updateImage(req, res) {
        images.getImageInfo(req.params.id)
            .then((img) => {
                if (req.user._id !== img.owner && req.user.role !== 1) return send.fail401();
                return images.updateImage(req.params.id, req.body);
            })
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'updateImage', error);
                return response.send(res, error);
            });
    },
    removeImage(req, res) {
        // leaving S3 alone...
        images.getImageInfo(req.params.id)
            .then((img) => {
                if (req.user._id !== img.owner && req.user.role !== 1) return send.fail401();
                return images.removeImage(req.params.id);
            })
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'removeImage', error);
                return response.send(res, error);
            });
    },
    getImages(req, res) {
        images.getAllImages()
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'getImages', error);
                return response.send(res, error);
            });
    },
    searchImages(req, res) {
        images.searchImages(req.query.q)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'searchImages', error);
                return response.send(res, error);
            });
    },
    addImageCategory(req, res) {
        images.getImageInfo(req.params.id)
            .then((img) => {
                if (req.user._id !== img.owner && req.user.role !== 1) return send.fail401();
                return content.returnOneCategoryByName(req.body.name);
            })
            .then((result) => {
                if (result.code) return result;
                if (!result) return send.fail404('The category you are attempting to add, does not exist. Please add it to the system first.');
                return images.addImageCategory(req.params.id, { name: result.data.name, description: result.data.description });
            })
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'addImageCategory', error);
                return response.send(res, error);
            });
    },
    removeImageCategory(req, res) {
        images.getImageInfo(req.params.id)
            .then((img) => {
                if (req.user._id !== img.owner && req.user.role !== 1) return send.fail401();
                return content.returnOneCategoryByName(req.params.name);
            })
            .then((result) => {
                if (result.code) return result;
                if (!result) return send.fail404('The category you are attempting to add, does not exist. Please add it to the system first.');
                return images.removeImageCategory(req.params.id, req.params.name);
            })
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'removeImageCategory', error);
                return response.send(res, error);
            });
    },
    getImageCategories(req, res) {
        images.getImageCategories(req.params.id)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'getImageCategories', error);
                return response.send(res, error);
            });
    },
    getImagesByCategory(req, res) {
        images.getImagesByCategory(req.params.name)
            .then(output => response.send(res, output))
            .catch((error) => {
                log.detail('ERROR', 'getImagesByCategory', error);
                return response.send(res, error);
            });
    }
};

function uid(len) {
    const buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charlen = chars.length;

    for (let i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default contentApi;
