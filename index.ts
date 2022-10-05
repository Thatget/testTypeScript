import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connetEnsureLogin from 'connect-ensure-login';
import passport from 'passport';
import session from 'express-session'
var LocalStrategy = require('passport-local');

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response): Promise<void> => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});

app.use(session({
  secret: 'cookie_secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user_id, done){
  console.log(user_id);
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done){
  console.log('USER ID : ' + user_id);
  done('err', 'rows[0]');
});

passport.use(new LocalStrategy(
  function(username: any, password: any, done: (arg0: null, arg1: object|boolean) => any) {
    console.log("X@")
    // passport.serializeUser(function(user, done) {
    //   return done(null, {user: "false"});
    // });
    return done(null, {f:"f"})
  }
));


app.post('/login', passport.authenticate('local', { successRedirect: '/dashboard',failureRedirect: '/',session: true }),  function(req, res) {
	console.log(req)
	res.redirect('/dashboard');
});

app.get('/dashboard', connetEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.send(`Hello ${req.body.user.username}. Your session ID is ${req.body.sessionID} 
   and your session expires in ${req.body.session.cookie.maxAge} 
   milliseconds.<br><br>
   <a href="/logout">Log Out</a><br><br>
   <a href="/secret">Members Only</a>`);
});

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: any) {
    console.error(`Error occured: ${error.message}`);
}
