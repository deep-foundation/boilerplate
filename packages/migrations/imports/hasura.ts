import axios from 'axios';

axios.defaults.validateStatus = () => true;

const HASURA_PATH = process.env.HASURA_PATH;
const HASURA_SSL = !!+process.env.HASURA_SSL;
const HASURA_SECRET = process.env.HASURA_SECRET;

if (!HASURA_PATH) throw new Error('!HASURA_PATH');

const hasura = {
  sql: (sql: string) => hasura.query({
    type: 'run_sql',
    args: {
      sql,
    },
  }),
  query: (data: any) => axios({
    method: 'post',
    url: `http${HASURA_SSL ? 's' : ''}://${HASURA_PATH}/v1/query`,
    headers: {
      ...(HASURA_SECRET ? { 'x-hasura-admin-secret': HASURA_SECRET } : {}),
    },
    data,
  }),
};

export const sql = (strings: TemplateStringsArray, ...expr: any[]) =>
  strings
    .map((str, index) => str + (expr.length > index ? String(expr[index]) : ''))
    .join('');

export default hasura;
