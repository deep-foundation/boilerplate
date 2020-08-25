import { applyPassport } from '@deepcase/auth/passport/index';
import github from '@deepcase/auth/passport/github';
import LocalStrategy from 'passport-local';
import Debug from 'debug';

const debug = Debug('deepcase:passport');

export const initPassport = () => applyPassport((passport) => {
  passport.use(github);

  passport.use(new LocalStrategy((username, password, done) => {
    debug('LocalStrategy', { username, password });
    if (username === 'abc' && password === 'abc') done(null, { id: 'abc' });
    else done(null, false);
  }));

  passport.serializeUser((user, done) => {
    debug('serializeUser', user);
    done(null, { id: user.id });
  });

  passport.deserializeUser((id, done) => {
    debug('deserializeUser', id);
    done(null, { id });
  });
});
