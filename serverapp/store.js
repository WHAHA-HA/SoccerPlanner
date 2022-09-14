var Promise = require('promise');
var Sequelize = require('sequelize');
var Pass = require('pwd');
var shortid = require('shortid');

var env = process.env.NODE_ENV || "development";
var Config = require('./config')[env];
var db = new Sequelize(Config.db.name,
  Config.db.username, Config.db.password, {host: Config.db.host, logging: false});
var models = {};
var WP = require( 'wordpress-rest-api' );
var request = require('request');

function objectFromKeys(obj, keys){
  var data = {};
  keys.forEach(function(k){
    data[k] = obj[k];
  });

  return data
}

models.User = db.define('User', {
  email: {type: Sequelize.STRING, allowNull: false, unique: true},
  password: Sequelize.STRING,
  salt: Sequelize.STRING,
  name: Sequelize.STRING,
  activeMembership: Sequelize.BOOLEAN,
  local: Sequelize.STRING,
  logoUrl: Sequelize.STRING
}, {classMethods: {
  getByEmail: function(email){
    return this.findOne({where:{email:email}});
  },
  getById: function(id){
    return this.findOne({where:{id: id}});
  }
}, instanceMethods: {
  safeData: function(){
    return objectFromKeys(this, ['id', 'name', 'email', 'local', 'activeMembership', 'logoUrl']);
  }
}});

models.Session = db.define('Session', {
  key: {type: Sequelize.STRING, defaultValue:shortid.generate, unique: true},
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  date: Sequelize.DATE,
  team: Sequelize.STRING,
  duration: Sequelize.STRING,
  // theme: Sequelize.STRING,
  owner: Sequelize.BIGINT,
  shareToken: {type: Sequelize.STRING, defaultValue:shortid.generate, unique: true},
  isPublic: {type: Sequelize.BOOLEAN, defaultValue:false},
  deleted: {type: Sequelize.BOOLEAN, defaultValue:false},
}, {instanceMethods: {

  safeData: function(){
    var data = objectFromKeys(this, ['key', 'name', 'description', 'date', 'team', 'duration', 'owner', 'shareToken', 'isPublic']);
    if(this.drills){
      data.drills = [];
      this.drills.forEach(function(drill){
        data.drills.push(drill.safeData());
      });
    }
    return data;
  },

  copyValues: function(){
    return objectFromKeys(this, ['name', 'description', 'date', 'team', 'duration']);
  },

  copy: function(userid){
    var key = this.key;
    var userid = userid;
    var session = null;

    var oldSession = this;
    var oldSessionDrills = null;
    var oldDrillKeys = [];
    var oldDrills = {};

    var drillKeyMap = {};

    return new Promise(function(resolve, reject){
      var _val = oldSession.copyValues();
      _val.owner = userid;

      models.Session.create(_val).then(function(_session){
        session = _session;
        return models.SessionDrill.findAll({limit:200, where:{sessionKey: key}, order: [['orderIndex', 'ASC']]})
      }).then(function(_sessionDrills){
        oldSessionDrills = _sessionDrills;
        oldSessionDrills.forEach(function(sd, i){
          oldDrillKeys.push(sd.drillkey);
        });
        return models.Drill.findAll({where:{deleted:false, key:{$in:oldDrillKeys}}})
      }).then(function(drills){
        var drillsData = [];
        drills.forEach(function(drill, i){
          var ndrill = drill.copyValues();
          ndrill.owner = userid;
          ndrill.key = shortid.generate();

          drillKeyMap[drill.key] = ndrill.key;
          drillsData.push(ndrill);
        });

        return models.Drill.bulkCreate(drillsData);
      }).then(function(newDrills){
        var sdData = [];
        oldSessionDrills.forEach(function(sd, i){
          var drillkey = drillKeyMap[sd.drillkey];
          var newSD = sd.copyValues();
          newSD.drillkey = drillkey;
          newSD.sessionkey = session.key;
          sdData.push(newSD);
        });

        return models.SessionDrill.bulkCreate(sdData);
      }).then(function(){
        resolve(session);
      }, function(err){
        reject(err);
      }).catch(function(err){
        reject(err);
      });

    });
  }

}});

