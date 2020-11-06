import React, { useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import dynamic from "next/dynamic";

import { QueryStoreProvider, useQueryStore } from '@deepcase/store/query';

import { wrap } from '../imports/wrap';

import { Dash, DashStage } from '../imports/dash/components/dash';
import { gql } from 'apollo-boost';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import ReactResizeDetector from 'react-resize-detector';

import { Graph } from "react-d3-graph";
import { Button, ButtonGroup, Paper, Switch, Typography } from '@material-ui/core';
import { useAuth } from '@deepcase/auth';

import INSERT_NODES from '../imports/gql/INSERT_NODES.gql';
import UPDATE_NODES from '../imports/gql/UPDATE_NODES.gql';
import DELETE_NODES from '../imports/gql/DELETE_NODES.gql';

const FETCH_LIMITED = gql`subscription FETCH_LIMITED($where: nodes_bool_exp) {
  nodes(where: $where) {
    from_id id to_id type_id in { from_id id to_id type_id } out { from_id id to_id type_id }
  }
}`;

function GraphPage() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [limited, setLimited] = useQueryStore('limited', false);
  const auth = useAuth();

  const q = useSubscription(FETCH_LIMITED, { variables: {
    where: limited ? {
      _or: [
        ...(+(auth?.id || 0) ? [
          // rule
          {
            _by_item: {
              path_item: {
                // selector
                type_id: { _eq: 9 },
                from: {
                  in: {
                    // rule_object
                    type_id: { _eq: 4 },
                    from: {
                      // rule
                      type_id: { _eq: 2 },
                      out: {
                        // rule_subject
                        type_id: { _eq: 3 },
                        to: {
                          // selector
                          type_id: { _eq: 8 },
                          _by_path_item: { item_id: { _eq: +(auth?.id || 0) } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          // user owned
          {
            _by_item: {
              // user over upper
              path_item_id: { _eq: +(auth?.id || 0) },
              // but has not selector upper
              _or: [
                {
                  // but can be selector link
                  item: {
                    from_id: { _is_null: false },
                    to_id: { _is_null: false },
                    type_id: { _eq: 8 },
                  },
                },
                {
                  _not: { by_position: { path_item: {
                    from_id: { _is_null: false },
                    to_id: { _is_null: false },
                    type_id: { _eq: 8 },
                  } } },
                },
              ],
            },
          },
          // is user
          { id: { _eq: +(auth?.id || 0) } },
          // are any user
          { type_id: { _eq: 6 } },
          // not usered
          { _not: { _by_item: { path_item: { type_id: { _eq: 6 } } } } },
        ] : []),
      ],
    } : {},
  } });
  const [insertNodes] = useMutation(INSERT_NODES);
  const [updateNodes] = useMutation(UPDATE_NODES);
  const [deleteNodes] = useMutation(DELETE_NODES);

  const data = useMemo(() => {
    const nodes = q?.data?.nodes || [];
    const data = {
      links: [],
      nodes: [],
      hash: {},
    };
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes?.[i];
      if (n.from_id && n.to_id) {
        data.links.push({
          id: n.id.toString(),
          source: n.from_id.toString(),
          target: n.to_id.toString(),
          label: `${n.id} ${+n?.type_id}`,
          color: 
            +n?.type_id === 1 ? 'grey' :
            +n?.type_id === 2 ? 'purple' :
            +n?.type_id === 3 ? 'green' :
            +n?.type_id === 4 ? 'dodgerblue' :
            +n?.type_id === 5 ? 'fuchsia' :
            +n?.type_id === 6 ? 'red' :
            +n?.type_id === 7 ? 'sienna' :
            +n?.type_id === 8 ? 'gold' :
            +n?.type_id === 9 ? 'gold' :
            'grey',
        });
      } else {
        data.nodes.push({
          id: n.id.toString(),
          label: `${n.id} ${+n?.type_id}`,
          color: 
            +n?.type_id === 1 ? 'grey' :
            +n?.type_id === 2 ? 'purple' :
            +n?.type_id === 3 ? 'green' :
            +n?.type_id === 4 ? 'dodgerblue' :
            +n?.type_id === 5 ? 'fuchsia' :
            +n?.type_id === 6 ? 'red' :
            +n?.type_id === 7 ? 'sienna' :
            +n?.type_id === 8 ? 'gold' :
            +n?.type_id === 9 ? 'gold' :
            'grey',
        });
      }
      data.hash[n.id] = n;
    }
    _.remove(data?.links, l => !data?.hash[l.source] || !data?.hash[l.target]);
    return data;
  }, [q]);

  const [selected, setSelected] = useState(0);
  const selectedNode = data?.hash?.[selected];
  const [action, setAction] = useState(0);

  const onClickGraph = async () => {
    setSelected(0);
  };

  const onClickNode = async (nodeId: string) => {
    if (action) {
      if (action === 1) {
        setAction(0);
        await insertNodes({ variables: { objects: { from_id: selected, to_id: +nodeId } } });
      }
    } else {
      setSelected(+nodeId);
    }

    // const result = await insertNodes({ variables: { objects: {} } });
    // const id = result?.data?.insert_nodes?.returning?.[0]?.id;
    // await insertNodes({ variables: { objects: { from_id: +nodeId, to_id: +id } } });

    // if (data?.hash?.[+nodeId]?.type_id === 2) {
    //   ungrant({ variables: { ruleId: +nodeId } });
    // } else {
    //   grant({ variables: { forNodeId: +nodeId } });
    // }
  };

  // const onDoubleClickNode = (nodeId) => {
  //   console.log(`Double clicked node ${nodeId}`);
  // };

  // const onRightClickNode = (event, nodeId) => {
  //   console.log(`Right clicked node ${nodeId}`);
  // };

  // const onMouseOverNode = (nodeId) => {
  //   console.log(`Mouse over node ${nodeId}`);
  // };

  // const onMouseOutNode = (nodeId) => {
  //   console.log(`Mouse out node ${nodeId}`);
  // };

  const onClickLink = (source, target) => {
    const link = (data?.links || []).find(l => +l.source === +source && +l.target === +target);
    if (link) setSelected(+link?.id);
  };

  // const onRightClickLink = (event, source, target) => {
  //   console.log(`Right clicked link between ${source} and ${target}`);
  // };

  // const onMouseOverLink = (source, target) => {
  //   console.log(`Mouse over in link between ${source} and ${target}`);
  // };

  // const onMouseOutLink = (source, target) => {
  //   console.log(`Mouse out link between ${source} and ${target}`);
  // };

  // const onNodePositionChange = (nodeId, x, y) => {
  //   console.log(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
  // };

  return <div style={{ width: '100vw', height: '100vh', position: 'absolute', left: 0, top: 0 }} >
    <ReactResizeDetector handleWidth handleHeight onResize={(w: number, h: number) => setSize({ w, h })}/>
    <>
      {!!data?.nodes?.length && <Graph
        id="deepcase-materialized-path"
        data={{ links: data.links, nodes: data.nodes }}
        config={{
          height: size.h,
          width: size.w,
          directed: true,
          staticGraph: false,
          nodeHighlightBehavior: true,
          linkHighlightBehavior: true,
          automaticRearrangeAfterDropNode: true,
          link: {
            renderLabel: true,
            labelProperty: "label",
            highlightColor: "black",
            semanticStrokeWidth: true,
          },
          node: {
            renderLabel: true,
            labelProperty: "label",
            highlightStrokeColor: "black",
          },
        }}
        onClickNode={onClickNode}
        // onDoubleClickNode={onDoubleClickNode}
        // onRightClickNode={onRightClickNode}
        onClickGraph={onClickGraph}
        onClickLink={onClickLink}
        // onRightClickLink={onRightClickLink}
        // onMouseOverNode={onMouseOverNode}
        // onMouseOutNode={onMouseOutNode}
        // onMouseOverLink={onMouseOverLink}
        // onMouseOutLink={onMouseOutLink}
        // onNodePositionChange={onNodePositionChange}
      />}
    </>
    <div style={{ position: 'absolute', left: 16, top: 16 }}>
      <Switch
        checked={limited}
        onChange={() => setLimited(!limited)}
        name="limited"
      />
    </div>
    <div style={{ position: 'absolute', right: 16, top: 16 }}>
      <Typography>{auth?.id}</Typography>
    </div>
    <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', padding: 6 }}>
      <ButtonGroup disabled style={{ marginRight: 6 }}>
        <Button>#{selectedNode?.id ? selectedNode?.id : '?'}</Button>
        <Button>#{selectedNode?.from_id ? selectedNode?.from_id : '?'}</Button>
        <Button disabled> {'=>'} </Button>
        <Button>#{selectedNode?.to_id ? selectedNode?.to_id : '?'}</Button>
      </ButtonGroup>
      <ButtonGroup style={{ marginRight: 6 }} disabled={!selected}>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: null } } })} disabled={!selectedNode?.type_id}>0</Button>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: 1 } } })} disabled={selectedNode?.type_id === 1}>1</Button>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: 2 } } })} disabled={selectedNode?.type_id === 2}>2</Button>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: 3 } } })} disabled={selectedNode?.type_id === 3}>3</Button>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: 4 } } })} disabled={selectedNode?.type_id === 4}>4</Button>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: 5 } } })} disabled={selectedNode?.type_id === 5}>5</Button>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: 6 } } })} disabled={selectedNode?.type_id === 6}>6</Button>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: 7 } } })} disabled={selectedNode?.type_id === 7}>7</Button>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: 8 } } })} disabled={selectedNode?.type_id === 8}>8</Button>
        <Button onClick={() => updateNodes({ variables: { where: { id: { _eq: selected } }, set: { type_id: 9 } } })} disabled={selectedNode?.type_id === 9}>9</Button>
      </ButtonGroup>
      <ButtonGroup disabled={!selectedNode} style={{ marginRight: 6 }}>
        <Button onClick={() => deleteNodes({ variables: { where: { id: { _eq: selected } } } })}>{'X'}</Button>
        <Button color={action === 1 ? 'primary' : 'default'} onClick={() => setAction(1)}>{'|=>'}</Button>
        <Button color={action === 2 ? 'primary' : 'default'} onClick={async () => {
          const result = await insertNodes({ variables: { objects: {} } });
          const id = result?.data?.insert_nodes?.returning?.[0]?.id;
          await insertNodes({ variables: { objects: { from_id: selected, to_id: +id } } });
        }}>{'|=>O'}</Button>
      </ButtonGroup>
    </div>
  </div>;
}

export default wrap({ Component: function Wrap() {
  return <QueryStoreProvider>
    <GraphPage/>
  </QueryStoreProvider>;
} });
