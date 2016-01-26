const ipc = require('../../../../node-ipc');
//ipc.config; // Starting test with default config values
    
describe('Raw Buffer tests: ',
         function(){
            
            it(
                'Verify the ASCII encoded data received from the server is encoded by the client successfully.',
                function(done){
                    
                    ipc.config.id ='rawBufferClient';
                    ipc.config.retry = 600;
                    ipc.config.silent = true;
                    ipc.config.rawBuffer=true;
                    
                    ipc.config.encoding='ascii';
                    
                    ipc.connectToNet(
                        'rawBufferServer',
                         8600,
                        function(){
                             ipc.of.rawBufferServer.on(
                                'connect',
                                function(){
                                    ipc.of.rawBufferServer.emit(
                                        'Hello from rawBufferClient.'
                                    );
                                }
                            );

                            ipc.of.rawBufferServer.on(
                                'data',
                                function(data){
                                    expect(data instanceof Buffer).toBe(true);
                                    expect(data.toString()).toBe('hello');
                                    testDone();
                                }
                            );
                            
                            ipc.of.rawBufferServer.on(
                                'error',
                                function testError(err){
                                    expect (err).toBe(false);
                                    testDone();
                                }
                            );
                            
                            function testDone(){
                                ipc.disconnect('rawBufferServer');
                                done();
                            }

                         }
                    );

                }
            );
            
            it(
                'Verify the ASCII encoded data received from the server by the client is NOT same as the one encoded by the client in BASE64 format.',
                function(done){
                     
                    ipc.config.rawBuffer=true;
                    ipc.config.encoding='base64';
                    
                    ipc.connectToNet(
                        'rawBufferServer',
                        8600,
                        function(){
                             ipc.of.rawBufferServer.on(
                                'connect',
                                function(){
                                    ipc.of.rawBufferServer.emit(
                                        'Hello from rawBufferClient.'
                                    );
                                    
                                }
                            );

                            ipc.of.rawBufferServer.on(
                                'data',
                                function(data){
                                    expect(data.toString()).not.toBe('hello');
                                    expect(data instanceof Buffer).toBe(true);
                                    testDone();
                                }
                            );
                            
                            ipc.of.rawBufferServer.on(
                                'error',
                                function testError(err){
                                    expect(err).toBe(false);
                                    testDone();
                                    
                                }
                            );
                            
                            function testDone(){
                                ipc.disconnect('rawBufferServer');
                                ipc.config.rawBuffer=false; //resetting back to default value
                                ipc.config.encoding='utf8'; //resetting back to default value
                                done();
                            }
                        }
                    );

                }
            );
    
    }
);

