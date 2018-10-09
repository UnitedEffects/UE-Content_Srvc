import mongoose from 'mongoose';
mongoose.Promise = Promise;
import searchPlugin from 'mongoose-search-plugin';

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pretty_name: String,
    type: {
        type: String,
        default: 'content'
    },
    description: {
        type: String,
        required: true
    }
});

categoriesSchema.pre('save', callback => callback());

categoriesSchema.plugin(searchPlugin, {
    fields: ['name', 'type', 'description']
});

export default mongoose.model('Categories', categoriesSchema);