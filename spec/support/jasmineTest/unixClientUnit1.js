'use strict';

const ipc=require('../../../node-ipc');
const process=require('process');
const dieAfter=20000;

//die after 60 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id = 'unixClientUnit1';
ipc.config.retry= 600;
ipc.config.silent=true;

ipc.connectTo(
    'unixServerUnit',
    function open(){
         ipc.of.unixServerUnit.on(
            'connect',
            function connected(){
                ipc.of.unixServerUnit.on(
                    'message',
                    function gotMessage(data){
                        console.log('data obtained from Unix Server is: ', data.id, data.message);
                    }
                );

                ipc.of.unixServerUnit.emit(
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

