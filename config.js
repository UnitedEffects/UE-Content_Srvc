/**
 * Created by borzou on 1/29/17.
 */

var config = {
    defaultMongo: (process.env.MONGO) ? process.env.MONGO : 'mongodb://localhost:27017/ue-content',
    swaggerDomain: (process.env.SWAG_DOM) ? process.env.SWAG_DOM : 'localhost:3010',
    authApiServer: (process.env.DOMAIN) ? process.env.DOMAIN : 'http://localhost:4010',
    userApiServer: (process.env.USERAUTH) ? process.env.USERAUTH : 'https://userauth.freedompostcards.com',//http://localhost:4000',
    replica: process.env.REPLICA
};

module.exports = config;