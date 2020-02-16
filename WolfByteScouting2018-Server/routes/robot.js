var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var user = require('./user.js');
var util = require('util');
var bodyParser = require('body-parser')
var ObjectID = require('mongodb').ObjectID;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');


var robotSchema = mongoose.Schema({
  robotNumber: Number,
  scoutingReports: [{username: String, startPosValue: Number, startFuelValue: Number, moveInAutoValue: Number, spinRotationAutoValue: Number, spinPositionAutoValue: Number, spinAttAutoValue: Number, scoreLowAutoValue: Number, scoreHighAutoValue: Number, scoreInnerAutoValue: Number, fuelDropAutoValue: Number, moveInTeleValue: Number, spinRotationTeleValue: Number, spinPositionTeleValue: Number, spinAttTeleValue: Number, scoreLowTeleValue: Number, scoreHighTeleValue: Number, scoreInnerTeleValue: Number, fuelDropTeleValue: Number, defendValue: Number, fuelFromGroundValue: Number, climbValue: Number, attemptValue: Number, keptClimbLevelValue: Number, carryRobotValue: Number, drivesTrenchValue: Number, DriverSkillValue: Number, RobotEffValue: Number, RobotSpeedValue: Number, commentsValue: String}]
}, {
  usePushEach: true
});

var Robot = mongoose.model("Robot", robotSchema);
var User = mongoose.model("User");

//Allows the user to submit a full scouting report
//Searches for the robot number, and if the robot has not been logged before
//an entry is created for the robot in the database
//Then, it adds a dict of the scouting report to the array of scouting reports
router.post('/addScoutingReport', function(req, res){
  if(!req.body) return res.send(400);
  Robot.findOne({robotNumber: req.body["robotNumber"]}, function(error, robot){
    if(robot == null)
    {
      var newRobot = new Robot({
        robotNumber: req.body["robotNumber"],
        scoutingReports: [{username: req.body["username"], startPosValue: req.body["startPosValue"], startFuelValue: req.body["startFuelValue"], moveInAutoValue: req.body["moveInAutoValue"], spinRotationAutoValue: req.body["spinRotationAutoValue"], spinPositionAutoValue: req.body["spinPositionAutoValue"], spinAttAutoValue: req.body["spinAttAutoValue"], scoreLowAutoValue: req.body["scoreLowAutoValue"], scoreHighAutoValue: req.body["scoreHighAutoValue"], scoreInnerAutoValue: req.body["scoreInnerAutoValue"], fuelDropAutoValue: req.body["fuelDropAutoValue"], moveInTeleValue: req.body["moveInTeleValue"], spinRotationTeleValue: req.body["spinRotationTeleValue"], spinPositionTeleValue: req.body["spinPositionTeleValue"], spinAttTeleValue: req.body["spinAttTeleValue"], scoreLowTeleValue: req.body["scoreLowTeleValue"], scoreHighTeleValue: req.body["scoreHighTeleValue"], scoreInnerTeleValue: req.body["scoreInnerTeleValue"], fuelDropTeleValue: req.body["fuelDropTeleValue"], defendValue: req.body["defendValue"], fuelFromGroundValue: req.body["fuelFromGroundValue"], climbValue: req.body["climbValue"], attemptValue: req.body["attemptValue"], keptClimbLevelValue: req.body["keptClimbLevelValue"], carryRobotValue: req.body["carryRobotValue"], drivesTrenchValue: req.body["drivesTrenchValue"], drivesTrenchValue: req.body["drivesTrenchValue"], DriverSkillValue: req.body["DriverSkillValue"], RobotEffValue: req.body["RobotEffValue"], RobotSpeedValue: req.body["RobotSpeedValue"], commentsValue: req.body["commentsValue"]}]
      });
      newRobot.save(function(e, point){
        if(e) res.status(500).send(e);
        else {
          User.findOne({username: req.body["username"]}, function(err, user){
            user.submitted = user.submitted + 1;
            user.save();
          });
          res.status(200).send(point);
        }
      });
    }
    else {
      robot.scoutingReports.push({username: req.body["username"], startPosValue: req.body["startPosValue"], startFuelValue: req.body["startFuelValue"], moveInAutoValue: req.body["moveInAutoValue"], spinRotationAutoValue: req.body["spinRotationAutoValue"], spinPositionAutoValue: req.body["spinPositionAutoValue"], spinAttAutoValue: req.body["spinAttAutoValue"], scoreLowAutoValue: req.body["scoreLowAutoValue"], scoreHighAutoValue: req.body["scoreHighAutoValue"], scoreInnerAutoValue: req.body["scoreInnerAutoValue"], fuelDropAutoValue: req.body["fuelDropAutoValue"], moveInTeleValue: req.body["moveInTeleValue"], spinRotationTeleValue: req.body["spinRotationTeleValue"], spinPositionTeleValue: req.body["spinPositionTeleValue"], spinAttTeleValue: req.body["spinAttTeleValue"], scoreLowTeleValue: req.body["scoreLowTeleValue"], scoreHighTeleValue: req.body["scoreHighTeleValue"], scoreInnerTeleValue: req.body["scoreInnerTeleValue"], fuelDropTeleValue: req.body["fuelDropTeleValue"], defendValue: req.body["defendValue"], fuelFromGroundValue: req.body["fuelFromGroundValue"], climbValue: req.body["climbValue"], attemptValue: req.body["attemptValue"], keptClimbLevelValue: req.body["keptClimbLevelValue"], carryRobotValue: req.body["carryRobotValue"], drivesTrenchValue: req.body["drivesTrenchValue"], drivesTrenchValue: req.body["drivesTrenchValue"], DriverSkillValue: req.body["DriverSkillValue"], RobotEffValue: req.body["RobotEffValue"], RobotSpeedValue: req.body["RobotSpeedValue"], commentsValue: req.body["commentsValue"]});
      robot.save(function(saveError, robotSaved){
        if(saveError) res.status(500).send(saveError);
        else {
          User.findOne({username: req.body["username"]}, function(err, user){
            user.submitted = user.submitted + 1;
            user.save();
          });
          res.status(200).send(robotSaved);
        }
      });
    }
  });
});

module.exports = router;
