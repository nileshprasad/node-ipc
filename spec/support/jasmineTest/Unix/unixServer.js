'use strict';

const ipc=require('../../../../node-ipc');

ipc.config.id = 'unixServer';
ipc.config.retry= 1500;
ipc.config.silent=true;

ipc.serve(
    function serverStarted(){
        ipc.server.on(
            'message',
            function gotMessage(data,socket){
                ipc.server.emit(
                    socket,
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'I am unix server!'
                    }
                );
            }
        );
    }
);

ipc.server.on(
    'socket.disconnected',
    function shutdownServer(){
        ipc.server.stop();
    }
);

ipc.server.start();
