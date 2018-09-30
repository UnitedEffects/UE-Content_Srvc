import express from 'express';
import log from '../services/log/api';
import auth from '../services/auth/api';
import contentApi from '../services/content/controller/api';

const pJson = require('../package.json');

const router = express.Router();

/**
 * You'll want to change these values
 */
router.get('/', (req,res) => {
    res.json({
        service: 'United Effects - Content Service',
        site: 'https://unitedeffects.com',
        security: 'Secured by UE Auth by United Effects LLC - ueauth.io',
        api: 'REST',
        version: pJson.version,
        currentMaintainers: pJson.contributors
    });
});

//content
router.post('/content', auth.isBearerAuthenticated, contentApi.create);
router.get('/content', auth.isBearerAuthenticated, contentApi.returnAll);
router.get('/content/:id', auth.isBearerAuthenticated, contentApi.returnOne);
router.get('/content/:slug', auth.isBearerAuthenticated, contentApi.returnOneBySlug);
router.get('/content/public/:slug', contentApi.returnOneBySlug);
router.patch('/content/:id', auth.isBearerAuthenticated, contentApi.patchOne);
router.delete('/content/:id', auth.isBearerAuthenticated, contentApi.deleteOne);
router.put('/content/:id/category', auth.isBearerAuthenticated, contentApi.addCategory);
router.patch('/content/:id/category/:name', auth.isBearerAuthenticated, contentApi.removeCategory);
router.get('/content/:id/categories', auth.isBearerAuthenticated, contentApi.getCategories);
router.get('/content/category/:name', auth.isBearerAuthenticated, contentApi.getContentByCategory);
router.get('/content/search', auth.isBearerAuthenticated, contentApi.searchContent);

//categories
router.post('/category', [auth.isBearerAuthenticated, auth.isProductAdmin], contentApi.createCategory);
router.get('/categories', auth.isBearerAuthenticated, contentApi.returnAllCategories);
router.get('/category/:id', auth.isBearerAuthenticated, contentApi.returnOneCategory);
router.delete('/category/:id', [auth.isBearerAuthenticated, auth.isProductAdmin], contentApi.removeOneCategory);
router.get('/category/name/:name', auth.isBearerAuthenticated, contentApi.returnOneCategoryByName);
router.get('/categories/search', auth.isBearerAuthenticated, contentApi.searchCategory);


//images
router.post('/image', auth.isBearerAuthenticated, contentApi.addImage);
router.patch('/image/:id', auth.isBearerAuthenticated, contentApi.updateImage);
router.delete('/image/:id', auth.isBearerAuthenticated, contentApi.removeImage);
router.put('/image/:id/category', auth.isBearerAuthenticated, contentApi.addImageCategory);
router.patch('/image/:id/category/:name', auth.isBearerAuthenticated, contentApi.removeImageCategory);
router.get('/image/:id', contentApi.getImage);
router.get('/images', contentApi.getImages);
router.get('/image/:id/categories', auth.isBearerAuthenticated, contentApi.getImageCategories);
router.get('/images/category/:name', auth.isBearerAuthenticated, contentApi.getImagesByCategory);
router.get('/images/search', auth.isBearerAuthenticated, contentApi.searchImages);

//proxy
router.get('/img/:slug', contentApi.imageProxy);

/**
 * Log API Calls
 */
router.get('/logs', auth.isBearerAuthenticated, log.getLogs);
router.get('/logs/:code', auth.isBearerAuthenticated, log.getLogByCode);
router.get('/logs/:code/:timestamp', auth.isBearerAuthenticated, log.getLog);
router.post('/logs', auth.isBearerAuthenticated, log.writeLog);

export default router;
