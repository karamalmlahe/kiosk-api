const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    associatedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    storeName: String,
    isTakeaway: Boolean,
    isDelivery: Boolean,
    subs:[
        {
            associatedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        }
    ],
    contactInfo: {
        email: String,
        mobile: String,
        phone: String,
        city: String,
        address: String,
        latitude: String,
        longtitude: String
    },
    reviews: [
        {
            accountId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            reviewContext: String,
            createdAt: { type: Date, default: Date.now },
            rank:Number,
            isPublished: Boolean,
        }
    ],
    workingHours: [
        {
            day: Number,
            fromHour: String,
            toHour: String,
            isOpen: Boolean,
        }
    ],
    storeDescription: String,
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    logo: { type: String, default: "http://www.smartpowerdrink.com/pub/skin/default-skin/img/avatar.png" },
    isLocked: { type: Boolean, default: false }
})

module.exports = mongoose.model('Store', storeSchema);