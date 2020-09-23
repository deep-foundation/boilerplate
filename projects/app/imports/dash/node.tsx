import React, { useContext } from 'react';
import _ from 'lodash';

import { Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Tooltip } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { useSubscription } from '@apollo/react-hooks';

import NODE from '../gql/NODE.gql';
import { GqlLinearProgress } from '../hasura/progress';
import { DashContext } from './dash';

export function Node({
  item,
  path,
}: {
  item: any;
  path: any[];
}) {
  const { stage, select, unselect, positions } = useContext(DashContext);
  const q = useSubscription(NODE, { variables: { nodeId: item.id } });
  const node = q?.data?.nodes[0];

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
        <ListItemText primary={<>"{item.id}"</>} secondary={<>
          <>type: "{node?.type}";</> <>key: "{node?.key}";</> {!!node && <>{node?.from_id || node?.to_id ? 'link' : 'node'};</>}
        </>}/>
        <ListItemSecondaryAction>
          <Tooltip title="close">
            <IconButton onClick={() => unselect(path)}>
              <CloseIcon/>
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      <GqlLinearProgress result={q}/>
      <ListSubheader>.out</ListSubheader>
      <Divider/>
      {(node?.out || []).map((link) => {
        return <>
          <ListItem divider key={link.id} button selected={typeof selected[link.id] === 'number'}
            onClick={() => {
              select(path, link.id);
            }}
          >
            <ListItemText primary={<>"{link.id}"</>} secondary={<>
              <>type: "{link.type}";</> <>key: "{link.key}";</>
            </>}/>
            <ListItemSecondaryAction>
              <IconButton disabled>
                <ChevronRightIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </>;
      })}
      <ListSubheader>.in</ListSubheader>
      <Divider/>
      {(node?.in || []).map((link) => {
        return <>
          <ListItem divider key={link.id} button selected={typeof selected[link.id] === 'number'}
            onClick={() => {
              select(path, link.id);
            }}
          >
            <ListItemText primary={<>"{link.id}"</>} secondary={<>
              <>type: "{link.type}";</> <>key: "{link.key}";</>
            </>}/>
            <ListItemSecondaryAction>
              <IconButton disabled>
                <ChevronRightIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </>;
      })}
      <ListSubheader>.from</ListSubheader>
      <Divider/>
      {!!node?.from && <ListItem divider key={node?.from?.id} button selected={typeof selected[node?.from?.id] === 'number'}
        onClick={() => {
          select(path, node?.from?.id);
        }}
      >
        <ListItemText primary={<>"{node?.from?.id}"</>} secondary={<>
          <>type: "{node?.from?.type}";</> <>key: "{node?.from?.key}";</>
        </>}/>
        <ListItemSecondaryAction>
          <IconButton disabled>
            <ChevronRightIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>}
      <ListSubheader>.to</ListSubheader>
      <Divider/>
      {!!node?.to && <ListItem divider key={node?.to?.id} button selected={typeof selected[node?.to?.id] === 'number'}
        onClick={() => {
          select(path, node?.to?.id);
        }}
      >
        <ListItemText primary={<>"{node?.to?.id}"</>} secondary={<>
          <>type: "{node?.to?.type}";</> <>key: "{node?.to?.key}";</>
        </>}/>
        <ListItemSecondaryAction>
          <IconButton disabled>
            <ChevronRightIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>}
    </List>
  </Paper>;
};
