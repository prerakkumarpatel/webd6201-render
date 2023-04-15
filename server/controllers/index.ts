//import modules
import express, {Request, Response, NextFunction} from "express";
import {UserDisplayName} from "../util";
import Contact from "../models/contact";

//*****************function that manage  routes requests *******//

export function DisplayHomePage(req : Request, res : Response , next: NextFunction) : void
{
  res.render('index', { title: 'Home', page : 'home', displayName : UserDisplayName(req)  });
}

export function DisplayAboutUsPage(req : Request, res : Response , next: NextFunction) : void
{
  res.render('index', { title: 'About Us', page : 'about', displayName : UserDisplayName(req)  });
}

export function DisplayServicesPage(req : Request, res : Response , next: NextFunction) : void
{
  res.render('index', { title: 'Services', page : 'services', displayName : UserDisplayName(req)  });
}

export function DisplayProjectPage(req : Request, res : Response , next: NextFunction) : void
{
  res.render('index', { title: 'Our Projects', page : 'projects', displayName : UserDisplayName(req)  });
}

export function DisplayContactPage(req : Request, res : Response , next: NextFunction) : void
{
  res.render('index', { title: 'Contact Us', page : 'contact', displayName : UserDisplayName(req)  });
}

//Process Page Functions
export function ProcessContactPage(req : Request, res : Response , next: NextFunction) : void
{
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
    res.redirect('/home');

  }).catch(function(err){
    console.error(err);
    res.end(err)
  })



}