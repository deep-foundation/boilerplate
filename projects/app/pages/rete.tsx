import React, { useCallback, useEffect, useRef, useState } from 'react';

import _ from 'lodash';
import Rete from "rete";
import ConnectionPlugin from 'rete-connection-plugin';
import AreaPlugin from "rete-area-plugin";
import VueRenderPlugin from 'rete-vue-render-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin';
import ReactRenderPlugin, { Node, Control } from 'rete-react-render-plugin';

import { Fab, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@material-ui/core';

import { Socket } from '../imports/rete/socket';
import { useApolloClient, useSubscription } from '@apollo/react-hooks';
import { wrap } from '../imports/wrap';
import { ReteDocument } from '../imports/rete/document';
import { ReteNodeReact } from '../imports/rete/node';

const numSocket = new Rete.Socket("Number value");

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
    // this.update();
  }
}

class ReteNode extends Rete.Component {
  data = { component: ReteDocument };

  constructor() {
    super("Node");
  }

  builder(node) {
    const inp2 = new Rete.Input("num2", "Number2", numSocket);
    const inp1 = new Rete.Input("num1", "Number", numSocket);
    const out = new Rete.Output("num", "Number", numSocket);
    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    console.log({ node, inputs, outputs });
    const n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    const n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    const sum = n1 + n2;

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["num"] = sum;
  }
}

// export function NodeLoader({
//   nodeId,
//   reteComponent,
//   editorRef,
// }: {
//   nodeId: string;
//   reteComponent: any;
//   editorRef: any;
// }) {
//   const q = useSubscription(NODE, { variables: { nodeId } });
//   const existsRef = useRef(false);
//   console.log(0, q);
//   useEffect(() => {
//     console.log(1, q);
//     (async () => {
//       if (q?.data?.nodes?.[0] && !existsRef.current) {
//         console.log(2, q);
//         existsRef.current = await reteComponent.createNode({ abc: 'def', qwe: 'xyz' });
//         editorRef.current.addNode(existsRef.current);
//       }
//     })();
//     return () => {
//       console.log(3, q);
//       existsRef.current && editorRef.current.deleteNode(existsRef.current);
//     };
//   }, [q]);

//   return <></>;
// }

export function NodeLoader({
  nodeId,
  reteComponent,
  editorRef,
}: {
  nodeId: string;
  reteComponent: any;
  editorRef: any;
}) {
  useEffect(() => {
    let reteNode;
    (async () => {
      reteNode = await reteComponent.createNode({ nodeId });
      editorRef.current.addNode(reteNode);
    })();
    return () => {
      reteNode && editorRef.current.deleteNode(reteNode);
    };
  }, []);

  return <></>;
}

export function ReteNodes() {
  const elementRef = useRef();
  const editorRef = useRef<any>();
  const engineRef = useRef<any>();
  const componentsRef = useRef<{ [key: string]: any }>({});
  const [mounted, setMounted] = useState(false);
  const update = useCallback(async () => {
    await engineRef.current.abort();
    await engineRef.current.process(editorRef.current.toJSON());
    !_.isEmpty(editorRef.current.toJSON()?.nodes) && editorRef.current.trigger('arrange');
  }, []);
  useEffect(() => {
    (async () => {
      componentsRef.current.add = new ReteNode();

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

  return <>
    {/* {mounted && <>
      <NodeLoader
        nodeId={'a'}
        reteComponent={componentsRef.current.add}
        editorRef={editorRef}
        update={update}
      />
      <NodeLoader
        nodeId={'b'}
        reteComponent={componentsRef.current.add}
        editorRef={editorRef}
        update={update}
      />
    </>} */}
    <div style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, background: '#5E5E5E' }}>
      <div id="rete" style={{ width: '100%', height: '100%' }} ref={elementRef}/>
    </div>
  </>;
}

export default wrap({ Component: function Page() {
  return <ReteNodes/>;
}});
