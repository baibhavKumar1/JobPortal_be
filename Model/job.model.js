const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        title: String,
        positions: String,
        location: String,
        description: String,
        requirements: String,
        responsibilities: String,
        jobtype: {
            type: String,
            enum: ["Remote", "In-office"]
        },
        skills: [String],
        perks: String,
        company: {
            name: String,
            id: String
        },
        timeIntervalfrom:String,
        timeIntervalto:String,
        salary: String,
        applicants: [{
            _id: false,
            name: String,
            id: String
        }],
        posted: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: "Open",
            enum: ["Open", "Closed"]
        }
    },
    { versionKey: false }
)

const JobModel = mongoose.model("Job", jobSchema)

module.exports = JobModel