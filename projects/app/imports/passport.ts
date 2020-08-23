import { applyPassport } from "@deepcase/auth/passport/index";
import github from "@deepcase/auth/passport/github";

export const initPassport = () => applyPassport((passport) => {
  passport.use(github);
  passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, { id: user.id });
  });
  
  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    done(null, { id });
  });
});
