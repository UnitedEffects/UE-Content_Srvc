import mongoose from 'mongoose';
mongoose.Promise = Promise;
import moment from 'moment';
import searchPlugin from 'mongoose-search-plugin';

// Define our user schema
const contentSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: moment().format()
    },
    owner: mongoose.Schema.Types.ObjectId,
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
    /**
     * Path is depreciated
     */
    path: {
        type: String,
        required: false,
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
        default: true
    },
    active:{
        type: Boolean,
        default: true
    },
    auth_required: {
        type: Boolean,
        default: false
    },
    categories:[
        {
            name: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            }
        }
    ],
    internal_description: {
        type: String,
        required: false
    }
});

contentSchema.pre('save', callback => callback());

contentSchema.plugin(searchPlugin, {
    fields: ['title', 'internal_description', 'content']
});

export default mongoose.model('Content', contentSchema);