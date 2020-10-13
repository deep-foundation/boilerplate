import React, { useContext, useRef } from 'react';
import _ from 'lodash';

import { Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Tooltip } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { useQuery } from '@apollo/react-hooks';

import NODES from '../gql/NODES.gql';
import { GqlLinearProgress } from '../hasura/progress';
import { DashContext } from './components/dash';
import { Visibility, VisibilityContext } from './components/visibility';

export const Node = React.memo(({
  item,
  path,
}: {
  item: any;
  path: any[];
}) => {
  const { visible, focus } = useContext(VisibilityContext);
  const { stage, select, unselect } = useContext(DashContext);
  const q = useQuery(NODES, { variables: { where: { id: { _eq: item.id } }, limit: 1 } });
  const node = q?.data?.results[0];
  const ref = useRef();

  return <>
    <Visibility id={item?.id} elRef={ref}>
      <Paper ref={ref} style={{
        marginBottom: 6,
        minHeight: 16, width: 400,
      }}>
        <List disablePadding dense>
          <ListItem divider>
            <ListItemText primary={<>{item.id}</>} secondary={<>
              <>type: "{node?.type_id}";</>  {!!node && <>{node?.from_id || node?.to_id ? 'link' : 'node'};</>}
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
            const id = `${item.id}-${link.type || ''}`;
            return <>
              <ListItem divider key={link.id} button selected={typeof visible[id] === 'boolean'}
                style={{ boxShadow: visible?.[id]?.value ? 'inset 0 0 0 1000px rgba(0,0,0,0.21)' : 'none' }}
                onClick={() => {
                  select(path, {
                    type: 'nodes', id,
                    query: { where: {
                      type_id: { _eq: link.type_id },
                      from_id: { _eq: node?.id },
                    } },
                  });
                  focus(id);
                }}
              >
                <ListItemText primary={<>
                  <>type: "{link.type}";</>
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
            const id = `${item.id}-${link.type || ''}`;
            return <>
              <ListItem divider key={link.id} button selected={typeof visible[id] === 'boolean'}
                style={{ boxShadow: visible?.[id]?.value ? 'inset 0 0 0 1000px rgba(0,0,0,0.21)' : 'none' }}
                onClick={() => {
                  select(path, {
                    type: 'nodes', id,
                    query: { where: {
                      type: { _eq: link.type },
                      target_id: { _eq: node?.id },
                    } },
                  });
                  focus(id);
                }}
              >
                <ListItemText primary={<>
                  <>type: "{link.type}";</>
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
          {!!node?.from && <ListItem divider key={node?.from?.id} button selected={typeof visible[node?.from?.id] === 'boolean'}
            style={{ boxShadow: visible?.[node?.from?.id] ? 'inset 0 0 0 1000px rgba(0,0,0,0.21)' : 'none' }}
            onClick={() => {
              select(path, { type: 'node', id: node?.from?.id });
              focus(node?.from?.id);
            }}
          >
            <ListItemText primary={<>"{node?.from?.id}"</>} secondary={<>
              <>type: "{node?.from?.type}";</>
            </>}/>
            <ListItemSecondaryAction>
              <IconButton disabled>
                <ChevronRightIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>}
          <ListSubheader>.to</ListSubheader>
          <Divider/>
          {!!node?.to && <ListItem divider key={node?.to?.id} button selected={typeof visible[node?.to?.id] === 'boolean'}
            style={{ boxShadow: visible?.[node?.to?.id] ? 'inset 0 0 0 1000px rgba(0,0,0,0.21)' : 'none' }}
            onClick={() => {
              select(path, { type: 'node', id: node?.to?.id });
              focus(node?.to?.id);
            }}
          >
            <ListItemText primary={<>"{node?.to?.id}"</>} secondary={<>
              <>type: "{node?.to?.type}";</>
            </>}/>
            <ListItemSecondaryAction>
              <IconButton disabled>
                <ChevronRightIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>}
        </List>
      </Paper>
    </Visibility>
  </>;
});