models.Drill = db.define('Drill', {
  key: {type: Sequelize.STRING, defaultValue:shortid.generate, unique: true},
  name: Sequelize.STRING,
  // description: Sequelize.TEXT,
  setupText: Sequelize.TEXT,
  instructText: Sequelize.TEXT,
  coachText: Sequelize.TEXT,
  data: Sequelize.TEXT,
  // date: Sequelize.DATE,
  thumpUrl: Sequelize.STRING,
  thumpUrlBlack: Sequelize.STRING,
  owner: Sequelize.BIGINT,
  shareToken: {type: Sequelize.STRING, defaultValue:shortid.generate, unique: true},
  isPublic: {type: Sequelize.BOOLEAN, defaultValue:false},
  deleted: {type: Sequelize.BOOLEAN, defaultValue:false},
  pitch: Sequelize.STRING,
  duration: Sequelize.STRING,

}, {instanceMethods: {
  safeData: function(){
    return objectFromKeys(this, ['key', 'name', 'setupText', 'instructText', 'coachText', 'owner', 'shareToken', 'isPublic', 'thumpUrl', 'thumpUrlBlack', 'data', 'pitch', 'duration']);
  },

  copyValues: function(){
    return objectFromKeys(this, ['name', 'setupText', 'instructText', 'coachText', 'data', 'thumpUrl','thumpUrlBlack', 'pitch', 'duration']);
  },

  copy: function(userid){
    var val = this.copyValues();
    val.owner = userid;

    return models.Drill.create(val);
  }

}});

models.SessionDrill = db.define('SessionDrill', {
  sessionkey: {type: Sequelize.STRING, references:{model: models.Session, key:'key'}},
  drillkey: {type: Sequelize.STRING, references:{model: models.Drill, key:'key'}},
  orderIndex: Sequelize.INTEGER,
  pitch: Sequelize.STRING,
  duration: Sequelize.STRING
}, {instanceMethods: {
  safeData: function(){

    var data = objectFromKeys(this, ['sessionkey', 'drillkey', 'orderIndex', 'pitch', 'duration']);

    if(this.drill){
      if(this.drill.safeData){
        data.drill = this.drill.safeData();
      }else{
        data.drill = this.drill;
      }
    }
    return data;
  },

  copyValues: function(){
    return objectFromKeys(this, ['orderIndex', 'pitch', 'duration']);
  }

}});

var dbInitPromise = db.sync();

function createUser(name, email, password, local){
  var local = local || 'en';
  return new Promise(function(resolve, reject){
    Pass.hash(password, function (err, salt, hash) {
      if (err) throw err;
      models.User.create({
        name: name,
        email: email,
        salt: salt,
        password: hash,
        activeMembership: true,
        local: local
      }).then(resolve, reject);
    });
  });
};

function createUserWP(name, email, password, local){
  var local = local || 'en';
  return new Promise(function(resolve, reject){
    Pass.hash(password, function (err, salt, hash) {
      if (err) throw err;
      models.User.create({
        name: name,
        email: email,
        salt: salt,
        password: hash,
        activeMembership: true,
        local: local
      }).then(resolve, reject);
    });
  });
};

function authenticateUser(email, password) {
  return new Promise(function(resolve, reject){
    models.User.getByEmail(email).then(function(user){
        if(user){
          Pass.hash(password, user.salt, function(err, hash){
            if(err){
              reject(err);
            }else if(hash == user.password){
              resolve(user);
            }else{
              reject(new Error('Invalid Password'));
            }
          });
        }else{
          reject(new Error('User not found'));
        }
      }, function(error){
        reject(new Error('Failed to fetch user'));
      }
    );
  });
}

