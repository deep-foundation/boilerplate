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
exports.useLocalStore = exports.LocalStoreProvider = exports.LocalContext = void 0;
const react_1 = __importStar(require("react"));
const events_1 = require("events");
const debug_1 = __importDefault(require("debug"));
const store_1 = require("./store");
const debug = debug_1.default('deepcase:use-store:local');
const localStorageEvent = new events_1.EventEmitter();
exports.LocalContext = react_1.createContext(store_1.defaultContext);
exports.LocalStoreProvider = ({ context = exports.LocalContext, children, }) => {
    const [useStore] = react_1.useState(() => {
        return function useStore(key, defaultValue) {
            const [value, _setValue] = react_1.useState(typeof (localStorage) === 'undefined' ? JSON.stringify(defaultValue) : localStorage.getItem(key));
            react_1.useEffect(() => {
                if (typeof (localStorage.getItem(key)) === 'undefined') {
                    const json = JSON.stringify(defaultValue);
                    localStorage.setItem(key, json);
                    _setValue(json);
                }
                const fn = (value) => _setValue(value);
                localStorageEvent.on(key, fn);
                return () => {
                    localStorageEvent.off(key, fn);
                };
            }, []);
            const [setValue] = react_1.useState(() => value => {
                const json = JSON.stringify(value);
                localStorage.setItem(key, json);
                _setValue(json);
                localStorageEvent.emit(key, json);
            });
            return [JSON.parse(value), setValue];
        };
    });
    return react_1.default.createElement(context.Provider, { value: { useStore } }, children);
};
function useLocalStore(key, defaultValue, context = exports.LocalContext) {
    return store_1.useStore(key, defaultValue, context);
}
exports.useLocalStore = useLocalStore;
//# sourceMappingURL=local.js.map