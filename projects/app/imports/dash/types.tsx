import React, { useContext, useRef } from 'react';
import _ from 'lodash';

import TYPES from '../gql/TYPES.gql';
import { Rows } from './components/rows';
import { Button, ButtonGroup, Divider,  } from '@material-ui/core';

export type NodeItem = { type: 'nodes', id: string; query: any; };

export const Types = Rows({
  QUERY: TYPES,
  parse: (q: any) => q?.data?.results,
  generateItem: (result) => ({ type: 'nodes', id: result?.id, query: { where: { type_id: { _eq: result.id } } } }),
});
