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
var frequency = process.env.FREQUENCY || (60 * 1000 /* 1 minute */);
// Channel name. Change it as suits you (it MUST correspond to an existing channel in your account)
var channel_name = "sandbox";

setInterval(function()
  {
    diskspace.check('/', function (err, total, free, status) {
      bclient.write({
        channel: channel_name,
        resource: 'disk',
        data: { size: total, used: total - free }
      }, function(err, res) {
        if(err) console.log(err);
      });
    });
    diskspace.check('/data', function (err, total, free, status) {
      bclient.write({
        channel: channel_name,
        resource: 'data',
        data: { size: total, used: total - free }
      }, function(err, res) {
        if(err) console.log(err);
      });
    });
  }, frequency
);



