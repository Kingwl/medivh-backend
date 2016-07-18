const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
    
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