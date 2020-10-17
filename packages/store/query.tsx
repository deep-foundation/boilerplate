import { useRouter } from 'next/router';
import React, { Context, ReactNode, useState, createContext, useRef, useEffect } from 'react';
import Debug from 'debug';

import { IStoreContext, defaultContext, useStore } from './store';

const debug = Debug('deepcase:store:use-store-query');

export const QueryStoreContext = createContext(defaultContext);

export const fakeRouter: any = {};

export const QueryStoreProvider = ({
  context = QueryStoreContext,
  children,
}: {
  context?: Context<IStoreContext>;
  children?: ReactNode;
}) => {
  const _renderingRef = useRef({});
  const [useStore] = useState(() => {
    return function useStore<T extends any>(
      key: string,
      defaultValue: T,
    ): [T, (value: T) => any, () => any] {
      const router = useRouter();
      const { query, pathname, push } = router || fakeRouter;

      useEffect(() => {
        _renderingRef.current = {};
      }, [router?.query]);

      const setValue = (value) => {
        try {
          push({
            pathname,
            query: {
              ...query,
              ..._renderingRef.current,
              [key]: JSON.stringify(value),
            },
          });
          _renderingRef.current[key] = JSON.stringify(value);
        } catch (error) {
          debug('setStore:error', { error, key, defaultValue, value });
        }
      };

      const [unsetValue] = useState(() => () => {
        try {
          if (query[key]) delete query[key];
          push({
            pathname,
            query: {
              ...query,
              ..._renderingRef.current,
            }
          });
          _renderingRef.current[key] = undefined;
        } catch (error) {
          debug('unsetStore:error', { error, key });
        }
      });

      let value: any;
      try {
        value = query && query[key] && JSON.parse(query[key]);
      } catch (error) {
        debug('value:error', { error, key, defaultValue, query });
      }
      return [value || defaultValue, setValue, unsetValue];
    };
  });

  return <context.Provider value={{ useStore }}>
    {children}
  </context.Provider>;
};

export function useQueryStore<T extends any>(key: string, defaultValue: T, context = QueryStoreContext) {
  return useStore(key, defaultValue, context);
}
