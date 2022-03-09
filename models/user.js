const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:String,
    createdAt:{type:Date,default:Date.now},
    password:String,
    mobile:String,
    avatar:{type:String,default:"http://www.smartpowerdrink.com/pub/skin/default-skin/img/avatar.png"},
    firstName:String,
    lastName:String,
    passcode:Number,
    isBusiness:{type:Boolean,default:false},
    isApproved:{type:Boolean,default:false},
    isLocked:{type:Boolean,default:false}
})

module.exports = mongoose.model('User',userSchema);