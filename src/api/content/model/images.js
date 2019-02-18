import mongoose from 'mongoose';
import uuid from 'uuidv4';
import moment from 'moment';

mongoose.Promise = Promise;

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    guid: {
        type: String,
        default: uuid,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    labels: {
        type: [String],
        required: false
    },
    created: {
        type: Date,
        default: moment().format()
    },
    url: {
        type: String,
        required: true
    },
    meta: {
        type: Object,
        required: false
    }
});

imageSchema.pre('save', callback => callback());

imageSchema.index({
    name: 'text',
    description: 'text',
    labels: 'text'
});

// Export the Mongoose model
export default mongoose.model('Images', imageSchema);