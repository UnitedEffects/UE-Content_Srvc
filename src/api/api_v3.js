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

// content
router.post('/content', [auth.isBearerAuthenticated, auth.middleAny, schemaCheck], contentApi.create);
router.get('/content', [allowAnon, auth.isOptionalAuthenticated], contentApi.returnAll);
router.get('/content/:guid', [allowAnon, auth.isOptionalAuthenticated], contentApi.returnOne);
router.patch('/content/:guid', [auth.isBearerAuthenticated, schemaCheck], contentApi.patchOne);
router.delete('/content/:guid', [auth.isBearerAuthenticated], contentApi.deleteOne);
/*
// images
router.post('/image', [auth.isBearerAuthenticated, auth.middleAny, schemaCheck, upload.single('file')], contentApi.addImage); //todo ensure prod/dom required
router.patch('/image/:guid', [auth.isBearerAuthenticated, schemaCheck], contentApi.updateImage); //prev :id todo own only or admin
router.delete('/image/:guid', [auth.isBearerAuthenticated], contentApi.removeImage); //prev :id, make hard delete todo own only or admin
router.get('/image/:guid', [allowAnon, auth.isOptionalAuthenticated], contentApi.getImage); //prev :id
router.get('/images/:product/:domain', [allowAnon, auth.isOptionalAuthenticated], contentApi.getImages); //prev no domain/product

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
