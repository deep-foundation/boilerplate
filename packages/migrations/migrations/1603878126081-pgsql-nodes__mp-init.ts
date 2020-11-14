import hasura, { sql } from '../imports/hasura';

export const nmpsn = process.env.NODES_MP__SCHEMA_NAME || 'public';
export const nmptn = process.env.NODES_MP__TABLE_NAME || 'nodes__mp';

export const UP = sql`CREATE TABLE ${nmpsn}."${nmptn}" (
  id integer,
  item_id integer,
  path_item_id integer,
  path_item_depth integer,
  root_id integer,
  position_id text DEFAULT ${nmpsn}.gen_random_uuid()
);
CREATE SEQUENCE ${nmpsn}.${nmptn}_id_seq
AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE ${nmpsn}.${nmptn}_id_seq OWNED BY ${nmpsn}.${nmptn}.id;
ALTER TABLE ONLY ${nmpsn}.${nmptn} ALTER COLUMN id SET DEFAULT nextval('${nmpsn}.${nmptn}_id_seq'::regclass);
`;

export const DOWN = `DROP TABLE ${nmpsn}."${nmptn}";`;

export const up = async () => {
  await hasura.sql(UP);
};

export const down = async () => {
  await hasura.sql(DOWN);
};
