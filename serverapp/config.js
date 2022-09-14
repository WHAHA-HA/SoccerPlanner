var Config = {
  db: {
    host: '127.0.0.1',
    name: 'sp4v1',
    username: 'sp4admin',
    password: 'SP4!Min*'
  },

  web: {
    port: 3522,
    secret: 'd41d8cd98f00b204e9800998ecf8427e',
  },

  wpapi: {
    endPoint:'xhttp://193.108.24.242/soccer/wp-json/',
    memberPoint:'xhttp://193.108.24.242/soccer/wp-json/mp/v1/members/',
    admin: 'admin',
    adminPassword:'soccer123'
  },

  supportedImageTypes: {
    "image/png": true,
    "image/jpeg": true,
    "image/jpg": true,
    "image/bmp": true,
    "image/gif": true
  },

  useWPLogin: true,
  poFolder: './po/'
};

var RoanuzConfig =  JSON.parse(JSON.stringify(Config));
RoanuzConfig.useWPLogin = false;

var TestConfig =  JSON.parse(JSON.stringify(Config));
TestConfig.db = {
  host: 'localhost',
  name: 'sp4v1Test',
  username: 'sp4adminTest',
  password: 'SP4!Min*'
};

var RoanuzTestConfig =  JSON.parse(JSON.stringify(TestConfig));
RoanuzTestConfig.useWPLogin = false;

module.exports = {
  'development': Config,
  'production': Config,
  'test': TestConfig,//RoanuzTestConfig
  'roanuzdev': RoanuzConfig,
  'roanuztest': RoanuzTestConfig
};
