const mongoose = require('mongoose');

const applicantSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type:String, required: true},
    cv: {type:String, required: true},
    coverLetter: String,
    payExpectations: Number,
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;

