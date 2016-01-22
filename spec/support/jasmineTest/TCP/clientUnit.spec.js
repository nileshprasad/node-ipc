/*global describe, expect, it*/
'use strict';

const ipc = require('../../../../node-ipc');

describe('Verification of TCP and Unix client to connect without passing ID',
    function ClientSpec(){
        it(
            'Verify TCP client connection gets aborted when ID of the server is not specified.',
            function testIt(done){
                ipc.config.id ='testClient';
                ipc.config.silent = true;
                
                ipc.connectToNet();
            // (ipc.of) Object is not created when ID of the server is not specified in the connectToNet() 
                setTimeout(
                    function clientConnectionAborted(){
                        expect(ipc.of).toEqual({});
                        done();
                    },200
                );
            }
        );

     it(
         'Verify Unix client connection gets aborted when ID of the server is not specified.',
          function testIt(done){
              ipc.connectTo();
            // (ipc.of) Object is not created when ID of the server is not specified in the connectTo() 
              setTimeout(
                  function clientConnectionAborted(){
                      expect(ipc.of).toEqual({});
                      done();
                  },200
              );
            }
        );

    }
);
