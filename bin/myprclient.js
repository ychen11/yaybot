var github = require('octonode');
var log = require('logmagic').local('yaybot.myprobot');


var CREDENTIAL = { 
  username: '***',
  password: '***'
}

function PRClient(){
  this._cred = CREDENTIAL;
  this._client = null;
  this._ghme = null;
  this._ghrepo = null;
}

PRClient.prototype.init = function(callback) {
  this._client = github.client(this._cred);
  this._client.get('/user', {}, function(err, status, body, headers) {
    console.log(body);
    callback(err);
  });
};


PRClient.prototype.setMe = function() {
  this._ghme = this._client.me();
};


PRClient.prototype.getMe = function() {
  return this._ghme;
}


PRClient.prototype.setRepo = function(name) {
  this._ghrepo = this._client.repo(name);
};


PRClient.prototype.getRepo = function() {
  return this._ghrepo;
}


PRClient.prototype.queryPRs = function(callback) {
  this._ghrepo.prs(function(err, res, header) {
    if (err) {
      log.error('Error when try to query all the pull requests.', {Error: err});
      callback(err);
      return;
    }
    log.info('Successfully queried all PRs: ');
    console.dir(res);
    callback(null, res);
  });
}


exports.PRClient = PRClient;
