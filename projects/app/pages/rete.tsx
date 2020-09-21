import React, { useCallback, useEffect, useRef, useState } from 'react';

import _ from 'lodash';
import Rete from "rete";
import ConnectionPlugin from 'rete-connection-plugin';
import AreaPlugin from "rete-area-plugin";
import VueRenderPlugin from 'rete-vue-render-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin';
import ReactRenderPlugin, { Node, Control } from 'rete-react-render-plugin';

import { Fab, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@material-ui/core';

import { useQueryStore } from '@deepcase/store/query';

import { Socket } from '../imports/rete/socket';
import { useApolloClient, useSubscription } from '@apollo/react-hooks';
import { wrap } from '../imports/wrap';
import { ReteDocument } from '../imports/rete/document';
import { ReteNodeReact } from '../imports/rete/node';
import NODES from '../imports/gql/NODES.gql';

const RefSocket = new Rete.Socket('String');

class NumControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="number"
      value={value}
      ref={ref => {
        ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
      }}
      onChange={e => onChange(+e.target.value)}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = NumControl.component;

    const initial = node.data[key] || 0;

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: v => {
        this.setValue(v);
        this.emitter.trigger("process");
      }
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

class ReteNode extends Rete.Component {
  data = { component: ReteDocument };

  constructor() {
    super("node");
  }

  builder(node) {
    const id = new Rete.Input('id', 'id', RefSocket);

    const outI = new Rete.Input('out', 'out', RefSocket);
    const inI = new Rete.Input('in', 'in', RefSocket);
    const outO = new Rete.Output('out', 'out', RefSocket);
    const inO = new Rete.Output('in', 'in', RefSocket);

    const fromI = new Rete.Input('from', 'from', RefSocket);
    const fromO = new Rete.Output('from', 'from', RefSocket);
    const toI = new Rete.Input('to', 'to', RefSocket);
    const toO = new Rete.Output('to', 'to', RefSocket);

    return node
      .addInput(id)

      .addInput(inI)
      .addOutput(inO)

      .addInput(outI)
      .addOutput(outO)

      .addInput(fromI)
      .addOutput(fromO)

      .addInput(toI)
      .addOutput(toO)
    ;
  }

  worker(node, inputs, outputs) {
  }
}

export function ReteNodes() {
  const elementRef = useRef();
  const editorRef = useRef<any>();
  const engineRef = useRef<any>();
  const componentsRef = useRef<{ [key: string]: any }>({});
  const [mounted, setMounted] = useState(false);

  const [nodeIds, setNodeIds] = useQueryStore<any>('nodeIds', ['ikazjkd9xkpfc']);

  const update = useCallback(async (inJson) => {
    await engineRef.current.abort();
    const json = inJson?.id ? inJson : editorRef.current.toJSON();
    if (inJson) await editorRef.current.fromJSON(json);
    if (!inJson) await engineRef.current.process();
    !_.isEmpty(json?.nodes) && editorRef.current.trigger('arrange');
  }, []);

  useEffect(() => {
    (async () => {
      componentsRef.current.node = new ReteNode();

      editorRef.current = new Rete.NodeEditor("demo@0.1.0", elementRef.current);
      editorRef.current.use(ConnectionPlugin);
      editorRef.current.use(ReactRenderPlugin);
      editorRef.current.use(AutoArrangePlugin, { margin: {x: 50, y: 50 }, depth: 0 });

      engineRef.current = new Rete.Engine("demo@0.1.0");

      _.map(componentsRef.current, (c) => {
        editorRef.current.register(c);
        engineRef.current.register(c);
      });

      editorRef.current.on(
        "process nodecreated noderemoved connectioncreated connectionremoved",
        update,
      );

      editorRef.current.view.resize();
      editorRef.current.trigger("process");
      AreaPlugin.zoomAt(editorRef.current, editorRef.current.nodes);

      setMounted(true);
    })();
  }, []);

  const q = useSubscription(NODES, { variables: { nodeIds }});
  const nodes = q?.data?.nodes || [];
  useEffect(() => {
    if (nodes.length) {
      (async () => {
        const jsonNodes = {};
        for (let n = 0; n < nodes.length; n++) {
          jsonNodes[nodes[n].id] = {
            id: nodes[n].id,
            data: {},
            inputs: {
              id: { connections: [] },
              from: { connections: [] },
              to: { connections: [] },
              out: { connections: [] },
              in: { connections: [] },
            },
            outputs: {
              from: { connections: [] },
              to: { connections: [] },
              out: { connections: [] },
              in: { connections: [] },
            },
            position: [0, 0],
            name: 'node',
          };
        }
        // await editorRef.current.fromJSON({
        //   id: 'demo@0.1.0',
        //   nodes: jsonNodes,
        // });
        console.log(nodes, jsonNodes);
        await update({
          id: 'demo@0.1.0',
          nodes: jsonNodes,
        });
      })();
    }
  }, [nodes]);

  return <>
    <div style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, background: '#5E5E5E' }}>
      <div id="rete" style={{ width: '100%', height: '100%' }} ref={elementRef}/>
    </div>
  </>;
}

export default wrap({ Component: function Page() {
  return <ReteNodes/>;
}});
