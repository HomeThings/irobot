// use the Roomba Wi-fi Remote
//   cf., http://www.roomba-wifi-remote.com

var commands = require('./commands')
  , extend   = require('node.extend')
  , http     = require('http')
  , net      = require('net')
  , url      = require('url')
  ;


exports.RooWifi = function(options, cb) {
  var defaults;

  defaults = { portno      : 9001
             , user        : 'admin'
             , passphrase  : 'roombawifi'
             , _write      : write
             , commands    : commands.sets.OIC
             };
  options = extend(defaults, options);
  if (!options.ipaddr) throw new Error('IP address must be specified');
  delete (options.commands.Stream);
  delete (options.commands.Sensors);

  options.cb = cb;
  if (!!options.socket) {
    prepare(options.socket, cb);
    return cb(null, options);
  }
  options.socket = net.Socket({ type: 'tcp4' });
  prepare(options.socket, cb).on('connect', function() {
    cb(null, options);
  }).connect(options.portno, options.ipaddr);
};

var prepare = function(socket, cb) {
  socket.setNoDelay();

  return socket.on('timeout', function() {
    cb(new Error('timeout'));
  }).on('error', function(err) {
    cb(err);
  }).on('close', function(errorP) {
    if (errorP) cb(new Error('premature close'));
  });
};


// with the RooWiFi, you don't get sensor data as long as you have a TCP connection (sigh)
// so: quietP indicates whether the TCP connection is active, and, if not, busyP indicates whether HTTP is active

var write = function(robot, packet) {
  var retry;

  if (!robot.quietP) {
    if (true) {
      for (var x in robot.commands) if (robot.commands.hasOwnProperty(x) && robot.commands[x].opcode === packet[0]) {
        console.log(robot.commands[x]);
        break;
      }
      console.log(packet);
    }
    robot.serial.write(packet);
    if (robot.timer) clearTimeout(robot.timer);
    robot.timer = setTimeout(function() {
      try { robot.serial.end(); } catch(ex) {}
      robot.serial = { emit: function() {} };
      robot.quietP = true;
      sensorfetch(robot);
    }, 500);
    return robot;
  }

  if (!!robot.sendB) {
    robot.sendB = Buffer.concat([ robot.sendB, packet ]);
    return robot;
  }
  robot.sendB = packet;

  retry = function() {
    if (!!robot.busyP) return setTimeout(retry, 250);

    delete(robot.quietP);
    robot.serial = net.Socket({ type: 'tcp4' });
    prepare(robot.serial, robot.options.cb).on('connect', function() {
      var buffer = robot.sendB;

      delete(robot.sendB);
      write(robot, buffer);
    }).connect(robot.options.portno, robot.options.ipaddr);
  };
  retry();

  return robot;
};

