var express = require('express');
var authApi = require('../services/auth/controller/api');
var config = require('../config');
var contentApi = require('../services/content/controller/api');
var router = express.Router();
var helper = require('../services/helper');
const pack = require('../package.json');

/* GET api listing. */
router.get('/', function(req, res, next) {
    res.json( {
        err: null,
        message: {
            api: 'UE-PC-Content_Srvc',
            version: pack.version,
            baseURL: '/api',
            copyright: 'Copyright (c) 2018 United Effects LLC'
        }
    });
});

//Postcards
router.post('/content', authApi.isChainedSocialBearer, contentApi.create); //admin only
router.get('/content/:id', authApi.isChainedSocialBearer, contentApi.returnOne); //logged in user
router.get('/content/:slug', authApi.isChainedSocialBearer, contentApi.returnOneBySlugSecure);
router.get('/content/public/:slug', contentApi.returnOneBySlug);
router.get('/content', authApi.isChainedSocialBearer, contentApi.returnAll); //logged in user
router.patch('/content/:id', authApi.isChainedSocialBearer, contentApi.patchOne); //admin only
router.delete('/content/:id', authApi.isChainedSocialBearer, contentApi.deleteOne); //admin only
router.put('/content/:id/category', authApi.isChainedSocialBearer, contentApi.addCategory); //admin only
router.patch('/content/:id/category/:name', authApi.isChainedSocialBearer, contentApi.removeCategory); //admin only
router.get('/content/:id/categories', authApi.isChainedSocialBearer, contentApi.getCategories); //logged in
router.get('/content/category/:name', authApi.isChainedSocialBearer, contentApi.getContentByCategory); //logged in
router.get('/search', authApi.isChainedSocialBearer, contentApi.searchContent); //logged in

//categories
router.post('/category', authApi.isChainedSocialBearer, contentApi.createCategory);
router.get('/categories', authApi.isChainedSocialBearer, contentApi.returnAllCategories);
router.get('/category/:id', authApi.isChainedSocialBearer, contentApi.returnOneCategory);
router.delete('/category/:id', authApi.isChainedSocialBearer, contentApi.removeOneCategory);
router.get('/category/name/:name', authApi.isChainedSocialBearer, contentApi.returnOneCategoryByName);
router.get('/categories/search', authApi.isChainedSocialBearer, contentApi.searchCategory);


//images
router.post('/image', authApi.isChainedSocialBearer, contentApi.addImage);
router.patch('/image/:id', authApi.isChainedSocialBearer, contentApi.updateImage);
router.delete('/image/:id', authApi.isChainedSocialBearer, contentApi.removeImage);
router.get('/image/:id', contentApi.getImage);
router.get('/images', contentApi.getImages);
router.get('/images/search', contentApi.searchImages);
router.get('/img/:slug', contentApi.imageProxy);

router.put('/image/:id/category', authApi.isChainedSocialBearer, contentApi.addImageCategory);
router.patch('/image/:id/category/:name', authApi.isChainedSocialBearer, contentApi.removeImageCategory);
router.get('/image/:id/categories', contentApi.getImageCategories); //todo
router.get('/images/category/:name', contentApi.getImagesByCategory); //todo


//healthcheck
router.get('/health', function(req, res){
    res.json({err: null, data: {server: 'running'}});
});
router.get('/health/admin', authApi.isChainedSocialBearer, function(req, res){
    if(req.user.role!=1) res.status(401).send('Unauthorized');
    res.json({err: null, data: {server: 'running', mongo: helper.mongoStatus()}});
});



module.exports = router;