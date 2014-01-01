irobot
======

A human-friendly implementation of the iRobot Open Interface version 2 API.


Install
-------

    npm install irobot


API
---

You need to know the [Open Interface command](http://www.irobot.com/filelibrary/pdfs/hrd/create/Create%20Open%20Interface_v2.pdf).
This is the default command set used by the package.
Unless you are using old firmware, this should be fine.


    var irobot = require('irobot');


    // WHEN using a serial port to talk to the robot

        // there is an optional second parameter allowing you to specify the baudrate and the command set
        // e.g., options = { baudrate: 19200 }

        var robot = new irobot.Robot('/dev/ttyUSB0');
    
        robot.on('ready', function() {
          // invoked when the robot first comes up
        });


    // WHEN using a RooWiFi to talk to the robot
        irobot.roowifi.RooWifi({ ipaddr: '192.168.1.63' }, function(err, options) {
          if (!!err) return console.log(err);

          var robot = new irobot.Robot('tcp', options);

          robot.on('ready', function () {
            // invoked when the robot first comes up
          });
        });


Once you have a a ready robot, you can sense and actuate:


    // sensing: the robot emits events

    // this catches everything
    robot.on('sensordata', function(data) {
    });

    // most recent sensor readings
    var sensorData = robot.getSensorData();

    // most recent battery information
    var batteryInfo = robot.getBatteryInfo();


    // actuating: telling the robot what to do

    // change robot's mode
    robot.passiveMode();
    robot.safeMode();
    robot.fullMode();

    // perform one of the demo actions
    robot.demo(irobot.demos.Mouse);

    // TODO: document these as well
    robot.dock();
    robot.sing(notes);
    robot.togglePlayLED(enable);
    robot.toggleAdvanceLED(enable);
    robot.setPowerLED(intensity, color);
    robot.setLEDs(leds);
    robot.drive(velocity, radius);
    robot.drive({ left: velocity, right: velocity }, radius);
    robot.halt();

    // TODO: decide whether to expose other commands, if so implement and document them...


License
=======

[MIT](http://en.wikipedia.org/wiki/MIT_License) license. Freely have you received, freely give.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
