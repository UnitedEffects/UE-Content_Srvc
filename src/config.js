const env = process.env.NODE_ENV || 'dev';
const envVars = require(`../.env/env.${env}`);

const config = {
    ENV: process.env.NODE_ENV || envVars.NODE_ENV || 'dev',
    SWAGGER: process.env.SWAGGER || envVars.SWAGGER || 'localhost:3010',
    PROTOCOL: process.env.PROTOCOL || envVars.PROTOCOL || 'http',
    MONGO: process.env.MONGO || envVars.MONGO || 'mongodb://localhost:27017/ue-content',
    REPLICA: process.env.REPLICA || envVars.REPLICA || 'rs0',
    UEAUTH: process.env.UEAUTH || envVars.UEAUTH || 'https://domainqa.unitedeffects.com',
    PRODUCT_SLUG: process.env.PRODUCT_SLUG || envVars.PRODUCT_SLUG || 'united_effects_auth',
    S3_KEY: process.env.S3_KEY || envVars.S3_KEY || 'YOURS3KEY',
    S3_SECRET: process.env.S3_SECRET || envVars.S3_SECRET || 'YOURS3SECRET',
    S3_BUCKET: process.env.S3_BUCKET || envVars.S3_BUCKET || 'ue-platform-content',
    IMPLEMENTER: process.env.IMPLEMENTER || envVars.IMPLEMENTER || 'United Effects'
};

module.exports = config;
