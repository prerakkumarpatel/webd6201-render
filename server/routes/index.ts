import express from 'express';
import Contact from "../models/contact";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home',page: "home",displayName:"" });
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home',page: "home",displayName:"" });
});

router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About',page: "about",displayName:"" });
});


router.get('/projects', function(req, res, next) {
  res.render('index', { title: 'Project',page: "projects",displayName:"" });
});


router.get('/services', function(req, res, next) {
  res.render('index', { title: 'Services',page: "services",displayName:"" });
});


router.get('/contact', function(req, res, next) {
  res.render('index', { title: 'Contact us',page: "contact",displayName:"" });
});

router.post('/contact', function(req, res, next) {

  //instantiate a new contact
  let newContact = new Contact (
      {
        "FullName" : req.body.fullName,
        "ContactNumber" : req.body.contactNumber,
        "EmailAddress" : req.body.emailAddress
      }
  );

  console.log(newContact.toString());
  //insert contact in database
  Contact.create(newContact).then(function(){

    //new Contact has been added successfully
    res.redirect('/contact-list');

  }).catch(function(err){
    console.error(err);
    res.end(err)
  })


});

router.get('/contact-list', function(req, res, next) {


  Contact.find().then(function (data){
    //console.log(data);
    res.render('index', { title: 'Contact List', page : 'contact-list',
      contacts : data, displayName : '' });
  }).catch(function(err){
    console.error("Encountered an Error reading from the Database: " + err);
    res.end();
  });

});




/* Display the Add Page */
router.get('/add', function(req, res, next) {
  res.render('index', { title: 'Add', page : 'edit', contact : '', displayName : '' });
});


/* Process the Add Request */
router.post('/add', function(req, res, next) {

  //instantiate a new contact
  let newContact = new Contact (
      {
        "FullName" : req.body.fullName,
        "ContactNumber" : req.body.contactNumber,
        "EmailAddress" : req.body.emailAddress
      }
  );

  //insert contact in database
  Contact.create(newContact).then(function(){

    //new Contact has been added successfully
    res.redirect('/contact-list');

  }).catch(function(err){
    console.error(err);
    res.end(err)
  })


});

/* Process the delete request contact */
router.get('/delete/:id', function(req, res, next) {

  //this is obtained from the passed in :id
  let id = req.params.id;

  Contact.deleteOne({_id : id}).then(function() {
    res.redirect("/contact-list")
  }).catch(function(err){
    console.error(err);
    res.end(err);
  })

});


/* Display edit Page with data */
router.get('/edit/:id', function(req, res, next) {

  //this is obtained from the passed in :id
  let id = req.params.id;

  Contact.findById(id).then(function(contactToEdit) {
    //pass the id to the db and read/obtain the contact
    res.render('index', { title: 'Edit', page : 'edit',
      contact : contactToEdit, displayName : '' });

  }).catch(function(err){
    console.error(err);
    res.end(err);
  })

});


/* Process the edit Request */
router.post('/edit/:id', function(req, res, next) {

  let id = req.params.id;

  //instantiate a new contact
  let updatedContact = new Contact (
      {
        "_id" : id,
        "FullName" : req.body.fullName,
        "ContactNumber" : req.body.contactNumber,
        "EmailAddress" : req.body.emailAddress
      }
  );

  //insert contact in database
  Contact.updateOne({_id : id}, updatedContact).then(function(){

    //edit Contact was successful
    res.redirect('/contact-list');

  }).catch(function(err){
    console.error(err);
    res.end(err)
  })


});
router.get('/login', function(req, res, next) {
  res.render('index', { title: 'Login',page: "login",displayName:"" });
});

router.get('/register', function(req, res, next) {
  res.render('index', { title: 'Register',page: "register",displayName:"" });
});


export default  router;
