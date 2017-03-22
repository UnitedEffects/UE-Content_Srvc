var express = require('express');
var router = express.Router();
var contentApi = require('../services/content/controller/api');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.redirect('/docs');
    res.render('index', {title: 'Content'});
});

router.get('/public/:slug', contentApi.publicServe);

module.exports = router;
