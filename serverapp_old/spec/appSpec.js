var env = 'test';
process.env.NODE_ENV = env;

var supertest = require('supertest');
var fs = require('fs');

var app = require('./../app');
var Store = require('./../store');
var AllConfig = require('./../config');
var Setup = require('./../setup');
var Samples = require('./samples');

var Config = AllConfig[env];
var testApp = supertest.agent(app);
var sampleData = {};

var lastSessionKey = null;
var lastDrillKey = null;

var firstSessionKey = null;
var firstSessionToken = null;
var firstSession = null;
var firstDrill = null;

var lastFileUrl = null;

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

if((AllConfig.development.db.name == AllConfig.test.db.name) ||
    (AllConfig.production.db.name == AllConfig.test.db.name)){
  throw new Error("Test db must use different database");
}

if(!endsWith(AllConfig.test.db.name, 'Test')){
  throw new Error("Test db name must ends with 'Test'");
}

describe("Store", function(){

  beforeAll(function(done){

    Store.dbInitPromise
    .then(function(){
      return Store.db.drop();
    })
    .then(function(){
      return Store.db.sync();
    })
    .then(function(){
      console.log('Dropped and created new database');
      done()
    });

  })

  it("should sync", function(done){
    Store.dbInitPromise.then(function(){
      done();
    }, function(err) {
      done.fail(err);
    });
  });

  it("create users", function (done) {

    Promise.all([
      Store.createUser('alexi Test', 'alexi.test@roanuz.com', 'test123'),
      Store.createUser('Español Test', 'span.test@roanuz.com', 'test1231', 'es-AR'), //Spanish and Argentina
    ]).then(function(){
      done();
    }, done.fail);

  });

  it("have only one user", function (done) {
    Store.models.User.count().then(function(c){
      expect(c).toBe(2);
      done();
    }, done.fail);
  });


  it("auth user", function (done) {
    Store.authenticateUser('span.test@roanuz.com', 'test1231').then(function(user){
      expect(user.name).toBe('Español Test');
      done();
    }, done.fail);
  });

  it("not auth user", function (done) {
    Store.authenticateUser('span.test@roanuz.com', 'test1231' + 'XXX').then(done.fail, done);
  });

  it("get user by email", function (done) {
    Store.models.User.getByEmail('alexi.test@roanuz.com').then(function(user){
      expect(user.name).toBe('alexi Test');
      done();
    }, done.fail);
  });


});

