import { Box } from '@material-ui/core';
/* eslint-disable react/prop-types */
import React from 'react';

function kebab(str) {
  const replace = s => s.toLowerCase().replace(/ /g, '-');
  return Array.isArray(str) ? str.map(replace) : replace(str);
}

export interface ISocketProps {
  Component: any;
  innerRef: any;
  type: string;
  io: any;
  socket: any;
  className?: string;
  rootProps?: any;
}

export class Socket extends React.Component<ISocketProps> {
  createRef = el => {
    const { innerRef, type, io } = this.props;
    el && innerRef(el, type, io);
  };

  render() {
    const { socket, type, Component = () => <div></div>, className = '', rootProps = {} } = this.props;

    return (
      <div
        title={socket.name}
        ref={el => this.createRef(el)} // force update for new IO with a same key 
        className={`${kebab(socket.name)} ${className}`}
        {...rootProps}
      >
        <Component/>
      </div>
    )
  }
}