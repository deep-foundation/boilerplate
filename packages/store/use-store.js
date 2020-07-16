import { createContext, useContext } from 'react';
export const defaultContext = {
    useStore: (key, defaultValue) => [defaultValue, value => undefined],
};
export const StoreContext = createContext(defaultContext);
export function useStore(key, defaultValue, context = StoreContext) {
    const { useStore } = useContext(context);
    return useStore(key, defaultValue);
}
//# sourceMappingURL=use-store.js.map