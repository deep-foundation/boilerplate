import hasura, { sql } from '../imports/hasura';

const nmpsn = process.env.NODES_MP__SCHEMA_NAME || 'public';
const nmptn = process.env.NODES_MP__TABLE_NAME || 'nodes__mp';

const UP = sql`CREATE TABLE ${nmpsn}."${nmptn}" (
  id integer,
  item_id integer,
  path_item_id integer,
  path_item_depth integer,
  root_id integer,
  position_id text DEFAULT public.gen_random_uuid()
);
CREATE SEQUENCE public.${nmptn}_id_seq
AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.${nmptn}_id_seq OWNED BY public.${nmptn}.id;
ALTER TABLE ONLY public.${nmptn} ALTER COLUMN id SET DEFAULT nextval('public.${nmptn}_id_seq'::regclass);
`;

const DOWN = `DROP TABLE ${nmpsn}."${nmptn}";`;

export const up = async () => {
  await hasura.sql(UP);
};

export const down = async () => {
  await hasura.sql(DOWN);
};
