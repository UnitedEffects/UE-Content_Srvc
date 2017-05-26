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
    returnOneBySlugSecure: function(req, res){
        content.returnOneBySlugSecureAsync(req.params.slug)
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
        if(req.user.role!=1) return response.sendUnauthorized(res);
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
    },
    publicServe: function(req, res, next){
        content.returnOneBySlugAsync(req.params.slug)
            .then(function(output){
                return res.send(output.data.content);
            })
            .catch(function(error){
                next();
            })
    },
    //images...
    addImage: function(req, res){
        var s3Client = new AWS.S3({
            accessKeyId: config.S3_Key,
            secretAccessKey: config.S3_Secret
        });

        var form = new multipart.Form();

        form.parse(req, function(error, fields, files){
            var myFile = files.file[0];
            var metaData = getContentTypeByFile(myFile.originalFilename);
            s3Client.upload({
                Bucket: config.S3_Bucket,
                Key: myFile.originalFilename,
                ACL: 'public-read',
                Body: fs.createReadStream(myFile.path),
                ContentType: metaData
            }, function (err, data) {
                if (err) return response.sendJson(res, send.failErr(err));
                if (!fields.description) return response.sendJson(res, send.fail417('Missing Description'));
                if (!fields.name) return response.sendJson(res, send.fail417('Missing Description'));
                fs.unlinkSync(myFile.path);
                var options = {
                    name: fields.name[0] || null,
                    description: fields.description[0] || null,
                    url: data.Location,
                    owner: req.user._id,
                    tags: fields.tag[0],
                    meta: data
                };
                images.addImageAsync(options)
                    .then(function(output){
                        return response.sendJson(res, output);
                    })
                    .catch(function(error){
                        return response.sendJson(res, error);
                    })
            });
        })
    },
    imageProxy: function(req, res){
        images.getImageInfoBySlugAsync(req.params.slug)
            .then(function(output){
                return request.get(output.data.url).pipe(res);
            })
            .catch(function(error){
                return response.sendJson(res, error);
            })
    },
    getImage: function(req, res){
        images.getImageInfoAsync(req.params.id)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                return response.sendJson(res, error);
            })
    },
    updateImage: function(req, res){
        images.getImageInfoAsync(req.params.id)
            .then(function(img){
                if(req.user.role!=1 && req.user._id!=img.owner) return send.fail401();
                return images.updateImageAsync(req.params.id, req.body)
            })
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                return response.sendJson(res, error);
            })
    },
    removeImage: function(req, res){
        //leaving S3 alone...
        images.getImageInfoAsync(req.params.id)
            .then(function(img){
                if(req.user.role!=1 && req.user._id!=img.owner) return send.fail401();
                return images.removeImageAsync(req.param.id)
            })
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                return response.sendJson(res, error);
            })
    },
    getImages: function(req, res){
        images.getAllImagesAsync()
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                return response.sendJson(res, error);
            })
    },
    searchImages: function(req, res){
        images.searchImagesAsync(req.query.q)
            .then(function(output){
                return response.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return response.sendJson(res, error);
            })
    }
};

function getContentTypeByFile(fileName) {
    var rc = 'application/octet-stream';
    var fn = fileName.toLowerCase();

    if (fn.indexOf('.html') >= 0) rc = 'text/html';
    else if (fn.indexOf('.css') >= 0) rc = 'text/css';
    else if (fn.indexOf('.json') >= 0) rc = 'application/json';
    else if (fn.indexOf('.js') >= 0) rc = 'application/x-javascript';
    else if (fn.indexOf('.png') >= 0) rc = 'image/png';
    else if (fn.indexOf('.jpg') >= 0) rc = 'image/jpg';

    return rc;
}

module.exports = postCardApi;