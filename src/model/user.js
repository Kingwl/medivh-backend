import Mongoose from 'mongoose';

class User extends Mongoose.Schema {
    constructor() {
        super({
            createTime: Date,
            updateTime: Date,
            name: String,
            encrypted_password: String,
            male: Number,
            age: Number,
            articles: [
                {
                    type: this.Types.ObjectId,
                    ref: 'Articles'
                }
            ]
        })
    }
};

export default Mongoose.model('User', new User());
