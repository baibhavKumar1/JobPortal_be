const express = require('express');
const connection = require('./db');
const app= express();
const cors= require('cors');
const CandidateRouter = require('./Route/candidate.route');
const CompanyRouter = require('./Route/company.route');
app.use(cors())
// app.use(express.json())

app.use('/candidate',CandidateRouter)
app.use('/company',CompanyRouter)
app.use('/image',express.static("images"))
app.get('/',(req,res)=>{
    res.status(200).json("hello")
})

app.listen(3000,async()=>{
    try{
        await connection;
        console.log("connected")
    }
    catch(err){
        console.log(err)
    }
    console.log("running")
})