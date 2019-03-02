import mongoose from 'mongoose';
import moment from 'moment';
import uuid from 'uuidv4';

mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const contentSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: moment().format()
    },
    guid: {
        type: String,
        default: uuid,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    product: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    labels: [String],
    content: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: true
    },
    authRequired: {
        type: Boolean,
        default: false
    },
    internalDescription: String
}, { versionKey: false });

contentSchema.pre('save', callback => callback());

contentSchema.index({
    title: 'text',
    internal_description: 'text',
    labels: 'text',
    content: 'text'
});

export default mongoose.model('Content', contentSchema);
