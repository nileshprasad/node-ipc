'use strict'

let ipc = require('../../../../node-ipc');

describe('TLS Socket verification of client',
         function(){
                ipc.config.id ='testClientTLS';
                ipc.config.retry = 600;
                ipc.config.silent = true;
                
                it(
                    'Verify the error message pops when TLS client configuration is passed without "reject" and "trusted connections"',
                    function(done){
                        ipc.config.tls={
                            public: __dirname+ '/../../../../local-node-ipc-certs/client.pub',
                            private: __dirname+ '/../../../../local-node-ipc-certs/private/client.key'
                        };

                        ipc.connectToNet(
                            'tlsServer',
                             8700,
                             function(){
                                 ipc.of.tlsServer.on(
                                     'connect',
                                     function(){
                                         ipc.of.tlsServer.on(
                                            'error',
                                            function(err){
                                                expect(err).toBeDefined();
                                                testDone();
                                            }
                                        );
                                     }
                                 );
                             }
                        );
                        
                        function testDone(){
                            ipc.disconnect('tlsServer');
                            done();
                        }
                            
                    }
                );
    
                it(
                    'Verify the error message pops when TLS client configuration is passed without "reject"',
                    function(done){
                        
                        ipc.config.tls={
                            public: __dirname+ '/../../../../local-node-ipc-certs/client.pub',
                            private: __dirname+ '/../../../../local-node-ipc-certs/private/client.key',
                            trustedConnections: [
                                __dirname+ '/../../../../local-node-ipc-certs/server.pub'
                            ]
                        };

                        ipc.connectToNet(
                            'tlsServer',
                             8700,
                             function(){
                                 ipc.of.tlsServer.on(
                                     'connect',
                                     function(){
                                         ipc.of.tlsServer.on(
                                            'error',
                                            function(err){
                                                expect(err).toBeDefined();
                                                testDone();
                                            }
                                        );
                                     }
                                 );
                             }
                        );
                        
                        function testDone(){
                            ipc.disconnect('tlsServer');
                            done();
                        }
                            
                    }
                );
    
                it(
                    'Verify TLS client connects to the server in more secure configuration.',
                    function(done){
                        
                        ipc.config.networkHost='localhost';
                        ipc.config.tls={
                            public: __dirname+ '/../../../../local-node-ipc-certs/client.pub',
                            private: __dirname+ '/../../../../local-node-ipc-certs/private/client.key',
                            rejectUnauthorized:false,
                            trustedConnections: [
                                __dirname+ '/../../../../local-node-ipc-certs/server.pub'
                            ]

                        };

                        ipc.connectToNet(
                            'tlsServer',
                             8700,
                             function(){
                                 ipc.of.tlsServer.on(
                                     'connect',
                                     function(){
                                         ipc.of.tlsServer.emit(
                                             'message',
                                            {
                                                id      : ipc.config.id,
                                                message : 'Hello from testClientTLS.'
                                            }
                                        );
                                     }
                                 );
                                 
                                 ipc.of.tlsServer.on(
                                    'message',
                                    function(data,socket){
                                        expect(data.id).toBe('tlsServer');
                                        expect(data.message).toBe('I am TLS server!');
                                        testDone();
                                    }
                                );
                                
                                ipc.of.tlsServer.on(
                                    'error',
                                    function(err){
                                        expect(err).toBe(false);
                                        testDone();
                                    }
                                );    
                             }
                        );
                        
                        function testDone(){
                            ipc.disconnect('tlsServer');
                            ipc.config.tls={};
                            done();
                        }
                            
                    }
                );
    
    
    
    
    
    
    
    
        }
);

