import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import fetch from 'node-fetch';

const HASURA_URL = process.env.HASURA_URL || 'localhost:8080/v1/graphql';
const HASURA_SSL = +process.env.HASURA_SSL;

const cache = new InMemoryCache();
const link = createHttpLink({
  uri: `http${HASURA_SSL ? 's' : ''}://${HASURA_URL || ''}`, fetch,
});


export const client = new ApolloClient({
  link,
  cache,

  name: 'deepcase-mp',
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
