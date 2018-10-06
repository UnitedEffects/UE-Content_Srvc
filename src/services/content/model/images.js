
import mongoose from 'mongoose';
mongoose.Promise = Promise;
import searchPlugin from 'mongoose-search-plugin';

const imageSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
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
            id: {
                type: String,
                required: true
            }
        }
    ],
    meta: {
        type: Object,
        required: false
    }
});

imageSchema.pre('save', callback=>callback());

imageSchema.plugin(searchPlugin, {
    fields: ['name', 'description', 'tags']
});

// Export the Mongoose model
export default mongoose.model('Images', imageSchema);