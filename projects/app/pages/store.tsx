import React from 'react';
import { QueryStoreProvider, useQueryStore } from '@deepcase/store/use-query-store';

export function Content() {
  const [value, setValue] = useQueryStore('demo', 5);
  return <>
    <div>const [value, setValue] = useQueryStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
  </>
}

export default function Page() {
  return <>
    <QueryStoreProvider>
      <Content/>
    </QueryStoreProvider>
  </>;
}
