const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
    name: String,
    id: Number
  });
 

const jobSchema = new mongoose.Schema({
    jobSector:{type: String, required: true},
    title: { type: String, required: true},
    location: { type: String, required: true},
    submissionDeadline: {type: Date, required: true},
    premium: Boolean, 
    payMin: Number,
    payMax: Number,
    description: String,
    applicants: [subSchema],
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;