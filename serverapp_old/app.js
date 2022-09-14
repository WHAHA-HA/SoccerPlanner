var path = require('path');
var assert = require('assert');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');
var request = require('request');
var DecompressZip = require('decompress-zip');
var Q = require('q');

var fs = require('fs');
var pass = require('pwd');
var shortid = require('shortid');
var Buffer = require('buffer/').Buffer;

var PO = require('pofile');

var env = process.env.NODE_ENV || "development";
var Config = require('./config')[env];
var Store = require('./store');

var app = express();
app.use(bodyParser.urlencoded({ limit:'6mb', extended: true }));
app.use(bodyParser.json({ limit:'6mb' }));
app.use(cookieParser(Config.web.secret));

function informLoginRequired(req, res, next){
  req._error_type = 'LoginRequired';
  res.json({ok:false, error:'LoginRequired', next:'/login'});
}

function requiredAuthentication(req, res, next) {
  var userkey = req.signedCookies.user;
  if (userkey) {
    Store.models.User.findById(userkey).then(
      function(user){
        req._user = user;
        next();
      },
      function(err){
        informLoginRequired(req, res, next);
      })
  } else {
    informLoginRequired(req, res, next);
  }
}

function setCurrentUser(req, res, user){
  res.cookie('user', user.id, { signed: true });
}

function failedResponse(req, res, msg){
  return function(err){
    var err = err || {};
    res.json({ok:false, 'error_msg':err+'', 'error': msg});
  }
}

function processSession(req, res, fetchDrills, allowShareKey){
  return new Promise(function(resolve, reject){
    var sessionKey = req.params.sessionKey || req.query.sessionKey;
    var shareKey = req.params.shareKey || req.query.shareKey;
    var user = req._user;
    var q = null;

    if(!allowShareKey){
      shareKey = null;
    }

    if(fetchDrills){
      q = Store.userSessions(user.id, sessionKey, shareKey);
    }else{

      var cond = [{owner: user.id}];
      if(shareKey){
        cond.push({shareToken: shareKey})
      }

      q = Store.models.Session.findOne({where:{$and:[
        {key:sessionKey}, {$or:cond}
      ]}});
    }


    q.then(function(data){
      if(! data){
        failedResponse(req, res, 'SessionMissing')();
        return;
      }

      if(fetchDrills){
        var session = data.sessions;
        var drills = data.drills;

        if(session.length > 0){
          resolve(session[0], drills);
        }else{
          failedResponse(req, res, 'SessionMissing')();
        }
      }else{
        resolve(data);
      }

    }, failedResponse(req, res, 'SessionGetFailed'));
  });
};

function processSessionDrill(req, res){
  var drillKey = req.params.drillKey;
  var orderIndex = req.params.orderIndex;
  var session = null;
  var sessionDrill = null;
  var _response_finished = false;
  return processSession(req, res)
    .then(function(_session){
      session = _session;
      var _cond = {sessionkey:session.key, drillkey: drillKey};
      if(orderIndex){
        _cond.orderIndex = orderIndex;
      }
      return Store.models.SessionDrill.findOne({where:_cond})
    })
    .then(function(_sessionDrill){
      // if(_sessionDrill == null){
      //   _response_finished = true;
      //   failedResponse(req, res, 'DrillInSessionMissing')();
      //   return;
      // }

      sessionDrill = _sessionDrill;
      return Store.models.Drill.findOne({where:{key:drillKey}});
    })
    .then(function(drill){
      if( (drill == null || drill == undefined) && _response_finished == false){
        failedResponse(req, res, 'DrillMissing')();
        return;
      }
      return {drill:drill, session: session, sessionDrill: sessionDrill};
    });
};

