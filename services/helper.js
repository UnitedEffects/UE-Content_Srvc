/**
 * Created by borzou on 9/27/16.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var conn = mongoose.connection;

var helpers = {
    sendJson: function(res, output){
        var status;
        if(output.err==null)status=200;
        else status=output.err;
        if(output.message!=null)res.status(status).json({err: output.err, data: output.data, message: output.message});
        else res.status(status).json({err: output.err, data: output.data});
    },
    sendUnauthorized: function(res){
        res.status(401).send('Unauthorized');
    },
    mongoStatus: function(){
        return {
            config: conn.config,
            replica: conn.replica,
            name: conn.name,
            options: conn.options,
            readyState: conn._readyState,
            opened: conn._hasOpened
        }
    },
    isJson: function(check){
        try {
            var thisJSON = JSON.parse(check);
            return true;
        } catch(e) {
            return false;
        }
    }
};

module.exports = helpers;