const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const accountsRoute = require('./controllers/accounts');
const storeRoute = require('./controllers/store');
const productRoute = require('./controllers/product');

const port=3000;
const app= express();
const url="mongodb+srv://karam:1234@cluster0.mbkcj.mongodb.net/kiosk_db?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/api/accounts',accountsRoute);
app.use('/api/store',storeRoute);
app.use('/api/product',productRoute);

mongoose.connect(url)
.then(res =>{
    app.listen(port,()=>{
        console.log("Server is running",port);
    });
})
.catch(err=>{
    console.log(err.message);
})