var env = process.env.NODE_ENV || "development";
var Config = require('./config')[env];
var Store = require('./store');

var app = require('./app');

Store.dbInitPromise.then(function(){
  var server = app.listen(Config.web.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server app started on http://localhost:%s', port);
  });
}, function(err){
  console.log('Failed to make DB connection');
  console.error(err);
});
