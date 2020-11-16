import { ApolloServer, gql } from 'apollo-server-micro';
import Cors from 'micro-cors';
import Debug from 'debug';
import isInteger from 'lodash/isInteger';
import { generateApolloClient } from '../../../imports/hasura/client';
import NODE from '../../../imports/gql/NODE.gql';
import INSERT_NODES from '../../../imports/gql/INSERT_NODES.gql';

const debug = Debug('deepcase:auth:hrs');

const client = generateApolloClient({ secret: process.env.HASURA_SECRET });
const insertNode = async (client, objects: any) => {
  const result = await client.mutate({ mutation: INSERT_NODES, variables: { objects } });
  const id = result?.data?.insert_nodes?.returning?.[0]?.id;
  debug(`insert node #${id}`);
  return id;
};

const typeDefs = gql`
  type AuthResult {
    id: String
    token: String
    error: String
  }
  type Auth {
    local(username: String, password: String): AuthResult
    sendCode(address: String): String
    checkCode(sendId: String, code: String): AuthResult
  }
  type Query {
    auth: Auth
  }
`;

const resolvers = {
  Query: {
    auth: () => ({
      local: async ({ username, password }) => {
        debug('local', { username });

        const nodeId = +username;
        // fake register
        if (+username === 0 && +password === 0) {
          const nodeId = await insertNode(client, { type_id: 6 });
          if (typeof(nodeId) === 'number') return { id: `${nodeId}`, token: `${nodeId}` };
        } else if (username === 'abc' && password === 'abc') {
          return { id: 'abc', token: 'abc' };
        } else if (isInteger(nodeId)) {
          const result = await client.query({ query: NODE, variables: { nodeId } });
          if (result?.data?.results?.[0] && +username === +password) return { id: `${nodeId}`, token: `${nodeId}` };
        }
        return { error: '!user' };
      },
      sendCode: ({ address }) => {
        if (address === 'abc') return 'abc';
        return { error: '!address' };
      },
      checkCode: ({ sendId, code }) => {
        if (sendId === 'abc' && code === 'abc') return { id: 'abc', token: 'abc' };
        return { error: '!code' };
      },
    }),
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return {};
  },
});

const handler = apolloServer.createHandler({ path: '/api/auth/hrs' });

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS'],
});

export default cors(handler);
