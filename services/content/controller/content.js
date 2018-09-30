import Content from '../model/content';
import Category from '../model/categories';
import send from '../../response';

const contentFactory = {
    create (options){
        return new Promise((resolve, reject) => {
            options["slug"] = options.title.trim().toLowerCase().replace(/ /g, "_").replace(/\./g, "").replace(/!/g, "").replace(/\?/g, "").replace(/{/g, "").replace(/}/g, "");
            const content = new Content(options);
            content.save()
                .then(saved => resolve(send.set200(saved)))
                .catch((err) => {
                    if(err.code===11000) return reject(send.fail409({ message: 'duplicate', request: options }));
                    return reject(send.fail400(err));
                });
        });
    },
    returnOne (id){
        return new Promise((resolve, reject) => {
            Content.findOne({_id:id})
                .then((result) => {
                    if(!result) return reject(send.fail404('Content not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    returnOneBySlug (slug){
        return new Promise((resolve, reject) => {
            Content.findOne({slug:slug})
                .then((result) => {
                    if(!result) return reject(send.fail404('Content not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    returnAll (tag){
        return new Promise((resolve, reject) => {
            let query = {};
            if(tag) query = {tag:tag};
            Content.find(query)
                .then(result => resolve(send.set200(result)))
                .catch(error => reject(send.fail400(error)));
        });
    },
    patchOne (id, options){
        return new Promise((resolve, reject) => {
            if(options.title) options["slug"] = options.title.trim().toLowerCase().replace(/ /g, "_").replace(/\./g, "").replace(/!/g, "").replace(/\?/g, "").replace(/{/g, "").replace(/}/g, "");
            Content.findOneAndUpdate({_id:id}, options, {new:true})
                .then((result) => {
                    if(!result) return reject(send.fail404('Content not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    deleteOne (id){
        return new Promise((resolve, reject) => {
            Content.findOneAndRemove({_id:id})
                .then((result) => {
                    if(!result) return reject(send.fail404('Content not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    addCategory (id, option){
        return new Promise((resolve, reject) => {
            Content.findOneAndUpdate({_id:id}, {$push:{categories: option}},{new:true})
                .then((result) => {
                    if(!result) return reject(send.fail404('Content not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    removeCategory (id, name){
        return new Promise((resolve, reject) => {
            Content.findOneAndUpdate({_id:id}, {$pull:{categories:{name: name}}},{new:true})
                .then((result) => {
                    if(!result) return reject(send.fail404('Content not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    getContentByCategory (name){
        return new Promise((resolve, reject) => {
            Content.find({'categories.name': name})
                .then(result => resolve(send.set200(result)))
                .catch(error => reject(send.fail400(error)));
        });
    },
    getCategories (id){
        return new Promise((resolve, reject) => {
            Content.findOne({_id:id})
                .then((result) => {
                    if(!result) return reject(send.fail404('Content not found'));
                    return resolve(send.set200(result.categories));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    searchContent (q, active){
        return new Promise((resolve, reject) => {
            Content.search(q, {title: 1, internal_description: 1, message: 1}, {conditions: {active: active}, sort: {title: 1}, limit: 40}, (err,data) => {
                if(err) return reject(send.fail400(err));
                return resolve(send.set200(data.results));
            })
        });
    },
    returnAllCategories (){
        return new Promise((resolve, reject) => {
            Category.find({})
                .then(result => resolve(send.set200(result)))
                .catch(error => reject(send.fail400(error)));
        });
    },
    returnOneCategory (id){
        return new Promise((resolve, reject) => {
            Category.findOne({_id:id})
                .then((result) => {
                    if(!result) return reject(send.fail404('Category not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    returnOneCategoryByName (name){
        return new Promise((resolve, reject) => {
            const sName = name.toLowerCase();
            Category.findOne({name:sName})
                .then((result) => {
                    if(!result) return reject(send.fail404('Category not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    },
    searchCategory (q){
        return new Promise((resolve, reject) => {
            Category.search(q, {name: 1, description: 1}, {conditions: {name: {$exists: true}}, sort: {name: 1}, limit: 40}, (err, data) => {
                if(err) return reject(send.fail400(err));
                return resolve(send.set200(data.results));
            })
        });
    },
    createCategory (option){
        return new Promise((resolve, reject) => {
            option.pretty_name = option.name;
            if(option.type) {
                option.name = `${option.type}: ${option.name}`.toLowerCase();
                option.type = option.type.toLowerCase();
            } else option.name = `content: ${option.name}`.toLowerCase();
            const category = new Category(option);
            category.save()
                .then(result => resolve(send.set200(result)))
                .catch((error) => {
                    if(error.code===11000) return reject(send.fail409({ message: 'duplicate', request: option }));
                    return reject(send.fail400(error))
                });
        });
    },
    removeOneCategory (id){
        return new Promise((resolve, reject) => {
            Category.findOneAndRemove({_id:id})
                .then((result) => {
                    if(!result) return reject(send.fail404('Category not found'));
                    return resolve(send.set200(result));
                })
                .catch(error => reject(send.fail400(error)));
        });
    }
};

module.exports = contentFactory;