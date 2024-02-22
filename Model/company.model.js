const mongoose = require('mongoose');

const companySchema = mongoose.Schema(
    {
        name: {
            unique:true,
            type:String
        },
        industry:String,
        description:String,
        size:String,
        email: String,
        password: String,
        city: String,
        url: String,
        employees: [{ String }],
        jobs: {
            unique: true,
            type: [{
                role: String
            }]
        }

    },
    { versionKey: false }
)

const CompanyModel = mongoose.model("Company", companySchema)

module.exports = CompanyModel