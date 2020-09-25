import React, { useContext } from 'react';
import _ from 'lodash';

import { Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Tooltip } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { useSubscription } from '@apollo/react-hooks';

import NODES from '../gql/NODES.gql';
import { GqlLinearProgress } from '../hasura/progress';
import { DashContext } from './dash';

export type NodeItem = { type: 'nodes', id: string; query: any; };

export function Nodes({
  item,
  path,
}: {
  item: any;
  path: any[];
}) {
  const { stage, select, unselect } = useContext(DashContext);
  const q = useSubscription(NODES, { variables: { ...item.query } });
  const nodes = q?.data?.nodes;

  const selected: { [key: string]: number } = {};
  if (stage?.[path[0] + 1]?.length) {
    for (let i = 0; i < stage?.[path[0] + 1]?.length; i++) {
      selected[stage?.[path[0] + 1][i].id] = i;
    }
  }

  return <Paper style={{
    marginBottom: 6,
    minHeight: 16, width: 400,
  }}>
    <List disablePadding dense>
      <ListItem divider>
        <ListItemText primary={<>"{item.id}"</>}/>
        <ListItemSecondaryAction>
          <Tooltip title="close">
            <IconButton onClick={() => unselect(path)}>
              <CloseIcon/>
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      <GqlLinearProgress result={q}/>
      <Divider/>
    </List>
    <List disablePadding dense style={{ maxHeight: 300, overflowY: 'scroll' }}>
      {(nodes || []).map((node) => {
        return <>
          <ListItem divider key={node.id} button selected={typeof selected[node.id] === 'number'}
            onClick={() => {
              select(path, { type: 'node', id: node.id });
            }}
          >
            <ListItemText primary={<>"{node.id}"</>} secondary={<>
              <>type: "{node.type}";</> <>key: "{node.key}";</>
            </>}/>
            <ListItemSecondaryAction>
              <IconButton disabled>
                <ChevronRightIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </>;
      })}
    </List>
  </Paper>;
};
