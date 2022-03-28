const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const isAuth = require("./isAuth");
const store = require("./../models/store");
const user = require("./../models/user");

router.post("/createStore", isAuth, async (req, res) => {
  const isStoreExist = await store.findOne({ associatedId: req.account._id });
  if (isStoreExist) {
    return res.status(200).json({
      message: `You Have a store`,
    });
  } else {
    const _store = new store({
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
