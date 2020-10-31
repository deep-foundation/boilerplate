import { applyPassport } from '@deepcase/auth/passport/index';
import github from '@deepcase/auth/passport/github';
import LocalStrategy from 'passport-local';
import Debug from 'debug';
import isInteger from 'lodash/isInteger';
import { generateApolloClient } from './hasura/client';
import NODE from './gql/NODE.gql';

const debug = Debug('deepcase:passport');

export const initPassport = () => {
  const client = generateApolloClient({});

  return applyPassport((passport) => {
    passport.use(github);

    passport.use(new LocalStrategy(async (username, password, done) => {
      debug('LocalStrategy', { username, password });
      const nodeId = +username;
      if (username === 'abc' && password === 'abc') done(null, { id: 'abc' });
      else if (isInteger(nodeId)) {
        const result = await client.query({ query: NODE, variables: { nodeId } });
        if (result?.data?.results?.[0] && +username === +password) done(null, { id: nodeId });
        else done(null, false);
      } else done(null, false);
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
