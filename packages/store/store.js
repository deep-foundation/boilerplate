"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = exports.StoreContext = exports.defaultContext = void 0;
const react_1 = require("react");
exports.defaultContext = {
    useStore: (key, defaultValue) => [defaultValue, value => undefined],
};
exports.StoreContext = react_1.createContext(exports.defaultContext);
function useStore(key, defaultValue, context = exports.StoreContext) {
    const { useStore } = react_1.useContext(context);
    return useStore(key, defaultValue);
}
exports.useStore = useStore;
//# sourceMappingURL=store.js.map