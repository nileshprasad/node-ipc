/*global describe, expect, it*/
'use strict';

const ipc = require('../../../../node-ipc');

describe('TCP Socket verification of client',
    function TCPClientSpec(){
        it(
            'Verify retry attempts by TCP client to connect to the server as per the value set in "maxRetries" parameter. Verify default networkHost and networkPort are assigned when host and port values are not passed.',
            function testIt(done){
                ipc.config.id ='testClient';
                ipc.config.retry = 600;
                ipc.config.maxRetries = 3;
                ipc.config.stopRetrying = false;

                //set to -1 because there is an error on the first fail
                //before retrying
                let errorCount=-1;

                ipc.connectToNet('tcpFakeServer');
                ipc.of.tcpFakeServer.on(
                    'error',
                    function gotError(err){
                        errorCount++;
                        expect(ipc.of.tcpFakeServer.retriesRemaining).toBe(
                            ipc.config.maxRetries-errorCount
                        );
                        expect(err).toBeDefined();
                    }
                );
                
                setTimeout(
                    function testDelay(){
                        expect(errorCount).toBe(ipc.config.maxRetries);
                        expect(ipc.config.networkHost).toBe('127.0.0.1');
                        expect(ipc.config.networkPort).toBe(8000);
                        ipc.disconnect('tcpFakeServer');
                        done();
                    },
                    ipc.config.retry*ipc.config.maxRetries +
                    ipc.config.retry+ipc.config.retry
                );

            }
        );

        it(
            'Verify TCP client does not connect to the TCPserver when "stopRetrying" value is set to true.',
            function testIt(done){
                ipc.config.maxRetries = 3;
                ipc.config.stopRetrying = true;
                ipc.silent=true;

                //set to -1 because there is an error on the first fail
                //before retrying
                let errorCount=-1;

                ipc.connectToNet(
                    'tcpFakeServer',
                    8030,
                    function open(){
                        ipc.of.tcpFakeServer.on(
                            'error',
                            function gotError(err){
                                expect(ipc.of.tcpFakeServer.retriesRemaining).toBe(ipc.config.maxRetries);
                                expect(err).toBeDefined();
                                errorCount++;
                            }
                        );
                    }
                );

                setTimeout(
                    function testDelay(){
                        expect(errorCount).toBe(0);
                        expect(ipc.of.tcpFakeServer.retriesRemaining).toBe(ipc.config.maxRetries);
                        ipc.disconnect('tcpFakeServer');
                        done();
                    },
                    ipc.config.retry*ipc.config.maxRetries
                );
            }
        );

        it(
            'Verify TCP client connects to server named "tcpServer" and receives message.It disconnects from the server after receiving "kill.connection" event.',
            function testIt(done){
                ipc.connectToNet(
                    'tcpServer',
                    8300,
                    function open(){
                        ipc.of.tcpServer.on(
                            'connect',
                            function connected(){
                                ipc.of.tcpServer.on(
                                    'message',
                                    function gotMessage(data){
                                        expect(data.id).toBe('tcpServer');
                                        expect(data.message).toBe('I am TCP server!');
                                    }
                                );

                                ipc.of.tcpServer.emit(
                                    'message',
                                    {
                                        id      : ipc.config.id,
                                        message : 'Hello from testClient.'
                                    }
                                );
                            }
                        );
                        
                        ipc.of.tcpServer.on(
                            'kill.connection',
                            function disconnectServer(){
                                ipc.disconnect('tcpServer');
                                done();
                            }
                        );
                        
                        ipc.of.tcpServer.on(
                            'error',
                            function testError(err){
                                expect(err).toBe(false);
                                ipc.disconnect('tcpServer');
                            }
                        );
                    }
                );
                
            }
        );
    }
);
