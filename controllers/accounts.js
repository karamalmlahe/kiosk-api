const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();

router.get('/sayHello',(req,res)=>{
    return res.status(200).json({message: 'Hello'});
})

module.exports=router;