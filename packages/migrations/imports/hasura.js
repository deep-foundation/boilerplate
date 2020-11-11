"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const axios_1 = __importDefault(require("axios"));
axios_1.default.defaults.validateStatus = () => true;
const HASURA_PATH = process.env.HASURA_PATH;
const HASURA_SSL = !!+process.env.HASURA_SSL;
const HASURA_SECRET = process.env.HASURA_SECRET;
if (!HASURA_PATH)
    throw new Error('!HASURA_PATH');
const hasura = {
    sql: (sql) => axios_1.default({
        method: 'post',
        url: `http${HASURA_SSL ? 's' : ''}://${HASURA_PATH}/v1/query`,
        headers: Object.assign({}, (HASURA_SECRET ? { 'x-hasura-admin-secret': HASURA_SECRET } : {})),
        data: {
            type: 'run_sql',
            args: {
                sql,
            },
        },
    }),
    query: (data) => axios_1.default({
        method: 'post',
        url: `http${HASURA_SSL ? 's' : ''}://${HASURA_PATH}/v1/query`,
        headers: Object.assign({}, (HASURA_SECRET ? { 'x-hasura-admin-secret': HASURA_SECRET } : {})),
        data,
    }),
};
exports.sql = (strings, ...expr) => strings
    .map((str, index) => str + (expr.length > index ? String(expr[index]) : ''))
    .join('');
exports.default = hasura;
//# sourceMappingURL=hasura.js.map