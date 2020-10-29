import hasura from '../imports/hasura';

const ntn = process.env.NODES__TABLE_NAME || 'nodes';
const nsn = process.env.NODES__SCHEMA_NAME || 'public';

export const up = async () => {
  await hasura.post({
    type: 'track_table',
    args: {
      schema: nsn,
      name: ntn,
    },
  });
};

export const down = async () => {
  await hasura.post({
    type: 'untrack_table',
    args: {
      table: {
        schema: nsn,
        name: ntn,
      },
    },
  });
};
