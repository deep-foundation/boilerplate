import hasura, { sql } from '../imports/hasura';

const ntn = process.env.NODES__TABLE_NAME || 'nodes';
const nsn = process.env.NODES__SCHEMA_NAME || 'public';

const nmpsn = process.env.NODES_MP__SCHEMA_NAME || 'public';
const nmptn = process.env.NODES_MP__TABLE_NAME || 'nodes__mp';

const INSERT_INITIAL_DATA = sql`
-- type 1 type
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type 2 rule
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type 3 rule_subject
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type 4 rule_object
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type 5 rule_action
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type 6 subject
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type 7 own
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type 8 selector
INSERT INTO "nodes" ("type_id") VALUES (1);
-- type 9 selection
INSERT INTO "nodes" ("type_id") VALUES (1);
`;

const DELETE_INITIAL_DATA = sql`
DELETE FROM "nodes" WHERE id in (1,2,3,4,5,6,7,8,9);
`;

export const up = async () => {
  await hasura.sql(INSERT_INITIAL_DATA);
};

export const down = async () => {
  await hasura.sql(DELETE_INITIAL_DATA);
};