function processDrill(req, res, allowShareKey){
  return new Promise(function(resolve, reject){

    var drillKey = req.params.drillKey || req.query.drillKey;
    var shareKey = req.params.shareKey || req.query.shareKey;
    var user = req._user;

    if(!allowShareKey){
      shareKey = null;
    }

    var cond = [{owner: user.id}];
    if(shareKey){
      cond.push({shareToken: shareKey})
    }

    var q = Store.models.Drill.findOne({where:{$and:[
      {key:drillKey}, {$or:cond}
    ]}});

    q.then(function(drill){

      if(! drill){
        failedResponse(req, res, 'DrillMissing')();
        return;
      }

      resolve(drill);

    }, failedResponse(req, res, 'DrillGetFailed'));
  });
};

function processDrillThumpData(req, drill, type){
  return new Promise(function(resolve, reject){
    var thumpData = null;
    if(type == 'black'){
      var imagefileName = '/uploads/drill/' +'drill_' + drill.key + '_black.png';
      if(req.body.thumpDataBlack){
        thumpData = req.body.thumpDataBlack;
      }
    }
    else{
      var imagefileName = '/uploads/drill/' +'drill_' + drill.key + '.png';
      if(req.body.thumpData){
        thumpData = req.body.thumpData;

      }
    }

    if(thumpData){
      var base64Data = thumpData.replace(/^data:image\/png;base64,/, "");
      fs.writeFile(staticPath + imagefileName, base64Data, 'base64', function(err){
        if(err){
          reject(err);
        }
        if(type == 'black'){
          drill.thumpUrlBlack = imagefileName;
        }
        else{
          drill.thumpUrl = imagefileName;
        }
        resolve(drill);
      });
    }
    else{
      resolve(drill);
    }

  });
}

function fs_readFile (file, encoding, callback) {
  var deferred = Q.defer()
  fs.readFile(file, function (err, data) {
    if (err) deferred.reject(err) // rejects the promise with `er` as the reason
    else deferred.resolve([file, data]) // fulfills the promise with `data` as the value
  })
  return deferred.promise.nodeify(callback) // the promise is returned
}

function getFolderFiles(dirpath, callback, errcallback){
  fs.readdir(dirpath, function(err, filenames) {
    if (err) {
      errcallback(err)
    }
    callback(filenames);
  });
}

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var staticPath = path.resolve(__dirname, '../app');
var fileUpload = multer({ dest: staticPath + '/uploads/tmp', limits:{fileSize: 6 * 1000 * 1000}})

app.get('/', function(req, res){
  res.sendFile(staticPath + '/index.html');
});

app.get('/me', requiredAuthentication, function(req, res){
  var user = req._user;
  res.json({ok:true, user:user.safeData()});
});

app.post('/me', requiredAuthentication, fileUpload.single('file'),  function(req, res){
  var user = req._user;
  user.name = req.body.name;
  user.local = req.body.local;

  function _updateUser(){
    user.save().then(function(){
      res.json({ok:true, user:user.safeData()});
    }, failedResponse(req, res, 'UserUpdateFailed'));
  }

  if(req.file){
    var file = req.file;

    if(Config.supportedImageTypes[file.mimetype] != true || file.length > 6 * 1000 * 1000 || file.length < 500){
      return res.json({ok:false, 'error_msg':'Invalid file type or size', 'error': 'INVALID_FILE'});
    }

    var newName = file.originalname.split('.');
    newName = 'logo_' + shortid.generate() + '.' + newName[newName.length-1];
    newName = '/uploads/logo/' + newName;
    fs.rename(file.path, staticPath + newName, function(err){
      if(err){
        return res.json({ok:false, 'error_msg':err + '', 'error': 'FILE_UPLOAD_FAILED'});
      }

      var oldFile = user.logoUrl;
      if(oldFile){
        fs.unlink(staticPath + oldFile, function(err){
          if(err){
            console.log('Error deleting file');
          }
        });
      }

      user.logoUrl = newName;
      return _updateUser();
    });

  } else if(req.body.logoUrl == ''){
    user.logoUrl = '';
    return _updateUser();
  } else {
    return _updateUser();
  }

});

