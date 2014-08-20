/*
 * Example showing how to use Beebotte to monitor the CPU and memory usage of a server.
 * You should have first created a corresponding device (see file create_device.js)
 * Works on any Linux platform.
 * Microsoft Windows is not (yet) supported.
 *
 * Copyright, Beebotte.com 2014
 * MIT license
 */

var fs = require('fs');
var os = require('os');
var bbt = require('beebotte');

var bclient = new bbt.Connector({
    //API keys for your account
    keyId: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

//Frequency of activity reporting in milliseconds
var frequency = process.env.FREQUENCY || (60 * 1000 /* 1 minute */);
var oldinfo = null;
// Channel name. Change it as suits you (they MUST correspond to an existing channel in your account)
var channel_name = "ooosandbox";

function netinfo(callback, ifs) {
  fs.readFile('/proc/net/dev', 'utf8', function (err, ninfo) {
    if (err) {
      return callback(err);
    }
    var ninfo = ninfo.split('\n')
    ninfo.splice(0, 2);
    var data = {};
    ninfo.forEach(function (line) {
      var record = line.split(':');
      if (record[0] !== '') {
        var ifname = record[0].replace(/\s+/, '').toLowerCase();
        var ifinfo = record[1].replace(/\s+/g, ':');
        ifinfo = ifinfo.split(/\:/);
        data[ifname] = {rx_bytes: ifinfo[1], rx_packets: ifinfo[2], tx_bytes: ifinfo[9], tx_packets: ifinfo[10]};
      }
    });
    if(oldinfo) {
      var diff = {};
      for( i in data ) {
        if( oldinfo[i] ) {
          diff[i] = {rx_bytes: data[i].rx_bytes - oldinfo[i].rx_bytes, rx_packets: data[i].rx_packets - oldinfo[i].rx_packets, tx_bytes: data[i].tx_bytes - oldinfo[i].tx_bytes, tx_packets: data[i].tx_packets - oldinfo[i].tx_packets};
        }
      }
      if(ifs) {
        var retval = {};
        for( s in ifs ) {
          retval[ifs[s]] = diff[ifs[s]];
        }
        callback(null, retval);
      } else {
        callback(null, diff);
      }
    }else {
      callback(null, null);
    }
    oldinfo = data;
  });
}

setInterval(function()
  {
    netinfo(function (err, data) {
      console.log(data);
      for( net in data ) {
        //Write a record to the latency resource
        bclient.write({
          channel: channel_name,
          resource: net,
          data: data[net]
        }, function(err, res) {
          if(err) console.log(err);
        });
      }
    }, ['eth0']);
  }, frequency
);



