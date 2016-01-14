const ipc = require('../../../../node-ipc');
    
describe('Raw Buffer tests: ',
         function(){
            
            it(
                'Verify the ASCII encoded data received from the server is encoded by the client successfully.',
                function(done){
                    
                    ipc.config.id ='rawBufferClient';
                    ipc.config.retry = 600;
                    ipc.config.rawBuffer=true;
                    
                    ipc.config.encoding='ascii';
                    
                    ipc.connectToNet(
                        'rawBufferServer',
                         8600,
                        function(){
                             ipc.of.rawBufferServer.on(
                                'connect',
                                function(){
                                    ipc.log('## connected to rawBufferServer ##'.rainbow, ipc.config.delay);
                                }
                            );

                            ipc.of.rawBufferServer.on(
                                'data',
                                function(data){
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
                     
                    ipc.config.id ='rawBufferClient';
                    ipc.config.retry = 600;
                    ipc.config.rawBuffer=true;
                    ipc.config.encoding='base64';
                    
                    ipc.connectToNet(
                        'rawBufferServer',
                        8600,
                        function(){
                             ipc.of.rawBufferServer.on(
                                'connect',
                                function(){
                                    ipc.log('## connected to rawBufferServer ##'.rainbow, ipc.config.delay);  
                                    
                                }
                            );

                            ipc.of.rawBufferServer.on(
                                'data',
                                function(data){
                                    expect(data).not.toBe('hello');
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
                                done();
                            }
                        }
                    );

                }
            );
    
    }
);

