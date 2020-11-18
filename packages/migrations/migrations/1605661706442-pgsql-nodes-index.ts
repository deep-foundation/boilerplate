import hasura, { sql } from '../imports/hasura';

export const ntn = process.env.NODES__TABLE_NAME || 'nodes';
export const nsn = process.env.NODES__SCHEMA_NAME || 'public';

export const up = async () => {
  await hasura.sql(`create index if not exists ${ntn}_index_id_hash on ${nsn}."${ntn}" using hash (id);`);
  await hasura.sql(`create unique index if not exists ${ntn}_index_id_btree on ${nsn}."${ntn}" using btree (id);`);
  await hasura.sql(`create index if not exists ${ntn}_index_from_hash on ${nsn}."${ntn}" using hash (from_id);`);
  await hasura.sql(`create index if not exists ${ntn}_index_from_btree on ${nsn}."${ntn}" using btree (from_id);`);
  await hasura.sql(`create index if not exists ${ntn}_index_to_hash on ${nsn}."${ntn}" using hash (to_id);`);
  await hasura.sql(`create index if not exists ${ntn}_index_to_btree on ${nsn}."${ntn}" using btree (to_id);`);
};

export const down = async () => {
  await hasura.sql(`drop index if exists ${ntn}_index_id_hash;`);
  await hasura.sql(`drop index if exists ${ntn}_index_id_btree;`);
  await hasura.sql(`drop index if exists ${ntn}_index_from_hash;`);
  await hasura.sql(`drop index if exists ${ntn}_index_from_btree;`);
  await hasura.sql(`drop index if exists ${ntn}_index_to_hash;`);
  await hasura.sql(`drop index if exists ${ntn}_index_to_btree;`);
};
