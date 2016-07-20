const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    name: String,
    article: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Article',
            default: []
        }
    ]
});

const Tag = mongoose.model('Tag', TagSchema);
module.exports = Tag;