app.post('/xmlupload', requiredAuthentication, fileUpload.single('file'),  function(req, res){
  var user = req._user;
  user.name = req.body.name;
  user.local = req.body.local;

  if(req.file){
    var file = req.file;

    var fielType = file.mimetype;
    var srcFilePath = file.path;
    var destinationFilePath = (staticPath + '/uploads/tmp/' +  shortid.generate())
    if(fielType == 'application/zip'){
      var unzipper = new DecompressZip(srcFilePath)

      unzipper.on('error', function (err) {
        console.log('Error in Unziping', err);
        res.json({ok:false});
      });


      unzipper.on('extract', function (log) {
        var fileReads = [];
        for (var i = log.length - 1; i >= 0; i--) {
          var f = log[i];
          var relPath = f.deflated || f.stored;
          if(relPath){
            if(f.deflated.indexOf("session_") > -1 || f.deflated.indexOf("drill_") > -1){
              fr =  fs_readFile((destinationFilePath + "/" + relPath));
              fileReads.push(fr);
            }
          }
        };
        var allPromise = Q.all(fileReads);
        allPromise.then(
          function(results){
            var sessions = {};
            var drills = {};
            for(var i = results.length - 1; i >= 0; i--) {
              var v = results[i];
              var parts = v[0].split('/')
              var filename = parts[parts.length-1];
              if(filename.indexOf('session_') > -1){
                sessions[filename] = v[1].toString('utf-8');
              }
              else{
                drills[filename] = v[1].toString('utf-8');
              }
            };
            fs.unlink(srcFilePath, function(err){
              if(err){
                console.log('Error deleting old data file', err);
              }
            });
            deleteFolderRecursive(destinationFilePath, function(err){
              if(err){
                console.log('Error deleting old data file', err);
              }
            });

            res.json({ok:true, sessions:sessions, drills:drills});
          }
        )
      });

      unzipper.extract({
          path: destinationFilePath,
          filter: function (file) {
              if(file.filename.indexOf('.') == 0) return false;
              if(file.path.indexOf('__MACOSX') == 0) return false;
              return file.type == "File";
          }
      });
    }
    else{
      fr =  fs_readFile(srcFilePath);
      fr.then(function(data){
        var sessions = {};
        var drills = {};
        var filename = file.originalname || "";
        if(filename.indexOf('drill_') > -1){
          drills[filename] = data[1].toString('utf-8');
        }

        fs.unlink(srcFilePath, function(err){
          if(err){
            console.log('Error deleting old data file', err);
          }
        });

        res.json({ok:true, sessions:sessions, drills:drills});
      })
    }

  } else {
    res.json({ok:false});
  }

});



app.get('/sessions', requiredAuthentication, function(req, res){
  var user = req._user;

  Store.userSessions(user.id).then(function(data){
    var sessions = data.sessions;
    var drills = data.drills;
    var safeSessions = [];
    var safeDrills = [];

    sessions.forEach(function(session){
      if(session.drill && session.drill.drill){
        //avoid duplication data, this data is coming in drills object aswell
        session.drill.drill = null;
      }
      safeSessions.push(session.safeData());
    });

    drills.forEach(function(drill){
      if(drill.safeData){
        drill = drill.safeData();
      }
      safeDrills.push(drill);
    });

    res.json({ok:true, sessions:safeSessions, drills:safeDrills});

  }, failedResponse(req, res, 'UserSessionsFailed'));
});

app.post('/sessions', requiredAuthentication, function(req, res){
  var user = req._user;
  if(!req.body.name){
    failedResponse(req, res, 'DataRequired')();
    return;
  }

  Store.models.Session.create({
    name: req.body.name,
    description: req.body.description,
    date: req.body.date || null,
    team: req.body.team,
    duration: req.body.duration,
    owner: user.id
  }).then(function(session){
    res.json({ok:true, session:session.safeData()});
  }, failedResponse(req, res, 'SessionCreateFailed'));

});

app.get('/sessions/:sessionKey/', requiredAuthentication, function(req, res){
  processSession(req, res, true, true).then(function(session){
    if(session.safeData){
      session = session.safeData();
    }
    res.json({ok:true, session:session});
  });
});

