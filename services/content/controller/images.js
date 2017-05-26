/**
 * Created by borzou on 5/25/17.
 */
var Promise = require('bluebird');
var Images = Promise.promisifyAll(require('../model/images'));
var send = require('../../callback');

var imageFactory = {
    addImage: function(options, cb){
        options["slug"] = options.name.trim().toLowerCase().replace(/ /g, "_").replace(/\./g, "").replace(/!/g, "").replace(/\?/g, "").replace(/{/g, "").replace(/}/g, "");
        var image = new Images(options);

        image.saveAsync()
            .then(function(saved){
                return cb(null, send.success(saved));
            })
            .catch(function (err) {
                if(err.code==11000) return cb(send.fail409("An image with this name already exists"), null);
                return cb(send.failErr(err), null);
            });
    },
    updateImage: function(id, options, cb){
        Images.findOneAndUpdate({_id: id}, options, {new:true})
            .then(function(saved){
                if(!saved) cb (send.fail404("Image not found"), null);
                return cb(null, send.success(saved));
            })
            .catch(function (err) {
                if(err.code==11000) return cb(send.fail409("An image with this name already exists"), null);
                return cb(send.failErr(err), null);
            });
    },
    removeImage: function(id, cb){
        Images.findOneAndRemove({_id: id})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function (err) {
                return cb(send.failErr(err), null);
            });

    },
    getImageInfo: function(id, cb){
        Images.findOne({_id: id})
            .then(function(result){
                if(!result) cb(send.fail404("Image Not Found"), null);
                return cb(null, send.success(result));
            })
            .catch(function (err) {
                return cb(send.failErr(err), null);
            });
    },
    getImageInfoBySlug: function(slug, cb){
        Images.findOne({slug: slug})
            .then(function(result){
                if(!result) cb(send.fail404("Image Not Found"), null);
                return cb(null, send.success(result));
            })
            .catch(function (err) {
                return cb(send.failErr(err), null);
            });
    },
    getAllImages: function(cb){
        Images.find({})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function (err) {
                return cb(send.failErr(err), null);
            });
    },
    searchImages: function(q, cb){
        Images.searchAsync(q, {name: 1, description: 1, tags: 1}, {conditions: {name: {$exists: true}}, sort: {name: 1}, limit: 100})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
}

module.exports = imageFactory;