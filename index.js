const express = require('express');
const connection = require('./db');
const app= express();
const cors= require('cors');
const CandidateRouter = require('./Route/candidate.route');
const CompanyRouter = require('./Route/company.route');
//const TrialRouter = require('./Route/trial.route');
const JobRouter = require('./Route/job.route');
app.use(cors())
app.use(express.json())


app.use('/candidate',CandidateRouter)
app.use('/company',CompanyRouter)
app.use('/job',JobRouter)
//app.use('/trial',TrialRouter)
app.use('/images',express.static("images"))
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