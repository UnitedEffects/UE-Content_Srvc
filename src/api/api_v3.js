import express from 'express';
import multer from 'multer';
import log from './log/api';
import auth from './auth/api';
import contentApi from './content/api';
import swag from '../swagger';

const { OpenApiValidator } = require('express-openapi-validate');

const schema = new OpenApiValidator(swag);

const storage = multer.memoryStorage();
const upload = multer({ storage });
const pJson = require('../../package.json');

const router = express.Router();

async function schemaCheck(req, res, next) {
    let path = req.route.path;
    await Promise.all(Object.keys(req.params).map((p) => {
        path = path.replace(`:${p}`, `{${p}}`);
    }));
    schema.validate(req.method.toString().toLowerCase(), path.toLowerCase())(req, res, next);
}

function allowAnon(req, res, next) {
    if (!req.headers.authorization) req.headers.authorization = 'bearer anon';
    return next();
}

router.get('/', (req, res) => {
    res.json({
        service: 'United Effects - Content Service',
        site: 'https://unitedeffects.com',
        security: 'Secured by UE Auth by United Effects LLC - ueauth.io',
        api: 'REST',
        version: pJson.version,
        currentMaintainers: pJson.contributors
    });
});

// todo, test api as regular user
// content
router.post('/content', [auth.isBearerAuthenticated, auth.middleAny, schemaCheck], contentApi.create);
/*
router.get('/content/:product/:domain', [allowAnon, auth.isOptionalAuthenticated], contentApi.returnAll); //update swagger (prev /content:), implement with anon/public content, test
router.get('/content/:guid', [allowAnon, auth.isOptionalAuthenticated], contentApi.returnOne); //update swagger (prev /:id), make work with both slug and guid, validate anon/public, test
router.patch('/content/:guid', [auth.isBearerAuthenticated, schemaCheck], contentApi.patchOne); //prev :id, todo own only or admin
router.delete('/content/:guid', [auth.isBearerAuthenticated], contentApi.deleteOne); //prev :id, also make this a hard delete todo own only or admin
router.get('/content/:product/:domain/search', [allowAnon, auth.isOptionalAuthenticated], contentApi.searchContent); //prev /content/search, remove references to plugin, allowAnon

// images
router.post('/image', [auth.isBearerAuthenticated, auth.middleAny, schemaCheck, upload.single('file')], contentApi.addImage); //todo ensure prod/dom required
router.patch('/image/:guid', [auth.isBearerAuthenticated, schemaCheck], contentApi.updateImage); //prev :id todo own only or admin
router.delete('/image/:guid', [auth.isBearerAuthenticated], contentApi.removeImage); //prev :id, make hard delete todo own only or admin
router.get('/image/:guid', [allowAnon, auth.isOptionalAuthenticated], contentApi.getImage); //prev :id
router.get('/images/:product/:domain', [allowAnon, auth.isOptionalAuthenticated], contentApi.getImages); //prev no domain/product
router.get('/images/:product/:domain/search', [allowAnon, auth.isOptionalAuthenticated], contentApi.searchImages); //prev /images/search

// proxy
router.get('/img/:guid', [allowAnon, auth.isOptionalAuthenticated], contentApi.imageProxy); //prev :slug
*/
/**
 * Log API Calls
 */
router.get('/logs', auth.isBearerAuthenticated, log.getLogs);
router.get('/logs/:code', auth.isBearerAuthenticated, log.getLogByCode);
router.get('/logs/:code/:timestamp', auth.isBearerAuthenticated, log.getLog);
router.post('/logs', auth.isBearerAuthenticated, log.writeLog);

export default router;
