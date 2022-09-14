var Store = require('./store');
var Promise = require('promise');
var shortid = require('shortid');
var util = require('util');
var sampleData = require('./sampledata')


var env = process.env.NODE_ENV || "development";
var Config = require('./config')[env];

var Session = Store.models.Session,
    Drill = Store.models.Drill,
    SessionDrill = Store.models.SessionDrill,
    User = Store.models.User;

var users = {},
    userslist = [],
    sessions = [],
    drills = [],
    sessionDrills = [];


var drillsData = [
  {index:0, count: 4, name:'Junior Activity %s', description: 'Drill for juniors. Junior Activity %s. Go there and here so we have some text here to fill.'},

  // {index:1, noattach:true, count: 1, name:'Activity Not attached %s', description: 'This drill is not acttached to any sessions %s'},

  {index:2, count: 10, name:'Back Four- Transition From Defense %s', description: 'GK and the Back Four- Transition %s. Go there and here so we have some text here to fill.'},
];


function importSampleData(){
  return Store.dbInitPromise.then(function(){
    // console.log('Database sync done');
    return Store.models.User.count()
  })
  .then(function(c){
    return Promise.all([
      Store.createUser('Alexi', 'alexi@roanuz.com', 'test123'),
      Store.createUser('العرية/عربي', 'arb@roanuz.com', 'test123', 'ar'),
      Store.createUser('español', 'span@roanuz.com', 'test123', 'es'), //Spanish and Argentina
      Store.createUser('汉语', 'chn@roanuz.com', 'test123', 'zh-cn'),

      Store.createUser('Anto', 'anto@roanuz.com', 'test123'),
      Store.createUser('Ram', 'ram@roanuz.com', 'test123'),
      Store.createUser('Karthik', 'karthik@roanuz.com', 'test123'),
      Store.createUser('Vinoth', 'vinoth@roanuz.com', 'test123')
      
    ]);
  })
  .then(function(result){
    result.forEach(function(data){
      var user = data.dataValues;
      users[user.email] = user;
      userslist.push(user);
    });

    return Promise.all([
      Session.create({
        name: 'Junior Gonzalez Play in the Gaps and Between Lines',
        description: 'Basic play required for junior. Gonzalez Play in the Gaps and Between Lines. Go there and here so we have some text here to fill',
        date: new Date(2016, 01, 12),
        team: 'Junior guys',
        duration: '1.5 hours',
        owner: users['alexi@roanuz.com'].id
      }),

      Session.create({
        name: 'Football Conditioning Session',
        description: 'Conditioning Session. Conditioning Session Play in the Gaps and Between Lines. Go there and here so we have some text here to fill',
        date: new Date(2016, 03, 19),
        owner: users['alexi@roanuz.com'].id
      }),


      Session.create({
        name: 'GK and the Back Four- Transition From Defense to Offense',
        description: 'Drill for GK and the Back Four- Transition From Defense to Offense. Transition Activity 1. Go there and here so we.',
        date: new Date(2016, 01, 12),
        owner: users['arb@roanuz.com'].id
      }),

    ]);
  }).then(function(result){
    result.forEach(function(data){
      sessions.push(data.dataValues);
    });

    var tocreate = [];
    sampleData.data.forEach(function(d){
      var session = sessions[d.index];
      if(d.drills){
        for(var i=0; i< d.drills.length; i++){
          var drill = d.drills[i];
          drill.owner = session.owner;
          tocreate.push(
            Drill.create(drill)
          )
        };
      }
      else{
        for(var i=0; i< d.count; i++){
          tocreate.push(
            Drill.create({
              name: util.format(d.name, i+1),
              setupText: util.format(d.description, i+1),
              // date: new Date(2016, 01, 13),
              owner: session.owner
            })
          )
        };
      }
    });

    return Promise.all(tocreate);
  })
  .then(function(result){
    var drillkeys = [];
    result.forEach(function(data){
      drills.push(data.dataValues);
      drillkeys.push(data.dataValues.key);
    });


    var tocreate = [];
    sampleData.data.forEach(function(d, i){
      var session = sessions[d.index];
      // if((!session) || d.noattach ){return;}
      var _drils = drillkeys.splice(0, d.count);
      _drils.forEach(function(dri, di){
        var sd = {
          sessionkey: session.key,
          drillkey: dri,
          orderIndex: di
        };

        if(i==0){
          sd.pitch = '4x3 square';
          sd.duration = '60 min';
        }

        tocreate.push(
          SessionDrill.create(sd)
        );
      });
    });

    return Promise.all(tocreate);
  })
  .then(function(result){
    result.forEach(function(data){
      sessionDrills.push(data.dataValues);
    });

    return {users: users, userslist: userslist, sessions: sessions, drills:drills, sessionDrills:sessionDrills};
  })
  ;

}

module.exports = {
  importSampleData: importSampleData
}

if(require.main === module){
  importSampleData().then(function(){
    // console.log('Sample data imported');
  });
}
