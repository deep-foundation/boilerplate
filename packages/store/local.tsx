import React, { Context, ReactNode, useState, createContext, useEffect } from 'react';
import { EventEmitter } from 'events';
import { isNull } from 'lodash';

import { IStoreContext, defaultContext, useStore } from './store';

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
    ): [T, (value: T) => any, () => any] {
      const [value, _setValue] = useState<string>(typeof(localStorage) === 'undefined' ? JSON.stringify(defaultValue) : (localStorage.hasOwnProperty(key) ? localStorage.getItem(key) : JSON.stringify(defaultValue)));
      useEffect(
        () => {
          if (!localStorage.hasOwnProperty(key)) {
            const json = JSON.stringify(defaultValue);
            localStorage.setItem(key, json);
            _setValue(json);
          }
          const fn = (value) => {
            const item = localStorage.getItem(key);
            if (typeof(item) === 'undefined' || isNull(item)) _setValue(JSON.stringify(defaultValue));
            else _setValue(value);
          };
          localStorageEvent.on(key, fn);
          return () => {
            localStorageEvent.off(key, fn);
          };
        },
        [],
      );
      const [setValue] = useState(() => (value) => {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
        _setValue(json);
        localStorageEvent.emit(key, json);
      });
      const [unsetValue] = useState(() => () => {
        localStorage.removeItem(key);
        localStorageEvent.emit(key, defaultValue);
      });
      return [JSON.parse(value), setValue, unsetValue];
    };
  });

  return <context.Provider value={{ useStore }}>
    {children}
  </context.Provider>;
};

export function useLocalStore<T extends any>(key: string, defaultValue: T, context = LocalContext) {
  return useStore(key, defaultValue, context);
}
