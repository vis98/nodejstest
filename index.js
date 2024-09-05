const express=require("express");
const db=require('./db');

const app=express()
const { Router } = require('express');
const router=Router()
const port=3000
const bodyparser=require("body-parser")
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

const ProductController=require('./controller/productController')

app.get('/products',ProductController);