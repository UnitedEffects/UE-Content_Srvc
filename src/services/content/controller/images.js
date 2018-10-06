import Images from '../model/images';
import send from '../../response';

const imageFactory = {
    addImage (options){
        return new Promise ((resolve, reject) => {
            options["slug"] = options.name.trim().toLowerCase().replace(/ /g, "_").replace(/\./g, "").replace(/!/g, "").replace(/\?/g, "").replace(/{/g, "").replace(/}/g, "");
            const image = new Images(options);

            image.save()
                .then(saved => resolve(send.set200(saved)))
                .catch((err) => {
                    if(err.code===11000) return reject(send.fail409({request: options, error: err, message: "An image with this name already exists"}));
                    return reject(send.fail400(err));
                });
        })
    },
    updateImage (id, options){
        return new Promise((resolve, reject) => {
            Images.findOneAndUpdate({_id: id}, options, {new:true})
                .then((saved) => {
                    if(!saved) return reject(send.fail404("Image not found"));
                    return resolve(send.set200(saved));
                })
                .catch((err) => {
                    if(err.code===11000) return reject(send.fail409("An image with this name already exists"));
                    return reject(send.fail400(err));
                });
        })
    },
    removeImage (id){
        return new Promise((resolve, reject) => {
            Images.findOneAndRemove({_id: id})
                .then((result) => {
                    if(!result) return reject(send.fail404('Image not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        })
    },
    getImageInfo (id){
        return new Promise((resolve, reject) => {
            Images.findOne({_id: id})
                .then((result) => {
                    if(!result) return reject(send.fail404('Image not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    getImageInfoBySlug (slug){
        return new Promise((resolve, reject) => {
            Images.findOne({slug: slug})
                .then((result) => {
                    if(!result) return reject(send.fail404('Image not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    getAllImages (){
        return new Promise((resolve, reject) => {
            Images.find({})
                .then(result => resolve(send.set200(result)))
                .catch(error => reject(send.fail400(error)));
        });
    },
    searchImages (q){
        return new Promise((resolve, reject) => {
            Images.search(q, {name: 1, slug: 1, description: 1, tags: 1, url: 1}, {conditions: {name: {$exists: true}}, sort: {name: 1}, limit: 100}, (err, data) => {
                if(err) return reject(send.fail400(err));
                return resolve(send.set200(data.results));
            })
        });
    },
    addImageCategory (id, option){
        return new Promise((resolve, reject) => {
            Images.findOneAndUpdate({_id:id}, {$push:{categories: option}},{new:true})
                .then((result) => {
                    if(!result) return reject(send.fail404('Image not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    removeImageCategory (id, name){
        return new Promise((resolve, reject) => {
            Images.findOneAndUpdate({_id:id}, {$pull:{categories:{name: name}}},{new:true})
                .then((result) => {
                    if(!result) return reject(send.fail404('Image not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    getImageCategories (id){
        return new Promise((resolve, reject) => {
            Images.findOne({_id:id})
                .then((result) => {
                    if(!result) return reject(send.fail404('Image not found'));
                    return resolve(send.set200(result.categories));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    getImagesByCategory (name){
        return new Promise((resolve, reject) => {
            Images.find({'categories.name': name})
                .then(result=> resolve(send.set200(result)))
                .catch(error => reject(send.fail400(error)));
        });
    }
};

module.exports = imageFactory;