app.post('/sessions/:sessionKey/edit', requiredAuthentication, function(req, res){
  processSession(req, res, false).then(function(session){
    session.name = req.body.name;
    session.description = req.body.description;
    session.date = req.body.date || null;
    session.team = req.body.team;
    session.duration = req.body.duration;

    session.save().then(function(){
      if(session.safeData){
        session = session.safeData();
      }
      res.json({ok:true, session:session});
    }, failedResponse(req, res, 'SessionUpdateFailed'));
  });
});

app.post('/sessions/:sessionKey/delete', requiredAuthentication, function(req, res){
  processSession(req, res).then(function(session){
    session.deleted = true;
    session.save().then(function(){
      res.json({ok:true});
    }, failedResponse(req, res, 'SessionDeleteFailed'));
  });
});

app.post('/sessions/:sessionKey/copy', requiredAuthentication, function(req, res){
  processSession(req, res, false, true).then(function(session){
    session.copy(req._user.id).then(function(newSession){
      res.json({ok:true, session:newSession.safeData()});
    }, failedResponse(req, res, 'SessionCopyFailed'));
  });
});

app.post('/sessions/:sessionKey/attach/:drillKey', requiredAuthentication, function(req, res){
  processSessionDrill(req, res, false).then(function(data){
    var session = data.session;
    var drill = data.drill;

    var sessionDrill = Store.models.SessionDrill.create({
      sessionkey: session.key,
      drillkey: drill.key,
      pitch:drill.pitch,
      duration:drill.duration,
      orderIndex: req.body.orderIndex || 0
    }).then(function(sd){
      res.json({ok:true, drill:drill.safeData(), sessionDrill:sd.safeData(), session:session.safeData()});
    }, failedResponse(req, res, 'SessionUpdateFailed'));

  });
});

app.post('/drills', requiredAuthentication, function(req, res){

  var user = req._user;
  var session = null;
  var drill = null;
  var sessionDrill = null;

  function _creatDrill(){
    return new Promise(function(resolve, reject){
      var drillData = {
        key: shortid.generate(),
        name: req.body.name,
        setupText: req.body.setupText,
        instructText: req.body.instructText,
        coachText: req.body.coachText,
        data: req.body.data,
        owner: user.id
      }

      processDrillThumpData(req, drillData).then(function(drillData){
        return processDrillThumpData(req, drillData, 'black')
      }).then(function(drillData){
        Store.models.Drill.create(drillData).then(resolve, reject);
      })

    });
  }

  if(req.query.sessionKey){
    processSession(req, res)
    .then(function(_session){
      session = _session;
      return _creatDrill();
    }).then(function(_drill){
      drill = _drill;
      sessionDrill = Store.models.SessionDrill.create({
        sessionkey: session.key,
        drillkey: drill.key,
        orderIndex: req.body.orderIndex || 0,
        pitch: req.body.pitch,
        duration: req.body.duration
      });
      return sessionDrill;
    })
    .then(function(sd){
      res.json({ok:true, drill:drill.safeData(), sessionDrill:sd.safeData(), session:session.safeData()});
    }, failedResponse(req, res, 'DrillCreateFailed'));
  }else{
    _creatDrill().then(function(drill){
      res.json({ok:true, drill:drill.safeData()});
    }, failedResponse(req, res, 'DrillCreateFailed'));
  }
});

app.get('/drills/:drillKey/', requiredAuthentication, function(req, res){
  processDrill(req, res, true).then(function(drill){
    res.json({ok:true, drill:drill.safeData()});
  });
});

