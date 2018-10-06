import express from 'express';
import yaml from 'yamljs';

const config = require('../config');

const router = express.Router();
const pJson = require('../../package.json');
/* GET index page. */
router.get('/', (req, res) => {
    let maintainer = 'bmotlagh@unitedeffects.com';
    if (pJson.contributors) maintainer = pJson.contributors[0].email;
    res.render('index', {
        maintainer,
        title: 'UE Content Service'
    });
});

router.get('/swagger.json', (req, res) =>  {
    try {
        const swag = yaml.load('./swagger.yaml');
        swag.info.version = pJson.version;
        if (process.env.SWAGGER) swag.host = process.env.SWAGGER;
        if (config.ENV.toLowerCase()==='production' || config.ENV.toLowerCase()==='qa') swag.schemes = ['https'];
        res.json(swag);
    } catch (error) {
        console.info(error);
        res.status(400).send(error);
    }

});

export default router;
