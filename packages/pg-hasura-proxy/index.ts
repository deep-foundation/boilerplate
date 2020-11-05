import * as proxy from "node-tcp-proxy";
import * as util from 'util';
import { Buffer } from 'buffer';

var newProxy = proxy.createProxy(8081, "localhost", 15432, {
  upstream: function(context, data) {
    console.log(util.format("Client %s:%s sent:",
      context.proxySocket.remoteAddress,
      context.proxySocket.remotePort));
    let str = data.toString();
    str = str.replace('select * from nodes where id=3;', 'select * from nodes where id=4;');
    const buffer = Buffer.from(str);
    // do something with the data and return modified data
    return buffer;
  },
  downstream: function(context, data) {
    console.log(util.format("Service %s:%s sent:",
      context.serviceSocket.remoteAddress,
      context.serviceSocket.remotePort));
    console.log(data.toString());
    // do something with the data and return modified data
    return data;
  },
  serviceHostSelected: function(proxySocket, i) {
    console.log("Service host %s:%s selected for client");
    // use your own strategy to calculate i
    return i;
  },
});
