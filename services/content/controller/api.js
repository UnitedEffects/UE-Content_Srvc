/**
 * Created by borzou on 2/4/17.
 */

var response = require('../../helper');
var Promise = require('bluebird');
var content = Promise.promisifyAll(require('./content'));
var config = require('../../../config');

var postCardApi = {
    create: function(req, res){
        if(req.user.role!=1) return response.sendUnauthorized(res);
        content.createAsync(req.body)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
   returnOne: function(req, res, next){
        content.returnOneAsync(req.params.id)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                return next();
            })
    },
    returnOneBySlug: function(req, res){
        content.returnOneBySlugAsync(req.params.slug)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    returnAll: function(req, res){
        var tag = (req.query.tag) ? req.query.tag : null;
        content.returnAllAsync(tag)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    patchOne: function(req, res){
        if(req.user.role!=1) return response.sendUnauthorized(res);
        if(req.body.categories) delete req.body.categories;
        content.patchOneAsync(req.params.id, req.body)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    addCategory: function(req, res){
        if(req.user.role!=1) return response.sendUnauthorized(res);
        content.returnOneCategoryByNameAsync(req.body.name)
            .then(function(result){
                if(!result) return resonse.sendJson(res, {err: 404, data: 'The category you are attempting to add, does not exist. Please add it to the system first.'});
                return content.addCategoryAsync(req.params.id, {name: result.data.name, description: result.data.description})
            })
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    removeCategory: function(req, res){
        if(req.user.role!=1) return response.sendUnauthorized(res);
        content.removeCategoryAsync(req.params.id, req.params.name)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    deleteOne: function(req, res){
        if(!req.user) return response.sendUnauthorized(res);
        content.deleteOneAsync(req.params.id)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    getCategories: function(req, res){
        content.getCategoriesAsync(req.params.id)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    getContentByCategory: function(req, res){
        content.getContentByCategoryAsync(req.params.name)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    searchContent: function(req, res){
        var active = (req.query.active) ? req.query.active : true;
        content.searchContentAsync(req.query.q, active)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    returnAllCategories: function(req, res){
        content.returnAllCategoriesAsync()
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    returnOneCategory: function(req, res){
        content.returnOneCategoryAsync(req.params.id)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    returnOneCategoryByName: function(req, res){
        content.returnOneCategoryByNameAsync(req.params.name)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    searchCategory: function(req, res){
        content.searchCategoryAsync(req.query.q)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    createCategory: function(req, res){
        if(req.user.role!=1) return response.sendUnauthorized(res);
        content.createCategoryAsync(req.body)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    },
    removeOneCategory: function(req, res){
        if(req.user.role!=1) return response.sendUnauthorized(res);
        content.removeOneCategoryAsync(req.params.id)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    }
};

module.exports = postCardApi;