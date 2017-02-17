/**
 * Created by borzou on 2/4/17.
 */
var Promise = require('bluebird');
var Content = Promise.promisifyAll(require('../model/content'));
var Category = Promise.promisifyAll(require('../model/categories'));
var send = require('../../callback');
var moment = require('moment');

var postCardFactory = {
    create: function(options, cb){
        options['publish'] = false;
        options['categories'] = [{
            name: 'all',
            description: 'root category'
        }];
        if(!options.slug) options.slug = options.title.replace(" ", "_").toLowerCase();
        else options.slug = options.slug.replace(" ", "_").toLowerCase();
        var content = new Content(options);

        content.saveAsync()
            .then(function(saved){return cb(null, send.success(saved));})
            .catch(function (err) {return cb(send.failErr(err), null);});
    },
    returnOne: function(id, cb){
        Content.findOneAsync({_id:id})
            .then(function(result){
                if(!result) return cb(send.fail404("Content not found: "+id), null);
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    returnOneBySlug: function(slug, cb){
        Content.findOneAsync({slug:slug})
            .then(function(result){
                if(!result) return cb(send.fail404("Content not found: "+slug), null);
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    returnAll: function(cb){
        Content.findAsync({})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    patchOne: function(id, options, cb){
        Content.findOneAndUpdateAsync({_id:id}, options, {new:true})
            .then(function(result){
                if(!result) return cb(send.fail404("ID not found: "+id), null);
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    deleteOne: function(id, cb){
        Content.findOneAndRemoveAsync({_id:id})
            .then(function(result){
                if(!result) return cb(send.fail404("ID not found: "+id), null);
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    addCategory: function(id, option, cb){
        Content.findOneAndUpdateAsync({_id:id}, {$push:{categories: option}},{new:true})
            .then(function(result){
                if(!result) return cb(send.fail404("ID not found: "+id), null);
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    removeCategory: function(id, name, cb){
        Content.findOneAndUpdateAsync({_id:id}, {$pull:{categories:{name: name}}},{new:true})
            .then(function(result){
                if(!result) return cb(send.fail404("ID not found: "+id), null);
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    getContentByCategory: function(name, cb){
        Content.findAsync({'categories.name': name})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    getCategories: function(id, cb){
        Content.findOneAsync({_id:id})
            .then(function(result){
                if(!result) return cb(send.fail404("ID not found: "+id), null);
                return cb(null, send.success(result.categories));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    searchContent: function(q, active, cb){
        Content.searchAsync(q, {title: 1, internal_description: 1, message: 1}, {conditions: {active: active}, sort: {title: 1}, limit: 40})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    returnAllCategories: function(cb){
        Category.findAsync({})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    returnOneCategory: function(id, cb){
        Category.findOneAsync({_id:id})
            .then(function(result){
                if(!result) return cb(send.fail404("ID not found: "+id), null);
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    returnOneCategoryByName: function(name, cb){
        Category.findOneAsync({name:name})
            .then(function(result){
                if(!result) return cb(send.fail404("Name not found: "+name), null);
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    searchCategory: function(q, cb){
        Category.searchAsync(q, {name: 1, description: 1}, {conditions: {name: {$exists: true}}, sort: {name: 1}, limit: 40})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    createCategory: function(option, cb){
        var category = new Category(option);

        category.saveAsync()
            .then(function(saved){return cb(null, send.success(saved));})
            .catch(function (err) {return cb(send.failErr(err), null);});
    },
    removeOneCategory: function(id, cb){
        Category.findOneAndRemove({_id:id})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    }
};

module.exports = postCardFactory;