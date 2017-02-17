/**
 * Created by borzou on 1/29/17.
 */

var config = {
    defaultMongo: (process.env.MONGO) ? process.env.MONGO : 'mongodb://localhost:27017/ue-content',
    swaggerDomain: (process.env.SWAG_DOM) ? process.env.SWAG_DOM : 'localhost:3010',
    gatewayDomain: (process.env.GATEWAY) ? process.env.GATEWAY : 'localhost:6000',
    userApiServer: (process.env.USERAUTH) ? process.env.USERAUTH : 'http://localhost:4000'
};

module.exports = config;