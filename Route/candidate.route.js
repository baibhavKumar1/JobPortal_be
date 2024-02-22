const express = require('express');
const CandidateModel = require('../Model/candidate.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth.middleware');
const { cloudinary_js_config: cloudinary } = require('../cloudinary');
const Router = express.Router();
const mongoose = require('mongoose');
const upload = require('../Middleware/upload.middleware');

Router.get('/', async (req, res) => {
    try {
        const user = await CandidateModel.find();
        res.status(200).json({ user });
    } catch (err) {
        res.status(400).json(err.message)
    }
})
Router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await CandidateModel.findById(id);
        res.status(200).json({ user });
    } catch (err) {
        res.status(400).json(err.message)
    }
})
Router.post('/register', async (req, res) => {
    const { name, email, password, avatar } = req.body;
    try {
        const user = await CandidateModel.findOne({ email });
        bcrypt.hash(password, 3, async (err, hash) => {
            if (err) {
                res.status(401).json({ message: err.message })
            }
            else {
                try {
                    const newUser = new CandidateModel({
                        name, email, password: hash, avatar
                    })
                    await newUser.save()
                    var token = jwt.sign({ userID: user._id }, "secret")
                    res.status(201).json({ newUser, message: "User Registered", token })
                } catch (err) {
                    res.status(400).send(err.message)
                }

            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
Router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await CandidateModel.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Account Not Found" })
        } else {
            bcrypt.compare(password, user.password, (err, decode) => {
                if (err) {
                    res.status(400).json({ message: "Wrong credentials" })
                } else {
                    var token = jwt.sign({ userID: user._id }, "secret")
                    res.status(200).json({ message: "User Logged In", token })
                }
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

const Resume = mongoose.model('Resume', {
    resume: String,
});
Router.post('/upload', upload.single('resume'), async (req, res) => {
    const resume = req.file ? req.file.path : null;
    try {
        const newResume = new Resume({
            resume
        });
        await newResume.save();
        res.status(200).json({ message: 'Resume uploaded successfully!', newResume });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
Router.get('/resume',async(req,res)=>{
    
})
Router.post('/:id/add-field/:fieldName', async (req, res) => {
    const { id, fieldName } = req.params;
    const { newData } = req.body;
    try {
        const user = await CandidateModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user[fieldName] = user[fieldName] || [];
        if (newData && newData.length > 0) {
            user[fieldName].push(...newData);
        }
        // Save the updated user profile
        const updateUser = await user.save();

        res.status(200).json({ message: `${fieldName} updated successfully`, updateUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
Router.patch('/:id/update-field/:fieldName/:fieldId', async (req, res) => {
    const { id, fieldName, fieldId } = req.params;
    const { updatedData } = req.body;

    try {
        const user = await CandidateModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const fieldIndex = user[fieldName].findIndex(item => item._id == fieldId);

        if (fieldIndex === -1) {
            return res.status(404).json({ message: `${fieldName} element not found` });
        }
        user[fieldName][fieldIndex] = { ...user[fieldName][fieldIndex], ...updatedData };

        // Save the updated user profile
        const updateUser = await user.save();

        res.status(200).json({ message: `${fieldName} element updated successfully`, updateUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

Router.delete('/:id/delete-field/:fieldName/:fieldId', async (req, res) => {
    const { id, fieldName, fieldId } = req.params;
    try {
        const user = await CandidateModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const fieldIndex = user[fieldName].findIndex(item => item._id == fieldId);
        if (fieldIndex === -1) {
            return res.status(404).json({ message: `${fieldName} not found` });
        }
        user[fieldName].splice(fieldIndex, 1);
        const updateUser = await user.save();
        res.status(200).json({ message: `${fieldName} deleted successfully`, updateUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

Router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let user = await CandidateModel.findById(id);
        if (user) {
            const deletedUser = await CandidateModel.findByIdAndDelete(id)
            res.status(200).json({ message: "User deleted Successfully" })
        }
        else {
            res.status(400).json({ message: "User Not Found" })
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = Router