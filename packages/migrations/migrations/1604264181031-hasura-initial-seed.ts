import hasura, { sql } from '../imports/hasura';

const ntn = process.env.NODES__TABLE_NAME || 'nodes';
const nsn = process.env.NODES__SCHEMA_NAME || 'public';

const nmpsn = process.env.NODES_MP__SCHEMA_NAME || 'public';
const nmptn = process.env.NODES_MP__TABLE_NAME || 'nodes__mp';

const INSERT_INITIAL_DATA = sql`
-- type type
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type rule
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type rule_subject
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type rule_object
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type rule_action
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type subject
INSERT INTO "nodes" ("type_id") VALUES (1);
`;

const DELETE_INITIAL_DATA = sql`
DELETE FROM "nodes" WHERE id in (1,2,3,4,5,6);
`;

export const up = async () => {
  await hasura.sql(INSERT_INITIAL_DATA);
};

export const down = async () => {
  await hasura.sql(DELETE_INITIAL_DATA);
};
