'use strict';

const ipc= require('../../../../node-ipc');
const process=require('process');
const dieAfter=30000;

//die after 30 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id   = 'rawBufferServer';
ipc.config.retry= 600;
ipc.config.networkPort =8600;

ipc.config.rawBuffer=true;
ipc.config.encoding='ascii';


ipc.serveNet(
    function serverStarted(){
        ipc.server.on(
            'connect',
            function sendMessage(socket){
                ipc.server.emit(
                    socket,
                    'hello'
                );
            }
        );
    }
);


ipc.server.start();


