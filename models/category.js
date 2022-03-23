const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    categoryName: String,
    createdAt: { type: Date, default: Date.now },
    categoryImage: { type: String, default: "http://www.smartpowerdrink.com/pub/skin/default-skin/img/avatar.png" },
    priority: Number,
})

module.exports = mongoose.model('Category', categorySchema);