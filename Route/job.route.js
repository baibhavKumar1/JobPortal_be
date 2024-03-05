const express= require('express');
const auth = require('../Middleware/auth.middleware');
const CompanyModel = require('../Model/company.model');
const CandidateModel = require('../Model/candidate.model');
const JobModel = require('../Model/job.model');
const JobRouter= express.Router();

JobRouter.use(auth)

JobRouter.get('/',async(req,res)=>{
  const company= await CompanyModel.findById(req.body.userID);
  const candidate = await CandidateModel.findById(req.body.userID);
    if(!candidate && !company){
        res.status(400).json({message:"Not Authorised"});
    }else{
        const job = await JobModel.find();
        res.status(200).json(job)
    }
})
JobRouter.get('/:id',async(req,res)=>{
    const id = req.params.id;
  const company= await CompanyModel.findById(req.body.userID);
  const candidate = await CandidateModel.findById(req.body.userID);
    if(!candidate && !company){
        res.status(400).json({message:"Not Authorised"});
    }else{
        const job = await JobModel.findById(id);
        res.status(200).json(job)
    }
})

JobRouter.post('/create', async (req, res) => {
    try { 
        const company = await CompanyModel.findById(req.body.userID);
        if (!company) {
            res.status(400).json({ message: "Not Authorized as a company" });
        }
        const { title, body, salary } = req.body;
        const existingJob = company.jobs.find(job => job.role === title);
        if (existingJob) {
            console.log(existingJob)
            res.status(400).json({ message: "Company already has a job with the same title" });
        } else{
        const job = new JobModel({
            company: { name: company.name, id: company._id },...req.body
        });
        await job.save();
        company.jobs.push({id:job._id,role:job.title});
        await company.save();
        res.status(200).json({ message: "Job created", job,company });
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server  Error" });
    }
});


JobRouter.post('/apply/:id', async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.id);
        const candidate = await CandidateModel.findById(req.body.userID);
        if (!candidate) {
            return res.status(400).json({ message: "Not Authorized as a candidate" });
        }
        const candidateExists = job.applicants.some(applicant => applicant.id.toString() === candidate._id.toString());
        if (!candidateExists) {
            job.applicants.push({ name: candidate.name, id: candidate._id });
            await job.save();
            return res.status(200).json({ message: "Application successful" });
        } else {
            return res.status(400).json({ message: "Candidate has already applied to this job" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports= JobRouter