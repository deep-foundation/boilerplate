import hasura from '../imports/hasura';

export const ntn = process.env.NODES__TABLE_NAME || 'nodes';
export const nsn = process.env.NODES__SCHEMA_NAME || 'public';

export const up = async () => {
  await hasura.query({
    type: 'track_table',
    args: {
      schema: nsn,
      name: ntn,
    },
  });
};

export const down = async () => {
  await hasura.query({
    type: 'untrack_table',
    args: {
      table: {
        schema: nsn,
        name: ntn,
      },
    },
  });
};
