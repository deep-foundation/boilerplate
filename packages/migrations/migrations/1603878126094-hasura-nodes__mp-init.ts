import hasura from '../imports/hasura';

export const nmpsn = process.env.NODES_MP__SCHEMA_NAME || 'public';
export const nmptn = process.env.NODES_MP__TABLE_NAME || 'nodes__mp';

export const up = async () => {
  await hasura.query({
    type: 'track_table',
    args: {
      schema: nmpsn,
      name: nmptn,
    },
  });
};

export const down = async () => {
  await hasura.query({
    type: 'untrack_table',
    args: {
      table: {
        schema: nmpsn,
        name: nmptn,
      },
    },
  });
};
