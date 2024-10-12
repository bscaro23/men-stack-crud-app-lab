const dotenv = require('dotenv');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

const Job = require('./models/job');
const Applicant = require('./models/job-applicant')

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/jobs', async (req, res) => {
    const allJobs = await Job.find();
    res.render('jobs/index.ejs', {jobs: allJobs});
});

app.get('/jobs/new', (req, res) => {
    res.render('jobs/new.ejs');
});

app.get('/jobs/:jobId', async (req, res) => {
    const foundJob = await Job.findById(req.params.jobId);
    res.render('jobs/show.ejs', {job:foundJob});
});

app.get('/jobs/:jobId/edit', async (req, res) => {
    const foundJob = await Job.findById(req.params.jobId);
    console.log(foundJob);
    res.render('jobs/edit.ejs', {
        job: foundJob,
      });
  });

app.get('/jobs/:jobId/apply', async (req, res) => {
  const foundJob = await Job.findById(req.params.jobId);
  res.render('jobs/apply.ejs', {
    job: foundJob,
  });
});
  

app.delete('/jobs/:jobId', async (req, res) => {
    
    await Job.findByIdAndDelete(req.params.jobId);
    res.redirect('/jobs');
});
  

app.post('/jobs', async (req, res) => {
    //Has to be done as is not present if not on
    req.body.premium = req.body.premium ? true : false;

    //as names are the same as the schema
    await Job.create(req.body);
    res.redirect('/jobs');
});

app.put('/jobs/:jobId', async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    req.body.premium = req.body.premium ? true : false;
    
    // Update the fruit in the database
    await Job.findByIdAndUpdate(req.params.jobId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/jobs/${req.params.jobId}`);
  });

  app.post('/jobs/:jobId', async (req, res) =>{
    const allApplicants = await Applicant.find();
    const username = req.body.username;
    const usernameTaken = allApplicants.some(applicant => applicant.username === username);
    if (usernameTaken){
        console.log("username found")
        res.redirect(`/jobs/${req.params.jobId}/apply/login`);
    }else {
        console.log("username not found");
        const newApplicant = await Applicant.create(req.body);

        const jobAppliedTo = await Job.findById(req.params.jobId);

        jobAppliedTo.applicants.push(newApplicant);

        await jobAppliedTo.save();


        res.redirect('/jobs');
    };

  });















app.listen(3000, () =>{
    console.log('listening on port 3000');
});


//I dont have enough time to finish this, 
//Todo - complete the login page and use some sort of .env to hide the passwords of candidates, would be better to have login earlier on, add the ability for the page to only show ads that are yet to expire.