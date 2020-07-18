import React, { Context, ReactNode, useState, useEffect, useRef, createContext } from 'react';
import { EventEmitter } from 'events';
import { isEqual } from 'lodash';
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
    ): [T, (value: T) => any] {
      const getStateRef = useRef<any>();
      const intervalRef = useRef<any>();
      const [state, setState] = useState<T>(defaultValue);
      const [setValue] = useState(() => (value) => {
        Storage.set({ key, value: JSON.stringify(value) }).then(() => setState(value));
        capacitorStorageEvent.emit(key, JSON.stringify(value));
      });
      getStateRef.current = () => Storage.get({ key }).then(({ value }) => {
        let valueParsed: any;
        try {
          valueParsed = JSON.parse(value);
        } catch (error) {
          debug('setStore:error', { error, key, defaultValue, value });
        }
        if (!isEqual(valueParsed, state)) {
          setState(valueParsed);
        }
      });
      useEffect(
        () => {
          Storage.get({ key }).then(({ value }: any) => {
            if (typeof(value) != 'undefined') setState(value);
          })
          const fn = (value) => setState(value);
          intervalRef.current = setInterval(() => getStateRef.current(), fetchInterval);
          capacitorStorageEvent.on(key, fn);
          return () => {
            clearInterval(intervalRef.current);
            capacitorStorageEvent.off(key, fn);
          }
        },
        [],
      );
      return [state, setValue];
    };
  });

  return <context.Provider value={{ useStore }}>
    {children}
  </context.Provider>;
};

export function useCapacitorStore<T extends any>(key: string, defaultValue: T, context = CapacitorStoreContext) {
  return useStore(key, defaultValue, context);
}
