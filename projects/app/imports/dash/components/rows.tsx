import React, { useContext, useRef } from 'react';
import _ from 'lodash';

import { Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Tooltip, Typography } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import { useQuery } from '@apollo/react-hooks';

import NODES from '../gql/NODES.gql';
import { GqlLinearProgress } from '../../hasura/progress';
import { DashContext } from './dash';
import { Visibility, VisibilityContext } from './visibility';

export const Rows = ({
  QUERY,
  parse,
  generateItem,
  ResultComponent,
  bottomElement = null,
  BottomComponent,
}:{
  QUERY: any;
  parse: (q: any) => { id: any; [key: string]: any; }[];
  generateItem: (result) => any;
  ResultComponent?: (props: { item: any; path: any[]; result: any; results: any[]; q: any; index: number; generateItem: (result) => any; }) => any;
  bottomElement?: any;
  BottomComponent?: (props: { item: any; path: any[], q: any }) => any;
}) => React.memo(({
  item,
  path,
}: {
  item: any;
  path: any[];
}) => {
  const { visible, focus } = useContext(VisibilityContext);
  const { stage, select, unselect } = useContext(DashContext);
  const q = useQuery(QUERY, { variables: { ...item.query } });
  const results = parse(q);
  const ref = useRef();

  return <>
    <Visibility id={item?.id} elRef={ref}>
      <Paper ref={ref} style={{
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
          {(results || []).map((result, index) => {
            if (ResultComponent) {
              return <ResultComponent
                key={result.id}
                item={item} path={path} result={result} results={results} q={q} index={index} generateItem={generateItem}
              />;
            }
            return <>
              <ListItem divider key={result.id} button selected={typeof visible[result.id] === 'boolean'}
                style={{ boxShadow: visible?.[result.id]?.value ? 'inset 0 0 0 1000px rgba(0,0,0,0.21)' : 'none' }}
                onClick={() => {
                  select(path, generateItem(result));
                  focus(result.id);
                }}
              >
                <ListItemText primary={<>{result.id}</>} secondary={<>
                  <>type: "{result.type}";</>
                </>}/>
                <ListItemSecondaryAction>
                  <IconButton disabled>
                    <ChevronRightIcon/>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </>;
          })}
          {!q?.loading && !results?.length && <>
            <Typography align="center">
              <NotInterestedIcon color="disabled"/>
            </Typography>
          </>}
        </List>
        {bottomElement}
        {!!BottomComponent && <BottomComponent item={item} path={path} q={q}/>}
      </Paper>
    </Visibility>
  </>;
});
