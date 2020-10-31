import hasura from '../imports/hasura';

const nmpsn = process.env.NODES_MP__SCHEMA_NAME || 'public';
const nmptn = process.env.NODES_MP__TABLE_NAME || 'nodes__mp';

const UP = `CREATE TABLE ${nmpsn}."${nmptn}" (
  id serial,
  item_id integer NOT NULL,
  path_item_id integer NOT NULL,
  path_item_depth integer NOT NULL,
  root_id integer NOT NULL,
  position_id text DEFAULT public.gen_random_uuid() NOT NULL
);`;

const DOWN = `DROP TABLE ${nmpsn}."${nmptn}";`;

export const up = async () => {
  await hasura.sql(UP);
};

export const down = async () => {
  await hasura.sql(DOWN);
};
