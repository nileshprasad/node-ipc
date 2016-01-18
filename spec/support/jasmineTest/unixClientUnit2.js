'use strict';

const ipc=require('../../../node-ipc');
const process=require('process');
const dieAfter=20000;

//die after 20 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id = 'unixClientUnit2';
ipc.config.retry= 600;
ipc.config.silent=true;

ipc.connectTo(
    'unixServerUnit2',
    function open(){
         ipc.of.unixServerUnit2.on(
            'connect',
            function connected(){
                ipc.of.unixServerUnit2.on(
                    'message',
                    function gotMessage(data){
                        console.log('data obtained from Unix Server is: ', data.id, data.message);
                    }
                );

                ipc.of.unixServerUnit2.emit(
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'Hello from Client.'
                    }
                );
            }
        );
     }
    
    
);

