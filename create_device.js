/**
 * This script creates a device for reporting CPU and memory activity
 *
 * This device SHOULD only be run once; additional excecutions will 
 * report a "Device Already Exists" error (code 1306). 
 *
 * Copyright Beebotte 2014
 * MIT License 
 */

//Include the Beebotte SDK for nodejs
var bbt = require('beebotte');

//Create a Beebotte connector: Replace with your account access and secret keys
var bclient = new bbt.Connector({keyId: 'ACCESS_KEY', secretKey: 'SECRET KEY'});

//Define the device: change the device name and description as suits you
var sandbox_device =
{
  name: 'sandbox', description: 'This is a test device', //device name and description
  ispublic: true, //everybody has read access to this device
  services: [{
    name: 'performance', description: 'This service includes the performance metrics of the device',
    resources: [{
      name: 'CPU',
      description: 'CPU activity of the device',
      vtype: bbt.types.BBT_CPU, //Built in type for CPU activity
    },
    {
      name: 'memory',
      description: 'Memory usage of the device',
      vtype: bbt.types.BBT_Memory, //Built in type for memory usage
    }]
  }]
};

//Add the device
bclient.addDevice(sandbox_device, function(err, res) {
  if(err) return console.log(err);
  console.log(res);
});

