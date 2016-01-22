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

ipc.config.id   = 'tlsServer';
ipc.config.retry= 1500;
ipc.config.networkHost='localhost';
ipc.config.networkPort=8700;
ipc.config.tls={
    public: __dirname+ '/../../../../local-node-ipc-certs/server.pub',
    private: __dirname+ '/../../../../local-node-ipc-certs/private/server.key',
    dhparam: __dirname+ '/../../../../local-node-ipc-certs/private/dhparam.pem',
    requestCert: true,
    rejectUnauthorized:false,
    trustedConnections: [
        __dirname+ '/../../../../local-node-ipc-certs/client.pub'
    ]
}

ipc.serveNet(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
                
                ipc.server.emit(
                    socket,
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'I am TLS server!'
                        
                    }
                );
            }
        );
    }
);


ipc.server.start();
