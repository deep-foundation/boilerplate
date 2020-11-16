import github from '@deepcase/auth/passport/github';
import { applyPassport } from '@deepcase/auth/passport/index';
import Debug from 'debug';
import BearerStrategy from 'passport-http-bearer';
import LocalStrategy from 'passport-local';
import { Strategy as CustomStrategy } from 'passport-custom';
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

    // need real world token to user convert
    passport.use(new BearerStrategy(async (token, done) => {
      const user = {
        "X-Hasura-Role": 'user',
        "X-Hasura-User-Id": token,
      };
      return done(null, user);
    }));

    // need real world token to user convert
    passport.use('token', new CustomStrategy(async (req, done) => {
      const { token } = req.query;
      if (typeof(token) === 'string') {
        return done(null, { id: token, token });
      }
      return done(null, false);
    }));

    passport.serializeUser((result, done) => {
      debug('serializeUser', result);
      done(null, { id: result.id, token: result.id });
    });

    passport.deserializeUser((result, done) => {
      debug('deserializeUser', result);
      done(null, result);
    });
  });
};
