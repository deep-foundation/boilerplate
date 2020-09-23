import React from 'react';
import _ from 'lodash';

import { QueryStoreProvider, useQueryStore } from '@deepcase/store/query';

import { wrap } from '../imports/wrap';

import { Dash, DashStage } from '../imports/dash/dash';

function Page() {
  const [stage, setStage] = useQueryStore<DashStage>('dash', [[{ type: 'node', id: 'ikazjkd9xkpfc' }]]);
  return <Dash stage={stage} setStage={setStage}/>
}

export default wrap({ Component: function Wrap() {
  return <QueryStoreProvider>
    <Page/>
  </QueryStoreProvider>;
} });
