'use strict';
const ipc = require('../../../../node-ipc');

describe(
    'Test Cases for TLS server: ',
    function(){
        it(
            'Verify TLS server broadcasts and receives message.',
            function(done){
                ipc.config.id ='testTLSserver';
                ipc.config.retry = 1000;
                ipc.config.maxConnections=10;
                ipc.config.networkPort= 8800;
                ipc.config.silent = true;

                let responseMessage={
                    tlsClientTest1 : false,
                    tlsClientTest2 : false
                };

                ipc.config.tls={
                    public: __dirname+ '/../../../../local-node-ipc-certs/server.pub',
                    private: __dirname+ '/../../../../local-node-ipc-certs/private/server.key',
                    dhparam: __dirname+ '/../../../../local-node-ipc-certs/private/dhparam.pem',
                    requestCert: true,
                    rejectUnauthorized:false,
                    trustedConnections: [
                        __dirname+ '/../../../../local-node-ipc-certs/client.pub'
                    ]
                };

                ipc.serveNet(
                    function(){
                        ipc.server.on(
                            'connect',
                            function connected(socket){
                                ipc.server.broadcast(
                                    'message',
                                    {
                                        id: ipc.config.id,
                                        message: 'broadcast message test from server'
                                    }
                                );

                                ipc.server.on(
                                    'message',
                                    function gotMessage(data,socket){
                                        responseMessage[data.id]=true;
                                    }
                                );
                            }
                        );

                        ipc.server.on(
                            'error',
                            function gotErr(err){
                                expect(err).toBe(false);
                                done();
                            }
                        );
                    }
                );

            setTimeout(
                function testDone(){
                    expect(responseMessage.tlsClientTest1).toBe(true);
                    expect(responseMessage.tlsClientTest2).toBe(true);
                    ipc.server.stop();
                    done();
                },2000
            );

            ipc.server.start();

            }
        );
    }
);

