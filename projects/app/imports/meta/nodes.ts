export interface INode {
  type: string;
  extends: string[];
  extended: string[];
  from: string[];
  to: string[];
  in: string[];
  out: string[];
}

export const nodeTypes = {};

export const addNodeType = (node: INode) => {
  nodeTypes[node.type] = node;
  for (let i = 0; i < node.to.length; i++) {
    nodeTypes[node.to[i]].in.push(node.type);
  }
  for (let i = 0; i < node.from.length; i++) {
    nodeTypes[node.from[i]].out.push(node.type);
  }
  for (let i = 0; i < node.extends.length; i++) {
    nodeTypes[node.extends[i]].extended.push(node.type);
  }
}

addNodeType({
  type: 'node',
  extends: [],
  extended: [],
  from: [],
  to: [],
  in: [],
  out: [],
});

addNodeType({
  type: 'link',
  extends: ['node'],
  extended: [],
  from: [],
  to: [],
  in: [],
  out: [],
});

addNodeType({
  type: 'subject',
  extends: ['node'],
  extended: [],
  from: [],
  to: [],
  in: [],
  out: [],
});

addNodeType({
  type: 'phone',
  extends: ['node'],
  extended: [],
  from: [],
  to: [],
  in: [],
  out: [],
});

addNodeType({
  type: 'of',
  extends: ['link'],
  extended: [],
  from: ['node'],
  to: ['node'],
  in: [],
  out: [],
});
