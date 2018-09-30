/**
 * Created by borzou on 10/23/16.
 */

var Promise = require('bluebird');
var Log = Promise.promisifyAll(require('../model/log'));
var send = require('../../callback');

var logFactory = {
    enterLog: function(options, cb){
        var log = new Log({
            message: options.message,
            code: options.code,
            data: options.data
        });

        log.saveAsync()
            .then(function(saved){return cb(null, send.successSaved(saved));})
            .catch(function (err) {return cb(send.failErr(err), null);});

    },
    asyncEnterLog: function(message, code, data){
        var log = new Log({
            message: message,
            code: code,
            data: data
        });

        log.saveAsync()
            .then(function(saved){
                //return cb(null, send.successSaved(saved));
            })
            .catch(function (err) {
                console.log(err);
                //return cb(send.failErr(err), null);
            });
    },
    simpleLog: function(data){
        var log = new Log({
            message: data,
            code: 'NOTIFICATION'
        });

        log.save(function(err){
            if(err) console.log(err);
        });
    },
    getLogs: function(cb){
        Log.findAsync({})
            .then(function(logs){
                return cb(null, send.success(logs));
            })
            .catch(function(err){
                return cb(send.failErr(err), null);
            });
    },
    getLogsRange: function(options, cb){
        var greater = Date.parse(options.greater);
        var less = Date.parse(options.less);
        Log.findAsync({"created_on": {"$gte": greater, "$lt": less}})
            .then(function(logs){
                return cb(null, send.success(logs));
            })
            .catch(function(err){
                return cb(send.failErr(err), null);
            });
    },
    getCode: function(options, cb){
        Log.findAsync({code: options.code})
            .then(function(logs){
                return cb(null, send.success(logs));
            })
            .catch(function(err){
                return cb(send.failErr(err), null);
            });
    }
};

module.exports = logFactory;