describe("Server app", function() {
  describe("- Access -", function() {

    it("should logout", function(done) {
      testApp
      .get('/logout')
      .end(function(err, res){
        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
        done();
      });
    });

    it("no access to home page", function(done) {
      testApp
      .get('/me')
      .end(function(err, res){
        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(false);
        expect(res.body.next).toBe('/login');
        done();
      });
    });

    it("should fail login", function(done) {
      testApp.post('/login')
      .type('form')
      .send({ email: 'span.test@roanuz.com', password: 'test1231' + 'xx' })
      .end(function(err, res){
        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(false);
        done();
      });
    });

    it("should login", function(done) {
      testApp.post('/login')
      .type('form')
      .send({ email: 'span.test@roanuz.com', password: 'test1231' })
      .end(function(err, res){
        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.user.name).toBe('Español Test');
        done();
      });
    });

    it("returns status code 200", function(done) {
      testApp.get('/me').end(function(err, res){
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it("logout agin", function(done) {
      testApp
      .get('/logout')
      .end(function(err, res){
        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
        done();
      });
    });

    it("no access to home page agin", function(done) {
      testApp
      .get('/me')
      .end(function(err, res){
        expect(res.body.ok).toBe(false);
        expect(res.body.next).toBe('/login');
        done();
      });
    });

  });
});

describe("Sample data", function(){

  beforeAll(function(done){
    Store.models.User.truncate().then(done);
  });

  it("should be imported", function(done){
    Setup.importSampleData().then(function(data){
      sampleData = data;

      expect(data.userslist.length).toBe(8);
      expect(data.sessions.length).toBe(3);
      expect(data.drills.length).toBe(4+10);
      expect(data.sessionDrills.length).toBe(4+10);
      done();

    }, done.fail);
  });

  it("and get user sessions", function(done){
    Store.userSessions(sampleData.users['alexi@roanuz.com'].id).then(function(data){
      var sessions = data.sessions;
      var drills = data.drills;

      expect(sessions.length).toBe(2);
      expect(sessions[0].drills.length).toBe(4);
      expect(drills.length).toBe(4);
      done();
    }, done.fail);
  });

});

describe("API response", function(){

  it("should not give session for not logged in user", function(done){
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(false);
      expect(res.body.next).toBe('/login');
      done();
    });
  });

  it("should login", function(done) {
    testApp.post('/login')
    .type('form')
    .send({ email: 'alexi@roanuz.com', password: 'test123' })
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      done();
    });
  });

  it("should give me information", function(done) {
    testApp.get('/me')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.user.name).toBe('Alexi');
      expect(res.body.user.local).toBe('en');
      done();
    });
  });

  it("should give updated information", function(done) {
    testApp.post('/me')
    .field('name', 'Alexi Updated')
    .field('local', 'es')
    .attach('file', './serverapp/spec/test-profile-1.jpg')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.user.name).toBe('Alexi Updated');
      expect(res.body.user.local).toBe('es');
      fs.stat('./app' + res.body.user.logoUrl, function(err, stats){
        if(err){
          console.log('ERR', err);
          return done.fail(err);
        }

        lastFileUrl = res.body.user.logoUrl;
        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBeGreaterThan(1000);
        done();
      });
    });
  });

  it("should fail to upload user picture", function(done) {
    testApp.post('/me')
    .field('name', 'Alexi Updated Again')
    .field('local', 'en')
    .attach('file', './serverapp/spec/test-profile-monalisa.jpg')
    .end(function(err, res){
      expect(res.status).toBe(500);
      done();
    });
  });

  it("should give me information after user update", function(done) {
    testApp.get('/me')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.user.name).toBe('Alexi Updated');
      expect(res.body.user.logoUrl).toBe(lastFileUrl);
      done();
    });
  });

  it("should give sessions", function(done) {
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessions.length).toBe(2);

      var session = res.body.sessions[0];
      var drills = res.body.drills;
      var drill = session.drills[0];

      drills.forEach(function(d){
        if(d.key == drill.drillkey){
          drill.drill = d;
        }
      });

      firstSessionKey = session.key;
      firstSessionToken = session.shareToken;
      firstSession = session;
      firstDrill  = drill.drill;

      expect(session.drills.length).toBe(4);
      expect(session.team).toBe('Junior guys');

      expect(drill.orderIndex).toBe(0);
      expect(drill.drill.id).toBe(undefined);
      expect(drill.drillkey).toBe(drill.drill.key);
      expect(drill.drill.name).toBe('Junior Activity 1');
      expect(drill.pitch).toBe('4x3 square');

      done();
    });
  });

  it("should create new session", function(done) {
    testApp.post('/sessions')
    .type('form')
    .send({ name: 'New Session Name', description: 'Session description', duration: '6 days'})
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.session.name).toBe('New Session Name');
      expect(res.body.session.duration).toBe('6 days');
      lastSessionKey = res.body.session.key;
      done();
    });
  });

  it("should update give session data", function(done) {
    testApp.get('/sessions/' + firstSessionKey)
    .type('form')
    .end(function(err, res){
      if(err){
        return done.fail(err);
      }

      expect(res.body.ok).toBe(true);
      expect(res.body.session.name).toBe('Junior Gonzalez Play in the Gaps and Between Lines');
      expect(res.body.session.drills.length).toBe(4);
      done();
    });
  });

  it("should update session name", function(done) {
    testApp.post('/sessions/' + lastSessionKey + '/edit')
    .type('form')
    .send({ name: 'New Session Name Updated'})
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.session.name).toBe('New Session Name Updated');
      done();
    });
  });

  it("should create new drill", function(done) {
    testApp.post('/drills?sessionKey=' + lastSessionKey)
    .type('form')
    .send({ name: 'New Drill Name', setupText: 'Drill description', pitch:'3x3 circle'})
    .end(function(err, res){
      if(err){
        return done.fail(err);
      }

      expect(res.body.ok).toBe(true);
      expect(res.body.drill.name).toBe('New Drill Name');
      expect(res.body.sessionDrill.pitch).toBe('3x3 circle');
      lastDrillKey = res.body.drill.key;
      done();
    });
  });

  it("should update drill", function(done) {
    testApp.post('/drills/' + lastDrillKey + '/edit?sessionKey=' + lastSessionKey)
    .type('form')
    .send({ name: 'New Drill Name Updated', data: '<svg></svg>', thumpData: Samples.imageData, orderIndex:99 })
    .end(function(err, res){
      if(err){
        return done.fail(err);
      }

      expect(res.body.ok).toBe(true);

      expect(res.body.drill.name).toBe('New Drill Name Updated');
      expect(res.body.drill.data).toBe('<svg></svg>');

      expect(res.body.sessionDrill.orderIndex).toBe('99');
      expect(res.body.sessionDrill.pitch).toBe('3x3 circle');

      fs.stat('./app' + res.body.drill.thumpUrl, function(err, stats){
        if(err){
          console.log('ERR', err);
          return done.fail(err);
        }

        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBeGreaterThan(100);
        done();
      });

    });
  });

  it("should give new dril and new session", function(done) {
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessions.length).toBe(3);
      expect(res.body.sessions[2].drills.length).toBe(1);
      expect(res.body.sessions[2].name).toBe('New Session Name Updated');
      done();
    });
  });

  it("should not allow to create drill for someone else", function(done) {
    testApp.post('/drills?sessionKey=' + sampleData.sessions[2].key)
    .type('form')
    .send({ name: 'New Drill Name', description: 'Drill description'})
    .end(function(err, res){
      if(err){
        return done.fail(err);
      }
      expect(res.body.ok).toBe(false);
      done();
    });
  });

  it("should not allow to edit session for someone else", function(done) {
    testApp.post('/sessions/' + sampleData.sessions[2].key + '/edit')
    .type('form')
    .send({ name: 'Session Hacked'})
    .end(function(err, res){
      expect(res.body.ok).toBe(false);
      done();
    });
  });

  it("should not allow to edit drill for someone else", function(done) {
    testApp.post('/drills/' + sampleData.drills[5].key + '/edit?sessionKey=' + lastSessionKey)
    .type('form')
    .send({ name: 'New Drill Hacked' })
    .end(function(err, res){
      expect(res.body.ok).toBe(false);
      done();
    });
  });

  it("should delete drill", function(done) {
    testApp.post('/drills/' + lastDrillKey + '/delete?sessionKey=' + lastSessionKey)
    .type('form')
    .end(function(err, res){
      if(err){
        return done.fail(err);
      }
      expect(res.body.ok).toBe(true);
      done();
    });
  });

  it("should create drill without session", function(done){
    testApp.post('/drills')
    .type('form')
    .send({ name: 'A Drill without Session', setupText: 'Drill description which does not have session'})
    .end(function(err, res){
      if(err){
        return done.fail(err);
      }

      expect(res.body.ok).toBe(true);
      expect(res.body.drill.name).toBe('A Drill without Session');
      expect(res.body.sessionDrill).toBeUndefined();
      lastDrillKey = res.body.drill.key;
      done();
    });
  });

  it("should update drill without session", function(done) {
    testApp.post('/drills/' + lastDrillKey + '/edit')
    .type('form')
    .send({ name: 'A Drill without Session Updated', data: '<svg></svg>', thumpData: Samples.imageData })
    .end(function(err, res){
      if(err){
        return done.fail(err);
      }

      expect(res.body.ok).toBe(true);

      expect(res.body.drill.name).toBe('A Drill without Session Updated');
      expect(res.body.drill.data).toBe('<svg></svg>');

      expect(res.body.sessionDrill).toBeUndefined();
      done();
    });
  });

  it("should give updated drill list", function(done) {
    testApp.get('/sessions')
    .end(function(err, res){

      expect(res.body.ok).toBe(true);
      expect(res.body.sessions.length).toBe(3);

      expect(res.body.sessions[0].drills.length).toBe(4);
      expect(res.body.sessions[1].drills.length).toBe(0);
      expect(res.body.sessions[2].drills.length).toBe(0);

      expect(res.body.drills.length).toBe(4+1);
      done();
    });
  });

  it("should give last drill", function(done) {
    testApp.get('/drills/' + lastDrillKey)
    .end(function(err, res){

      expect(res.body.ok).toBe(true);
      expect(res.body.drill.name).toBe('A Drill without Session Updated');
      expect(res.body.drill.data).toBe('<svg></svg>');
      done();
    });
  });

  it("should attach to session", function(done) {
    testApp.post('/sessions/' + lastSessionKey + '/attach/' + lastDrillKey)
    .type('form')
    .send({ orderIndex:97})
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessionDrill.drillkey).toBe(lastDrillKey);
      expect(res.body.sessionDrill.orderIndex).toBe('97');
      done();
    });
  });

  it("should attach to session again", function(done) {
    testApp.post('/sessions/' + lastSessionKey + '/attach/' + lastDrillKey)
    .type('form')
    .send({ orderIndex:98})
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessionDrill.drillkey).toBe(lastDrillKey);
      expect(res.body.sessionDrill.orderIndex).toBe('98');
      done();
    });
  });

  it("should give updated session list", function(done) {
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessions[2].drills.length).toBe(2);
      done();
    });
  });

  it("should deattach drill from session", function(done) {
    testApp.post('/drills/' + lastDrillKey + '/delete?orderIndex=98&removeFromSession=true&sessionKey=' + lastSessionKey)
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      done();
    });
  });

  it("should give updated session list", function(done) {
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessions[2].drills.length).toBe(1);
      expect(res.body.drills.length).toBe(4+1);
      done();
    });
  });

  it("should delete drill", function(done) {
    testApp.post('/drills/' + lastDrillKey + '/delete')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      done();
    });
  });

  it("should give updated session list", function(done) {
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessions[2].drills.length).toBe(0);
      expect(res.body.drills.length).toBe(4);
      done();
    });
  });

  it("should delete session", function(done) {
    testApp.post('/sessions/' + lastSessionKey + '/delete')
    .type('form')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      done();
    });
  });

  it("should give updated session list", function(done) {
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessions.length).toBe(2);
      done();
    });
  });

});

