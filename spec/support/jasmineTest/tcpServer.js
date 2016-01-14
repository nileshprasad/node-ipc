'use strict';

const ipc=require('../../../node-ipc');


ipc.config.id = 'tcpServer';
ipc.config.retry= 1500;
ipc.config.networkPort=8300;
ipc.config.silent=true;

ipc.serveNet(
    function serverStarted(){
        ipc.server.on(
            'message',
            function gotMessage(data,socket){
                ipc.server.emit(
                    socket,
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'I am TCP server!'
                    }
                );
                
                if ((data.id == 'testClient') && (data.message == 'Hello from testClient.')){
                    ipc.server.broadcast(
                        'kill.connection',
                        {
                            id:ipc.config.id
                        }
                    );
                }
                
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
