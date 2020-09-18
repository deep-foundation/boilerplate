import dynamic from 'next/dynamic';

import React, { useState } from 'react';

const Tree = dynamic(() => import('react-d3-tree'), { ssr: false });

import { nodeTypes, INode } from '../meta/nodes';

function parse(node: INode) {
  const hash: any = {};
  const tree = parseNode(node, hash);
  return {
    hash,
    tree,
  }
}

function parseNode(node: INode, hash: any = {}) {
  hash[node.type] = {
    name: node.type,
    children: [
      {
        name: 'extends',
      },
      {
        name: 'extended',
      },
      {
        name: 'from',
      },
      {
        name: 'to',
      },
      {
        name: 'in',
      },
      {
        name: 'out',
      },
    ],
  };
  return hash[node.type];
};

const myTreeData = [parse(nodeTypes.node)]

// const myTreeData = [
//   {
//     name: 'Top Level',
//     attributes: {
//       keyA: 'val A',
//       keyB: 'val B',
//       keyC: 'val C',
//     },
//     children: [
//       {
//         name: 'Level 2: A',
//         attributes: {
//           keyA: 'val A',
//           keyB: 'val B',
//           keyC: 'val C',
//         },
//       },
//       {
//         name: 'Level 2: B',
//       },
//     ],
//   },
// ];

class NodeLabel extends React.PureComponent {
  render() {
    const {className, nodeData} = this.props
    return (
      <div className={className}>
        <h2>{nodeData.name}</h2>
        {nodeData._children && 
          <button>{nodeData._collapsed ? 'Expand' : 'Collapse'}</button>
        }
      </div>
    )
  }
}

export function Dash() {
  const [data, setData] = useState(parse(nodeTypes))
  return <>
    <Tree
      data={data.tree}
      onClick={(item) => {
        console.log(item);
      }}
    //   allowForeignObjects
    //   nodeLabelComponent={{
    //     render: <NodeLabel className='myLabelComponentInSvg' />,
    //     foreignObjectWrapper: {
    //       y: 24
    //     }
    //   }}
    />
  </>;
}
