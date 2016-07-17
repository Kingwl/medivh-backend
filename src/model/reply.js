const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    createTime: Date,
    updateTime: Date,

    name: String,
    content: String,
    index: Number,
    replyTo: Number,
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
    }
});

const Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply;