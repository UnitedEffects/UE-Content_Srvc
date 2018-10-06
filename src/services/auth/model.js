/**
 * Created by borzou on 9/27/16.
 */
import mongoose from 'mongoose';
mongoose.Promise = Promise;
import bcrypt from 'bcrypt-nodejs';

// Define our user schema
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
    product_slug:{
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
tokenSchema.pre('save', function(callback) {
    const token = this;

    // Break out if the password hasn't changed
    if (!token.isModified('value')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, (err, salt) => {
        if (err) return callback(err);

        bcrypt.hash(token.value, salt, null, (err, hash) => {
            if (err) return callback(err);
            token.value = hash;
            callback();
        });
    });
});

tokenSchema.methods.verifyToken = function(token, callback) {
    bcrypt.compare(token, this.value, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// Export the Mongoose model
export default mongoose.model('Token', tokenSchema);