Rerver Activity Tracking
========================

Periodically reports server CPU and memory usage to Beebotte platform.

## Install Dependencies

To install this packages's dependencies from npm, run:

    npm install

## Run

Go to your account settings page and take your access and secret keys.

### Create a Device

In order to report data to Beebotte, you need to create a device. This operation needs to be excecuted just once.

    ACCESS_KEY=your_access_key SECRET_KEY=your_secret_key node create_device.js

### Start the Reporting

    ACCESS_KEY=your_access_key SECRET_KEY=your_secret_key node reporter.js

## License
Copyright 2013 - 2014 Beebotte.

[The MIT License](http://opensource.org/licenses/MIT)
