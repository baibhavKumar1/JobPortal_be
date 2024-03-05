const express = require('express');
const upload = require('../Middleware/upload.middleware');
const TrialModel = require('../Model/trial.model');
const TrialRouter = express.Router();

// TrialRouter.post('/',(req,res)=>{
//     const {name}= req.body;
//     console.log(name)
//     res.json('hi') 
// }) 
TrialRouter.post('/',upload.single('avatar'),async(req,res)=>{
    const name= req.body.name;
    const resume = req.file ? req.file.path : null; 
    try {
        const newResume = new TrialModel({
            name,resume 
        });
        await newResume.save();
        res.status(200).json({ message: 'Resume uploaded successfully!', newResume,password:req.body.password });
    } catch (error) {
        res.status(500).send(error.message);
    } 
})
TrialRouter.get('/upload/:id',async(req,res)=>{
    const {id}= req.params 
    try {
        const newResume = await TrialModel.findById(id);
        res.status(200).json({ message: 'Resume found!', newResume });
    } catch (error) {
        res.status(500).send(error.message);
    }
})
module.exports= TrialRouter