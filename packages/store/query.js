"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQueryStore = exports.QueryStoreProvider = exports.fakeRouter = exports.QueryStoreContext = void 0;
const router_1 = require("next/router");
const react_1 = __importStar(require("react"));
const debug_1 = __importDefault(require("debug"));
const store_1 = require("./store");
const debug = debug_1.default('deepcase:store:use-store-query');
exports.QueryStoreContext = react_1.createContext(store_1.defaultContext);
exports.fakeRouter = {};
exports.QueryStoreProvider = ({ context = exports.QueryStoreContext, children, }) => {
    const [useStore] = react_1.useState(() => {
        return function useStore(key, defaultValue) {
            const router = router_1.useRouter();
            const { query, pathname, push } = router || exports.fakeRouter;
            const [setValue] = react_1.useState(() => (value) => {
                try {
                    push({
                        pathname,
                        query: Object.assign(Object.assign({}, query), { [key]: JSON.stringify(value) }),
                    });
                }
                catch (error) {
                    debug('setStore:error', { error, key, defaultValue, value });
                }
            });
            let value;
            try {
                value = query && query[key] && JSON.parse(query[key]);
            }
            catch (error) {
                debug('value:error', { error, key, defaultValue, query });
            }
            return [value || defaultValue, setValue];
        };
    });
    return react_1.default.createElement(context.Provider, { value: { useStore } }, children);
};
function useQueryStore(key, defaultValue, context = exports.QueryStoreContext) {
    return store_1.useStore(key, defaultValue, context);
}
exports.useQueryStore = useQueryStore;
//# sourceMappingURL=query.js.map