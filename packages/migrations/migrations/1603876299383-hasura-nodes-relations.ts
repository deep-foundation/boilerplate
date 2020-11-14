import hasura from '../imports/hasura';

export const ntn = process.env.NODES__TABLE_NAME || 'nodes';
export const nsn = process.env.NODES__SCHEMA_NAME || 'public';

export const up = async () => {
  await hasura.query({
    type: 'create_object_relationship',
    args: {
      table: ntn,
      name: 'from',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nsn,
            name: ntn,
          },
          column_mapping: {
            from_id: 'id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_object_relationship',
    args: {
      table: ntn,
      name: 'to',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nsn,
            name: ntn,
          },
          column_mapping: {
            to_id: 'id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_object_relationship',
    args: {
      table: ntn,
      name: 'type',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nsn,
            name: ntn,
          },
          column_mapping: {
            type_id: 'id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_array_relationship',
    args: {
      table: ntn,
      name: 'in',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nsn,
            name: ntn,
          },
          column_mapping: {
            id: 'to_id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_array_relationship',
    args: {
      table: ntn,
      name: 'out',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nsn,
            name: ntn,
          },
          column_mapping: {
            id: 'from_id',
          },
        },
      },
    },
  });
};

export const down = async () => {
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: 'from',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: 'to',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: 'type',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: 'in',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: 'out',
    },
  });
};
