"use strict";
import express from 'express';
import path from 'path';

const app = express();
const router= express.Router();
const port = process.env.PORT||3000;

//configration
app.use(router);
app.set("views",path.join(__dirname,"./views"));
app.set("view engine" , "ejs");

//static configuration
app.use(express.static(path.join(__dirname,"./client/")));

app.use(express.static(path.join(__dirname,"./node_modules/")));
//middleware
router.get('/',function (req, res, next){
    res.render('index',{title:"Hello World"});
    next();
});


app.listen(port,  () => {
    console.log(`Server running at :${port}/`);
});
export default app;