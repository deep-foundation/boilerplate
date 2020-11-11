import _ from 'lodash';
import { HttpLink, InMemoryCache } from 'apollo-boost';
import ApolloClient from 'apollo-client';
import { ApolloLink, concat, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import fetch from 'node-fetch';

interface IOptions {
  initialStore?: any;
  token?: string;
  secret?: string;
  ssl?: Boolean;
  path?: string;
  headers?: any;
}

export function generateHeaders(options: IOptions) {
  const headers: IOptions['headers'] = {};
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.secret) headers['x-hasura-admin-secret'] = options.secret;
  return headers;
}

/**
 * Generate ApolloClient with ssr and subscriptions support.
 * @description
 * By default create anonmous connection.
 * You can provide token for Authorization Bearer or secret for x-hasura-admin-secret headers.
 */
export function generateApolloClient(
  options: IOptions,
): ApolloClient<any> {
  const headers = generateHeaders(options);
  const ssl = typeof(options.ssl) === 'boolean' || !!(+process.env.HASURA_SSL);
  const path = typeof(options.path) === 'string' || `${process.env.HASURA_PATH}/v1/graphql`;

  const httpLink = new HttpLink({
    uri: `http${ssl ? 's' : ''}://${path || ''}`,
    // @ts-ignore
    fetch,
    headers,
  });

  // @ts-ignore
  const wsLink = !process.browser
    ? null
    : new WebSocketLink({
      uri: `ws${ssl ? 's' : ''}://${path || ''}`,
      options: {
        lazy: true,
        reconnect: true,
        connectionParams: () => ({
          headers,
        }),
      },
    });

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers,
    });

    return forward(operation);
  });

  // @ts-ignore
  const link = !process.browser
    ? httpLink
    : split(
        ({ query }) => true,
        wsLink,
        httpLink,
      );

  return new ApolloClient({
    ssrMode: true,
    link: concat(authMiddleware, link),
    connectToDevTools: true,
    cache: new InMemoryCache({
      freezeResults: false,
      resultCaching: false,
    }).restore(options.initialStore || {}),
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
}
