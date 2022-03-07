const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');

const port=13000;
const app= express();
const url="mongodb+srv://karam:1234@cluster0.mbkcj.mongodb.net/kiosk_db?retryWrites=true&w=majority";

app.use(bodyParser.json);
app.use(bodyParser.urlencoded);

mongoose.connect(url)
.then(res =>{
    app.listen(port,()=>{
        console.log("Server is running",port);
    });
})
.catch(err=>{
    console.log(err.message);
})