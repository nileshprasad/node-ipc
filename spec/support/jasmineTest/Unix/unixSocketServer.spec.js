/*global describe, expect, it*/
'use strict';

const ipc = require('../../../../node-ipc');

describe(
    'Test Cases for server: ',
    function testDescribe(){
        // Unix server verification //
        it(
            'Verify unix server starts without path and callback passed in as a parameter and broadcasts message.',
            function testIt(done){

                ipc.config.id ='unixServerTest';
                ipc.config.retry = 600;
                
                let responseMessage ={
                    unixClientTest1:false,
                    unixClientTest2:false
                };
                
                ipc.serve();
                
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
                               // console.log('data obtained from Unix Client is: ', data.id, data.message);
                                responseMessage[data.id]=true;
                                
                                if (data.id == 'unixClientTest1'){
                                    expect(data.message).toBe('Acknowledgement from client1.');
                                }
                                else if (data.id == 'unixClientTest2'){
                                    expect(data.message).toBe('Acknowledgement from client2.');
                                }  
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
                
                setTimeout(
                     function testDone(){
                         expect(responseMessage.unixClientTest1).toBe(true);
                         expect(responseMessage.unixClientTest2).toBe(true);
                         ipc.server.stop();
                         done();
                     },2000
                );
                
                ipc.server.start();
                
            }
        ); 
        
        it(
            'Verify unix server starts with only callback passed in as a parameter and detects only 1 client out of 2 clients when "maxConnections" set to 1.',
            function testIt(done){

                ipc.config.id ='testWorld';
                ipc.config.retry = 1000;
                ipc.config.silent=false;
                  
                let clientCounter=0;
                ipc.config.maxConnections=1;

                ipc.serve(
                    function serverStarted(socket){
                        ipc.server.on(
                            'connect',
                            function connected(socket){
                                clientCounter++;
                            }
                        );
                        
                    }
                );

                setTimeout(
                     function clientCountDelay(){
                         expect(clientCounter).toBe(ipc.config.maxConnections);
                         ipc.server.stop();
                         done();
                     },
                     ipc.config.retry+ipc.config.retry
                );

                ipc.server.start();
            }
        );
    }
);
