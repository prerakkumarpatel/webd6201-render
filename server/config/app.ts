//common modules for app
import createError from 'http-errors';
import express, {NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';

//routes
import indexRouter from '../routes/index';
import authRouter from '../routes/auth';
import contactListRouter from '../routes/contact-list';

//for database configuration
import * as DBConfig from './db';

//schema
import User from '../models/user';

//module for authentication
import  session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import flash from 'connect-flash'
let localStrategy = passportLocal.Strategy;  //alias

//modules to support authentication
import cors from 'cors';
import passportJWT from 'passport-jwt';


//JWT Aliases
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;



mongoose.connect(DBConfig.RemoteURI);
const db = mongoose.connection;
db.on("error",function(err){
  console.error("Connection Error");
});
db.once("open",function(){
  console.log(`Connected to mongodb at ${DBConfig.HostName}`);
});

const app = express();


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

//setup cors
app.use(cors());

//JWT Options
let jwtOptions =
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: DBConfig.SessionSecret
    }

//define our JWT Strategy
//http://www.passportjs.org/packages/passport-jwt/
let strategy = new JWTStrategy(jwtOptions, function(jwt_payload, done)
{
  User.find({id: jwt_payload.sub}).then(function (user : any){
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  }).catch(function(err){
    if (err) {
      return done(err, false);
    }
  });

});

app.use(express.static(path.join(__dirname, '../../client')));
app.use(express.static(path.join(__dirname, '../../node_modules')));
app.use(session ({
  secret : DBConfig.SessionSecret,
  saveUninitialized: false,
  resave: false
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//passport for authentication
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', contactListRouter);


// catch 404 and forward to error handler
app.use(function(req:express.Request, res:express.Response, next:NextFunction):void {
  next(createError(404));
});

// error handler
app.use(function(err: createError.HttpError, req: express.Request,
                 res : express.Response, next : NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;