app.post('/drills/:drillKey/edit', requiredAuthentication, function(req, res){

  var q = processDrill;
  if(req.query.sessionKey){
    q = processSessionDrill;
  }

  q(req, res).then(function(data){

    var session = null,
      drill = null,
      sessionDrill = null;

    if(req.query.sessionKey){
      session = data.session;
      drill = data.drill;
      sessionDrill = data.sessionDrill;
    }else{
      drill = data;
    }

    drill.name = req.body.name;
    drill.setupText = req.body.setupText;
    drill.instructText = req.body.instructText;
    drill.coachText = req.body.coachText;

    if(!req.query.sessionKey){
      drill.duration = req.body.duration;
      drill.pitch = req.body.pitch;
    }


    if(req.body.data){
      drill.data = req.body.data;
    }

    function _processResponse(){
      q = drill.save();
      if(session){
        q.then(function(){
          sessionDrill.orderIndex = req.body.orderIndex || sessionDrill.orderIndex || 0;
          sessionDrill.pitch = req.body.pitch || sessionDrill.pitch;
          sessionDrill.duration = req.body.duration || sessionDrill.duration;
          return sessionDrill.save();
        })
        .then(function(sd){
          res.json({ok:true, drill:drill.safeData(),  sessionDrill:sessionDrill.safeData(), session:session.safeData()});
        }, failedResponse(req, res, 'DrillUpdateFailed'));
      }else{
        q.then(function(drill){
          res.json({ok:true, drill:drill.safeData()});
        }, failedResponse(req, res, 'DrillUpdateFailed'));
      }
    }

    processDrillThumpData(req, drill).then(function(drill){
      return processDrillThumpData(req, drill, 'black')
    }).then(function(){
      return _processResponse();
    })

  });
});

app.post('/drills/:drillKey/delete', requiredAuthentication, function(req, res){
  var q = processDrill;
  if(req.query.sessionKey){
    q = processSessionDrill;
  }

  q(req, res).then(function(data){

    var session = null,
      drill = null,
      sessionDrill = null;

    if(req.query.sessionKey){
      session = data.session;
      drill = data.drill;
      sessionDrill = data.sessionDrill;
    }else{
      drill = data;
    }
    var q = null;

    if(req.query.removeFromSession){
      q = sessionDrill.destroy();
    }else{
      drill.deleted = true;
      var q = drill.save().then(function(){
        return Store.models.SessionDrill.destroy({where:{drillkey:drill.key}});
      });
    }

    q.then(function(){
      res.json({ok:true});
    }, failedResponse(req, res, 'DrillDeleteFailed'));
  });
});

app.post('/drills/:drillKey/copy', requiredAuthentication, function(req, res){
  processDrill(req, res, true).then(function(drill){
    if(drill.owner == req._user.id){
      drill.name = drill.name + " Copy";
    }
    drill.copy(req._user.id).then(function(newDrill){
      res.json({ok:true, drill:newDrill.safeData()});
    }, failedResponse(req, res, 'DrillCopyFailed'));
  });
});

app.get( '/_admin/translations/', requiredAuthentication, function(req, res){
  fs.readdir(Config.poFolder, function(err, files) {
    if (err) {
      console.log(err);
      failedResponse(req, res, 'TranslationListFailed');
      return;
    }

    var poFiles = [];

    files.forEach(function(f) {
      if(path.extname(f) === ".po") {
        poFiles.push(path.basename(f, '.po'));
      }
    });

    PO.load(Config.poFolder + 'template.pot', function(err, po){
      if (err) {
        console.log(err);
        failedResponse(req, res, 'TranslationTemplateLoadError');
        return;
      }

      res.json({ok:true, items:po.items, translations:poFiles});

    });

  });
});

app.post('/_admin/translations/', requiredAuthentication, function(req, res){
  var lang = req.body.lang;

  fs.access(Config.poFolder + lang + '.po', fs.F_OK, function(err) {
      if (!err) {
        failedResponse(req, res, 'TranslationFileExists');
      } else {
        PO.load(Config.poFolder + 'template.pot', function(err, po){
          if (err) {
            console.log(err);
            failedResponse(req, res, 'TranslationTemplateLoadError');
            return;
          }

          po.headers.Language = lang;

          po.save(Config.poFolder + lang + '.po', function(err){
            if (err) {
              console.log(err);
              failedResponse(req, res, 'TranslationFileCreateError');
              return;
            }

            res.json({ok:true, items:po.items, lang:lang});
          });
        });

      }
    }
  );
});

