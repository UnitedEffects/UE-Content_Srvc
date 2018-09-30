/**
 * Created by borzou on 10/23/16.
 */
var helper = require('../../helper');
var Promise = require('bluebird');
var Log = Promise.promisifyAll(require('./log'));

var logApi = {
    newLog: function(req, res){
        Log.enterLogAsync(req.body)
            .then(function(output){
                helper.sendJson(res, output)})
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                helper.sendJson(res, error);
            });
    },
    returnLogs: function(req, res){
        Log.getLogsAsync()
            .then(function(output){
                helper.sendJson(res, output)})
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                helper.sendJson(res, error);
            });
    },
    returnRange: function(req, res){
        Log.getLogsRangeAsync(req.body)
            .then(function(output){
                helper.sendJson(res, output)})
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                helper.sendJson(res, error);
            });
    }
};

module.exports = logApi;