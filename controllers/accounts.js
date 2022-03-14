const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user = require("./../models/user");

router.post("/createAccount", async (req, res) => {
  //Get user input
  const { firstName, lastName, email, password, mobile } = req.body;

  //Check if user exist
  user
    .findOne({ email: email })
    .then(async (account) => {
      if (account) {
        return res.status(200).json({
          message: "User is already exist ,Please try other email",
        });
      } else {
        //Crypt password
        const formatted_password = await bcryptjs.hash(password, 10);

        //Generate passcode
        const passcode = generateRandomNumber(1000, 9999);

        //create user in MongoDB
        const _user = new user({
          _id: mongoose.Types.ObjectId(),
          email: email,
          password: formatted_password,
          mobile: mobile,
          firstName: firstName,
          lastName: lastName,
          passcode: passcode,
        });
        _user.save().then((account_create) => {
          return res.status(200).json({
            message: _user,
          });
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
      });
    });
});

router.post("/login", async (req, res) => {
  //Get user credentials
  const { email, password } = req.body;

  //is user exist
  user
    .findOne({ email: email })
    .then(async (account) => {
      if (account) {
        //is Verified is Locked
        if (account.isApproved && !account.isLocked) {
          //Compare passwords
          const isMatch = await bcryptjs.compare(password, account.password);
          if (isMatch) {
            //Create Token
            const acc_data= {
              firstName: account.firstName,
              lastName: account.lastName,
              avatar: account.avatar,
              mobile: account.mobile,
              email: account.email,
              _id: account._id,
            };

            const token = await jwt.sign(acc_data, 'YATb7pSC6vs7Hiqu69CULzt6KNBoxHsp');
            //Response
            return res.status(200).json({ token: token });

            
          } else {
            return res.status(200).json({ message: "Password is incorrect" });
          }
        } else {
          return res
            .status(200)
            .json({ message: "Your account is not active" });
        }
      } else {
        return res.status(200).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
      });
    });
});

router.post("/verify", async (req, res) => {
  //Get user credentials
  const { email, passcode } = req.body;

  //Is user exists
  user
    .findOne({ email: email })
    .then(async (account) => {
      if (account) {
        //Verify code
        if (account.passcode === passcode) {
          //Update isApproved
          account.isApproved = true;
          account
            .save()
            .then((account_updated) => {
              //Response
              return res.status(200).json({
                message: account_updated,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                message: err.message,
              });
            });
        } else {
          return res.status(200).json({
            message: "Passcode not correct",
          });
        }
      } else {
        return res.status(200).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
      });
    });
});

router.post("/forgetPassword", (req, res) => {
  const {email}=req.body;
  user.findOne({email: email})
  .then((account)=>{
    if(account){
      account.passcode=generateRandomNumber(1000,9999);
      account.save()
      .then((account_updated)=>{
        return res.status(200).json({message: account_updated})
      })
      .catch((err) =>{
        return res.status(500).json({ message:err.message})
      })
    }
    else{
      return res.status(200).json({message: "User not found"})
    }
  }
  )
  .catch((err) =>{
    return res.status(500).json({message: err.message})
  })
})

router.post('/VerifyRecaver',(req, res)=>{
  const {email,passcode}=req.body;
  user.findOne({ email: email})
  .then((account)=>{
    if(account){
      if(account.passcode==passcode){
        return res.status(200).json({message:'passcode is correct',isCorrect: true});
      }
      else{
        return res.status(200).json({message:'passcode is incorrect',isCorrect: false});
      }

    }
    else{
      return res.status(200).json({ message:'User not found'});
    }
  })
  .catch(err=>{
    return res.status(500).json({ message: err.message})
  })
})

router.post('/updatePassword',(req, res)=>{
  const {email,newpassword}=req.body;
  user.findOne({ email: email})
  .then(async(account)=>{
    if(account){
      const isMatch = await bcryptjs.compare(newpassword, account.password);
      if(!isMatch){
        const formatted_password = await bcryptjs.hash(newpassword, 10);
        account.password=formatted_password;
        account.save()
        .then(account_updated=>{
          return res.status(200).json({message:account_updated});
        })
        .catch(err=>{
          return res.status(500).json({ message: err.message})
        })
      }
      else{
        return res.status(200).json({message:"This is your password now"});
      }
    }
    else{
      return res.status(200).json({message: 'User is not found'});
    }
  })
  .catch(err=>{
    return res.status(500).json({ message: err.message});
  })
})



const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
router.get("/sayHello", async (req, res) => {
  try {
    const users = await user.find();
    return res.status(200).json({ message: users });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
