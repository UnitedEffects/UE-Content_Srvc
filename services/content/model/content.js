/**
 * Created by borzou on 2/4/17.
 */

/**
 * Created by borzou on 9/27/16.
 */
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var moment = require('moment');
var searchPlugin = require('mongoose-search-plugin');

// Define our user schema
var contentSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: moment().format()
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: false,
        unique: true
    },
    path: {
        type: String,
        required: false
    },
    tag: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    },
    active:{
        type: Boolean,
        default: true
    },
    categories:[
        {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: false
            }
        }
    ],
    internal_description: {
        type: String,
        required: true
    }
});

// Execute before each user.save() call
contentSchema.pre('save', function(callback) {
    console.log('content saved');
    return callback();
});

contentSchema.plugin(searchPlugin, {
    fields: ['title', 'internal_description', 'content']
});

// Export the Mongoose model
module.exports = mongoose.model('Content', contentSchema);