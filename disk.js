/*
 * Example showing how to use Beebotte to monitor the CPU and memory usage of a server.
 * You should have first created a corresponding device (see file create_device.js)
 * Works on any Linux platform.
 * Microsoft Windows is not (yet) supported.
 *
 * Copyright, Beebotte.com 2014
 * MIT license
 */

var diskspace = require('diskspace');
var bbt = require('beebotte');

var bclient = new bbt.Connector({
    //API keys for your account
    keyId: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

//Frequency of activity reporting in milliseconds
var frequency = process.env.FREQUECY || (60 * 1000 /* 1 minute */);
// Device, service and resource names. Change them as suits you (they MUST correspond to an existing device in your account)
var device_name = "sandbox";
var service_name = "hd";

setInterval(function()
  {
    diskspace.check('/', function (total, free, status) {
      bclient.writeResource({
        device: device_name,
        service: service_name,
        resource: 'root',
        value: { size: total, used: total - free }
      }, function(err, res) {
        if(err) console.log(err);
      });
    });
    diskspace.check('/data', function (total, free, status) {
      bclient.writeResource({
        device: device_name,
        service: service_name,
        resource: 'data',
        value: { size: total, used: total - free }
      }, function(err, res) {
        if(err) console.log(err);
      });
    });
  }, frequency
);



