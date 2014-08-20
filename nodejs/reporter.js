/*
 * Example showing how to use Beebotte to monitor the CPU and memory usage of a server. 
 * You should have first created a corresponding channel (see file create_channel.js)
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
// Channel and resource names. Change them as suits you (they MUST correspond to an existing channel in your account)
var channel_name = "sandbox";
var cpu_resource = "cpu";
var mem_resource = "memory";

var cpus = null;
var avg_cpu = {user: 0, nice: 0, sys: 0, idle: 0, irq: 0};

function getAvgCpu(r1, r2) {
  var avg_cpu = {user: 0, nice: 0, sys: 0, idle: 0, irq: 0};
  var tot_time = 0;
  for(var c in r2) {
    avg_cpu.user += r2[c].times.user;
    avg_cpu.nice += r2[c].times.nice;
    avg_cpu.sys  += r2[c].times.sys;
    avg_cpu.idle += r2[c].times.idle;
    avg_cpu.irq  += r2[c].times.irq;
  }
  for(var c in r1) {
    avg_cpu.user -= r1[c].times.user;
    avg_cpu.nice -= r1[c].times.nice;
    avg_cpu.sys  -= r1[c].times.sys;
    avg_cpu.idle -= r1[c].times.idle;
    avg_cpu.irq  -= r1[c].times.irq;
  }

  tot_time += avg_cpu.user + avg_cpu.nice + avg_cpu.sys + avg_cpu.idle + avg_cpu.irq;

  avg_cpu.user = (avg_cpu.user / tot_time) * 100;
  avg_cpu.nice = (avg_cpu.nice / tot_time) * 100;
  avg_cpu.sys  = (avg_cpu.sys  / tot_time) * 100;
  avg_cpu.idle = (avg_cpu.idle / tot_time) * 100;
  avg_cpu.irq  = (avg_cpu.irq  / tot_time) * 100;

  return avg_cpu;
}

function meminfo(callback, elems) {
  fs.readFile('/proc/meminfo', 'utf8', function (err, minfo) {
    if (err) {
      return callback(err);
    }
    var minfo = minfo.split('\n')
    var data = {};
    minfo.forEach(function (line) {
      var line = line.replace(/\s+/, '');
      line = line.replace(/\skB/, '');
      var record = line.split(/\:/);
      if (record[0] !== '') {
        data[record[0].toLowerCase()] = parseInt(record[1]);
      }
    });
    if(elems) {
      var retval = {};
      for( e in elems) {
        retval[elems[e].toLowerCase()] = data[elems[e].toLowerCase()];
      }
      return callback(null, retval);
    }
    return callback(data);
  });
}

setInterval(function()
  {
    if(!cpus) cpus = os.cpus();
    else {
      var new_cpus = os.cpus();
      var avg_cpu = getAvgCpu(cpus, new_cpus);
      //Write a record to the CPU resource
      bclient.write({
        channel: channel_name,
        resource: cpu_resource,
        data: avg_cpu 
      }, function(err, res) {
        if(err) console.log(err);
      });

      meminfo(function (err, data) {
        console.log(data);
        if(err) return console.log(err);
        //Write a record to the memory resource
        bclient.writeResource({
          channel: channel_name,
          resource: mem_resource,
          data: data
        }, function(err, res) {
          if(err) console.log(err);
        });
      }, ['MemTotal', 'memfree', 'cached', 'dirty']);
      console.log(avg_cpu);
      cpus = new_cpus;
    }
  }, frequency 
);

