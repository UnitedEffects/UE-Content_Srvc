/**
 * Created by borzou on 5/25/17.
 */
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var searchPlugin = require('mongoose-search-plugin');

var imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: false
    },
    created: {
        type: Date,
        default: Date.now()
    },
    url: {
        type: String,
        required: true
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
    meta: {
        type: Object,
        required: false
    }
});

imageSchema.pre('save', function(callback) {
    return callback();
});

imageSchema.plugin(searchPlugin, {
    fields: ['name', 'description', 'tags']
});

// Export the Mongoose model
module.exports = mongoose.model('Images', imageSchema);