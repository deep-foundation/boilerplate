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
      ref={ref => {
        ref && ref.addEventListener('pointerdown', e => e.stopPropagation());
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
        this.emitter.trigger('process');
      }
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

class NumComponent extends Rete.Component {
  constructor() {
    super('Number');
  }

  builder(node) {
    let out1 = new Rete.Output('num', 'Number', numSocket);
    let ctrl = new NumControl(this.editor, 'num', node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data.num;
  }
}

class AddComponent extends Rete.Component {
  constructor() {
    super('Add');
    this.data.component = MyNode; // optional
  }

  builder(node) {
    let inp1 = new Rete.Input('num1', 'Number', numSocket);
    let inp2 = new Rete.Input('num2', 'Number2', numSocket);
    let out = new Rete.Output('num', 'Number', numSocket);

    inp1.addControl(new NumControl(this.editor, 'num1', node));
    inp2.addControl(new NumControl(this.editor, 'num2', node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, 'preview', node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    let n1 = inputs['num1'].length ? inputs['num1'][0] : node.data.num1;
    let n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2;
    let sum = n1 + n2;

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get('preview')
      .setValue(sum);
    outputs['num'] = sum;
  }
}

export async function createEditor(container) {
  let components = [new NumComponent(), new AddComponent()];

  let editor = new Rete.NodeEditor('demo@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);

  let engine = new Rete.Engine('demo@0.1.0');

  components.map(c => {
    editor.register(c);
    engine.register(c);
  });

  let n1 = await components[0].createNode({ num: 2 });
  let n2 = await components[0].createNode({ num: 3 });
  let add = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);

  editor.connect(n1.outputs.get('num'), add.inputs.get('num1'));
  editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      console.log('process');
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  editor.trigger('process');
  AreaPlugin.zoomAt(editor, editor.nodes);
}
