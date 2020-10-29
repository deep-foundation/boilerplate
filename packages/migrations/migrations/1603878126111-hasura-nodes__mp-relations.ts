import hasura from '../imports/hasura';

const ntn = process.env.NODES__TABLE_NAME || 'nodes';
const nsn = process.env.NODES__SCHEMA_NAME || 'public';

const nmpsn = process.env.NODES_MP__SCHEMA_NAME || 'public';
const nmptn = process.env.NODES_MP__TABLE_NAME || 'nodes__mp';

export const up = async () => {
  await hasura.post({
    type: 'create_array_relationship',
    args: {
      table: ntn,
      name: '_by_item',
      using: {
        manual_configuration: {
          remote_table: {
            schema: 'public',
            name: 'nodes__mp',
          },
          column_mapping: {
            id: 'item_id',
          },
        },
      },
    },
  });

  await hasura.post({
    type: 'create_array_relationship',
    args: {
      table: ntn,
      name: '_by_path_item',
      using: {
        manual_configuration: {
          remote_table: {
            schema: 'public',
            name: 'nodes__mp',
          },
          column_mapping: {
            id: 'path_item_id',
          },
        },
      },
    },
  });

  await hasura.post({
    type: 'create_array_relationship',
    args: {
      table: ntn,
      name: '_by_root',
      using: {
        manual_configuration: {
          remote_table: {
            schema: 'public',
            name: 'nodes__mp',
          },
          column_mapping: {
            id: 'root_id',
          },
        },
      },
    },
  });
};

export const down = async () => {
  await hasura.post({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: '_by_item',
    },
  });
  await hasura.post({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: '_by_path_item',
    },
  });
  await hasura.post({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: '_by_root',
    },
  });
};
