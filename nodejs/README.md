Server Activity Monitoring
==========================

Periodically reports server CPU and memory usage to Beebotte platform.

## Install Dependencies

To install this packages's dependencies from npm, run:

    npm install

## Run

Go to your account settings page and take your access and secret keys.

### Create a Channel

In order to report data to Beebotte, you need to create a channel. This operation needs to be excecuted just once.

    ACCESS_KEY=your_access_key SECRET_KEY=your_secret_key node create_channel.js

### Start the Reporting

Report CPU and Memory usage

    ACCESS_KEY=your_access_key SECRET_KEY=your_secret_key node reporter.js

Report Network activity

    ACCESS_KEY=your_access_key SECRET_KEY=your_secret_key node network.js

Report Disk space usage

    ACCESS_KEY=your_access_key SECRET_KEY=your_secret_key node disk.js


## License
Copyright 2017 Beebotte.

[The MIT License](http://opensource.org/licenses/MIT)
