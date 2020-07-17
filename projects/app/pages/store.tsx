import React from 'react';
import { QueryStoreProvider, useQueryStore } from '@deepcase/store/use-query-store';
import { CookiesStoreProvider, useCookiesStore } from '@deepcase/store/use-cookies-store';
import { LocalStoreProvider, useLocalStore } from '@deepcase/store/use-local-store';
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

let rerendered = 0;
export function Content() {
  return <>
    page rerendered: {rerendered++}
    <ContentQuery/>
    <ContentQueryListener/>
    <ContentCookies/>
    <ContentCookiesListener/>
    <ContentLocal/>
    <ContentLocalListener/>
  </>;
}

export function Page() {
  return <>
    <QueryStoreProvider>
      <CookiesStoreProvider>
        <LocalStoreProvider>
          <Content/>
        </LocalStoreProvider>
      </CookiesStoreProvider>
    </QueryStoreProvider>
  </>;
}

export default wrap({ Component: Page });
