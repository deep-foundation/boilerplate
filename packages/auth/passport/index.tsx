import { NextApiResponse, NextApiRequest } from 'next';
import passport from 'passport';
import cookieSession from 'cookie-session';
import url from 'url';
// @ts-ignore
import redirect from 'micro-redirect';
import { Profile } from 'passport-github';
export { passport };

import { IAuth } from '../index';

import github from './github';

passport.use(github);

export interface PassportSession {
  passport: { user: IAuth };
}

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Github profile is serialized
// and deserialized.
passport.serializeUser((user: Profile, done) => {
  const { id, displayName, username, profileUrl, photos } = user;
  console.log('serializeUser', user);
  done(null, { id, displayName, username, profileUrl, photos });
});
passport.deserializeUser(async (serializedUser, done) => {
  console.log('deserializeUser', serializedUser);
  if (!serializedUser) {
    return done(new Error(`User not found: ${serializedUser}`));
  }

  done(null, serializedUser);
});

// export middleware to wrap api/auth handlers
export const withPassport = fn => (req, res) => {
  if (!res.redirect) {
    // passport.js needs res.redirect:
    // https://github.com/jaredhanson/passport/blob/1c8ede/lib/middleware/authenticate.js#L261
    // Monkey-patch res.redirect to emulate express.js's res.redirect,
    // since it doesn't exist in micro. default redirect status is 302
    // as it is in express. https://expressjs.com/en/api.html#res.redirect
    res.redirect = (location: string) => redirect(res, 302, location);
  }

  // Initialize Passport and restore authentication state, if any, from the
  // session. This nesting of middleware handlers basically does what app.use(passport.initialize())
  // does in express.
  cookieSession({
    name: 'passportSession',
    signed: false,
    domain: url.parse(req.url).host,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })(req, res, () => (
    passport.initialize()(req, res, () => (
      passport.session()(req, res, () => (
        // call wrapped api route as innermost handler
        fn(req, res)
      ))
    ))
  ));
};
