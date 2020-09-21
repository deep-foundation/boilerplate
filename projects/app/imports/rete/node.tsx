import React, { useEffect, useRef, useState } from 'react';
import { Divider, Fab, ListItem, ListItemText, Paper } from '@material-ui/core';

import Rete from "rete";
import { Control, Node } from 'rete-react-render-plugin';

import { Socket } from './socket';
import NODE from '../gql/NODE.gql';
import { ApolloProvider, useSubscription } from '@apollo/react-hooks';
import { wrap } from '../wrap';

export const CustomDot = (props) => {
  return <Fab size="small" color="primary">+</Fab>;
};

export function ReteNodeReact({
  nodeId,
  ReteProps,
  ReteState,
  update,
}: {
  nodeId: string;
  ReteProps: any;
  ReteState: any;
  update: () => any;
}) {
  const { outputs, controls, inputs, selected } = ReteState;

  // const q = useSubscription(NODE, { variables: { nodeId } });
  // const node = q?.data?.nodes?.[0];
  // const nodeRef = useRef<any | void>();
  // useEffect(() => {
  //   if (node && !nodeRef) {
  //     nodeRef.current = node;
  //     const inp2 = new Rete.Input("num2", "Number2", new Rete.Socket("Number value"));
  //   // const inp1 = new Rete.Input("num1", "Number", numSocket);
  //   // const out = new Rete.Output("num", "Number", numSocket);
  //   // inp1.addControl(new NumControl(this.editor, "num1", node));
  //   // inp2.addControl(new NumControl(this.editor, "num2", node));

  //     ReteProps.node.addInput(inp2);
  //     ReteProps.node.update();
  //   //   .addInput(inp1)
  //   //   .addControl(new NumControl(this.editor, "preview", node, true))
  //   //   .addOutput(out);
  //     update();
  //   }
  // }, [node]);

  console.log({ ReteProps, ReteState });

  return <Paper>
    <ListItem divider >
      <ListItemText primary={ReteProps?.node?.name}/>
    </ListItem>

    <Divider/>

    {true && <>

    {/* Outputs */}
    {outputs.map((output) => (<>
      <Socket Component={() => <CustomDot/>} type="output" socket={output.socket} io={output} innerRef={ReteProps.bindSocket} rootProps={{ style: { float: 'right', height: 40 }}}/>
      <ListItem divider key={output.key}>
        <ListItemText primary={output.name} secondary={output.key}/>
      </ListItem>
    </>))}

    <Divider/>

    {/* Controls */}
    {controls.map((control) => (<>
      <ListItem divider key={control.key}>
        <ListItemText primary={<>
          <Control className="control" key={control.key} control={control} innerRef={ReteProps.bindControl} />
        </>} secondary={control.key}/>
      </ListItem>
    </>))}

    <Divider/>

    {/* Inputs */}
    {inputs.map(input => (<>
      <Socket Component={() => <CustomDot/>} type="input" socket={input.socket} io={input} innerRef={ReteProps.bindSocket} rootProps={{ style: { float: 'left', height: 40 }}}/>
      <ListItem divider key={input.key}>
        <ListItemText primary={<>
        {!input.showControl() && <div className="input-title">{input.name}</div>}
        {input.showControl() && <Control className="input-control" control={input.control} innerRef={ReteProps.bindControl} />}
        </>} secondary={input.key}/>
      </ListItem>
    </>))}
    {/* <pre><code>
      {JSON.stringify(q?.data, null, 2)}
    </code></pre> */}

    </>}
  </Paper>;
}
