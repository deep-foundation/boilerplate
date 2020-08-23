import { applyPassport } from '@deepcase/auth/passport/index';
import github from '@deepcase/auth/passport/github';
import LocalStrategy from 'passport-local';

export const initPassport = () => applyPassport((passport) => {
  passport.use(github);

  passport.use(new LocalStrategy((username, password, done) => {
    console.log('LocalStrategy', { username, password });
    if (username === 'abc' && password === 'abc') done(null, { id: 'abc' });
    else done(null, false);
  }));

  passport.serializeUser((user, done) => {
    console.log('serializeUser', user);
    done(null, { id: user.id });
  });

  passport.deserializeUser((id, done) => {
    console.log('deserializeUser', id);
    done(null, { id });
  });
});
