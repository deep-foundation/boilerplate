import React, { useContext, useRef } from 'react';
import _ from 'lodash';

import NODES from '../gql/NODES.gql';
import { Rows } from './components/rows';

export const Nodes = Rows({
  QUERY: NODES,
  parse: (q: any) => q?.data?.results,
  generateItem: (result) => ({ type: 'node', id: result?.id }),
});
