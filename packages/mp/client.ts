require('dotenv').config();

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import fetch from 'node-fetch';

const HASURA_PATH = process.env.HASURA_PATH;
const HASURA_SSL = +process.env.HASURA_SSL;
const HASURA_SECRET = process.env.HASURA_SECRET;

const APP_NAME = process.env.APP_NAME || '@deepcase/mp';

const cache = new InMemoryCache();
const link = createHttpLink({
  uri: `http${HASURA_SSL ? 's' : ''}://${HASURA_PATH || ''}/v1/graphql`, fetch,
  headers: {
    ...(HASURA_SECRET ? { 'x-hasura-admin-secret': HASURA_SECRET } : {}),
  },
});

export const client = new ApolloClient({
  link,
  cache,

  name: APP_NAME,
  version: '0.0.0',

  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});
