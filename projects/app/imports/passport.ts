import { applyPassport } from '@deepcase/auth/passport/index';
import github from '@deepcase/auth/passport/github';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';
import Debug from 'debug';
import isInteger from 'lodash/isInteger';
import { generateApolloClient } from './hasura/client';
import NODE from './gql/NODE.gql';
import INSERT_NODES from './gql/INSERT_NODES.gql';

const debug = Debug('deepcase:passport');

export const insertNode = async (client, objects: any) => {
  const result = await client.mutate({ mutation: INSERT_NODES, variables: { objects } });
  const id = result?.data?.insert_nodes?.returning?.[0]?.id;
  debug(`insert node #${id}`);
  return id;
};

export const initPassport = () => {
  const client = generateApolloClient({ secret: process.env.HASURA_SECRET });

  return applyPassport((passport) => {
    passport.use(github);

    passport.use(new LocalStrategy(async (username, password, done) => {
      debug('LocalStrategy', { username, password });
      const nodeId = +username;
      // fake register
      if (+username === 0 && +password === 0) {
        const nodeId = await insertNode(client, { type_id: 6 });
        if (typeof(nodeId) === 'number') done(null, { id: nodeId });
        else done(null, false);
      } else if (username === 'abc' && password === 'abc') done(null, { id: 'abc' });
      else if (isInteger(nodeId)) {
        const result = await client.query({ query: NODE, variables: { nodeId } });
        if (result?.data?.results?.[0] && +username === +password) done(null, { id: nodeId });
        else done(null, false);
      } else done(null, false);
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
