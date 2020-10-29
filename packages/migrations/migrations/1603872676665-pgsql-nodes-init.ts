import hasura from '../imports/hasura';

const ntn = process.env.NODES__TABLE_NAME || 'nodes';
const nsn = process.env.NODES__SCHEMA_NAME || 'public';

const UP = `CREATE TABLE ${nsn}."${ntn}" (
  id serial primary key,
  from_id integer,
  to_id integer,
  type_id integer
);`;

const DOWN = `DROP TABLE ${nsn}."${ntn}";`;

export const up = async () => {
  await hasura.sql(UP);
};

export const down = async () => {
  await hasura.sql(DOWN);
};
