'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const CourseDao = require('./modules/courseDAO'); 
const UserDao = require('./modules/userDAO'); 
const StudyPlanDao= require('./modules/studyPlanDAO');

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const port = 3001;

const corsOptions={
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
}

const courseDAO= new CourseDao();
const userDAO= new UserDao();
const studyPlanDAO=new StudyPlanDao();

// init express
const app = new express();
// set up the middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions))

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDAO.getUser(username, password)
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "Final Exam Secret Key",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        return res.status(401).send(info);
      }
      req.login(user, (err) => {
        if (err)
          return next(err);

        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/// courses API
app.get('/api/courses', async(req,res)=>{
try{
  const result=await courseDAO.getAllCourses();
  return res.status(200).json(result);
}
catch(err)
{
  console.log(err)
  return res.status(500).json({ error: "Generic error !!" });
}
})


  /// studyPlan API
  app.post('/api/studyplan', isLoggedIn,
  [
  check('type').notEmpty().isIn(['FullTime', 'PartTime']),
  check('minCredit').isInt(),
  check('maxCredit').isInt(),
  check('totalCredit').isInt().custom((value, { req }) => {
    if (value < req.body.minCredit || value > req.body.maxCredit) {
      throw new Error('totalCredit does not match with minCredit and maxCredit');
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),

  ], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});

    try {
        if (Object.keys(req.body).length !== 7) 
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        const result=await studyPlanDAO.addCoursestoStudyPlan(req.user.id,req.user.code,req.body.type,req.body.minCredit,req.body.maxCredit,req.body.totalCredit,req.body.courses);
        return res.status(201).end();
    } catch (err) {
        console.log(err)
        return res.status(503).json({ error: `Generic error` }).end();
    }

});

app.get('/api/studyplan',isLoggedIn, async(req,res)=>{
  try{
    const result=await studyPlanDAO.getStudyPlan(req.user.id);
    return res.status(200).json(result);
  }
  catch(err)
  {
    console.log(err)
    return res.status(500).json({ error: "Generic error !!" });
  }
  })

  app.put('/api/studyplan/:id', isLoggedIn,[
    check('id').isInt(),
    check('type').notEmpty().isIn(['FullTime', 'PartTime']),
    check('minCredit').isInt(),
    check('maxCredit').isInt(),
    check('totalCredit').isInt().custom((value, { req }) => {
      if (value < req.body.minCredit || value > req.body.maxCredit) {
        throw new Error('totalCredit does not match with minCredit and maxCredit');
      }
  
      // Indicates the success of this synchronous custom validator
      return true;
    }),
  
    ], async (req, res) => {

      const errors = validationResult(req);
      if(!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});

    try {

      if (req.body.id !== Number(req.params.id)) {  // Check if url and body id mismatch
        return res.status(422).json({ error: 'URL and body id mismatch' });
      }
        await studyPlanDAO.updateStudyPlan(req.body.id,req.user.id,req.user.code,req.body.type,req.body.minCredit,req.body.maxCredit,req.body.totalCredit,req.body.courses);
        return res.status(200).end();
    } catch (err) {
        console.log(err)
        return res.status(503).json({ error: `Generic error` }).end();
    }

});

  app.get('/api/studyplan/:id/courses',isLoggedIn,
  [ check('id').isInt()]
  , async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});

    try{
      const id=req.params.id
      const result=await studyPlanDAO.getStudyPlanCourses(id);
      return res.status(200).json(result);
    }
    catch(err)
    {
      console.log(err)
      return res.status(500).json({ error: "Generic error !!" });
    }
    })

    app.delete('/api/studyplan', isLoggedIn, async (req, res) => {
      try {         
              var result = await studyPlanDAO.deleteStudyPlan(req.user.id);
              if (result)
                  return res.status(204).end();
              else
                  return res.status(503).end();
          }
      catch (err) {
          return res.status(503).json({ error: `Generic error` }).end();
      }
  })

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});