describe("Share function", function(){

  it("should login", function(done) {
    testApp.post('/login')
    .type('form')
    .send({ email: 'span@roanuz.com', password: 'test123' })
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      done();
    });
  });

  it("should have zero sessions", function(done){
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessions.length).toBe(0);
      expect(res.body.drills.length).toBe(0);
      done();
    });
  });

  it("should deny shared session without token", function(done){
    testApp.get('/sessions/' + firstSessionKey)
    .end(function(err, res){
      expect(res.body.ok).toBe(false);
      done();
    });
  });

  it("should open shared session", function(done){
    testApp.get('/sessions/' + firstSessionKey + '?shareKey=' + firstSessionToken)
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.session.name).toBe(firstSession.name);
      expect(res.body.session.drills.length).toBe(4);
      expect(res.body.session.drills[0].drill.name).toBe(firstDrill.name);
      done();
    });
  });

  it("should not update session name", function(done) {
    testApp.post('/sessions/' + firstSessionKey + '/edit?shareKey=' + firstSessionToken)
    .type('form')
    .send({ name: 'New Session Name Updated'})
    .end(function(err, res){
      expect(res.body.ok).toBe(false);
      done();
    });
  });

  it("should deny shared drill without token", function(done){
    testApp.get('/drills/' + firstDrill.key)
    .end(function(err, res){
      expect(res.body.ok).toBe(false);
      done();
    });
  });

  it("should open shared drill", function(done){
    testApp.get('/drills/' + firstDrill.key + '?shareKey=' + firstDrill.shareToken)
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.drill.name).toBe(firstDrill.name);
      done();
    });
  });

  it("should not update drill", function(done) {
    testApp.post('/drills/' + firstDrill.key + '/edit?shareKey=' + firstDrill.shareToken)
    .type('form')
    .send({ name: 'Drill Hacked'})
    .end(function(err, res){
      expect(res.body.ok).toBe(false);
      done();
    });
  });

  it("should deny copy session without token", function(done){
    testApp.post('/sessions/' + firstSessionKey + '/copy')
    .end(function(err, res){
      expect(res.body.ok).toBe(false);
      done();
    });
  });

  it("should deny copy drill without token", function(done){
    testApp.post('/drills/' + firstDrill.key + '/copy')
    .end(function(err, res){
      expect(res.body.ok).toBe(false);
      done();
    });
  });


  it("should copy drill", function(done){
    testApp.post('/drills/' + firstDrill.key + '/copy?shareKey=' + firstDrill.shareToken)
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      done();
    });
  });

  it("should have copied drill", function(done){
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessions.length).toBe(0);
      expect(res.body.drills.length).toBe(1);
      done();
    });
  });

  it("should copy session", function(done){
    testApp.post('/sessions/' + firstSessionKey + '/copy?shareKey=' + firstSessionToken)
    .end(function(err, res){
      expect(res.body.ok).toBe(true);

      testApp.get('/sessions/' + res.body.session.key)
      .type('form')
      .end(function(err, res){
        if(err){
          return done.fail(err);
        }
        expect(res.body.ok).toBe(true);
        expect(res.body.session.drills.length).toBe(4);
        done();
      });

      done();
    });
  });

  it("should have copied session and drill", function(done){
    testApp.get('/sessions')
    .end(function(err, res){
      expect(res.body.ok).toBe(true);
      expect(res.body.sessions.length).toBe(1);
      // expect(res.body.session.drills.length).toBe(4);
      expect(res.body.drills.length).toBe(4+1);
      done();
    });
  });

})

// Test for drill, drill update, drill delete, attach drill, copy session, copy drill, open shared session, open shared drill
