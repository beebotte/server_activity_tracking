/**
 * This script creates a channel for reporting CPU usage, memory usage and latency (round trip time to a server)
 *
 * This channel SHOULD only be run once; additional excecutions will 
 * report a "Device Already Exists" error (code 1306). 
 *
 * Copyright Beebotte 2014
 * MIT License 
 */

//Include the Beebotte SDK for nodejs
var bbt = require('beebotte');

//Create a Beebotte connector: Replace with your account access and secret keys
var bclient = new bbt.Connector({
    //API keys for your account
    keyId: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

//Define the channel: change the channel name and description as suits you
var sandbox_channel =
{
  name: 'sandbox', description: 'This is a test channel', //channel name and description
  ispublic: true, //everybody has read access to this channel
  resources: [{
    name: 'cpu',
    description: 'CPU activity of the device',
    vtype: bbt.types.BBT_CPU, //Built in type for CPU activity
  },
  {
    name: 'memory',
    description: 'Memory usage of the device',
    vtype: bbt.types.BBT_Memory, //Built in type for memory usage
  },
  {
    name: 'disk',
    description: 'Disk space at "/" mount point',
    vtype: bbt.types.BBT_Disk, //Built in type for Disk space usage
  },
  {
    name: 'data',
    description: 'Disk space at "/data" mount point',
    vtype: bbt.types.BBT_Disk, //Built in type for Disk space usage
  },
  {
    name: 'eth0',
    description: 'Netrowk activity of interface eth0',
    vtype: bbt.types.BBT_NetIf, //Built in type for network interface activity
  },
  {
    name: 'latency',
    description: 'Latency (round trip time)',
    vtype: bbt.types.BBT_Number, //Number basic type
  }]
};

//Add the channel
bclient.addChannel(sandbox_channel, function(err, res) {
  if(err) return console.log(err);
  console.log(res);
});

