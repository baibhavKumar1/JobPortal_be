const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        title:String,
        body:{
            description:String,
            requirements:String,
            jobType:{
                type:String,
                enum:["remote","In-office"]
            },
        },
        company:{
            name:String,
            id:String
        },
        salary:Number,
        applicants:[{

            name:String,
            id:String
        }],
        posted:Date,
        status:{
            type:String,
            enum:["Open","Closed"]
        }
    },
    {versionKey:false}
)

const JobModel = mongoose.model("Job",jobSchema)

module.exports = JobModel