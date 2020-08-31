import React, { useRef, useEffect } from 'react';
import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import { createEditor } from '../imports/rete';

class MyReactControl extends React.Component {

  componentDidMount() {
      // this.props.getData
      // this.props.putData
  }

  render() {
    return (
        <div>Hello ${this.props.name}!</div>
    )
  }
}

class MyControl extends Rete.Control {
  constructor(emitter, key, name) {
    super(key);
    this.render = 'react';
    this.component = MyReactControl;
    this.props = { emitter, name };
  }
}

export default function Page() {
  return <div style={{ position: 'fixed', left: 0, top: 0, width: '100%', height: '100%' }}>
    <div ref={(ref) => ref && createEditor(ref)}/>
  </div>;
}
