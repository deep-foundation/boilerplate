require('dotenv').config();

import { client } from './client';
import Debug from 'debug';
import { gql } from 'apollo-boost';
import { check } from './check';

const debug = Debug('deepcase-mp:test');

const DELAY = +process.env.DELAY || 0;
const delay = time => new Promise(res => setTimeout(res, time));

const itDelay = () => {
  if (DELAY) {
    it('delay', async () => {
      await delay(DELAY);
    });
  }
};

const insertNode = async () => {
  const result = await client.mutate({ mutation: gql`mutation InsertNode {
    insert_nodes(objects: {}) { returning { id } }
  }` });
  const id = result?.data?.insert_nodes?.returning?.[0]?.id;
  debug(`insert node #${id}`);
  return id;
};
const insertLink = async (fromId: number, toId: number) => {
  const result = await client.mutate({ mutation: gql`mutation InsertLink($fromId: Int, $toId: Int) {
    insert_nodes(objects: { from_id: $fromId, to_id: $toId }) { returning { id } }
  }`, variables: { fromId, toId } });
  const id = result?.data?.insert_nodes?.returning?.[0]?.id;
  debug(`insert link #${id} (#${fromId} -> #${toId})`);
  return id;
};
const clear = async () => {
  await client.mutate({ mutation: gql`mutation Clear {
    delete_nodes(where: {}) { affected_rows }
    delete_nodes__mp(where: {}) { affected_rows }
  }
  ` });
  debug(`clear`);
};
const deleteNode = async (id: number) => {
  const result = await client.mutate({ mutation: gql`mutation DeleteNode($id: Int) {
    delete_nodes(where: { id: { _eq: $id } }) { returning { id } }
  }`, variables: { id } });
  debug(`delete node #${id}`);
  return result?.data?.delete_nodes?.returning?.[0]?.id;
};

beforeAll(async () => {
  jest.setTimeout(100000);
});

it('+1', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  await check({ a, b });
});
itDelay();
it('-1', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  await deleteNode(a);
  await check({ a, b });
});
itDelay();
it('+2', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  await check({ a, b, c });
});
itDelay();
it('-2', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  await deleteNode(c);
  await check({ a, b, c });
});
itDelay();
it('+3', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  const d = await insertNode();
  const e = await insertLink(b, d);
  await check({ a, b, c, d, e });
});
itDelay();
it('-3', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  const d = await insertNode();
  const e = await insertLink(b, d);
  await deleteNode(e);
  await check({ a, b, c, d, e });
});
itDelay();
it('+4', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  const d = await insertNode();
  const e = await insertLink(b, d);
  const x = await insertNode();
  const y = await insertLink(x, a);
  await check({ a, b, c, d, e, x, y });
});
itDelay();
it('-4', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  const d = await insertNode();
  const e = await insertLink(b, d);
  const x = await insertNode();
  const y = await insertLink(x, a);
  await deleteNode(y);
  await check({ a, b, c, d, e, x, y });
});
itDelay();
it('+5', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  const d = await insertNode();
  const e = await insertLink(b, d);
  const x = await insertNode();
  const y = await insertLink(x, b);
  await check({ a, b, c, d, e, x, y });
});
itDelay();
it('-5', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  const d = await insertNode();
  const e = await insertLink(b, d);
  const x = await insertNode();
  const y = await insertLink(x, b);
  await deleteNode(y);
  await check({ a, b, c, d, e, x, y });
});
itDelay();
it('+7', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  const d = await insertNode();
  const e = await insertLink(b, d);
  const y = await insertLink(a, d);
  await check({ a, b, c, d, e, y });
});
itDelay();
it('-7', async () => {
  await clear();
  const a = await insertNode();
  const b = await insertNode();
  const c = await insertLink(a, b);
  const d = await insertNode();
  const e = await insertLink(b, d);
  const y = await insertLink(a, d);
  await deleteNode(y);
  await check({ a, b, c, d, e, y });
});
