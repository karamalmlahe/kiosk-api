const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    productName: String,
    createdAt: { type: Date, default: Date.now },
    productImages:[
        {
            imageSource:String
        }
    ],
    price: Number,
    discount: { type: Number, default: 0},
    unitInStock:Number,
    desclimer: String,
    isAgeLimitation: Boolean
})

module.exports = mongoose.model('Product', ProductSchema);