import github from '@deepcase/auth/passport/github';
import { applyPassport } from '@deepcase/auth/passport/index';
import Debug from 'debug';
import BearerStrategy from 'passport-http-bearer';
import LocalStrategy from 'passport-local';
import AUTH_LOCAL from './gql/AUTH_LOCAL.gql';
import { generateApolloClient } from './hasura/client';

const debug = Debug('deepcase:passport');

export const initPassport = () => {
  const client = generateApolloClient({ secret: process.env.HASURA_SECRET });

  return applyPassport((passport) => {
    passport.use(github);

    passport.use(new LocalStrategy(async (username, password, done) => {
      debug('LocalStrategy', { username });

      const result = await client.query({ query: AUTH_LOCAL, variables: { username, password } });
      const { id, token, error } = result?.data?.auth?.local || {};
      if (error) done(null, false);
      else done(null, { id, token });
    }));

    // need real world token convert
    passport.use(new BearerStrategy(async (token, done) => {
      const user = {
        "X-Hasura-Role": 'user',
        "X-Hasura-User-Id": token,
      };
      return done(null, user);
    }));

    passport.serializeUser((user, done) => {
      debug('serializeUser', user);
      done(null, { id: user.id, token: user.id });
    });

    passport.deserializeUser((id, done) => {
      debug('deserializeUser', id);
      done(null, { id, token: id });
    });
  });
};
