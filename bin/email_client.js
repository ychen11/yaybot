//This is file is for saving some unfinished code. Meaningless...

function updateUser(username, command) {
  cosole.dir(Users);
  Users.forEach(function(ele) {
    if (ele.name == username){
      ele.status = command;
      return;
    }
  });
  var user = {
    name: username,
    status: command
  };
  Users.push(user);
}

var Command = {
  collect: false,
  remind: false
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


var server = email.server.connect({
  user: '***',
  password: '***',
  host: 'smtp.gmail.com',
  ssl: true
});

var sendout = function send(msgBody) {
  server.send({
    text: msgBody,
    from: 'yaybot9527@gmail.com',
    to: '123@gmail.com',
    subject: 'test emailjs'
  }, function(err, msg){
    console.log(err || msg)
  });
}

function parseCommand(msg) {
  var command = msg.text[0].replce(NICK_NAME+':', '');
  if (command == 'collect') {
    Command.collect = true;
  }
  updateUser(msg.user, Command);
}