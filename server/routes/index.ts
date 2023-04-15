import express from 'express';
const router = express.Router();

import {
  DisplayAboutUsPage,
  DisplayContactPage,
  DisplayHomePage,
  DisplayProjectPage,
  DisplayServicesPage,ProcessContactPage
} from "../controllers";

/* ****************************** TOP LEVEL ROUTES *************************************** */
router.get('/', DisplayHomePage);

router.get('/home', DisplayHomePage);

router.get('/about', DisplayAboutUsPage);

router.get('/projects', DisplayProjectPage);

router.get('/services', DisplayServicesPage);

router.get('/contact', DisplayContactPage);

router.post('/contact', ProcessContactPage);

export default router;