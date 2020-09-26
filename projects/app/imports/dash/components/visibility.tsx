import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { Node } from '../node';
import { Nodes } from '../nodes';

import VisibilitySensor from 'react-visibility-sensor';
import ReactResizeDetector from 'react-resize-detector';
import { useDebounce, useDebouncedCallback } from 'use-debounce';

export type VisibilityContextData = {
  visible: { [id: string]: boolean };
  setVisible: (id: string, value: boolean) => any;
  registerRef: any;
  focus: (id: string) => any;
};

export const VisibilityContext = createContext<VisibilityContextData>({
  visible: {},
  setVisible: (id, value) => {},
  registerRef: {},
  focus: (id) => {},
});

export const VisibilityProvider = React.memo(({ children }:{ children: any; }) => {
  const [visible, setV] = useState({});
  const registerRef = useRef<{ [key: string]: any; }>({});

  const setVisible = useCallback((id: string, value: boolean) => {
    setV((visible) => {
      return { ...visible, [id]: value };
    });
  }, []);

  const focus = useCallback((id) => {
    registerRef?.current?.[id]?.scrollIntoView({ behavior: 'smooth' });
    console.log('focus', id);
  }, [visible]);

  return <>
    <VisibilityContext.Provider value={{ visible, setVisible, registerRef, focus }}>
      {children}
    </VisibilityContext.Provider>
  </>;
});

export const Visibility = React.memo(({ id, elRef, children }:{ id: string; elRef: any; children: any; }) => {
  const { visible, setVisible, registerRef } = useContext(VisibilityContext);
  const onChange = useCallback((isVisible) => {
    setVisible(id, isVisible);
  }, []);
  useEffect(() => {
    setVisible(id, false);
    registerRef.current[id] = elRef.current;
    return () => {
      setVisible(id, null);
      delete registerRef.current[id];
    };
  }, []);

  return <>
    <VisibilitySensor onChange={onChange}>
      {children}
    </VisibilitySensor>
  </>;
});
