const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String,
            unique: true
        },
        avatar: String,
        resume:String,
        city: String,
        skills: String,
        education:{
            unique: true,
            type: [{
                degree: String,
                institution: String,
                completionYear: Number,
            }]},
        experience: {
            unique: true,
            type: [{
                company: String,
                position: String,
                startDate: Date,
                endDate: Date,
                working: Boolean
            }]},
        projects:{
            unique: true,
            type: [{ 
            title: String,
            description: String,
            image: String,
            url: String,
            techStack: [String]
        }]},
        certification:{
            unique: true,
            type: [{ 
            certificateURL: String,
            organization: String
        }]}
    },
    { versionKey: false }
)

const CandidateModel = mongoose.model("Candidate", candidateSchema)

module.exports = CandidateModel