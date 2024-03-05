const mongoose = require('mongoose');

const trialSchema = mongoose.Schema(
    {
        name:String,
        resume:String
    },
    {versionKey:false}
)

const TrialModel = mongoose.model('Trial',trialSchema)

module.exports= TrialModel