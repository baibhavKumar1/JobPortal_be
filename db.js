const mongoose = require('mongoose');
 const connection = mongoose.connect('mongodb+srv://cocc1274:Vaibhav1@cluster0.mybcsrv.mongodb.net/JobPortal?retryWrites=true&w=majority')
//const connection = mongoose.connect('mongodb://localhost:27017/JobPortal')
module.exports= connection