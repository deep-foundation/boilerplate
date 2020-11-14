import hasura from '../imports/hasura';

export const ntn = process.env.NODES__TABLE_NAME || 'nodes';
export const nsn = process.env.NODES__SCHEMA_NAME || 'public';

export const nmpsn = process.env.NODES_MP__SCHEMA_NAME || 'public';
export const nmptn = process.env.NODES_MP__TABLE_NAME || 'nodes__mp';

export const up = async () => {
  await hasura.query({
    type: 'create_array_relationship',
    args: {
      table: ntn,
      name: '_by_item',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nmpsn,
            name: nmptn,
          },
          column_mapping: {
            id: 'item_id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_array_relationship',
    args: {
      table: ntn,
      name: '_by_path_item',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nmpsn,
            name: nmptn,
          },
          column_mapping: {
            id: 'path_item_id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_array_relationship',
    args: {
      table: ntn,
      name: '_by_root',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nmpsn,
            name: nmptn,
          },
          column_mapping: {
            id: 'root_id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_object_relationship',
    args: {
      table: nmptn,
      name: 'item',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nsn,
            name: ntn,
          },
          column_mapping: {
            item_id: 'id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_object_relationship',
    args: {
      table: nmptn,
      name: 'path_item',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nsn,
            name: ntn,
          },
          column_mapping: {
            path_item_id: 'id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_object_relationship',
    args: {
      table: nmptn,
      name: 'root',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nsn,
            name: ntn,
          },
          column_mapping: {
            root_id: 'id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_array_relationship',
    args: {
      table: nmptn,
      name: 'by_item',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nmpsn,
            name: nmptn,
          },
          column_mapping: {
            item_id: 'item_id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_array_relationship',
    args: {
      table: nmptn,
      name: 'by_path_item',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nmpsn,
            name: nmptn,
          },
          column_mapping: {
            path_item_id: 'path_item_id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_array_relationship',
    args: {
      table: nmptn,
      name: 'by_position',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nmpsn,
            name: nmptn,
          },
          column_mapping: {
            position_id: 'position_id',
          },
        },
      },
    },
  });

  await hasura.query({
    type: 'create_array_relationship',
    args: {
      table: nmptn,
      name: 'by_root',
      using: {
        manual_configuration: {
          remote_table: {
            schema: nmpsn,
            name: nmptn,
          },
          column_mapping: {
            root_id: 'root_id',
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
      relationship: '_by_item',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: '_by_path_item',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: ntn,
      relationship: '_by_root',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: nmptn,
      relationship: 'item',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: nmptn,
      relationship: 'path_item',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: nmptn,
      relationship: 'root',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: nmptn,
      relationship: 'by_item',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: nmptn,
      relationship: 'by_path_item',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: nmptn,
      relationship: 'by_position',
    },
  });
  await hasura.query({
    type: 'drop_relationship',
    args: {
      table: nmptn,
      relationship: 'by_root',
    },
  });
};
