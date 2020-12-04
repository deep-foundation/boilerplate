import { ApolloServer, gql } from 'apollo-server-micro';
import Cors from 'micro-cors';
import Debug from 'debug';
import isInteger from 'lodash/isInteger';
import { generateApolloClient } from '../../../imports/hasura/client';
import NODE from '../../../imports/gql/NODE.gql';
import INSERT_NODES from '../../../imports/gql/INSERT_NODES.gql';
import { Handler } from '@deepcase/auth/hrs';
import random from 'lodash/random';

const debug = Debug('deepcase:auth:hrs');

const client = generateApolloClient({ secret: process.env.HASURA_SECRET });
const insertNode = async (client, objects: any) => {
  const result = await client.mutate({ mutation: INSERT_NODES, variables: { objects } });
  const id = result?.data?.insert_nodes?.returning?.[0]?.id;
  debug(`insert node #${id}`);
  return id;
};

const codesHash = {};

const { config, handler } = Handler({
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
    const code = `${random(0, 9)}${random(0, 9)}${random(0, 9)}${random(0, 9)}`;
    const id = Math.random().toString(36).slice(2);
    codesHash[id] = code;
    console.log({ address, id, code });
    return { id };
  },
  checkCode: ({ sendId, code }) => {
    if (!codesHash[sendId]) {
      return { error: '!id' };
    }
    if (codesHash[sendId] === code) {
      return { id: 'abc', token: 'abc' };
    } else {
      return { error: '!code' };
    }
  },
});

export { config };
export default handler;
