/**
 * Created by borzou on 5/25/17.
 */

const config = {
    ENV: process.env.NODE_ENV || 'dev',
    SWAGGER: process.env.SWAGGER || 'localhost:3010',
    MONGO: process.env.MONGO || 'mongodb://localhost:27017/ue-content',
    REPLICA: process.env.REPLICA || 'rs0',
    UEAUTH: process.env.UEAUTH || 'https://domainqa.unitedeffects.com',
    PRODUCT_SLUG: process.env.PRODUCT_SLUG || 'united_effects_auth',
    S3_KEY: process.env.S3_KEY || 'YOURS3KEY',
    S3_SECRET: process.env.S3_SECRET || 'YOURS3SECRET',
    S3_BUCKET: process.env.S3_BUCKET || 'ue-platform-content'
};

module.exports = config;
