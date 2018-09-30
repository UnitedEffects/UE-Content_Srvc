/**
 * Created by borzou on 2/15/17.
 */
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var searchPlugin = require('mongoose-search-plugin');

// Define our user schema
var categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
});

// Execute before each user.save() call
categoriesSchema.pre('save', function(callback) {
    return callback();
});

categoriesSchema.plugin(searchPlugin, {
    fields: ['name', 'description']
});

// Export the Mongoose model
module.exports = mongoose.model('Categories', categoriesSchema);