import React from 'react';
import { QueryStoreProvider, useQueryStore } from '@deepcase/store/query';
import { CookiesStoreProvider, useCookiesStore } from '@deepcase/store/cookies';
import { LocalStoreProvider, useLocalStore } from '@deepcase/store/local';
import { CapacitorStoreProvider, useCapacitorStore } from '@deepcase/store/capacitor';
import { wrap } from '../imports/wrap';
import { useAuth } from '@deepcase/auth';

export function ContentQuery() {
  const [value, setValue, unsetValue] = useQueryStore('demo', 5);
  return <>
    <div>const [value, setValue, unsetValue] = useQueryStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
}

export function ContentQueryListener() {
  const [value, setValue, unsetValue] = useQueryStore('demo', 5);
  return <>
    <div>const [value] = useQueryStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
}

export function ContentCookies() {
  const [value, setValue, unsetValue] = useCookiesStore('demo', 5);
  return <>
    <div>const [value, setValue, unsetValue] = useCookiesStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
}

export function ContentCookiesListener() {
  const [value, setValue, unsetValue] = useCookiesStore('demo', 5);
  return <>
    <div>const [value] = useCookiesStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
}

export function ContentLocal() {
  const [value, setValue, unsetValue] = useLocalStore('demo', 5);
  return <>
    <div>const [value, setValue, unsetValue] = useLocalStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
}

export function ContentLocalListener() {
  const [value, setValue, unsetValue] = useLocalStore('demo', 5);
  return <>
    <div>const [value] = useLocalStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
}

export function ContentCapacitor() {
  const [value, setValue, unsetValue] = useCapacitorStore('demo', 5);
  return <>
    <div>const [value, setValue, unsetValue] = useCapacitorStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
}

export function ContentCapacitorListener() {
  const [value, setValue, unsetValue] = useCapacitorStore('demo', 5);
  return <>
    <div>const [value] = useCapacitorStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
}

export function Auth() {
  const identity = useAuth();
  return <>
    <div>auth</div>
    <div><a href="/api/auth/logout">logout</a></div>
    <div><a href="/api/auth/github">github</a></div>
    <div><a href="/api/auth/local?username=abc&password=abc">local abc:abc</a></div>
    <div><a href="/api/auth/local?username=qwe&password=qwe">local qwe:qwe</a></div>
    <div>
      <pre><code>
        {JSON.stringify(identity)}
      </code></pre>
    </div>
  </>;
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
    <Auth/>
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
