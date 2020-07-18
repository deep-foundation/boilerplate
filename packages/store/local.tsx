import React, { Context, ReactNode, useState, createContext, useEffect } from 'react';
import { EventEmitter } from 'events';
import Debug from 'debug';

import { StoreContext, IStoreContext, defaultContext, useStore } from './store';

const debug = Debug('deepcase:use-store:local');

const localStorageEvent = new EventEmitter();

export const LocalContext = createContext(defaultContext);

export const LocalStoreProvider = ({
  context = LocalContext,
  children,
}: {
  context?: Context<IStoreContext>;
  children?: ReactNode;
}) => {
  const [useStore] = useState(() => {
    return function useStore<T extends any>(
      key: string,
      defaultValue: T,
    ): [T, (value: T) => any] {
      const [value, _setValue] = useState<string>(typeof(localStorage) === 'undefined' ? JSON.stringify(defaultValue) : localStorage.getItem(key));
      useEffect(() => {
        if (typeof(localStorage.getItem(key)) === 'undefined') {
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
      const [setValue] = useState(() => value => {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
        _setValue(json);
        localStorageEvent.emit(key, json);
      });
      return [JSON.parse(value), setValue];
    }
  });

  return <context.Provider value={{ useStore }}>
    {children}
  </context.Provider>;
};

export function useLocalStore<T extends any>(key: string, defaultValue: T, context = LocalContext) {
  return useStore(key, defaultValue, context);
}
