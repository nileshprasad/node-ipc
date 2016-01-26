'use strict';

const cmd=require('node-cmd');

cmd.run(`node ${__dirname}/Unix/unixServer.js`);
cmd.run(`node ${__dirname}/Unix/unixServerSync.js`);

cmd.run(`node ${__dirname}/UDP/udp4Server.js`);
cmd.run(`node ${__dirname}/UDP/udp6Server.js`);

cmd.run(`node ${__dirname}/TCP/tcpServer.js`);

cmd.run(`node ${__dirname}/Unix/unixClient.js`);
cmd.run(`node ${__dirname}/Unix/unixClientforBroadcastTest.js`);
cmd.run(`node ${__dirname}/Unix/unixServerBroad.js`);

cmd.run(`node ${__dirname}/TCP/tcpClient.js`);

cmd.run(`node ${__dirname}/RawBuffer/rawBufferServer.js`);

cmd.run(`node ${__dirname}/TLS/tlsClientBroadcastTest.js`);
cmd.run(`node ${__dirname}/TLS/tlsServer.js`);


