"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessContactPage = exports.DisplayContactPage = exports.DisplayProjectPage = exports.DisplayServicesPage = exports.DisplayAboutUsPage = exports.DisplayHomePage = void 0;
const util_1 = require("../util");
const contact_1 = __importDefault(require("../models/contact"));
function DisplayHomePage(req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayHomePage = DisplayHomePage;
function DisplayAboutUsPage(req, res, next) {
    res.render('index', { title: 'About Us', page: 'about', displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayAboutUsPage = DisplayAboutUsPage;
function DisplayServicesPage(req, res, next) {
    res.render('index', { title: 'Services', page: 'services', displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayServicesPage = DisplayServicesPage;
function DisplayProjectPage(req, res, next) {
    res.render('index', { title: 'Our Projects', page: 'projects', displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayProjectPage = DisplayProjectPage;
function DisplayContactPage(req, res, next) {
    res.render('index', { title: 'Contact Us', page: 'contact', displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayContactPage = DisplayContactPage;
function ProcessContactPage(req, res, next) {
    let newContact = new contact_1.default({
        "FullName": req.body.fullName,
        "ContactNumber": req.body.contactNumber,
        "EmailAddress": req.body.emailAddress
    });
    contact_1.default.create(newContact).then(function () {
        res.redirect('/home');
    }).catch(function (err) {
        console.error(err);
        res.end(err);
    });
}
exports.ProcessContactPage = ProcessContactPage;
//# sourceMappingURL=index.js.map