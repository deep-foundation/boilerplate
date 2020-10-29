import axios from 'axios';

const HASURA_PATH = process.env.HASURA_PATH;
const HASURA_SSL = !!+process.env.HASURA_SSL;

if (!HASURA_PATH) throw new Error('!HASURA_PATH');

const hasura = {
  sql: (sql: string) => axios({
    method: 'post',
    url: `http${HASURA_SSL ? 's' : ''}://${HASURA_PATH}/v1/query`,
    data: {
      type: 'run_sql',
      args: {
        sql,
      },
    },
  }),
  post: (data: any) => axios({
    method: 'post',
    url: `http${HASURA_SSL ? 's' : ''}://${HASURA_PATH}/v1/query`,
    data,
  }),
};

export const sql = (strings: TemplateStringsArray, ...expr: any[]) =>
  strings
    .map((str, index) => str + (expr.length > index ? String(expr[index]) : ''))
    .join('');

export default hasura;
