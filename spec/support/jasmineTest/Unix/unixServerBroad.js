'use strict';

const ipc=require('../../../../node-ipc');
const process=require('process');
const dieAfter=30000;

//die after 30 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id = 'unixServerBroad';
ipc.config.retry= 1500;
ipc.config.silent=true;

ipc.serve();

ipc.server.on(
    'connect',
    function connected(socket){
        ipc.server.broadcast(
            'message',
            {
                message: 'broadcast message test from server'
            }
        );


    }
);


ipc.server.start();

