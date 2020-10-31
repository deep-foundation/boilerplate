import React, { useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import dynamic from "next/dynamic";

import { useQueryStore } from '@deepcase/store/query';

import { wrap } from '../imports/wrap';

import { Dash, DashStage } from '../imports/dash/components/dash';
import { gql } from 'apollo-boost';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import ReactResizeDetector from 'react-resize-detector';

import { Graph } from "react-d3-graph";
import { Switch } from '@material-ui/core';

const Tree = dynamic(() => import('react-d3-tree'), { ssr: false });

const FETCH = gql`subscription FETCH {
  nodes {
    from_id id to_id type_id in { from_id id to_id type_id } out { from_id id to_id type_id }
  }
}`;
const FETCH_LIMITED = gql`subscription FETCH_LIMITED {
  nodes(where: {
    _by_item: { path_item: { type_id: { _eq: 1 } } },
  }) {
    from_id id to_id type_id in { from_id id to_id type_id } out { from_id id to_id type_id }
  }
}`;
const GRANT = gql`mutation GRANT($forNodeId: Int) {
  insert_nodes(objects: {
    type_id: 1,
    out: { data: {
      to_id: $forNodeId
    } },
  }) { returning { id } }
}`;
const UNGRANT = gql`mutation GRANT($ruleId: Int) {
  delete_nodes(where: {
    _or: [
      { id: { _eq: $ruleId } },
      { from_id: { _eq: $ruleId } },
    ],
  }) { returning { id } }
}`;

function TreePage() {
  const q = useSubscription(FETCH);

  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const data = useMemo(() => {
    const hash = {};
    const nodes = q?.data?.nodes || [];
    const roots = [];
    for (let i = 0; i < nodes.length; i++) {
      hash[nodes[i].id] = { node: nodes[i], tree: {
        name: nodes[i].id,
        children: [],
      } };
      if (!nodes[i]?.in?.length) roots.push(nodes[i].id);
    }
    for (let i = 0; i < nodes.length; i++) {
      hash[nodes[i].id].tree.children.push(...nodes[i]?.out?.map((l) => hash[l.id].tree));
    }
    console.log(q, hash, roots);
    return roots.map(r => hash[r].tree);
  }, [q]);
  return <div style={{ width: '100vw', height: '100vh' }} >
    <ReactResizeDetector handleWidth handleHeight onResize={(w: number, h: number) => setTranslate({ x: w / 2, y: h / 2 })}/>
    <>
      {!!data?.length && <Tree data={data} translate={translate}/>}
    </>
  </div>;
}

function GraphPage() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [limited, setLimited] = useState(false);

  const q = useSubscription(limited ? FETCH_LIMITED : FETCH);
  console.log(q);
  const [grant] = useMutation(GRANT);
  const [ungrant] = useMutation(UNGRANT);

  const data = useMemo(() => {
    const nodes = q?.data?.nodes || [];
    const data = {
      links: [],
      nodes: [],
      hash: [],
    };
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].from_id && nodes[i].to_id) {
        data.links.push({ id: nodes[i].id.toString(), source: nodes[i].from_id.toString(), target: nodes[i].to_id.toString() });
      } else {
        data.nodes.push({
          id: nodes[i].id.toString(),
          color: nodes[i]?.type_id ? 'green' : nodes[i]?.in?.length ? 'black' : 'red',
        });
      }
      data.hash[nodes[i].id] = nodes[i];
    }
    return data;
  }, [q]);

  // const onClickGraph = () => {
  //   console.log(`Clicked the graph background`);
  // };

  const onClickNode = (nodeId: string) => {
    if (data?.hash?.[+nodeId]?.type_id === 1) {
      ungrant({ variables: { ruleId: +nodeId } });
    } else {
      grant({ variables: { forNodeId: +nodeId } });
    }
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

  // const onClickLink = (source, target) => {
  //   console.log(`Clicked link between ${source} and ${target}`);
  // };

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

  return <div style={{ width: '100vw', height: '100vh', position: 'relative' }} >
    <ReactResizeDetector handleWidth handleHeight onResize={(w: number, h: number) => setSize({ w, h })}/>
    <>
      {!!data?.nodes?.length && !!data?.links?.length && <Graph
        id="deepcase-materialized-path"
        data={{ links: data.links, nodes: data.nodes }}
        config={{
          height: size.h,
          width: size.w,
          directed: true,
        }}
        onClickNode={onClickNode}
        // onDoubleClickNode={onDoubleClickNode}
        // onRightClickNode={onRightClickNode}
        // onClickGraph={onClickGraph}
        // onClickLink={onClickLink}
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
  </div>;
}

export default wrap({ Component: function Wrap() {
  return <GraphPage/>;
} });
