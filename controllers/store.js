const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const isAuth = require("./isAuth");
const Store = require("./../models/store");
const user = require("./../models/user");


router.put('/updateStore',isAuth,async (req, res)=>{
  const{storeName,isTakeaway,isDelivery,email,mobile,phone,city,address,latitude,longtitude,storeDescription,logo,workingHours}=req.body;
  const associatedId=req.account._id;
  const store =await Store.findOne({associatedId: associatedId})
  .then((updateStore)=>{
    if(updateStore){
      const findEmail=Store.findOne({"contactInfo.email":email})
      .then(emailIsExists=>{
        if(!emailIsExists || updateStore.contactInfo.email===email){
          updateStore.storeName=storeName;
          updateStore.isTakeaway=isTakeaway;
          updateStore.isDelivery=isDelivery;
          updateStore.contactInfo={
            email:email,
            mobile:mobile,
            phone:phone,
            city:city,
            address:address,
            latitude:latitude,
            longtitude:longtitude,
          }
          updateStore.storeDescription=storeDescription;
          updateStore.logo=logo;
          updateStore.workingHours=workingHours;
          updateStore.updateAt=Date.now();
          return updateStore.save()
          .then((store_updated)=>{
            return res.status(200).json({
              message:store_updated,
            });
          })
          .catch(err=>{
            return res.status(500).json({
              message: err,
            });
          })
        }
        else{
          return res.status(200).json({
            message: "Email is already exist ,Please try other email",
          });
        }
      })
      .catch(err=>{
        return res.status(500).json({
          message: err,
        });
      })
    }
    else{
      return res.status(200).json({
        message: "This Store not found",
      });
    }
  })
  .catch((err)=>{
    return res.status(500).json({
      message: err,
    });
  })

});

router.post("/createStore", isAuth, async (req, res) => {
  const isStoreExist = await Store.findOne({ associatedId: req.account._id });
  if (isStoreExist) {
    return res.status(200).json({
      message: `You Have a store`,
    });
  } else {
    const _store = new Store({
      _id: mongoose.Types.ObjectId(),
      associatedId: req.account._id,
      storeName: req.body.storeName,
      isTakeaway: req.body.isTakeaway,
      isDelivery: req.body.isDelivery,
      subs: [],
      contactInfo: {
        email: req.body.contactInfo.email,
        mobile: req.body.contactInfo.mobile,
        phone: req.body.contactInfo.phone,
        city: req.body.contactInfo.city,
        address: req.body.contactInfo.address,
        latitude: req.body.contactInfo.latitude,
        longtitude: req.body.contactInfo.longtitude,
      },
      reviews: [],
      workingHours: [],
      storeDescription: req.body.storeDescription,
    });
    _store
      .save()
      .then((store_Schema) => {
        user
          .findById(req.account._id )
          .then((account) => {
            account.isBusiness = true;
            account.save();
          })
          .catch((err) => {
            return res.status(500).json({
              message: err,
            });
          });
        return res.status(200).json({
          message: store_Schema,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          message: err,
        });
      });
  }
});

module.exports = router;
