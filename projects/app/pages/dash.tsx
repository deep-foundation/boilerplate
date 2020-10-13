import React from 'react';
import _ from 'lodash';

import { QueryStoreProvider, useQueryStore } from '@deepcase/store/query';

import { wrap } from '../imports/wrap';

import { Dash, DashStage } from '../imports/dash/components/dash';
import { Node } from '../imports/dash/node';
import { Nodes } from '../imports/dash/nodes';
import { Main } from '../imports/dash/main';

const types = {
  node: Node,
  nodes: Nodes,
  main: Main,
};

function Page() {
  const [stage, setStage] = useQueryStore<DashStage>('dash', [[{ type: 'main', id: 'main' }]]);
  return <Dash stage={stage} setStage={setStage} types={types}/>;
}

export default wrap({ Component: function Wrap() {
  return <QueryStoreProvider>
    <Page/>
  </QueryStoreProvider>;
} });
