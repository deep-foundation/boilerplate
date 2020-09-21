import React, { useEffect, useRef, useState } from 'react';
import { Fab, ListItem, ListItemText, Paper } from '@material-ui/core';
import { Control, Node } from 'rete-react-render-plugin';

import { Socket } from './socket';
import NODE from '../gql/NODE.gql';
import { ApolloProvider, useSubscription } from '@apollo/react-hooks';
import { wrap } from '../wrap';
import { ReteNodeReact } from './node';

export function ReteDocumentReact({
  nodeId,
  ReteProps,
  ReteState,
  Component,
  update,
}: {
  nodeId: string;
  ReteProps: any;
  ReteState: any;
  Component: any;
  update: () => any;
}) {
  const [Wrapped] = useState(() => wrap({ Component: ReteNodeReact }));
  return <Wrapped nodeId={nodeId} ReteProps={ReteProps} ReteState={ReteState} update={update}/>;
}

export class ReteDocument extends Node {
  render() {
    const { node, bindSocket, bindControl } = this.props;
    console.log('ReteDocumentReact', this.props);
    const { outputs, controls, inputs, selected } = this.state;

    return (<>
      <ReteDocumentReact nodeId={this?.props?.node?.data?.nodeId} ReteProps={this.props} ReteState={this.state} Component={this?.props?.node?.data?.Component} update={this?.props?.node?.data?.update}/>
    </>);
      // <Paper>
      //   <ListItem divider >
      //     <ListItemText primary={node.name}/>
      //   </ListItem>

      //   {/* Outputs */}
      //   {outputs.map((output) => (<>
      //     <Socket Component={() => <CustomDot/>} type="output" socket={output.socket} io={output} innerRef={bindSocket} rootProps={{ style: { float: 'right', height: 40 }}}/>
      //     <ListItem divider key={output.key}>
      //       <ListItemText primary={output.name} secondary={output.key}/>
      //     </ListItem>
      //   </>))}

      //   {/* Controls */}
      //     {controls.map((control) => (<>
      //     <ListItem divider key={control.key}>
      //       <ListItemText primary={<>
      //         <Control className="control" key={control.key} control={control} innerRef={bindControl} />
      //       </>} secondary={control.key}/>
      //     </ListItem>
      //   </>))}

      //   {/* Inputs */}
      //   {inputs.map(input => (<>
      //     <Socket Component={() => <CustomDot/>} type="input" socket={input.socket} io={input} innerRef={bindSocket} rootProps={{ style: { float: 'left', height: 40 }}}/>
      //     <ListItem divider key={input.key}>
      //       <ListItemText primary={<>
      //       {!input.showControl() && <div className="input-title">{input.name}</div>}
      //       {input.showControl() && <Control className="input-control" control={input.control} innerRef={bindControl} />}
      //       </>} secondary={input.key}/>
      //     </ListItem>
      //   </>))}
      // </Paper>
  }
}