app.get( '/_admin/translations/:lang', requiredAuthentication, function(req, res){
  PO.load(Config.poFolder + req.params.lang + '.po', function(err, po){
    if (err) {
      console.log(err);
      failedResponse(req, res, 'TranslationLoadError');
      return;
    }

    res.json({ok:true, items:po.items, lang:req.params.lang});
  });
});

app.post('/_admin/translations/:lang', requiredAuthentication, function(req, res){
  var lang = req.params.lang;
  var poFile = Config.poFolder + lang + '.po';
  PO.load(poFile, function(err, po){
    if (err) {
      console.log(err);
      failedResponse(req, res, 'TranslationLoadError');
      return;
    }

    var updates = {};
    req.body.items.forEach(function(item){
      updates[item.msgid] = item;
    });

    for(var i=0, item=null; item=po.items[i]; i++){
      var update = updates[ item.msgid ];
      if(update){
        item.msgstr = update.msgstr;
        item.comments = update.comments;
      }
    }

    po.save(poFile, function(err){
      if (err) {
        console.log(err);
        failedResponse(req, res, 'TranslationFileUpdateError');
        return;
      }

      res.json({ok:true, items:po.items, lang:lang});
    });

  });
});

app.post('/_admin/translations/:lang/sync', requiredAuthentication, function(req, res){
  var lang = req.params.lang;
  var poFile = Config.poFolder + lang + '.po';

  PO.load(poFile, function(err, po){
    if (err) {
      console.log(err);
      failedResponse(req, res, 'TranslationLoadError');
      return;
    }

    PO.load(Config.poFolder + 'template.pot', function(err, templatePO){
      if (err) {
        console.log(err);
        failedResponse(req, res, 'TranslationTemplateLoadError');
        return;
      }


      var updates = {};
      po.items.forEach(function(item){
        updates[item.msgid] = item;
      });

      for(var i=0, item=null; item=templatePO.items[i]; i++){
        var update = updates[ item.msgid ];
        if(update){
          item.msgstr = update.msgstr;
          item.comments = update.comments;
        }
      }

      templatePO.headers.Language = lang;
      templatePO.save(poFile, function(err){
        if (err) {
          console.log(err);
          failedResponse(req, res, 'TranslationFileUpdateError');
          return;
        }

        res.json({ok:true, items:templatePO.items, lang:lang});
      });

    });

  });
});

function handleDirectLogin(req, res){
  Store.authenticateUser(req.body.email, req.body.password).then(function(user){
    setCurrentUser(req, res, user);
    var next = req.query.next || '/';
    res.json({ok:true, user:user.safeData(), next:next});
  }, function(err){
    res.json({ok:false, 'error_msg':err+'', 'error': 'LOGIN_FAILED'});
  });
}

function handleWPLogin(req, res){
  Store.authenticateUserWP(req.body.email, req.body.password).then(function(user){
    setCurrentUser(req, res, user);
    var membershipURL = Config.wpapi.memberPoint+user[0].id;
    //this is the call for getting membership
    request.get(membershipURL,
      {'auth': {
        'user': Config.wpapi.admin,
        'password': Config.wpapi.adminPassword
      }},
      function(err, result, resultBody){
        if (err) {
          console.log(err);
          res.json({ok:false, data:err});
        }
        res.json({ok:true, data:resultBody});
      }
    );
  }, function(err){
    console.log(err);
    res.json({ok:false, 'error_msg':err+'', 'error': 'LOGIN_FAILED'});
  });
}

app.post("/login", function (req, res) {
  if(Config.useWPLogin){
    handleWPLogin(req, res);
  }else{
    handleDirectLogin(req, res);
  }
});

app.post("/loginwp", function (req, res) {
  handleWPLogin(req, res);
});

app.get('/logout', function (req, res) {
  res.clearCookie('user');
  var next = req.query.next || '/';
  res.json({next:next, ok:true});
});

app.use(express.static(staticPath));

module.exports = app;
