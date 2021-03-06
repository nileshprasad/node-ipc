'use strict';

const ipc=require('../../../../node-ipc');
const process=require('process');
const dieAfter=20000;

//die after 20 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id = 'unixClientTest';
ipc.config.retry= 600;
ipc.config.silent=true;

ipc.connectTo(
    'unixServerTest',
    '/tmp/app.unixServerTest',
    function open(){
         ipc.of.unixServerTest.on(
             'connect',
             function connected(){
                 ipc.of.unixServerTest.on(
                     'message',
                     function gotMessage(data){
                         ipc.of.unixServerTest.emit(
                            'message',
                            {
                                id      : ipc.config.id +'1'
                            }
                        );
                     }
                 );
             }
         );
    }
);

ipc.connectTo(
    'unixServerTest2',
    '/tmp/app.unixServerTest',
    function open(){
         ipc.of.unixServerTest2.on(
             'connect',
             function connected(){
                 ipc.of.unixServerTest2.on(
                     'message',
                     function gotMessage(data){
                         ipc.of.unixServerTest2.emit(
                            'message',
                            {
                                id      : ipc.config.id +'2'
                            }
                        );
                        
                     }
                 );
             }
         );
    }
);
                         
                         
                         