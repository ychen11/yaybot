var jerk = require('jerk');
var email = require('emailjs');
var ghApi = require('github');
var async = require('async');
var _ = require('underscore');
var log = require('logmagic').local('yaybot.yay');
var sprintf = require('sprintf').sprintf;
var cronJob = require('cron').CronJob;

var PRClient = require('./myprclient').PRClient;
var settings = require('./settings').settings;

/*
 * IRC account info
 *
 */
var NICK_NAME = 'yay_bot';
var PORT = 6666;
var IRC_SERVER = 'irc.freenode.net';
var CHANNELS = ['#test-yiwei'];

var USERS = [
  'ychen11'
];


var options = {
  server : settings.IRC_SERVER,
  port: settings.PORT,
  nick : settings.NICK_NAME,
  channels: settings.CHANNELS
}


/**
 * getPRsInfo get PRs info make a msg and send it to devs.
 */
function getPRsInfo(callback) {
  var prClient = new PRClient(),
      repoName = 'racker/ele',
      prInfo = [];

  async.series([
    function init(callback) {
      prClient.init(function(err) {
        callback(err);
      });
    },

    function getPRs(callback) {
      prClient.setRepo(repoName);
      prClient.queryPRs(function(err, res) {
        if (err) {
          callback(err);
          return;
        }
        prInfo = _.last(res, 5).reverse();
        callback(null);
      });
    }, 

    function compseMsg(callback) {
      var msg = 'Hey, there are 6 PRs need to be reviewed today\n';

      msg += 'Oldest 3: \n';
      _.each(prInfoLast, function(item) {
        msg += sprintf('%s, ', item.html_url);
      });
      msg += 'Latest 3: \n';
      _.each(prInfoFirst, function(item) {
        msg += sprintf('%s, ', item.html_url);
      });
      callback(null, msg);
    }
  ], function(err, res) {
    if (err) {
      console.dir(err);
    }
    console.dir('All prs got queried');
    callback(err, res[2]);
  })
}

/**
 * excute connect the bot to irc channel
 */
var excute = jerk(function(j){
  j.watch_for('Hello, PR_bot', function(message){
    message.say("Hey, what can I do for you, my lord?");
  });
  j.watch_for(/(r|R)(f|F)(r|R)/, function(message) {
    message.say(settings.USERS.toString() + ' ^ ');
  });
}).connect(options);


/**
 * job the cron job for bot
 */
var job = new cronJob({
  cronTime: '00 17 00 * * 1-5', 
  onTick: function() {
    getPRsInfo(function(err, msg) {
      excute.say(CHANNELS[0], settings.USERS.toString() + ' ' + msg); 
    });
  },  
  start: false,
  timeZone: "America/Los_Angeles"
});

/** start the cron job above */
job.start();

