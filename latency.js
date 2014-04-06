var bbt = require('beebotte');
// Use the jjg-ping library.
var ping = require('net-ping');

var bclient = new bbt.Connector({
    //API keys for your account
    keyId: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

var options = {
    retries: 3,
    timeout: 2000
};

var session = ping.createSession (options);

//Frequency of activity reporting in milliseconds
var frequency = process.env.FREQUECY || (60 * 1000 /* 1 minute */);
// Device, service and resource names. Change them as suits you (they MUST correspond to an existing device in your account)
var device_name = "sandbox";
var service_name = "performance";
var latency_resource = "latency";
var server = process.env.SERVER || "127.0.0.1";

setInterval(function()
  {
    // Ping the server
    session.pingHost (server, function (error, target, sent, rcvd) {
      var ms = rcvd - sent;
      if (error) {
        if (error instanceof ping.RequestTimedOutError)
          console.log (server + ": Not alive (ms=" + ms + ")");
        else
          console.log (server + ": " + error.toString () + " (ms=" + ms + ")");
      } else {
        console.log (target + ": Alive alive (ms=" + ms + ")");
        //Write a record to the latency resource
        bclient.writeResource({
          device: device_name,
          service: service_name,
          resource: latency_resource,
          value: ms
        }, function(err, res) {
          if(err) console.log(err);
        });
      }
    });
  }, frequency
);

