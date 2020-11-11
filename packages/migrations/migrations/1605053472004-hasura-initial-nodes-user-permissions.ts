import hasura, { sql } from '../imports/hasura';

const ntn = process.env.NODES__TABLE_NAME || 'nodes';
const nsn = process.env.NODES__SCHEMA_NAME || 'public';

export const up = async () => {
  await hasura.query({
    type : 'create_insert_permission',
    args : {
      table : ntn,
      role : 'user',
      permission : {
        check : {},
        set: {},
        columns: '*',
      },
    },
  });
  await hasura.query({
    type : 'create_select_permission',
    args : {
      table : ntn,
      role : 'user',
      permission : {
        filter : {},
        columns: '*',
      },
    },
  });
  await hasura.query({
    type : 'create_update_permission',
    args : {
      table : ntn,
      role : 'user',
      permission : {
        filter : {},
        check : {},
        columns: '*',
      },
    },
  });
  await hasura.query({
    type : 'create_delete_permission',
    args : {
      table : ntn,
      role : 'user',
      permission : {
        filter : {},
      },
    },
  });
};

export const down = async () => {
  await hasura.query({
    type : 'drop_insert_permission',
    args : {
      table : ntn,
      role : 'user',
    },
  });
  await hasura.query({
    type : 'drop_select_permission',
    args : {
      table : ntn,
      role : 'user',
    },
  });
  await hasura.query({
    type : 'drop_update_permission',
    args : {
      table : ntn,
      role : 'user',
    },
  });
  await hasura.query({
    type : 'drop_delete_permission',
    args : {
      table : ntn,
      role : 'user',
    },
  });
};
