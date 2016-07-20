const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },

    name: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    },
    index: Number,
    replyTo: {
        type: Number,
        default: 0,
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
    }
});

const Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply;