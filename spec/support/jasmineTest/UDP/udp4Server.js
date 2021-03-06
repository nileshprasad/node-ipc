'use strict';

const ipc=require('../../../../node-ipc');
const process=require('process');
const dieAfter=30000;

//die after 60 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id = 'udpServer';
ipc.config.retry= 1500;
ipc.config.silent=true;
ipc.config.networkPort=8095;


ipc.serveNet(
    'udp4',
    function serverStarted(){
        ipc.server.on(
            'message',
            function gotMessage(data,socket){
                ipc.server.emit(
                    socket,
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'I am UDP4 server!'
                    }
                );
            }
        );
    }
);


ipc.server.start();
