const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    createTime: Date,
    updateTime: Date,

    title: String,
    url: String,
    content: String,
    reply: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reply',
        }
    ],
    tag: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
        }
    ],

    isDelete: Boolean,
    readCount: Number,
});

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;