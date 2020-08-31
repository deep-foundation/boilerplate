import React from 'react';
import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import AreaPlugin from 'rete-area-plugin';
import { MyNode } from './rete-node';

const numSocket = new Rete.Socket('Number value');

class NumControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="number"
      value={value}
      ref={(ref) => {
        ref && ref.addEventListener('pointerdown', e => e.stopPropagation());
      }}
      onChange={e => onChange(+e.target.value)}
    />
  )

  emitter: any;
  key: any;
  component: any;
  props: any;
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
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger('process');
      },
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    // @ts-ignore
    this.update();
  }
}

class NumComponent extends Rete.Component {
  constructor() {
    super('Number');
  }

  builder(node) {
    const out1 = new Rete.Output('num', 'Number', numSocket);
    const ctrl = new NumControl(this.editor, 'num', node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data.num;
  }
}

class AddComponent extends Rete.Component {
  constructor() {
    super('Add');
    // @ts-ignore
    this.data.component = MyNode; // optional
  }

  builder(node) {
    const inp1 = new Rete.Input('num1', 'Number', numSocket);
    const inp2 = new Rete.Input('num2', 'Number2', numSocket);
    const out = new Rete.Output('num', 'Number', numSocket);

    inp1.addControl(new NumControl(this.editor, 'num1', node));
    inp2.addControl(new NumControl(this.editor, 'num2', node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, 'preview', node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const n1 = inputs['num1'].length ? inputs['num1'][0] : node.data.num1;
    const n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2;
    const sum = n1 + n2;

    this.editor.nodes
      .find(n => n.id === node.id)
      .controls.get('preview')
      // @ts-ignore
      .setValue(sum);
    outputs['num'] = sum;
  }
}

export async function createEditor(container) {
  const components = [new NumComponent(), new AddComponent()];

  const editor = new Rete.NodeEditor('demo@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);

  const engine = new Rete.Engine('demo@0.1.0');

  components.map((c) => {
    editor.register(c);
    engine.register(c);
  });

  const n1 = await components[0].createNode({ num: 2 });
  const n2 = await components[0].createNode({ num: 3 });
  const add = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);

  editor.connect(n1.outputs.get('num'), add.inputs.get('num1'));
  editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

  editor.on(
    // @ts-ignore
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      console.log('process');
      await engine.abort();
      await engine.process(editor.toJSON());
    },
  );

  editor.view.resize();
  editor.trigger('process');
  AreaPlugin.zoomAt(editor, editor.nodes);
}
