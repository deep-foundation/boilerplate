import axios, { AxiosResponse } from 'axios';
import Debug from 'debug';

const debug = Debug('deepcase:migrations');

const HASURA_PATH = process.env.HASURA_PATH;
const HASURA_SSL = !!+process.env.HASURA_SSL;
const HASURA_SECRET = process.env.HASURA_SECRET;

if (!HASURA_PATH) throw new Error('!HASURA_PATH');

export interface HasuraAxiosResponse extends AxiosResponse {
  error?: string;
}

export const hasura = {
  validateStatus: () => true,
  getError: (result: AxiosResponse): null | string => {
    const { status } = result;
    const error = status >= 200 && status < 300 ? null : result.statusText;
    return error;
  },
  sql: (sql: string) => hasura.query({
    type: 'run_sql',
    args: {
      sql,
    },
  }),
  query: async (data: any) => {
    debug('hasura:query', data?.type);
    const result: HasuraAxiosResponse = await axios({
      method: 'post',
      url: `http${HASURA_SSL ? 's' : ''}://${HASURA_PATH}/v1/query`,
      headers: {
        ...(HASURA_SECRET ? { 'x-hasura-admin-secret': HASURA_SECRET } : {}),
      },
      data,
      validateStatus: hasura.validateStatus,
    });
    result.error = hasura.getError(result);
    if (result.error) debug('error', result?.error, result?.data);
    return result;
  },
};

export const sql = (strings: TemplateStringsArray, ...expr: any[]) =>
  strings
    .map((str, index) => str + (expr.length > index ? String(expr[index]) : ''))
    .join('');

export default hasura;
