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

export const Main = React.memo(({
  item,
  path,
}: {
  item: any;
  path: any[];
}) => {
  const { visible, focus } = useContext(VisibilityContext);
  const { stage, select, unselect } = useContext(DashContext);
  const ref = useRef();

  return <>
    <Visibility id={item?.id} elRef={ref}>
      <Paper ref={ref} style={{
        marginBottom: 6,
        minHeight: 16, width: 400,
      }}>
        <List disablePadding dense>
          <ListItem divider>
            <ListItemText primary={<>"{item.id}"</>} secondary={<>
              <>dash</>
            </>}/>
            <ListItemSecondaryAction>
              <Tooltip title="close">
                <IconButton onClick={() => unselect(path)}>
                  <CloseIcon/>
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button selected={typeof visible['types'] === 'boolean'}
            style={{ boxShadow: visible?.['types'] ? 'inset 0 0 0 1000px rgba(0,0,0,0.21)' : 'none' }}
            onClick={() => {
              select(path, { type: 'types', id: 'types' });
              focus('types');
            }}
          >
            <ListItemText primary={<>"{'types'}"</>}/>
            <ListItemSecondaryAction>
              <IconButton disabled>
                <ChevronRightIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button selected={typeof visible['nodes'] === 'boolean'}
            style={{ boxShadow: visible?.['nodes'] ? 'inset 0 0 0 1000px rgba(0,0,0,0.21)' : 'none' }}
            onClick={() => {
              select(path, { type: 'nodes', id: 'nodes', query: { where: {} } });
              focus('nodes');
            }}
          >
            <ListItemText primary={<>"{'nodes'}"</>}/>
            <ListItemSecondaryAction>
              <IconButton disabled>
                <ChevronRightIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Visibility>
  </>;
});
