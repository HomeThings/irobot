var _ = require('lodash');

var Command = function (name, opcode, bytes) {
  this.name = name;
  this.opcode = opcode;
  this.bytes = _.isNumber(bytes) ? bytes : null;
};



// Commands:

// 1. Getting Started

module.exports.Start = new Command('start', 128, 0);
module.exports.Baud = new Command('baud', 129, 1);


// 2. Mode
module.exports.Control = new Command('control', 130, 0);
module.exports.Safe = new Command('safe', 131, 0);
module.exports.Full = new Command('full', 132, 0);


// 3. Demo (Clean)

module.exports.Cover = new Command('cover', 135, 0);
module.exports.Demo = new Command('demo', 136, 1);
module.exports.Spot = new Command('spot', 134, 0);
module.exports.CoverAndDock = new Command('cover_and_dock', 143, 1);
module.exports.Schedule = new Command('schedule', 167);
module.exports.SetDayTime = new Command('clock', 168, 3);
module.exports.PowerDown = new Command('power_down', 133, 0);


// 4. Actuator

module.exports.Drive = new Command('drive', 137, 4);
module.exports.DriveDirect = new Command('drive_direct', 145, 4);
module.exports.LEDs = new Command('leds', 139, 3);
module.exports.DigitalOutputs = new Command('digital_outputs', 147, 1);
module.exports.DrivePwm = new Command('drive_pwm', 146, 3);
module.exports.Motors = new Command('motors', 138, 1);
module.exports.LowSideDrivers = new Command('low_side_drivers', 144, 3);
module.exports.SendIR = new Command('send_ir', 151, 1);
module.exports.SchedulingLEDs = new Command('scheduling_leds', 162, 2);
module.exports.DigitLEDsRaw = new Command('digit_leds_raw', 163, 4);
module.exports.DigitLEDsASCII = new Command('digit_leds_ascii', 164, 4);
module.exports.Buttons = new Command('buttons', 165, 1);
module.exports.Song = new Command('song', 140);
module.exports.PlaySong = new Command('play_song', 141, 1);


// 5. Input

module.exports.Sensors = new Command('sensors', 142, 1);
module.exports.QueryList = new Command('query_list', 149);
module.exports.Stream = new Command('stream', 148);
module.exports.ToggleStream = new Command('pause_resume_stream', 150, 1);


// 6. Script

module.exports.Script = new Command('script', 152);
module.exports.PlayScript = new Command('play_script', 153, 0);
module.exports.ShowScript = new Command('show_script', 154, 0);


// 7. Wait

module.exports.WaitTime = new Command('wait_time', 155, 1);
module.exports.WaitDistance = new Command('wait_distance', 156, 2);
module.exports.WaitAngle = new Command('wait_angle', 157, 2);
module.exports.WaitEvent = new Command('wait_event', 158, 1);



// command sets

var sets = {};
var e = module.exports;

// these are the Open Interface commands
//   cf., http://www.irobot.com/filelibrary/pdfs/hrd/create/Create%20Open%20Interface_v2.pdf
sets.OICv2 =
{ Start             : e.Start
, Baud              : e.Baud
, Control           : e.Control
, Safe              : e.Safe
, Full              : e.Full
, Spot              : e.Spot
, Cover             : e.Cover
, Demo              : e.Demo
, Drive             : e.Drive
, LowSideDrivers    : e.Motors
, LEDs              : e.LEDs
, Song              : e.Song
, PlaySong          : e.PlaySong
, Sensors           : e.Sensors
, CoverAndDock      : e.CoverAndDock
, PwmLowSideDrivers : e.LowSideDrivers
, DriveDirect       : e.DriveDirect
, DigitalOutputs    : e.DigitalOutputs
, Stream            : e.Stream
, QueryList         : e.QueryList
, PauseResumeStream : e.ToggleStream
, SendIR            : e.SendIR
, Script            : e.Script
, PlayScript        : e.PlayScript
, ShowScript        : e.ShowScript
, WaitTime          : e.WaitTime
, WaitDistance      : e.WaitDistance
, WaitAngle         : e.WaitAngle
, WaitEvent         : e.WaitEvent
};
sets.OIC = sets.OICv2;

// these are the Roomba 500 Open Interface commands
//   cf., http://www.irobot.lv/uploaded_files/File/iRobot_Roomba_500_Open_Interface_Spec.pdf
sets.OIC500 =
{ Start             : e.Start
, Baud              : e.Baud
, Control           : e.Control
, Safe              : e.Safe
, Full              : e.Full
, Power             : e.PowerDown
, Spot              : e.Spot
, Clean             : e.Cover
, Max               : e.Demo
, Drive             : e.Drive
, DriveWheels       : e.DriveDirect
, DriveDirect       : e.DriveDirect    // renamed in OICv2
, Motors            : e.Motors
, PwmMotors         : e.LowSideDrivers
, DrivePwm          : e.DrivePwm
, LEDs              : e.LEDs
, Song              : e.Song
, Play              : e.PlaySong
, Stream            : e.Stream
, QueryList         : e.QueryList
, DoStream          : e.ToggleStream
, Query             : e.Sensors
, ForceSeekingDock  : e.CoverAndDock
, SchedulingLeds    : e.SchedulingLEDs
, DigitLEDsRaw      : e.DigitLEDsRaw
, DigitLEDsASCII    : e.DigitLEDsASCII
, Buttons           : e.Buttons
, Schedule          : e.Schedule
, SetDayTime        : e.SetDayTime
};


// these are the classic Serial Command Interface commands:
//   cf., http://www.irobot.com/images/consumer/hacker/Roomba_SCI_Spec_Manual.pdf
sets.SCI =
{ Start             : e.Start
, Baud              : e.Baud
, Control           : e.Control
, Safe              : e.Safe
, Full              : e.Full
, Power             : e.PowerDown
, PowerDown         : e.PowerDown
, Spot              : e.Spot
, Clean             : e.Cover
, Cover             : e.Cover
, Max               : e.Demo
, Drive             : e.Drive
, Motors            : e.Motors
, LEDs              : e.LEDs
, Song              : e.Song
, Play              : e.PlaySong
, Sensors           : e.Sensors
, ForceSeekingDock  : e.CoverAndDock
, CoverAndDoc       : e.CoverAndDock
};


module.exports.sets = sets;