function authenticateUserWP(email, password) {
  return new Promise(function(resolve, reject){
    console.log(email, ':', password);
    var URL = Config.wpapi.endPoint;
    var wp = new WP({
        endpoint: URL ,
        username: email,
        password: password,
        auth: true
    });
   wp.users().me().then(function(data){
     console.log('wp authenticate--------------');
     console.log(data);
      resolve(data);
   }, function(err){
      reject(err);
   });
  });
}
function authenticateUserWPJWT(email, password) {
  return new Promise(function(resolve, reject){
    var URL = Config.wpapi.endPoint + 'jwt-auth/v1/token';
    var postData = {
      email: email,
      password: password
    };
    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: URL
    }
    request(options,function(err, res, body){
      if(err){
        reject(err);
      }
      //for authorized, there is id field, otherwise reject
      if(typeof body.id === 'undefined'){
        reject(body);
      }

      var userData = body;
      userData.logoUrl = '';
      //first check if mysql synced, and then continue
      models.User.getById(body.id).then(function(user){
        //existed...
        if(user === null){
          var newUser = {
            id: userData.id,
            email: userData.user_email,
            password:userData.token,
            local:'en'
          };
          models.User.create(newUser)
              .then(function(){
                resolve(userData);
              });
        }else{
          resolve(userData);
        }
      }, function(error){
        reject(error);
        //create user.
      });
      //resolve(body);
    });
  });
}
function userSessions(userId, sessionKey, shareKey){
  return new Promise(function(resolve, reject){

    var sessions = [],
        drills = [],
        sessionMap = [],
        drillMap = [],
        sessionKeys = [],
        drillKeys = [],
        sessionDrills = [];

    var cond = [{owner: userId}];
    if(shareKey){
      cond.push({shareToken: shareKey})
    }

    var where = {deleted:false};
    if(sessionKey){
      where.key = sessionKey;
    }
    where = {$and:[{$or:cond}, where]}

    models.Session.findAll({limit:100, where:where})
    .then(function(data){

      data.forEach(function(session, i){
        // session = session.safeData()
        session.drills = [];
        sessions.push(session);
        sessionKeys.push(session.key);
        sessionMap[session.key] = i;
      });
      return models.SessionDrill.findAll({limit:200, where:{sessionkey:{$in:sessionKeys}}, order: [['orderIndex', 'ASC']]});
    })
    .then(function(data){
      sessionDrills = data;
      if(shareKey){
        var _dkeys = [];
        sessionDrills.forEach(function(sd){
          _dkeys.push(sd.drillkey);
        });
        cond.push({key:{$in:_dkeys}});
      }

      var _where = {deleted:false};
      _where = {$and:[{$or:cond}, _where]}

      return models.Drill.findAll({
        limit:200,
        where:_where,
        attributes: { exclude: ['data'] },
        // logging: true
      });
    })
    .then(function(data){
      drills  = data;

      var _drills = {};
      data.forEach(function(drill){
        _drills[drill.key] = drill;
      })

      sessionDrills.forEach(function(sd){

        var session = sessions[sessionMap[sd.sessionkey]];
        var drill = null;

        if(_drills[sd.drillkey] != undefined){
          drill = _drills[sd.drillkey];
          sd.drill = drill;
          session.drills.push(sd);
        }else{
          console.log('Drill missing', sd.drillkey);
        }

      });

      resolve({sessions:sessions, drills:drills});
    }, function(err){
      reject(err);
    });

  });
}
//copy admin sessions and drills
function initSessionsAndDrills(userId, sessionKey, shareKey){
  return new Promise(function(resolve, reject){

    var sessions = [],
        drills = [],
        sessionMap = [],
        drillMap = [],
        sessionKeys = [],
        drillKeys = [],
        sessionDrills = [];

    var cond = [{owner: userId, deleted: 0}];

    models.Session.findAll({limit:100, where:cond})
        .then(function(data){
          //check if data empty
          if(data.length == 0){
            console.log('no sessions found for current user');
            models.Session.findAll({where:{owner: 1, deleted: 0}})
                .then(function(ownerData){
                  ownerData.forEach(function(session, i){
                    // session = session.safeData()
                    session.copy(userId);
                  });
                })
          }else{
            console.log('Session Already popuplated');
          }
          return models.SessionDrill.findAll({limit:200, where:{sessionkey:{$in:sessionKeys}}, order: [['orderIndex', 'ASC']]});
        })
        .then(function(data){
          models.Drill.findAll({limit:100, where:cond})
              .then(function(data){
                //check if data empty
                if(data.length == 0){
                  console.log('no drills found for current user');
                  models.Drill.findAll({where:{owner: 1, deleted: 0}})
                      .then(function(ownerData){
                        ownerData.forEach(function(drill, i){
                          // session = session.safeData()
                          drill.copy(userId);
                        });
                      })
                }else{
                  console.log('Drill Already populated');
                }
                return models.SessionDrill.findAll({limit:200, where:{sessionkey:{$in:sessionKeys}}, order: [['orderIndex', 'ASC']]});
              })
        })
        .then(function(data){
          resolve(data);
        });
  });
}

module.exports = {
  db: db,
  models: models,
  dbInitPromise: dbInitPromise,
  createUser: createUser,
  authenticateUser: authenticateUser,
  authenticateUserWP: authenticateUserWP,
  authenticateUserWPJWT: authenticateUserWPJWT,
  initSessionsAndDrills: initSessionsAndDrills,
  userSessions: userSessions,
};
