import express, { Request, Response } from 'express';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import sessions from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './db/schema/user.schema';
//import Pothole from './db/schema/pothole.schema';
import rootRouter from './routes/index';
import './db/index';
import './automation';
//import { Server } from 'socket.io';
const app = express();
// running on port 5555 if no env available
const PORT = process.env.PORT || 5555;

app.use(
  sessions({
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.redirect('/');
};

app.use('/', express.static(path.resolve('dist')));
app.use('/User', isLoggedIn, express.static(path.resolve('dist')));
app.use('/User:id', isLoggedIn, express.static(path.resolve('dist')));
app.use('/AddPothole', isLoggedIn, express.static(path.resolve('dist')));

app.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
      callbackURL: `${process.env.GOOGLE_CALLBACK}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails, photos } = profile;
      const email = emails ? emails[0].value : '';
      const photo = photos ? photos[0].value : '';
      try {
        const [user] = await User.findOrCreate({
          where: { id },
          defaults: { id, email, name: displayName, photo, badge_id: 0 },
        });
        done(null, user);
      } catch (error) {
        done(null, profile);
      }
    }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  if (id) {
    User.findOne({ where: { id } }).then((data) => done(null, data));
  }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    successRedirect: '/User',
    failureRedirect: '/Map',
  })
);

app.use('/api', rootRouter);

// ZM
// const io = new Server(8081, {
//   cors: {
//     origin: '*',
//   },
// });

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// io.on('connection', async (socket: any) => {
//   // Set up an interval to send a "heartbeat" message every 10 seconds
//   setInterval(() => {
//     User.findAll({}).then((data) => socket.emit('heartbeat', { data: data.length }));
//   }, 500);

//   setInterval(() => {
//     Pothole.count({}).then((data) => socket.emit('pothole', { data }));
//   }, 500);
// });

//ZM

// wildcard endpoint
app.use('/*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'), (err) => {
    if (err) res.status(500).send(err);
  });
});

// app listen
app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
