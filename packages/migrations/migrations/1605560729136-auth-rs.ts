import hasura, { sql } from '../imports/hasura';

export const arsn = process.env.AUTH_RS_NAME || 'auth';
export const arsp = process.env.AUTH_RS_PATH || 'http://dockerhost:4000/api/auth/hrs';

export const up = async () => {
  await hasura.query({
    type: 'add_remote_schema',
    args: {
      name: arsn,
      definition: {
        url: arsp,
        headers: [{ name: 'X-Deepcase-Client', value: 'Hasura' }],
        forward_client_headers: true,
        timeout_seconds: 60,
      },
    },
  });
};

export const down = async () => {
  await hasura.query({
    type: 'remove_remote_schema',
    args: {
      name: arsn,
    },
  });
};
