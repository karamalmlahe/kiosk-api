const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const user = require("./../models/user");

router.post("/createAccount", async(req, res) => {
  //Get user input
  const { firstName, lastName, email, password, mobile } = req.body;

//Check if user exist
user.findOne({ email: email })
.then(async (account) => {
      if (account) {
        return res.status(200).json({
          message: "User is already exist ,Please try other email",
        });
      } else {
          //Crypt password
        const formatted_password = await bcryptjs.hash(password,10);

        //Generate passcode
        const passcode = generateRandomNumber(1000,9999);

        //create user in MongoDB
        const _user=new user({
            _id:mongoose.Types.ObjectId(),
            email:email,
            password:formatted_password,
            mobile:mobile,
            firstName:firstName,
            lastName:lastName,
            passcode:passcode
        })
        _user.save()
        .then(account_create =>{
            return res.status(200).json({
                message: _user,
              });
        })
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
      });
    });
});


const generateRandomNumber=(min,max)=>{
    return Math.floor(Math.random()*(max-min+1))+min;
}
router.get("/sayHello", async (req, res) => {
    try {
        const users=await user.find();
        return res.status(200).json({ message: users });
    } catch (error) {
        return res.status(200).json({ message: error });
    }
});

module.exports = router;
