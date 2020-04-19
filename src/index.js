import express from 'express';

const swagger = require('./swagger').default;

const config = require('./config');

const router = express.Router();
const pJson = require('../package.json');

router.get('/', (req, res) => {
    let maintainer = 'bmotlagh@unitedeffects.com';
    if (pJson.contributors) maintainer = pJson.contributors[0].email;
    res.render('index', {
        maintainer,
        title: 'UE Content Service'
    });
});

router.get('/swagger.json', (req, res) => {
    try {
        const swag = swagger;
        swag.info.version = pJson.version;
        swag.info.description = swag.info.description.replace('{{IMPLEMENTER}}', config.IMPLEMENTER);
        if (config.SWAGGER) swag.servers = [{ url: `${config.PROTOCOL}://${config.SWAGGER}/api` }];
        res.json(swag);
    } catch (error) {
        console.info(error);
        res.json(swagger);
    }
});

export default router;
