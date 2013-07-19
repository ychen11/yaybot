var jerk = require('jerk');
var email = require('emailjs')

/*
 * IRC account info
 *
 */
var NICK_NAME = 'Iamajerk9527';
var PORT = 6666;
var IRC_SERVER = 'irc.freenode.net';
var CHANNELS = ['#test-for'];


var command = {
  collect: collectMessages,
  remind: remindMeInEmail
}

var collectMessages = function(count) {
  jerk(function(j) {
    j.watch_for(NICK_NAME, function(msg){
      console.dir(msg);
      console.log("this is from collectMessages");
      if (msg.text.length != count) {
        msg.say('Tell me how many messages you want me to collect for you!');
      }else{
        for (var i = 0; i < count; i++) {
          msg.say(msg.text[i]);
        }
      }
    })
  }).connect(options);
}

var remindMeInEmail = function(count) {

}


var options = {
  server : IRC_SERVER,
  port: PORT,
  nick : NICK_NAME,
  channels: CHANNELS
 // channels: ['#ele-dev roosevelt']
}

var server = email.server.connect({
  user: 'yaybot9527',
  password: 'iamajerk',
  host: 'smtp.gmail.com',
  ssl: true
});

var sendout = function send() {
  server.send({
    text: 'I hope this works',
    from: 'yaybot9527@gmail.com',
    to: 'chenyiwei1987@gmail.com',
    subject: 'test emailjs'
  }, function(err, msg){
    console.log(err || msg)
  });
}

var excute = jerk(function(j){
  j.watch_for('soup', function(message){
    console.log("aaa");
    sendout();
    message.say(": I am a jerk, totally, shame on me!");
  });
  j.watch_for(NICK_NAME, function(message){
    console.dir(message);
   // console.dir(message.text[0]);
    message.say(message.text[0]);
  })
}).connect(options);

function parseCommand(msg) {
  var command = msg.replce(NICK_NAME+':', '');
  if (command == 'collect') {
    command.collect(3);
  }
}
