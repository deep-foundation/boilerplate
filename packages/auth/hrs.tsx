import { ApolloServer, gql } from 'apollo-server-micro';
import Cors from 'micro-cors';
import Debug from 'debug';
import isInteger from 'lodash/isInteger';

export const debug = Debug('deepcase:auth:hrs');

export const typeDefs = gql`
  type AuthResult {
    id: String
    token: String
    error: String
  }
  type AuthSendResult {
    id: String
    error: String
  }
  type Auth {
    local(username: String, password: String): AuthResult
    sendCode(address: String): AuthSendResult
    checkCode(sendId: String, code: String): AuthResult
  }
  type Query {
    auth: Auth
  }
`;

export interface IAuthQueryResult {
  id?: string;
  token?: string;
  error?: string;
}

export interface IAuthSendResult {
  id?: string;
  error?: string;
}

export interface IAuthQueryResolvers {
  local: (args: { username: string; password: string; }, context: any, info: any) => IAuthQueryResult | Promise<IAuthQueryResult>;
  sendCode: (args: { address: string }, context: any, info: any) => IAuthSendResult | Promise<IAuthSendResult>;
  checkCode: (args: { sendId: string; code: string; }, context: any, info: any) => IAuthQueryResult | Promise<IAuthQueryResult>;
}

export const generateResolvers = (queryResolvers: IAuthQueryResolvers) => {
  const resolvers = {
    Query: {
      auth: () => (queryResolvers),
    },
  };
  return resolvers;
};

export const Handler = (resolvers?: IAuthQueryResolvers) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: generateResolvers(resolvers),
    context: () => {
      return {};
    },
  });
  const handler = apolloServer.createHandler({ path: '/api/auth/hrs' });
  const config = {
    api: {
      bodyParser: false,
    },
  };

  const cors = Cors({
    allowMethods: ['POST', 'OPTIONS'],
  });
 
  return {
    handler: cors(handler),
    config,
  };
};
