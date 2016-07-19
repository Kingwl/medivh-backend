const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },

    isDelete: { type: Boolean, default: false },
    readCount: { type: Number, default: 0 },

    title: { type: String, default: '' },
    url: { type: String, default: '' },
    content: { type: String, default: '' },
    reply: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reply',
            default: []
        }
    ],
    tag: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
            default: []
        }
    ],
});

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;