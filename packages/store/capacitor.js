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
exports.useCapacitorStore = exports.CapacitorStoreProvider = exports.CapacitorStoreContext = void 0;
const react_1 = __importStar(require("react"));
const events_1 = require("events");
const lodash_1 = require("lodash");
const core_1 = require("@capacitor/core");
const debug_1 = __importDefault(require("debug"));
const store_1 = require("./store");
const debug = debug_1.default('deepcase:use-store:capacitor');
const capacitorStorageEvent = new events_1.EventEmitter();
exports.CapacitorStoreContext = react_1.createContext(store_1.defaultContext);
exports.CapacitorStoreProvider = ({ context = exports.CapacitorStoreContext, children, fetchInterval = 5000, }) => {
    const [useStore] = react_1.useState(() => {
        return function useStore(key, defaultValue) {
            const getStateRef = react_1.useRef();
            const intervalRef = react_1.useRef();
            const [state, setState] = react_1.useState(defaultValue);
            const [setValue] = react_1.useState(() => (value) => {
                debug('setValue', { key, defaultValue, value });
                core_1.Storage.set({ key, value: JSON.stringify(value) }).then(() => setState(value));
                capacitorStorageEvent.emit(key, JSON.stringify(value));
            });
            const [unsetValue] = react_1.useState(() => () => {
                debug('unsetValue', { key, defaultValue });
                core_1.Storage.remove({ key }).then(() => setState(defaultValue));
                capacitorStorageEvent.emit(key, defaultValue);
            });
            getStateRef.current = () => core_1.Storage.get({ key }).then(({ value }) => {
                if (typeof (value) === 'undefined' || lodash_1.isNull(value)) {
                    setState(defaultValue);
                }
                else {
                    let valueParsed;
                    try {
                        valueParsed = JSON.parse(value);
                    }
                    catch (error) {
                        debug('setStore:error', { error, key, defaultValue, value });
                    }
                    debug('getStore', { key, defaultValue, valueParsed, value });
                    if (!lodash_1.isEqual(valueParsed, state)) {
                        if (typeof (valueParsed) === 'undefined' || lodash_1.isNull(value))
                            setState(defaultValue);
                        else
                            setState(valueParsed);
                    }
                }
            });
            react_1.useEffect(() => {
                debug('init', { key, defaultValue });
                getStateRef.current();
                const fn = (value) => {
                    let valueParsed;
                    try {
                        valueParsed = JSON.parse(value);
                    }
                    catch (error) {
                        debug('fn:error', { error, key, defaultValue, value });
                    }
                    if (typeof (valueParsed) === 'undefined' || lodash_1.isNull(valueParsed))
                        setState(defaultValue);
                    else
                        setState(valueParsed);
                };
                intervalRef.current = setInterval(() => getStateRef.current(), fetchInterval);
                capacitorStorageEvent.on(key, fn);
                return () => {
                    clearInterval(intervalRef.current);
                    capacitorStorageEvent.off(key, fn);
                };
            }, []);
            return [state, setValue, unsetValue];
        };
    });
    return react_1.default.createElement(context.Provider, { value: { useStore } }, children);
};
function useCapacitorStore(key, defaultValue, context = exports.CapacitorStoreContext) {
    return store_1.useStore(key, defaultValue, context);
}
exports.useCapacitorStore = useCapacitorStore;
//# sourceMappingURL=capacitor.js.map