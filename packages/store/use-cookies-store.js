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
exports.useCookiesStore = exports.CookiesStoreProviderCore = exports.CookiesStoreProvider = exports.CookiesStoreContext = void 0;
const react_1 = __importStar(require("react"));
const react_cookie_1 = require("react-cookie");
const universal_cookie_1 = __importDefault(require("universal-cookie"));
const debug_1 = __importDefault(require("debug"));
const use_store_1 = require("./use-store");
const debug = debug_1.default('deepcase:use-store:cookie');
exports.CookiesStoreContext = react_1.createContext(use_store_1.defaultContext);
exports.CookiesStoreProvider = ({ context = exports.CookiesStoreContext, children, defaultCookies, options = {}, }) => {
    const [cookies] = react_1.useState(() => defaultCookies && new universal_cookie_1.default(defaultCookies));
    return react_1.default.createElement(react_cookie_1.CookiesProvider, { cookies: cookies },
        react_1.default.createElement(exports.CookiesStoreProviderCore, { options: options, context: context, defaultCookies: defaultCookies }, children));
};
exports.CookiesStoreProviderCore = ({ context = exports.CookiesStoreContext, children, defaultCookies = {}, options = {}, }) => {
    const [useStore] = react_1.useState(() => {
        return function useStore(key, defaultValue) {
            const [cookie, setCookie] = react_cookie_1.useCookies([key]);
            const [setValue] = react_1.useState(() => value => setCookie(key, { value }, options));
            let defaultCookie;
            try {
                defaultCookie = defaultCookies && defaultCookies[key] && typeof (defaultCookies[key]) === 'string' ? JSON.parse(defaultCookies[key]).value : defaultCookies[key];
            }
            catch (error) {
                debug('setStore:error', { error, key, defaultValue, defaultCookie: defaultCookies[key] });
            }
            return [(cookie[key] && cookie[key].value) || (defaultCookies && defaultCookie) || defaultValue, setValue];
        };
    });
    return react_1.default.createElement(context.Provider, { value: { useStore } }, children);
};
function useCookiesStore(key, defaultValue, context = exports.CookiesStoreContext) {
    return use_store_1.useStore(key, defaultValue, context);
}
exports.useCookiesStore = useCookiesStore;
//# sourceMappingURL=use-cookies-store.js.map