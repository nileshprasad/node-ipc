/*global describe, expect, it*/
'use strict';

const ipc = require('../../../../node-ipc');

describe(
    'Test Cases for server: ',
    function testDescribe(){
        // Unix server verification //
        it(
            'Verify unix server starts with only callback passed in as a parameter and not with path parameter.',
            function testIt(done){

                ipc.config.id ='unixServerUnit';
                ipc.config.retry = 1000;
                ipc.config.silent=false;
               
                ipc.serve(
                    function serverStarted(socket){
                         ipc.server.on(
                             'message',
                             function gotMessage(data,socket){
                                 expect(data.id).toBe('unixClientUnit1');
                                 expect(data.message).toBe('Hello from Client.');
                                 
                                 ipc.server.emit(
                                     socket,
                                     'message',
                                     {
                                         id: ipc.config.id,
                                         message: 'This is unix server for unit1.'
                                     }
                                 );
                                 
                                 testDone();
                             }
                         );
                     }
                );
                
                ipc.server.on(
                     'error',
                     function gotErr(err){
                         expect(err).toBe(false);
                         testDone();
                     }
                );
                
                function testDone(){
                    ipc.server.stop();
                    done();
                }

                ipc.server.start();
            }
        );
        
        
        it(
            'Verify unix server starts without path and callback passed in as a parameter.',
            function testIt(done){

                ipc.config.id ='unixServerUnit2';
                ipc.config.retry = 1000;
                ipc.config.silent=false;
               
                ipc.serve();
                
                ipc.server.on(
                    'message',
                    function gotMessage(data,socket){
                        expect(socket).toBeDefined();
                        expect(data.id).toBe('unixClientUnit2');
                        expect(data.message).toBe('Hello from Client.');

                        ipc.server.broadcast(
                            'message',
                            {
                                id: ipc.config.id,
                                message: 'This is unix server for unit2.'
                            }
                        );
                    
                        testDone();
                    }

                );
                
                ipc.server.on(
                    'error',
                    function gotErr(err){
                        expect(err).toBe(false);
                        testDone();
                    }
                );
                
                function testDone(){
                    ipc.server.stop();
                    done();
                }
                
                ipc.server.start();
                
            }
        );  
        
    }
);
