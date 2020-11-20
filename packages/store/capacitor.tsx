import React, { Context, ReactNode, useState, useEffect, useRef, createContext } from 'react';
import { EventEmitter } from 'events';
import { isEqual, isNull } from 'lodash';
import { Storage } from '@capacitor/core';
import Debug from 'debug';

import { IStoreContext, defaultContext, useStore } from './store';

const debug = Debug('deepcase:use-store:capacitor');

const capacitorStorageEvent = new EventEmitter();

export const CapacitorStoreContext = createContext(defaultContext);

export const CapacitorStoreProvider = ({
  context = CapacitorStoreContext,
  children,
  fetchInterval = 5000,
}: {
  context?: Context<IStoreContext>;
  children?: ReactNode;
  fetchInterval?: number;
}) => {
  const [useStore] = useState(() => {
    return function useStore<T extends any>(
      key: string,
      defaultValue: T,
    ): [T, (value: T) => any, () => any] {
      const getStateRef = useRef<any>();
      const intervalRef = useRef<any>();
      const [state, setState] = useState<T>(defaultValue);
      const [setValue] = useState(() => (value) => {
        debug('setValue', { key, defaultValue, value });
        Storage.set({ key, value: JSON.stringify(value) }).then(() => setState(value));
        capacitorStorageEvent.emit(key, JSON.stringify(value));
      });
      const [unsetValue] = useState(() => () => {
        debug('unsetValue', { key, defaultValue });
        Storage.remove({ key }).then(() => setState(defaultValue));
        capacitorStorageEvent.emit(key, defaultValue);
      });
      getStateRef.current = () => Storage.get({ key }).then(async ({ value }) => {
        const { keys } = await Storage.keys();
        if (!!~keys.indexOf(key)) {
          let valueParsed: any;
          try {
            valueParsed = JSON.parse(value);
          } catch (error) {
            debug('setStore:error', { error, key, defaultValue, value });
          }
          debug('getStore', { key, defaultValue, valueParsed, value });
          if (!isEqual(valueParsed, state)) {
            if (typeof(valueParsed) === 'undefined' || isNull(value)) setState(defaultValue);
            else setState(valueParsed);
          }
        }
      });
      useEffect(
        () => {
          debug('init', { key, defaultValue });
          getStateRef.current();
          const fn = (value) => {
            let valueParsed;
            try {
              valueParsed = JSON.parse(value);
            } catch (error) {
              debug('fn:error', { error, key, defaultValue, value });
            }
            if (typeof(valueParsed) === 'undefined' || isNull(valueParsed)) setState(defaultValue);
            else setState(valueParsed);
          };
          intervalRef.current = setInterval(() => getStateRef.current(), fetchInterval);
          capacitorStorageEvent.on(key, fn);
          return () => {
            clearInterval(intervalRef.current);
            capacitorStorageEvent.off(key, fn);
          };
        },
        [],
      );
      return [state, setValue, unsetValue];
    };
  });

  return <context.Provider value={{ useStore }}>
    {children}
  </context.Provider>;
};

export function useCapacitorStore<T extends any>(key: string, defaultValue: T, context = CapacitorStoreContext) {
  return useStore(key, defaultValue, context);
}
