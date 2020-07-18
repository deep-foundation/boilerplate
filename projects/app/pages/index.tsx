import React from 'react';
import { QueryStoreProvider, useQueryStore } from '@deepcase/store/query';
import { CookiesStoreProvider, useCookiesStore } from '@deepcase/store/cookies';
import { LocalStoreProvider, useLocalStore } from '@deepcase/store/local';
import { CapacitorStoreProvider, useCapacitorStore } from '@deepcase/store/capacitor';
import { wrap } from '../imports/wrap';

export function ContentQuery() {
  const [value, setValue] = useQueryStore('demo', 5);
  return <>
    <div>const [value, setValue] = useQueryStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
  </>
}

export function ContentQueryListener() {
  const [value, setValue] = useQueryStore('demo', 5);
  return <>
    <div>const [value] = useQueryStore('demo', 5);</div>
    <div>value == {value}</div>
  </>
}

export function ContentCookies() {
  const [value, setValue] = useCookiesStore('demo', 5);
  return <>
    <div>const [value, setValue] = useCookiesStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
  </>
}

export function ContentCookiesListener() {
  const [value, setValue] = useCookiesStore('demo', 5);
  return <>
    <div>const [value] = useCookiesStore('demo', 5);</div>
    <div>value == {value}</div>
  </>
}

export function ContentLocal() {
  const [value, setValue] = useLocalStore('demo', 5);
  return <>
    <div>const [value, setValue] = useLocalStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
  </>
}

export function ContentLocalListener() {
  const [value, setValue] = useLocalStore('demo', 5);
  return <>
    <div>const [value] = useLocalStore('demo', 5);</div>
    <div>value == {value}</div>
  </>
}

export function ContentCapacitor() {
  const [value, setValue] = useCapacitorStore('demo', 5);
  return <>
    <div>const [value, setValue] = useCapacitorStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
  </>
}

export function ContentCapacitorListener() {
  const [value, setValue] = useCapacitorStore('demo', 5);
  return <>
    <div>const [value] = useCapacitorStore('demo', 5);</div>
    <div>value == {value}</div>
  </>
}

let rerendered = 0;
export function Content() {
  return <>
    <div>page rerendered: {rerendered++}</div>
    <hr/>
    <div>store</div>
    <hr/>
    <ContentQuery/>
    <ContentQueryListener/>
    <hr/>
    <ContentCookies/>
    <ContentCookiesListener/>
    <hr/>
    <ContentLocal/>
    <ContentLocalListener/>
    <hr/>
    <ContentCapacitor/>
    <ContentCapacitorListener/>
    <hr/>
  </>;
}

export function Page() {
  return <>
    <QueryStoreProvider>
      <CookiesStoreProvider>
        <LocalStoreProvider>
          <CapacitorStoreProvider fetchInterval={5000}>
            <Content/>
          </CapacitorStoreProvider>
        </LocalStoreProvider>
      </CookiesStoreProvider>
    </QueryStoreProvider>
  </>;
}

export default wrap({ Component: Page });