var sensorfetch = function(robot) {
  var params, retry;

  if (!robot.quietP) return;

  robot.busyP = true;
  retry = function(secs) {
    delete(robot.busyP);
    setTimeout (function() { sensorfetch(robot); }, (!!secs) ? secs * 1000 : 500);
  };

  params = url.parse('http://' + robot.options.user + ':' + robot.options.passphrase + '@' + robot.options.ipaddr
                     + '/roomba.json');
  http.request(params, function(response) {
    var data = '';

    response.on('data', function(chunk) {
      data += chunk.toString();
    }).on('end', function() {
      var pair, results, rsp, sensor, sensordata;

      try {
        results = JSON.parse(data);
        if (!results.response) throw new Error('no response in JSON data');
      } catch(ex) {
        console.log('JSON parse failed: ' + ex.message + ' on ' + data);
        return retry(10);
      }

      rsp = {};
      for (sensor in results.response) if (results.response.hasOwnProperty(sensor)) {
        pair = results.response[sensor];
        rsp[pair.name] = parseInt(pair.value, 10);
      }
      if (rsp.Voltage < 0) rsp.Voltage += 65536;
      if (rsp.Charge < 0) rsp.Charge += 65536;
      if (rsp.Capacity < 0) rsp.Capacity += 65536;

      sensordata =
      { wheels                      :
        { right                     :
          { dropped                 : !!(rsp['Bumps Wheeldrops'] & 0x04)
          , overcurrent             : !!(rsp['Bumps Wheeldrops'] & 0x01)
          }
        , left                      :
          { dropped                 : !!(rsp['Bumps Wheeldrops'] & 0x08)
          , overcurrent             : !!(rsp['Bumps Wheeldrops'] & 0x02)
          }
        , caster                    :
          { dropped                 : !!(rsp['Bumps Wheeldrops'] & 0x10)
          }
        }
      , low_side_drivers            :
        { 0                         :
          { overcurrent             : !!(rsp['Motor Overcurrent'] & 0x01)
          }
        , 1                         :
          { overcurrent             : !!(rsp['Motor Overcurrent'] & 0x02)
          }
        , 2                         :
          { overcurrent             : !!(rsp['Motor Overcurrent'] & 0x04)
          }
        , 3                         :
          { overcurrent             : !!(rsp['Motor Overcurrent'] & 0x08)
          }
        , 4                         :
          { overcurrent             : !!(rsp['Motor Overcurrent'] & 0x10)
          }
        }
      , bumpers                     :
        { left                      :
          { activated               : null
          }
        , right                     :
          { activated               : null
          }
        , both                      :
          { activated               : null
          }
        }
      , cliff_sensors               :
        { left                      :
          { detecting               : !!(rsp['Cliff Left'] & 0x01)
          , signal                  : null
          }
          , front_left              :
          { detecting               : !!(rsp['Cliff Front Left'] & 0x01)
          , signal                  : null
          }
          , front_right             :
          { detecting               : !!(rsp['Cliff Front Right'] & 0x01)
          , signal                  : null
          }
          , right                   :
          { detecting               : !!(rsp['Cliff Right'] & 0x01)
          , signal                  : null
          }
        }
      , wall_sensor                 :
        { detecting                 : !!(rsp.Wall & 0x01)
        , signal                    : null
        }
      , virtual_wall_sensor         :
        { detecting                 : !!(rsp['Virtual Wall'] & 0x01)
        }
      , ir                          :
        { receiving                 : null
        , received_value            : null
        }
      , buttons                     :
        { advance                   :
          { pressed                 : null
          }
        , play                      :
          { pressed                 : null
          }
        , max                       :
          { pressed                 : !!(rsp.Buttons & 0x01)
          }
        , spot                      :
          { pressed                 : !!(rsp.Buttons & 0x02)
          }
        , clean                     :
          { pressed                 : !!(rsp.Buttons & 0x04)
          }
        , power                     :
          { pressed                 : !!(rsp.Buttons & 0x08)
          }
        }
      , battery                     :
        { charging                  :
          { recharging              : rsp['Charging State'] !== 0
          , from                    : 1
          , type                    :
            { reconditioning        : rsp['Charging State'] === 1
            , full                  : rsp['Charging State'] === 2
            , trickle               : rsp['Charging State'] === 3
            , waiting               : rsp['Charging State'] === 4
            , fault                 : rsp['Charging State'] === 5
            }
          }
        , voltage                   :
          { volts                   : rsp.Voltage / 1000
          , millivolts              : rsp.Voltage
          }
        , current                   :
          { amps                    : rsp.Current / 1000
          , milliamps               : rsp.Current
          }
        , temperature               :
          { celsius                 : Math.round((rsp.Temperature - 32) / 1.8)
          , fahrenheit              : rsp.Temperature
          }
        , capacity                  :
          { percent                 : (rsp.Capacity > 0) ? Math.round((rsp.Charge * 100) / rsp.Capacity) : null
          , current                 : rsp.Charge
          , max                     : rsp.Capacity
          }
        }
      , cargo_bay                   :
        { device_detected           : null
        , baudrate_change_requested : null
        , digital_input             : null
        , analog_signal             : null
        }
      , song                        :
        { playing                   : null
        , number                    : null
        }
      , state                       :
        { mode                      : 'unknown' // 'off' 'passive' 'safe' 'full'
        , distance                  : rsp.Distance
        , angle                     : rsp.Angle
        , requested_velocity        : null
        , requested_radius          : null
        , requested_right_velocity  : null
        , requested_left_velocity   : null
        }
      };
      if (!robot.readyP) {
        robot.readyP = true;
        robot.emit('ready');
      }
      robot._handleSensorData(sensordata);

      retry();
    }).on('close', function() {
      console.log('socket premature eof');
      retry(10);
    }).setEncoding('utf8');
  }).on('error', function(err) {
    console.log('socket error: ' + err.message);
    retry(30);
  }).end();
};
