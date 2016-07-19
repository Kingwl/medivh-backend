const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
    
    name: String,
    encrypted_password: String,
    male: Number,
    age: Number,
    articles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Article'
        }
    ]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;