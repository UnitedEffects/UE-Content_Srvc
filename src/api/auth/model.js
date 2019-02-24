/**
 * Created by borzou on 9/27/16.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const tokenSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true,
        index: true
    },
    product_slug: {
        type: String,
        required: true
    },
    domain_slug: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    created: {
        type: Date,
        required: true,
        expires: '12h'
    }
});

// Execute before each user.save() call
tokenSchema.pre('save', function ps(callback) {
    const token = this;

    // Break out if the password hasn't changed
    if (!token.isModified('value')) return callback();

    // Password changed so we need to hash it
    return bcrypt.genSalt(5, (err, salt) => {
        if (err) return callback(err);

        bcrypt.hash(token.value, salt, null, (err, hash) => {
            if (err) return callback(err);
            token.value = hash;
            return callback();
        });
    });
});

tokenSchema.methods.verifyToken = function vt(token, callback) {
    bcrypt.compare(token, this.value, (err, isMatch) => {
        if (err) return callback(err);
        return callback(null, isMatch);
    });
};

tokenSchema.methods.verifyTokenAsync = async function vt(token) {
    return bcrypt.compare(token, this.value, (err, isMatch) => {
        if (err) throw err;
        return isMatch;
    });
};

// Export the Mongoose model
export default mongoose.model('Token', tokenSchema);
