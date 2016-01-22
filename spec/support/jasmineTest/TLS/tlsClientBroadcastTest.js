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

ipc.config.id = 'tlsClientTest';
ipc.config.retry= 600;
ipc.config.silent=true;
ipc.config.networkPort=8800;

ipc.config.tls={
    public: __dirname+ '/../../../../local-node-ipc-certs/client.pub',
    private: __dirname+ '/../../../../local-node-ipc-certs/private/client.key',
    rejectUnauthorized:false,
    trustedConnections: [
        __dirname+ '/../../../../local-node-ipc-certs/server.pub'
    ]

};



ipc.connectToNet(
    'testTLSserver',
    function open(){
         ipc.of.testTLSserver.on(
             'connect',
             function connected(){
                 ipc.of.testTLSserver.on(
                     'message',
                     function gotMessage(data){
                         console.log('data obtained from TLS Server is: ', data.id, data.message);
                         
                         if((data.message== 'broadcast message test from server')&&
                           (data.id== 'testTLSserver')){
                            
                            ipc.of.testTLSserver.emit(
                                'message',
                                {
                                    id      : ipc.config.id +'1',
                                    message : 'Acknowledgement from client1.'
                                }
                            );
                        }
                     }
                 );
             }
         );
    }
);

ipc.connectToNet(
    'testTLSserver2',
    function open(){
         ipc.of.testTLSserver2.on(
             'connect',
             function connected(){
                 ipc.of.testTLSserver2.on(
                     'message',
                     function gotMessage(data){
                         console.log('data obtained from TLS Server is: ', data.id, data.message);
                         
                         if((data.message== 'broadcast message test from server')&&
                           (data.id== 'testTLSserver')){
                            
                            ipc.of.testTLSserver2.emit(
                                'message',
                                {
                                    id      : ipc.config.id +'2',
                                    message : 'Acknowledgement from client2.'
                                }
                            );
                        }
                     }
                 );
             }
         );
    }
);
                         
                         
                         