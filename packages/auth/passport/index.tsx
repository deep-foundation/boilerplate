import { NextApiResponse, NextApiRequest } from 'next';
import passport, { Strategy } from 'passport';
import cookieSession from 'cookie-session';
import url from 'url';
import memoize from 'lodash/memoize';
// @ts-ignore
import redirect from 'micro-redirect';
import { Profile } from 'passport-github';
export { passport };

import { IAuth } from '../index';

export interface ISession {
  passport: { user: IAuth };
}

let applied = false;
export const applyPassport = (applier: (passport: any) => void) => {
  if (!applied) {
    applied = true;
    applier(passport);
  }
};

export const withPassport = (
  fn: (req: any, res: any) => any,
) => {
  return (req, res) => {
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
};
