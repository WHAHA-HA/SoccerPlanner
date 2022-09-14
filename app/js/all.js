(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*

Help:
https://www.timroes.de/2015/07/29/using-ecmascript-6-es6-with-angularjs-1-x/
http://cameronjroe.com/writing/code/angular-movie-search/
http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html

*/
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('babel-polyfill');

require('./common.js');

var _configJs = require('./config.js');

var _configJs2 = _interopRequireDefault(_configJs);

var _dataJs = require('./data.js');

var _modelsJs = require('./models.js');

var _editorCanvasJs = require('./editor/canvas.js');

var _directivesDirectivesJs = require('./directives/directives.js');

var Driectives = _interopRequireWildcard(_directivesDirectivesJs);

var _controllersMainJs = require('./controllers/main.js');

var Main = _interopRequireWildcard(_controllersMainJs);

angular.module('sp', ['ui.router', 'gettext', 'angularMoment', '720kb.datepicker', 'ngDropdowns', 'cfp.hotkeys', 'ngFileUpload', 'ngDialog', 'dndLists', 'angularValidator']).constant('config', new _configJs2['default']()).factory('providers', _dataJs.providers).factory('models', _modelsJs.models).directive('spEditor', function () {
  return new _editorCanvasJs.EditorDriective();
}).directive('spTabs', function () {
  return new Driectives.SpTabs();
}).directive('spTabPane', function () {
  return new Driectives.SpTabPane();
}).directive('spDraggable', function () {
  return new Driectives.Draggable();
}).directive('spDroppable', function () {
  return new Driectives.Droppable();
}).directive('spSessions', ["config", function (config) {
  return new Driectives.SpSessions(config);
}]).directive('spDrills', ["config", function (config) {
  return new Driectives.SpDrills(config);
}]).directive('spSessionDrills', ["config", function (config) {
  return new Driectives.SpSessionDrills(config);
}]).filter('objOrderBy', function () {
  return function (items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function (item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return a[field] > b[field] ? 1 : -1;
    });
    if (reverse) filtered.reverse();
    return filtered;
  };
}).filter('rawHtml', ['$sce', function ($sce) {
  return function (val) {
    return $sce.trustAsHtml(val);
  };
}]).filter('range', function () {
  return function (input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i = min; i < max; i++) input.push(i);
    return input;
  };
}).filter('amUtc', function () {
  return function (value) {
    return moment.utc(value);
  };
}).config(["$stateProvider", "$urlRouterProvider", "config", function ($stateProvider, $urlRouterProvider, config) {

  var templateBasePath = config.templateBasePath;

  $stateProvider.state('app', {
    abstract: true,
    templateUrl: templateBasePath + 'base.html',
    controller: Main.AppController,
    title: 'Home',
    resolve: {
      activeUserLoaded: ["models", function activeUserLoaded(models) {
        return models.ActiveUser.checkLoginStatus().then(function (user) {
          return user;
        }, function (res) {});
      }]
    }
  }).state('app.login', {
    url: '/login/',
    loginRequired: false,
    params: { next: null },
    title: 'Login',
    views: {
      'content': {
        templateUrl: templateBasePath + 'login.html',
        controller: Main.LoginController
      }
    }
  }).state('app.home', {
    url: '/',
    loginRequired: true,
    title: 'Home',
    params: { drillkey: 'new' },
    views: {
      'content': {
        templateUrl: templateBasePath + 'editor.html',
        controller: Main.DrillEditorController
      }
    }
  }).state('app.sample', {
    url: '/sample/',
    loginRequired: true,
    title: 'sample',
    views: {
      'content': {
        templateUrl: templateBasePath + 'sample.html'
      }
    }
  }).state('app.library', {
    url: '/library/',
    loginRequired: true,
    title: 'Library',
    views: {
      'content': {
        templateUrl: templateBasePath + 'home.html',
        controller: Main.LibraryController
      }
    }
  }).state('app.settings', {
    url: '/settings',
    loginRequired: true,
    title: 'Settings',
    params: { passValue: null },
    views: {
      'content': {
        templateUrl: templateBasePath + 'settings.html',
        controller: Main.SettingsController
      }
    }
  }).state('app.session', {
    url: '/session/{sessionkey}',
    loginRequired: true,
    title: 'Session',
    params: { passValue: null },
    views: {
      'content': {
        templateUrl: templateBasePath + 'session.html',
        controller: Main.SessionController
      }
    }
  }).state('app.sessionshare', {
    url: '/session/{sessionkey}/shareKey/{sharekey}',
    loginRequired: true,
    title: 'Shared Session',
    params: { passValue: null },
    views: {
      'content': {
        templateUrl: templateBasePath + 'session.html',
        controller: Main.SessionController
      }
    }
  }).state('app.sessionshareprint', {
    url: '/session/{sessionkey}/shareKey/{sharekey}/print',
    loginRequired: true,
    title: 'Shared Session Print',
    params: { passValue: null, printView: true },
    views: {
      'content': {
        templateUrl: templateBasePath + 'session.html',
        controller: Main.SessionController
      }
    }
  }).state('app.sessionprint', {
    url: '/session/{sessionkey}/print',
    loginRequired: true,
    title: 'Session Print',
    params: { passValue: null, printView: true },
    views: {
      'content': {
        templateUrl: templateBasePath + 'session.html',
        controller: Main.SessionController
      }
    }
  }).state('app.session.edit', {
    url: '/edit',
    loginRequired: true,
    title: 'Session Edit',
    params: { passValue: null },
    views: {
      'content': {
        templateUrl: templateBasePath + 'session.html',
        controller: Main.SessionController
      }
    }
  }).state('app.drillshare', {
    url: '/drill/{drillkey}/shareKey/{sharekey}',
    loginRequired: true,
    title: 'Shared Drill',
    params: { passValue: null },
    views: {
      'content': {
        templateUrl: templateBasePath + 'drill.html',
        controller: Main.DrillController
      }
    }
  }).state('app.drill', {
    url: '/drill/{drillkey}/',
    loginRequired: true,
    title: 'Drill',
    views: {
      'content': {
        templateUrl: templateBasePath + 'drill.html',
        controller: Main.DrillController
      }
    }
  }).state('app.drillprint', {
    url: '/drill/{drillkey}/print/',
    loginRequired: true,
    title: 'Drill Print',
    params: { passValue: null, printView: true },
    views: {
      'content': {
        templateUrl: templateBasePath + 'drill.html',
        controller: Main.DrillController
      }
    }
  }).state('app.drillshareprint', {
    url: '/drill/{drillkey}/shareKey/{sharekey}/print',
    loginRequired: true,
    title: 'Shared Drill Print',
    params: { passValue: null, printView: true },
    views: {
      'content': {
        templateUrl: templateBasePath + 'drill.html',
        controller: Main.DrillController
      }
    }
  }).state('app.drilleditor', {
    url: '/drill/{drillkey}/editor/',
    loginRequired: true,
    title: 'Drill Editor',
    params: { passValue: null },
    views: {
      'content': {
        templateUrl: templateBasePath + 'editor.html',
        controller: Main.DrillEditorController
      }
    }
  }).state('app.chooser', {
    url: '/chooser/{sessionkey}/{drillkey}/{mode}/{callback}/',
    loginRequired: true,
    title: 'Choose',
    views: {
      'content': {
        templateUrl: templateBasePath + 'chooser.html',
        controller: Main.ChooserController
      }
    }
  }).state('app.translations', {
    url: '/_translations/',
    loginRequired: true,
    title: 'Translations',
    views: {
      'content': {
        templateUrl: templateBasePath + 'translations.html',
        controller: Main.TranslationsController
      }
    }
  }).state('app.import', {
    url: '/import/',
    loginRequired: true,
    title: 'Import',
    views: {
      'content': {
        templateUrl: templateBasePath + 'import.html',
        controller: Main.ImportController
      }
    }
  });

  $urlRouterProvider.otherwise('/');
}]).run(["$rootScope", "$state", "gettextCatalog", "config", "models", "$stateParams", "providers", "amMoment", "$location", "$window", "gettext", function ($rootScope, $state, gettextCatalog, config, models, $stateParams, providers, amMoment, $location, $window, gettext) {
  config.dataProvider = new providers.DataProvider(config.apiBasePath);

  // $rootScope.rview = {
  //   screenClasses:[],
  //   title: '',
  //   mainMenu: 'main',
  //   displayTitle: '',
  //   largeLogo: true,
  // }

  /** THESE are the additional text to be translated **/
  var additionalTranslations = [gettext('Select & Drag'), gettext('Pen'), gettext('Player Path'), gettext('Ball Path'), gettext('Dribble'), gettext('Highlight'), gettext('Triangle'), gettext('Rectangle'), gettext('Circle'), gettext('Shape'), gettext('Text Box')];

  $rootScope.lastState = null;
  $rootScope.user = models.ActiveUser.user;
  $rootScope.local = null;

  $rootScope.setLocal = function (local) {
    if ($rootScope.local == local) {
      return;
    }

    $rootScope.local = local;

    var _local$split = local.split('-');

    var _local$split2 = _slicedToArray(_local$split, 2);

    var lang = _local$split2[0];
    var country = _local$split2[1];

    // gettextCatalog.setCurrentLanguage(lang);
    gettextCatalog.setCurrentLanguage(local);

    // if(lang != 'en'){
    //   gettextCatalog.loadRemote("/js/languages/" + lang + ".json");
    // }
    // gettextCatalog.debug = true;

    if (config.supportedDateLocal.indexOf(local) > -1) {
      amMoment.changeLocale(local);
    } else if (config.supportedDateLocal.indexOf(lang) > -1) {
      amMoment.changeLocale(lang);
    } else {
      //console.log('Unsupported Date Local', local);
      amMoment.changeLocale('en');
    }
  };

  $rootScope.$state = $state;
  $rootScope.showBackBtn = true;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
    // to be used for back button //won't work when page is reloaded.
    $rootScope.previousState_name = fromState.name;
    $rootScope.previousState_params = fromParams;
    $rootScope.currentState_name = $state.$current.self.name;
    // console.log($rootScope.currentState_name+" <-- "+$rootScope.previousState_name,$rootScope.previousState_params);
    if ($rootScope.previousState_name == 'app.login') {
      $rootScope.showBackBtn = false;
    } else {
      $rootScope.showBackBtn = true;
    }

    if ($window) {
      $window.ga('send', 'pageview', { page: $location.path(), title: $rootScope.documentTitle });
    }
  });
  //back button function called from back button's ng-click="back()"
  $rootScope.back = function () {
    if ($rootScope.previousState_name == 'app.login') {
      $state.go($rootScope.currentState_name);
    } else {
      $state.go($rootScope.previousState_name, $rootScope.previousState_params);
    }
  };

  $rootScope.$on('$stateChangeStart', function (e, to, toParams, fromState, fromParams) {

    $rootScope.rview = {
      screenClasses: [],
      title: '',
      mainMenu: 'main',
      displayTitle: '',
      largeLogo: true,
      isEdit: false
    };

    $rootScope.documentTitle = '';
    $rootScope.lastState = fromState.name;

    var title = to.title;
    var className = 'screen-' + to.name.replace('app.', '');
    $rootScope.rview.screenClasses = [className];

    if (title) {
      $rootScope.documentTitle = title + ' - ' + config.name;
      $rootScope.rview.title = title;
      title += ' | ' + config.name;
    } else {
      $rootScope.rview.title = '';
      title = config.name;
    }

    $rootScope.title = title;

    if (models.ActiveUser && models.ActiveUser.user) {
      $rootScope.setLocal(models.ActiveUser.user.local);
    }

    if (to.loginRequired !== true || to.isLoginPage === true) {
      return;
    }

    if (!models.ActiveUser.isLoggedIn()) {
      models.ActiveUser.checkLoginStatus().then(function (user) {
        $rootScope.setLocal(user.local);
      }, function (err) {
        var nextPath = nextPath || to.name;
        var nextParams = nextParams || toParams;

        if (e) {
          e.preventDefault();
        }
        $state.go('app.login', { next: { path: nextPath, params: nextParams } });
      });
    }
  });
}]);

},{"./common.js":2,"./config.js":3,"./controllers/main.js":4,"./data.js":5,"./directives/directives.js":6,"./editor/canvas.js":8,"./models.js":14,"babel-polyfill":15}],2:[function(require,module,exports){
"use strict";

if (!Promise.Deferred) {
  Promise.Deferred = function () {
    this.promise = new Promise((function (resolve, reject) {
      this.resolve = resolve;
      this.reject = reject;
    }).bind(this));

    this.then = this.promise.then.bind(this.promise);
    this["catch"] = this.promise["catch"].bind(this.promise);
  };
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Config = function Config() {
  _classCallCheck(this, Config);

  this.name = 'Session Planner 4.0';
  this.templateBasePath = '/views/';
  this.defaultLocal = 'en';
  this.editorVersion = '4.0.0';

  this.apiBasePath = '';
  this.dataProvider = {};

  this.suportedLocale = [{ key: 'en', name: 'English' }, { key: 'ar', name: 'Arabic (العربية)' }, { key: 'es', name: 'Spanish (Español)' }, { key: 'pt', name: 'Portuguese (Português)' }, { key: 'zh-cn', name: 'Chinese (汉语)' }];

  this.supportedDateLocal = ['en', 'ar', 'es', 'pt', 'pt-br', 'zh-cn'];
};

exports['default'] = Config;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _editorSetupJs = require('./../editor/setup.js');

var _editorDrawJs = require('./../editor/draw.js');

var _editorImport_dataJs = require('./../editor/import_data.js');

var AppController = (function () {
  function AppController($scope, $rootScope, $state, config, models, gettextCatalog) {
    _classCallCheck(this, AppController);

    var parser = new UAParser();

    var getBrowserInfo = parser.getResult();
    $rootScope.BrowserInfo = {};
    $rootScope.BrowserInfo.name = getBrowserInfo.browser.name;
    $rootScope.showBrowserWarning = false;

    if (getBrowserInfo.browser.major) {
      $rootScope.BrowserInfo.version = parseInt(getBrowserInfo.browser.major);
      switch ($rootScope.BrowserInfo.name) {
        case 'Chrome':
          {
            if ($rootScope.BrowserInfo.version >= 43) {
              $rootScope.showBrowserWarning = false;
            } else {
              $rootScope.showBrowserWarning = true;
            }
            break;
          }
        case 'Firefox':
          {
            if ($rootScope.BrowserInfo.version >= 39) {
              $rootScope.showBrowserWarning = false;
            } else {
              $rootScope.showBrowserWarning = true;
            }
            break;
          }
        case 'IE':
          {
            if ($rootScope.BrowserInfo.version >= 11) {
              $rootScope.showBrowserWarning = false;
            } else {
              $rootScope.showBrowserWarning = true;
            }
            break;
          }
        case 'MSIE':
          {
            if ($rootScope.BrowserInfo.version >= 11) {
              $rootScope.showBrowserWarning = false;
            } else {
              $rootScope.showBrowserWarning = true;
            }
            break;
          }
        case 'Safari':
          {
            if ($rootScope.BrowserInfo.version >= 8) {
              $rootScope.showBrowserWarning = false;
            } else {
              $rootScope.showBrowserWarning = true;
            }
            break;
          }
        case 'Mobile Safari':
          {
            if ($rootScope.BrowserInfo.version >= 8) {
              $rootScope.showBrowserWarning = false;
            } else {
              $rootScope.showBrowserWarning = true;
            }
            break;
          }

        case 'Edge':
          {
            $rootScope.showBrowserWarning = true;
            break;
          }
      }
    } else {
      $rootScope.showBrowserWarning = false;
    }

    this.local = null;
    $rootScope.rview.mainMenu = 'main';
    $rootScope.rview.displayTitle = '';
    $rootScope.rview.largeLogo = true;

    $rootScope.$watch('user', function (old, updated) {
      $rootScope.setLocal(updated.local);
    });

    $scope.doLogout = this.doLogout.bind(this, $scope, $state, models);
  }

  _createClass(AppController, [{
    key: 'doLogout',
    value: function doLogout($scope, $state, models) {
      models.ActiveUser.logout().then(function () {
        $state.go('app.home', {}, { reload: true });
        // window.location.reload();
      });
    }
  }]);

  return AppController;
})();

exports.AppController = AppController;

var LibraryController = function LibraryController($scope, $rootScope, config) {
  var _this = this;

  _classCallCheck(this, LibraryController);

  $rootScope.rview.menuItem = 'library';
  $scope.view = this.view = { ready: false, sessions: [], drills: [] };
  config.dataProvider.sessions().then(function (data) {
    if (data.data.ok) {
      _this.view.sessions = data.data.sessions;
      _this.view.drills = data.data.drills;
      _this.view.ready = true;
      _this.activeSort = {
        name: 'name',
        rev: true
      };
    } else {
      console.log('Error fetching session', data);
    }
  }, function (err) {
    console.log('Error fetching session', err);
  });
};

exports.LibraryController = LibraryController;

var SessionController = (function () {
  function SessionController($scope, $rootScope, $stateParams, $state, ngDialog, config) {
    var _this2 = this;

    _classCallCheck(this, SessionController);

    $rootScope.rview.menuItem = 'session';
    $scope.view = this.view = { ready: false, readmode: false };
    $scope.input = this.input = {};
    $scope.data = this.data = {};
    var shareData = { currentOwner: $rootScope.user.id };

    $scope.view.printView = $stateParams.printView ? true : false;
    this.data.pageOption = 3;
    $scope.data.pageSelect = [1, 2, 3, 4];
    $scope.data.pushDrill = [];

    $scope.SelectedView = function () {
      $scope.pagination($scope.data.pageOption);
    };

    $scope.view.showBlack = '0';

    $scope.view.drillkey = null;
    if ($stateParams.passValue) {
      $scope.view.drillkey = $stateParams.passValue.drillkey || null;
    }

    this.session = null;
    this.shareData = shareData;

    $scope.post = this.post = {
      started: false,
      error: null
    };

    if ($stateParams.sessionkey == 'new') {
      this.view.ready = true;
      this.view.createMode = true;
      this.view.sessionkey = null;
      this.view.heading = 'New Session';
      this.input.key = null;
    } else if ($stateParams.passValue) {
      this.view.justsaved = $stateParams.passValue.justsaved;
      this.session = $stateParams.passValue.session;
    }

    if (this.session) {
      this.prepareData();
    } else {
      config.dataProvider.getSession($stateParams.sessionkey, $stateParams.sharekey).then(function (data) {
        if (data.data.ok) {
          _this2.session = data.data.session;
          _this2.author = $rootScope.user;
          $scope.author = _this2.author;

          _this2.prepareData();
        } else {
          //console.log('Error fetching session', data);
        }
      }, function (err) {
        //console.log('Error fetching session', err)
      });
    }

    $scope.copySession = function () {
      config.dataProvider.copySession($stateParams.sessionkey, $stateParams.sharekey).then(function (data) {
        $state.go('app.library');
      }, function (err) {
        //console.log('Error in copying session', err)
      });
    };

    $scope.showShare = function () {
      ngDialog.open({
        template: config.templateBasePath + 'share.html',
        showClose: true,
        controller: function controller($scope, $window) {
          $scope.showSessionShare = true;
          $scope.shareUrl = $state.href('app.sessionshare', { sessionkey: shareData.key, sharekey: shareData.shareToken }, { absolute: true });
        }
      });
    };

    $scope.printSession = function () {
      if (_this2.view.shareMode) {
        $state.go('app.sessionshareprint', { 'sessionkey': $stateParams.sessionkey, 'sharekey': $stateParams.sharekey });
      } else {
        $state.go('app.sessionprint', { 'sessionkey': $stateParams.sessionkey });
      }
    };

    $scope.doSave = function () {
      var _this3 = this;

      this.post.started = true;
      config.dataProvider.saveSession(this.input).then(function (data) {
        if (data.data.ok) {
          var session = data.data.session;
          if ($scope.view.session) {
            var drills = $scope.view.session.drills;
            session.drills = drills;
          }

          if ($scope.view.drillkey) {
            config.dataProvider.attachDrill(session.key, $scope.view.drillkey).then(function () {
              _this3.post.started = false;
              $state.go('app.session.edit', { sessionkey: session.key });
            }, function (err) {
              _this3.post.error = err.data.error_msg;
              _this3.post.started = false;
            });
          } else {
            _this3.post.started = false;
            var passValue = {
              justsaved: true,
              session: session
            };
            $state.go('app.session.edit', { sessionkey: session.key, passValue: passValue });
          }
        } else {
          var err = data.data;
          _this3.post.error = err.error_msg;
          _this3.post.started = false;
        }
      }, function (err) {
        _this3.post.error = err.data.error_msg;
        _this3.post.started = false;
      });
    };

    $scope.pagination = function (data) {
      var viewData = data;
      $scope.data.selectedView = [];
      for (var i = 0; i < $scope.view.session.drills.length; i += viewData) {
        $scope.data.selectedView.push($scope.view.session.drills.slice(i, i + viewData));
      }
    };
  }

  _createClass(SessionController, [{
    key: 'prepareData',
    value: function prepareData() {
      this.input.name = this.session.name;
      this.input.description = this.session.description;
      this.input.date = this.session.date;
      this.input.team = this.session.team;
      this.input.duration = this.session.duration;
      this.input.key = this.session.key;

      if (this.input.date) {
        var _m = moment(this.session.date).utc();
        this.input.date = new Date(_m.year(), _m.month(), _m.date()) + '';
      }

      this.view.heading = this.input.name;
      this.view.createMode = false;
      this.view.ready = true;
      this.view.session = this.session;
      this.view.readmode = true;
      this.view.shareMode = this.session.owner != this.shareData.currentOwner;

      this.shareData.key = this.session.key;
      this.shareData.shareToken = this.session.shareToken;
      this.data.selectedView = [];
      if (!this.view.session.drills) {
        this.view.session.drills = [];
      }
      for (var i = 0; i < this.view.session.drills.length; i++) {
        this.view.session.drills[i].order = i + 1;
      }
      for (var i = 0; i < this.view.session.drills.length; i += this.data.pageOption) {
        this.data.selectedView.push(this.view.session.drills.slice(i, i + this.data.pageOption));
        // //console.log(this.data.selectedView);
      }
    }
  }]);

  return SessionController;
})();

exports.SessionController = SessionController;

var LoginController = (function () {
  function LoginController($scope, $state, $stateParams, config, models, gettextCatalog) {
    _classCallCheck(this, LoginController);

    $scope.postUser = this.postUser = {};
    $scope.post = this.post = {
      started: false,
      error: null
    };

    $scope.next = this.next = $stateParams.next || {};
    $scope.doLogin = this.doLogin.bind(this, $state, $scope, models, gettextCatalog);
  }

  _createClass(LoginController, [{
    key: 'doLogin',
    value: function doLogin($state, $scope, models, gettextCatalog) {
      var _this4 = this;

      this.post.started = true;
      this.post.error = null;
      var user = this.postUser;

      models.ActiveUser.login(user.email, user.password).then(function (user) {
        var path = _this4.next.path || 'app.home';
        var params = _this4.next.params || {};
        $state.go(_this4.next.path || 'app.home', _this4.next.params || {}, { reload: true });
        _this4.post.started = false;
        $scope.$digest();
      }, function (err) {
        if (err.error == 'MEMBERSHIP_FAILED') {
          _this4.post.error = 'You need a Premium account to access the Session Planner. Upgrade to premium ( https://soccerspecific.com/plans/member-benefits/)';
        } else {
          _this4.post.error = 'Check your email and password';
        }
        _this4.post.started = false;
        $scope.$digest();
      });
    }
  }]);

  return LoginController;
})();

exports.LoginController = LoginController;

var DrillController = function DrillController($scope, $rootScope, $state, $stateParams, config) {
  var _this5 = this;

  _classCallCheck(this, DrillController);

  $scope.drill = {};
  $scope.ts = moment().unix();
  $scope.view = this.view = { ready: false };
  $scope.view.printView = $stateParams.printView ? true : false;
  $scope.updating = false;
  if ($scope.view.printView) {
    $rootScope.rview.menuItem = 'drillprint';
  } else {
    $rootScope.rview.menuItem = 'drill';
  }

  $scope.view.showBlack = '0';

  var shareData = { currentOwner: $rootScope.user.id };
  this.shareData = shareData;

  $scope.showShare = function () {

    ngDialog.open({
      template: config.templateBasePath + 'share.html',
      showClose: true,
      controller: function controller($scope, $window) {
        $scope.showSessionShare = false;
        $scope.shareUrl = $state.href('app.drillshare', { drillkey: shareData.key, sharekey: shareData.shareToken }, { absolute: true });
      }
    });
  };

  $scope.printDrill = function () {
    if (_this5.view.shareMode) {
      $state.go('app.drillshareprint', { 'drillkey': $stateParams.drillkey, 'sharekey': $stateParams.sharekey });
    } else {
      $state.go('app.drillprint', { 'drillkey': $stateParams.drillkey });
    }
  };

  $scope.updateDrill = function () {
    $scope.updating = true;
    var postData = {
      key: $scope.drill.key,
      name: $scope.drill.name,
      setupText: $scope.drill.setupText,
      instructText: $scope.drill.instructText,
      coachText: $scope.drill.coachText,
      pitch: $scope.drill.pitch,
      duration: $scope.drill.duration
    };

    config.dataProvider.saveDrill(postData).then(function (data) {
      $scope.updating = false;
    }, function (err) {});
  };

  $scope.copyDrill = function () {
    config.dataProvider.copyDrill($stateParams.drillkey, $stateParams.sharekey).then(function (data) {
      $state.go('app.library');
    }, function (err) {
      //console.log('Error in copying drill', err)
    });
  };

  var sharekey = $stateParams.sharekey || null;

  config.dataProvider.getDrill($stateParams.sessionkey, $stateParams.drillkey, sharekey).then(function (data) {
    if (data.data.ok) {
      $scope.drill = data.data.drill;
      $scope.author = $rootScope.user;
      _this5.view.ready = true;

      _this5.view.shareMode = $scope.drill.owner != _this5.shareData.currentOwner;
    } else {
      //console.log('Error fetching drill', data);
    }
  }, function (err) {
    //console.log('Error fetching drill', err)
  });
};

exports.DrillController = DrillController;

var DrillEditorController = function DrillEditorController($scope, $rootScope, $stateParams, $state, config, gettext, $window, $element, $document, gettextCatalog) {
  var _this6 = this;

  _classCallCheck(this, DrillEditorController);

  $scope.WindowWidth = window.innerWidth;
  update_disp_changes($scope.WindowWidth);

  $(window).resize(function () {
    $scope.WindowWidth = window.innerWidth;
    $scope.$apply(function () {
      $scope.WindowWidth = window.innerWidth;
      update_disp_changes($scope.WindowWidth);
    });
  });

  function update_disp_changes(WindowWidth) {
    $scope.hideViewableScreen = false;
    $scope.ShowViewableScreen = true;

    if ($scope.WindowWidth < 1024) {
      $scope.ShowViewableScreen = false;
      $scope.hideViewableScreen = true;
    } else if ($scope.WindowWidth == 1024) {
      $scope.ChangeClase = true;
      $scope.ShowViewableScreen = true;
    } else {
      if ($scope.WindowWidth > 1024 && $scope.WindowWidth < 1226) {
        $scope.ChangeClase = true;
      } else {
        $scope.ChangeClase = false;
      }
      $scope.ShowViewableScreen = true;
    }
  }

  $scope.svgIconAssertsUrl = config.templateBasePath + 'assertsWork.svg';
  $rootScope.rview.mainMenu = 'drill';
  $rootScope.rview.largeLogo = false;
  $scope.editorSetup = _editorSetupJs.EditorSetup;
  $rootScope.rview.isEdit = $scope.isEdit = $stateParams.drillkey != 'new';

  this.drill = $scope.drill = {
    name: gettextCatalog.getString("Insert Name of Drill Here")
  };

  $rootScope.rview.editableTitleData = $scope.drill;

  this.view = $scope.view = {
    fieldboxOpenned: false,
    ready: false
  };

  $scope.expanBox = function () {
    $scope.view.fieldboxOpenned = true;
  };

  $document.bind('click', function (event) {
    if ($scope.view.fieldboxOpenned) {
      if (event.toElement.id != 'openFieldBox' && event.toElement.id != 'openedFieldBox' && event.toElement.id != 'openFieldIcon') {
        $scope.view.fieldboxOpenned = false;
        $scope.$apply();
      }
    }
  });

  $scope.view.sessionkey = null;
  if ($stateParams.passValue) {
    $scope.view.sessionkey = $stateParams.passValue.sessionkey || null;
  }

  $rootScope.keyDownOperations = function ($event) {
    var $this = $(event.target);
    if (event.which === 13) // Enter key
      {
        $this.focusout();
      }
  };

  $scope.onAssertLoaded = function () {

    _editorSetupJs.EditorSetup.activeDrill = _this6.drill;
    // $scope.view.OptionalFieldIdx =
    // $scope.view.ready = true;
    var _a = Snap('#svgIconAsserts');
    (0, _editorDrawJs.LoadAllPlayerAssert)(_a);
    (0, _editorDrawJs.LoadExtraAssert)(_a);
    _a.attr({ width: 0, height: 0 });

    if ($stateParams.passValue && $stateParams.passValue.drill && $stateParams.passValue.drill.data) {
      angular.extend($scope.drill, $stateParams.passValue.drill);
      $scope.view.ready = true;
    } else if ($scope.isEdit) {
      config.dataProvider.getDrill(null, $stateParams.drillkey, null).then(function (data) {
        if (data.data.ok) {
          angular.extend($scope.drill, data.data.drill);
          $scope.view.ready = true;
        } else {
          //console.log('Error fetching session', data);
        }
      }, function (err) {
        //console.log('Error fetching session', err)
      });
    } else {
        $scope.view.ready = true;
      }
  };
  $rootScope.clearDrill = function () {
    _editorSetupJs.EditorSetup.activeEditor.clear();
  };

  $rootScope.keyDownOperations = function ($event) {
    var $this = $(event.target);
    if (event.which === 13) {
      $this.blur();
    }
  };

  $rootScope.saveAsDrill = function () {
    $rootScope.saveDrill(false, true);
  };

  $rootScope.saveDrill = function (goPrintPage, isSaveAs) {
    $rootScope.rview.actionSaveStarted = true;

    (0, _editorDrawJs.CreateCanvasElement)('convertCanvas').then(function (data) {
      var drill = _this6.drill;
      var canvas = data.canvas;
      var imageData = data.imageData;
      var imageDataBlack = data.imageDataBlack;
      var svgText = data.svgText;

      if (isSaveAs) {
        drill.key = null;
      }

      var postData = {
        key: drill.key,
        name: drill.name,
        setupText: drill.setupText,
        instructText: drill.instructText,
        coachText: drill.coachText,
        pitch: drill.pitch,
        duration: drill.duration,
        data: svgText,
        thumpData: imageData,
        thumpDataBlack: imageDataBlack
      };

      config.dataProvider.saveDrill(postData, _this6.view.sessionkey).then(function (data) {
        var _drill = data.data.drill;
        var drillkey = _drill.key;
        if (goPrintPage) {
          if (_this6.view.shareMode) {
            $state.go('app.drillshareprint', { 'drillkey': drillkey, 'sharekey': $stateParams.sharekey });
          } else {
            $state.go('app.drillprint', { 'drillkey': drillkey });
          }
        } else if (!$scope.isEdit || isSaveAs) {
          $state.go('app.drilleditor', { drillkey: drillkey });
        }

        $rootScope.rview.actionSaveStarted = false;
      }, function (err) {
        $rootScope.rview.actionSaveStarted = false;
        //console.log('Failed', err);
        alert('Error while saving');
      });
    });
  };

  $rootScope.printDrill = function () {
    $rootScope.saveDrill(true);
  };
};

exports.DrillEditorController = DrillEditorController;

var ChooserController = function ChooserController($scope, $rootScope, $stateParams, $state, $q, config) {
  var _this7 = this;

  _classCallCheck(this, ChooserController);

  $rootScope.rview.menuItem = 'choose';
  $scope.sessionkey = $stateParams.sessionkey;
  $scope.drillkey = $stateParams.drillkey;
  $scope.addedDrills = [];
  $scope.mode = $stateParams.mode;
  $scope.callback = $stateParams.callback;

  $scope.view = this.view = { ready: false, sessions: [], drills: [], addedDrills: $scope.addedDrills };

  $scope.onSessionSelected = function (session) {
    return new Promise(function (resolve, reject) {
      config.dataProvider.attachDrill(session.key, $scope.drillkey).then(function () {
        $state.go('app.library');
        resolve();
      }, function () {
        reject();
      });
    });
  };

  $scope.onDrillsAdd = function (drills, index) {
    drills = drills || $scope.addedDrills;
    index = index || 0;

    return new Promise(function (resolve, reject) {
      if (index >= drills.length) {
        $state.go('app.session', { sessionkey: $scope.sessionkey });
        resolve();
      } else {
        config.dataProvider.attachDrill($scope.sessionkey, drills[index]).then(function () {
          return $scope.onDrillsAdd(drills, index + 1);
        }, function () {
          reject();
        });
      }
    });
  };

  config.dataProvider.sessions().then(function (data) {
    if (data.data.ok) {
      _this7.view.sessions = data.data.sessions;
      _this7.view.drills = data.data.drills;

      _this7.view.ready = true;
    } else {
      //console.log('Error fetching session', data);
    }
  }, function (err) {
    //console.log('Error fetching session', err)
  });
};

exports.ChooserController = ChooserController;

var SettingsController = function SettingsController($scope, $rootScope, Upload, config, $state) {
  var _this8 = this;

  _classCallCheck(this, SettingsController);

  $rootScope.rview.menuItem = 'settings';
  $scope.view = this.view = { ready: true, user: $rootScope.user, loading: false, error: false };
  this.view.languages = config.suportedLocale;
  this.view.local = config.suportedLocale[0];
  if (this.view.user.local) {
    this.view.languages.forEach(function (l, i) {
      if (l.key == _this8.view.user.local) {
        _this8.view.local = config.suportedLocale[i];
      }
    });
  }

  $scope.showError = function (err) {
    _this8.view.loading = false;
    _this8.view.error = true;
    //console.log(err);
  };

  $scope.saveProfile = function () {
    _this8.view.loading = true;
    Upload.upload({
      url: config.dataProvider.getUrl('/me'),
      data: {
        file: _this8.view.file,
        name: _this8.view.user.name,
        local: _this8.view.local.key
      }
    }).then(function (data) {
      if (data.data.ok) {
        $rootScope.hideEverything = true;
        window.location.href = '/#/';
        window.location.reload();
      } else {
        $scope.showError(data.data.error);
      }
    }, function (data) {
      $scope.showError(data.data.error);
    });
  };
};

exports.SettingsController = SettingsController;

var SessionPrintController = function SessionPrintController($scope, $rootScope, $stateParams, config) {
  var _this9 = this;

  _classCallCheck(this, SessionPrintController);

  $rootScope.rview.menuItem = 'sessionprint';
  $scope.sessionkey = $stateParams.sessionkey;

  $scope.view = this.view = { ready: false, session: [] };

  config.dataProvider.getSession($stateParams.sessionkey).then(function (data) {
    if (data.data.ok) {
      $scope.session = data.data.session;
      _this9.view.ready = true;
    } else {
      //console.log('Error fetching session', data);
    }
  }, function (err) {
    //console.log('Error fetching session', err)
  });
};

exports.SessionPrintController = SessionPrintController;

var DrillPrintController = function DrillPrintController($scope, $rootScope, config) {
  _classCallCheck(this, DrillPrintController);

  $rootScope.rview.menuItem = 'drillprint';
};

exports.DrillPrintController = DrillPrintController;

var TranslationsController = function TranslationsController($scope, $rootScope, $stateParams, $state, $q, config, ngDialog) {
  var _this14 = this;

  _classCallCheck(this, TranslationsController);

  $rootScope.rview.menuItem = 'translation';
  $scope.view = this.view = {
    ready: false, translations: [], items: [],
    suportedLocale: config.suportedLocale,
    mode: 'list',
    saving: false,
    insync: false,
    selectedLanguage: '',
    selectedLanguageName: ''
  };

  $scope.selectLanguage = function (lang, name) {
    var _this10 = this;

    this.view.mode = 'loading';
    this.view.selectedLanguage = lang;
    this.view.selectedLanguageName = name;

    if (this.view.translations.indexOf(lang) == -1) {
      this.view.mode = 'create';
      return;
    }

    config.dataProvider.getTranslationsLang(lang).then(function (data) {
      if (data.data.ok) {
        _this10.view.items = data.data.items;
        _this10.view.mode = 'translate';

        // this.view.items.forEach((item, i)=>{
        //   item.msgstr = ['x ' + item.msgid]
        // });
      } else {
          //console.log('Error fetching translation for language', data);
        }
    }, function (err) {
      //console.log('Error fetching translation for language', err)
    });
  };

  $scope.createNewLanguage = function (lang) {
    var _this11 = this;

    this.view.saving = true;

    config.dataProvider.createTranslationsLang(lang).then(function (data) {
      if (!data.data.ok) {
        //console.log('Error create translation for language', data);
        return;
      }

      _this11.view.translations.push(lang);
      return config.dataProvider.getTranslationsLang(lang);
    }).then(function (data) {
      if (data.data.ok) {
        _this11.view.items = data.data.items;
        _this11.view.mode = 'translate';
        _this11.view.saving = false;
      } else {
        //console.log('Error fetching translation for language', data);
      }
    }, function (err) {
      //console.log('Error create translation for language', err)
    });
  };

  $scope.saveTranslation = function (lang) {
    var _this12 = this;

    this.view.saving = true;

    config.dataProvider.saveTranslationsLang(lang, this.view.items).then(function (data) {
      if (!data.data.ok) {
        //console.log('Error saving translation for language', data);
        return;
      }
      return config.dataProvider.getTranslationsLang(lang);
    }).then(function (data) {
      if (data.data.ok) {
        _this12.view.items = data.data.items;
        _this12.view.mode = 'translate';
        _this12.view.saving = false;
        ngDialog.open({
          template: config.templateBasePath + 'message.html',
          showClose: true,
          controller: function controller($scope, $window) {
            $scope.message = "Translation Saved";
          }
        });
      } else {
        //console.log('Error fetching translation for language', data);
      }
    }, function (err) {
      //console.log('Error saving translation for language', err)
    });
  };

  $scope.syncTranslation = function (lang) {
    var _this13 = this;

    this.view.insync = true;

    config.dataProvider.syncTranslationsLang(lang).then(function (data) {
      if (!data.data.ok) {
        //console.log('Error saving translation for language', data);
        return;
      }

      _this13.view.items = data.data.items;
      _this13.view.mode = 'translate';
      _this13.view.insync = false;
    }, function (err) {
      //console.log('Error saving translation for language', err)
    });
  };

  config.dataProvider.translations().then(function (data) {
    if (data.data.ok) {
      _this14.view.items = data.data.items;
      _this14.view.translations = data.data.translations;

      _this14.view.ready = true;
    } else {
      //console.log('Error fetching translation information', data);
    }
  }, function (err) {
    //console.log('Error fetching translation informations', err)
  });
};

exports.TranslationsController = TranslationsController;

var ImportController = function ImportController($scope, $rootScope, config, Upload) {
  var _this15 = this;

  _classCallCheck(this, ImportController);

  $scope.svgIconAssertsUrl = config.templateBasePath + 'assertsWork.svg';

  $rootScope.rview.menuItem = 'import';
  $scope.view = this.view = { 'file': null };
  $scope.data = this.data = {};
  $scope.EditorSetup = _editorSetupJs.EditorSetup;

  $scope.view.uploading = false;
  $scope.view.uploadingError = false;
  $scope.view.importing = false;
  this.drill = $scope.drill = {};

  this.session = $scope.session = {};

  this.data.fileDrills = {};

  $scope.$watch('view.file', function (updated, old) {
    if (updated || old) {
      $scope.newFileSelected();
    }
  });

  $scope.newFileSelected = function () {

    $scope.view.uploadingError = false;
    $scope.view.uploading = false;
    $scope.view.importing = false;
    $scope.view.imported = false;

    $scope.data.importingDrillFiles = [];
    $scope.data.importingSessionFiles = [];
    $scope.importXml();
  };

  $scope.importXml = function () {
    $scope.view.uploading = true;
    Upload.upload({
      url: config.dataProvider.getUrl('/xmlupload'),
      data: {
        file: _this15.view.file
      }
    }).then(function (data) {
      $scope.view.uploading = false;
      if (data.data.ok) {
        _this15.data.sessions = data.data.sessions;
        _this15.data.drills = data.data.drills;
        $scope.processImportFiles();
      } else {
        $scope.view.uploadingError = true;
      }
    }, function (data) {
      $scope.view.uploadingError = true;
    });
  };

  $scope.addSessionDrills = function (session, pos) {
    var pos = pos || 0;
    if (!session.drills[pos]) {
      $scope.onSeesionDrillsAdded(session);
      return;
    }
    var drillFileName = session.drills[pos];
    pos += 1;
    if (_this15.data.fileDrills && _this15.data.fileDrills[drillFileName]) {
      var drillKey = _this15.data.fileDrills[drillFileName].key;
      config.dataProvider.attachDrill(session.session.key, drillKey, { orderIndex: pos }).then(function () {
        session.addedDrills.push(drillKey);
        $scope.addSessionDrills(session, pos);
      }, function () {
        $scope.addSessionDrills(session, pos);
      });
    } else {
      $scope.addSessionDrills(session, pos);
    }
  };

  $scope.onSessionsImported = function () {
    for (var i = 0; i < $scope.data.importingSessionFiles.length; i++) {
      var sf = $scope.data.importingSessionFiles[i];
      $scope.addSessionDrills(sf);
    };
  };

  $scope.importSessionFromData = function (pos) {
    var pos = pos || 0;
    if (!$scope.data.importingSessionFiles[pos]) {
      $scope.onSessionsImported();
      return;
    }
    var currentCreatingSession = $scope.data.importingSessionFiles[pos];
    currentCreatingSession.processing = true;
    var data = $scope.data.sessions[currentCreatingSession.id];
    _this15.session = (0, _editorImport_dataJs.importSession)(data);
    currentCreatingSession.drills = _this15.session.drills;
    pos += 1;
    config.dataProvider.saveSession(_this15.session).then(function (data) {
      currentCreatingSession.processing = false;
      currentCreatingSession.processed = true;
      currentCreatingSession.session = data.data.session;
      $scope.importSessionFromData(pos);
    }, function (err) {
      currentCreatingSession.processing = false;
      currentCreatingSession.processed = false;
      currentCreatingSession.error = true;
      $scope.importSessionFromData(pos);
    });
  };

  $scope.onDrillsImported = function () {
    $scope.importSessionFromData();
    if ($scope.data.importingSessionFiles.length == 0) {
      $scope.view.importing = false;
      $scope.view.imported = true;
    }
  };

  $scope.onSeesionDrillsAdded = function (session) {
    session.drillsAdded = true;

    var imported = true;
    for (var i = $scope.data.importingSessionFiles.length - 1; i >= 0; i--) {
      var s = $scope.data.importingSessionFiles[i];
      if (!s.drillsAdded) {
        imported = false;
      }
    };

    if (imported) {
      $scope.view.importing = false;
      $scope.view.imported = true;
    }
  };

  $scope.importDrillFromData = function (pos) {
    var pos = pos || 0;
    if (!$scope.data.importingDrillFiles[pos]) {
      $scope.onDrillsImported();
      return;
    }
    var drillStatusInfo = $scope.data.importingDrillFiles[pos];
    drillStatusInfo.processing = true;
    var data = $scope.data.drills[drillStatusInfo.id];
    pos += 1;
    try {
      _this15.drill = (0, _editorImport_dataJs.importDrill)($scope.EditorSetup.activeEditor, data);
    } catch (err) {
      drillStatusInfo.processing = false;
      drillStatusInfo.processed = false;
      drillStatusInfo.error = true;
      $scope.importDrillFromData(pos);
      return;
    }
    (0, _editorDrawJs.CreateCanvasElement)('convertCanvas').then(function (data) {
      var drill = _this15.drill;
      var canvas = data.canvas;
      var imageData = data.imageData;
      var imageDataBlack = data.imageDataBlack;
      var svgText = data.svgText;

      var postData = {
        key: drill.key,
        name: drill.name,
        setupText: drill.setupText,
        instructText: drill.instructText,
        coachText: drill.coachText,
        pitch: drill.pitch,
        duration: drill.duration,
        data: svgText,
        thumpData: imageData,
        thumpDataBlack: imageDataBlack
      };
      config.dataProvider.saveDrill(postData).then(function (data) {
        drillStatusInfo.processing = false;
        drillStatusInfo.processed = true;
        drillStatusInfo.drill = data.data.drill;
        _this15.data.fileDrills[drillStatusInfo.id] = data.data.drill;
        $scope.importDrillFromData(pos);
      }, function (err) {
        drillStatusInfo.processing = false;
        drillStatusInfo.processed = false;
        drillStatusInfo.error = true;
        $scope.importDrillFromData(pos);
      });
    });
  };

  $scope.processImportFiles = function () {

    $scope.view.importing = true;

    for (var key in $scope.data.sessions) {
      var session = { processing: false, processed: false, id: key, session: {}, error: false, drills: [], addedDrills: [] };
      $scope.data.importingSessionFiles.push(session);
    }

    for (var key in $scope.data.drills) {
      var drill = { processing: false, processed: false, id: key, drill: {}, error: false };
      $scope.data.importingDrillFiles.push(drill);
    }

    // $scope.EditorSetup.activeEditor.updateField();
    $scope.EditorSetup.activeEditor.assertSVG = Snap('#svgIconAsserts');

    $scope.importDrillFromData();
  };

  $scope.onAssertLoaded = function () {

    _editorSetupJs.EditorSetup.activeDrill = _this15.drill;
    // $scope.view.OptionalFieldIdx =
    // $scope.view.ready = true;
    var _a = Snap('#svgIconAsserts');
    (0, _editorDrawJs.LoadAllPlayerAssert)(_a);
    (0, _editorDrawJs.LoadExtraAssert)(_a);
    _a.attr({ width: 0, height: 0 });
  };
};

exports.ImportController = ImportController;

},{"./../editor/draw.js":9,"./../editor/import_data.js":10,"./../editor/setup.js":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var providers = function providers($http) {
  var DataProvider = (function () {
    function DataProvider(basePath) {
      _classCallCheck(this, DataProvider);

      this.basePath = basePath;
      this.cache = {};
    }

    _createClass(DataProvider, [{
      key: 'getUrl',
      value: function getUrl(path) {
        return this.basePath + path;
      }
    }, {
      key: 'get',
      value: function get(path, params) {
        return $http.get(this.getUrl(path), params);
      }
    }, {
      key: 'post',
      value: function post(path, params) {
        return $http.post(this.getUrl(path), params);
      }
    }, {
      key: 'login',
      value: function login(email, password) {
        return this.post('/login', { email: email, password: password });
      }
    }, {
      key: 'logout',
      value: function logout() {
        return this.get('/logout');
      }
    }, {
      key: 'me',
      value: function me() {
        return this.get('/me');
      }
    }, {
      key: 'sessions',
      value: function sessions() {
        return this.get('/sessions');
      }
    }, {
      key: 'saveSession',
      value: function saveSession(session) {
        var createMode = session.key ? false : true;
        var path = '/sessions';

        if (!createMode) {
          path += '/' + session.key + '/edit';
        }

        return this.post(path, session);
      }
    }, {
      key: 'deleteSession',
      value: function deleteSession(session) {
        var path = '/sessions/' + session.key + '/delete';

        return this.post(path, session);
      }
    }, {
      key: 'getSession',
      value: function getSession(sessionkey, sharekey) {
        var url = '/sessions/' + sessionkey;
        if (sharekey) {
          url += '?shareKey=' + sharekey;
        }

        return this.get(url);
      }
    }, {
      key: 'copySession',
      value: function copySession(sessionkey, sharekey) {
        var path = '/sessions/' + sessionkey + '/copy?shareKey=' + sharekey;
        return this.post(path);
      }
    }, {
      key: 'saveSessionDrill',
      value: function saveSessionDrill(sessionkey, drill) {
        var path = "/drills/" + drill.key + '/edit?sessionKey=' + sessionkey;
        return this.post(path, drill);
      }
    }, {
      key: 'saveDrill',
      value: function saveDrill(drill, sessionKey) {
        var createMode = drill.key ? false : true;
        var path = '/drills';

        if (!createMode) {
          path += '/' + drill.key + '/edit';
        }

        if (sessionKey) {
          path += '?sessionKey=' + sessionKey;
        }
        return this.post(path, drill);
      }
    }, {
      key: 'getDrill',
      value: function getDrill(sessionkey, drillkey, sharekey) {
        if (sessionkey) {
          var url = '/sessions/' + sessionkey + '/drills/' + drillkey + '/';
        } else {
          var url = '/drills/' + drillkey + '/';
          if (sharekey) {
            url += '?shareKey=' + sharekey;
          }
        }
        return this.get(url);
      }
    }, {
      key: 'copyDrill',
      value: function copyDrill(drillkey, shareKey) {
        return this.post('/drills/' + drillkey + '/copy?shareKey=' + shareKey);
      }
    }, {
      key: 'deleteDrill',
      value: function deleteDrill(sessionkey, drill) {
        var path = '/drills/' + drill.key + '/delete';

        if (sessionkey) {
          path += '?sessionKey=' + sessionkey;
          path += '&removeFromSession=' + true;
          path += '&orderIndex=' + drill.orderIndex;
        }

        return this.post(path, drill);
      }
    }, {
      key: 'attachDrill',
      value: function attachDrill(sessionkey, drillkey, params) {
        var params = params || {};
        var path = '/sessions/' + sessionkey + '/attach/' + drillkey;
        return this.post(path, params);
      }
    }, {
      key: 'translations',
      value: function translations() {
        return this.get('/_admin/translations');
      }
    }, {
      key: 'getTranslationsLang',
      value: function getTranslationsLang(lang) {
        return this.get('/_admin/translations/' + lang);
      }
    }, {
      key: 'createTranslationsLang',
      value: function createTranslationsLang(lang) {
        return this.post('/_admin/translations', { lang: lang });
      }
    }, {
      key: 'saveTranslationsLang',
      value: function saveTranslationsLang(lang, items) {
        return this.post('/_admin/translations/' + lang, { items: items });
      }
    }, {
      key: 'syncTranslationsLang',
      value: function syncTranslationsLang(lang) {
        return this.post('/_admin/translations/' + lang + '/sync');
      }
    }]);

    return DataProvider;
  })();

  return {
    DataProvider: DataProvider
  };
};
exports.providers = providers;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _editorUtilsJs = require('../editor/utils.js');

var Utils = _interopRequireWildcard(_editorUtilsJs);

var SpTabs = (function () {
  function SpTabs() {
    _classCallCheck(this, SpTabs);

    this.restrict = 'EA';
    this.transclude = true;
    this.replace = true;
    this.template = '\n      <div class="tabs">\n        <ul class="tab-head">\n          <li ng-repeat="pane in panes" ng-click="select(pane)" ng-class="{active:pane.selected}">\n            {{pane.title}}\n          </li>\n        </ul>\n        <div class="tab-content" ng-transclude></div>\n      </div>\n    ';
  }

  _createClass(SpTabs, [{
    key: 'controller',
    value: function controller($scope, $element) {
      var panes = $scope.panes = [];

      $scope.select = function (pane) {
        angular.forEach(panes, function (pane) {
          pane.selected = false;
        });
        pane.selected = true;
      };

      this.addPane = function (pane) {
        if (panes.length == 0 || pane.selected) $scope.select(pane);
        panes.push(pane);
      };
    }
  }]);

  return SpTabs;
})();

exports.SpTabs = SpTabs;

var SpTabPane = (function () {
  function SpTabPane() {
    _classCallCheck(this, SpTabPane);

    this.restrict = 'EA';
    this.transclude = true;
    this.replace = true;
    this.require = '^sp-tabs';
    this.scope = {
      title: '@',
      selected: '@',
      id: '@'
    };
    this.template = '\n      <div class="tab-pane" ng-class="{active: selected}" ng-transclude>\n      </div>\n    ';
  }

  _createClass(SpTabPane, [{
    key: 'link',
    value: function link(scope, element, attrs, spTabsController) {
      if (!scope.id) {
        scope.id = scope.title;
      }
      spTabsController.addPane(scope);
    }
  }]);

  return SpTabPane;
})();

exports.SpTabPane = SpTabPane;

var SpSessions = (function () {
  function SpSessions(config) {
    _classCallCheck(this, SpSessions);

    this.restrict = 'EA';
    this.scope = {
      sessions: '=',
      activeSessionKey: '=?bind',
      activeSort: '=?bind',
      mode: '@',
      onSessionSelected: '&',
      drillKey: '='
    };
    this.templateUrl = config.templateBasePath + 'directives/sessions.html';
  }

  _createClass(SpSessions, [{
    key: 'controller',
    value: function controller($scope, $state, $rootScope, config, ngDialog, gettextCatalog) {
      $scope.isDemo = $rootScope.user.isDemo;
      $scope.actions = [{ text: gettextCatalog.getString('Edit'), value: 'edit' }, { text: gettextCatalog.getString('Delete'), value: 'delete' }];

      $scope.activeSort = {
        name: 'name',
        rev: true
      };

      $scope.loadingAction = false;
      $scope.onItemClick = function ($event, session) {
        if ($scope.mode != 'chooser') {
          return;
        }

        $scope.activeSessionKey = session.key;
        var q = $scope.onSessionSelected({
          session: session
        });

        if (q.then) {
          $scope.loadingAction = true;
          q.then(function () {
            $scope.loadingAction = false;
          });
        }
      };

      $scope.doAction = function (selected, session, index) {
        if (selected.value == 'edit') {
          $state.go('app.session', { sessionkey: session.key });
        } else if (selected.value == 'delete') {
          var deleteTitleText = gettextCatalog.getString('Are you sure you want to delete?');
          var cancelText = gettextCatalog.getString('Cancel');
          var deleteText = gettextCatalog.getString('Delete');

          ngDialog.open({
            template: '\n              <br/>\n              <p>' + deleteTitleText + '</p>\n              <br/>\n              <div class="ngdialog-buttons">\n                  <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">' + cancelText + '</button>\n                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirmDelete(1)">' + deleteText + '</button>\n              </div>',
            plain: true,
            showClose: false,
            scope: $scope,
            controller: function controller($scope) {
              $scope.confirmDelete = function (confirm) {
                $scope.loadingAction = true;
                var delSesionKey = session.key;
                config.dataProvider.deleteSession(session).then(function () {
                  $scope.loadingAction = false;
                  var i = 0;
                  for (var key in $scope.sessions) {
                    if ($scope.sessions[key].key == delSesionKey) {
                      // console.log(index, i, $scope.sessions[key].key+" == "+delSesionKey)
                      $scope.sessions.splice(i, 1);
                      break;
                    }
                    i++;
                  }
                });
                $scope.closeThisDialog(0);
              };
            }
          });
        }
      };

      $scope.newSession = function () {
        var passValue = {};
        if ($scope.drillKey) {
          passValue.drillkey = $scope.drillKey;
        }
        $state.go('app.session', { sessionkey: 'new', passValue: passValue });
      };

      $scope.selectedAction = {};
    }
  }]);

  return SpSessions;
})();

exports.SpSessions = SpSessions;

var SpDrills = (function () {
  function SpDrills(config) {
    _classCallCheck(this, SpDrills);

    this.restrict = 'EA';
    this.scope = {
      drills: '=',
      addedDrills: '=',
      sessionKey: '=',
      activeDrillKey: '=?bind',
      activeSort: '=?bind',
      mode: '@',
      onDrillSelected: '&',
      onDrillsAdd: '&'
    };
    this.templateUrl = config.templateBasePath + 'directives/drills.html';
  }

  _createClass(SpDrills, [{
    key: 'controller',
    value: function controller($scope, $state, $rootScope, config, gettextCatalog, ngDialog) {

      $scope.post = {
        started: false,
        error: null
      };

      $scope.activeSort = {
        name: 'name',
        rev: true
      };

      $scope.ts = moment().unix();
      $scope.isDemo = $rootScope.user.isDemo;
      $scope.actions = [{ text: gettextCatalog.getString('Print'), value: 'view' }, { text: gettextCatalog.getString('Editor'), value: 'edit' }, { text: gettextCatalog.getString('Share'), value: 'share' }, { text: gettextCatalog.getString('Copy'), value: 'copy' }, { text: gettextCatalog.getString('Add to Session'), value: 'tosession' }, { text: gettextCatalog.getString('Delete'), value: 'delete' }];
      $scope.loadingAction = false;

      $scope.addDrills = function () {
        $scope.post.started = true;
        var q = $scope.onDrillsAdd();

        if (q.then) {
          $scope.post.started = false;
          $scope.loadingAction = true;
          q.then(function () {
            $scope.loadingAction = false;
          });
        }
      };

      $scope.onSelect = function (drill) {
        if ($scope.mode == 'chooser') {
          return;
        }
        $state.go('app.drilleditor', { drillkey: drill.key });
      };

      $scope.onItemClick = function ($event, drill) {
        if ($scope.mode != 'chooser') {
          return;
        }

        if (drill.selected) {
          drill.selected = false;
          $scope.activeDrillKey = null;
          $scope.addedDrills.splice($scope.addedDrills.indexOf(drill.key), 1);
        } else {
          drill.selected = true;
          $scope.activeDrillKey = drill.key;
          $scope.addedDrills.push(drill.key);
        }
      };

      $scope.doAction = function (selected, drill, index) {
        if (selected.value == 'edit') {
          $state.go('app.drilleditor', { drillkey: drill.key });
        } else if (selected.value == 'delete') {
          var deleteTitleText = gettextCatalog.getString('Are you sure you want to delete?');
          var cancelText = gettextCatalog.getString('Cancel');
          var deleteText = gettextCatalog.getString('Delete');

          ngDialog.open({
            template: '\n              <br/>\n              <p>' + deleteTitleText + '</p>\n              <br/>\n              <div class="ngdialog-buttons">\n                  <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">' + cancelText + '</button>\n                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirmDelete(1)">' + deleteText + '</button>\n              </div>',
            plain: true,
            showClose: false,
            scope: $scope,
            controller: function controller($scope) {
              $scope.confirmDelete = function (confirm) {
                $scope.loadingAction = true;
                var delDrillKey = drill.key;
                config.dataProvider.deleteDrill(drill.sessionkey, drill).then(function () {
                  $scope.loadingAction = false;
                  // $scope.drills.splice(index, 1);
                  var i = 0;
                  for (var key in $scope.drills) {
                    if ($scope.drills[key].key == delDrillKey) {
                      // console.log(index, i, $scope.sessions[key].key+" == "+delSesionKey)
                      $scope.drills.splice(i, 1);
                      break;
                    }
                    i++;
                  }
                });
                $scope.closeThisDialog(0);
              };
            }
          });
        } else if (selected.value == 'tosession') {
          $state.go('app.chooser', { sessionkey: drill.sessionkey, drillkey: drill.key,
            mode: 'session',
            callback: 'home' });
        } else if (selected.value == 'share') {
          ngDialog.open({
            template: config.templateBasePath + 'share.html',
            showClose: true,
            controller: function controller($scope, $window) {
              $scope.showSessionShare = false;
              $scope.shareUrl = $state.href('app.drillshare', { drillkey: drill.key, sharekey: drill.shareToken }, { absolute: true });
            }
          });
        } else if (selected.value == 'view') {
          $state.go('app.drillprint', { 'drillkey': drill.key });
        } else if (selected.value == 'copy') {
          config.dataProvider.copyDrill(drill.key).then(function (data) {
            if (data.data.ok) {
              $scope.drills.push(data.data.drill);
            }
          }, function (err) {
            //console.log('Error in copying drill', err)
          });
        }
      };

      $scope.selectedAction = {};

      $scope.newDrill = function () {
        var passValue = {};
        if ($scope.sessionKey) {
          passValue.sessionkey = $scope.sessionKey;
        }
        $state.go('app.drilleditor', { drillkey: 'new', passValue: passValue });
      };

      $scope.editdrill = function (drill, indx) {
        $scope.editMode = true;
        $scope.activeDrillKey = drill.drillkey;
        $scope.activeDrillIndex = drill.orderIndex;
        $scope.activeIndex = indx;
      };

      $scope.updateDrill = function (drill) {
        $scope.post.started = true;
        var postData = {
          key: drill.key,
          name: drill.name,
          setupText: drill.setupText,
          instructText: drill.instructText,
          coachText: drill.coachText,
          pitch: drill.pitch,
          duration: drill.duration
        };

        config.dataProvider.saveDrill(postData).then(function (data) {
          $scope.editMode = false;
          $scope.post.started = false;
        }, function (err) {});
      };
    }
  }]);

  return SpDrills;
})();

exports.SpDrills = SpDrills;

var SpSessionDrills = (function () {
  function SpSessionDrills(config) {
    _classCallCheck(this, SpSessionDrills);

    this.restrict = 'EA';
    this.scope = {
      drills: '=',
      sessionKey: '=',
      activeDrillKey: '=?bind',
      activeDrillIndex: '=?bind',
      activeSort: '=?bind',
      isPrintView: '=',
      mode: '@',
      isShareMode: '=',
      showList: '=',
      onDrillSelected: '&',
      showBlack: "="
    };
    this.templateUrl = config.templateBasePath + 'directives/sessiondrills.html';
  }

  _createClass(SpSessionDrills, [{
    key: 'controller',
    value: function controller($scope, $state, config, gettextCatalog, ngDialog) {

      if ($scope.isShareMode) {
        $scope.drillSelect = "drillprint";
      } else {
        $scope.drillSelect = "drilleditor";
      }

      $scope.ts = moment().unix();
      $scope.actions = [{ text: gettextCatalog.getString('Print'), value: 'view' }, { text: gettextCatalog.getString('Edit'), value: 'edit' }, { text: gettextCatalog.getString('Share'), value: 'share' }, { text: gettextCatalog.getString('Copy'), value: 'copy' }, { text: gettextCatalog.getString('Remove from session'), value: 'remove' }];
      $scope.loadingAction = false;
      $scope.editMode = false;

      $scope.post = {
        started: false,
        error: null
      };

      $scope.onDrillMved = function (val, changedIdx) {
        if ($scope.isShareMode) {
          return;
        }
        for (var i = 0; i < val.length; i++) {
          // console.log(val[i].orderIndex, val.length, changedIdx);
          val[i].orderIndex = i + 1;
          // console.log(val[i].orderIndex, val);
          $scope.updateDrillOnChg(val[i]);
        };
      };

      $scope.onItemClick = function ($event, drill) {};

      $scope.doAction = function (selected, drill, index) {
        $scope.activeDrillKey = drill.drillkey;
        if (selected.value == 'edit') {
          var passValue = {
            sessionkey: $scope.sessionKey
          };
          $state.go('app.drilleditor', { 'drillkey': drill.drill.key, passValue: passValue });
        } else if (selected.value == 'remove') {
          var deleteTitleText = gettextCatalog.getString('Are you sure you want to remove this drill from the session?');
          var cancelText = gettextCatalog.getString('Cancel');
          var deleteText = gettextCatalog.getString('Remove');

          ngDialog.open({
            template: '\n              <br/>\n              <p>' + deleteTitleText + '</p>\n              <br/>\n              <div class="ngdialog-buttons">\n                  <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">' + cancelText + '</button>\n                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirmDelete(1)">' + deleteText + '</button>\n              </div>',
            plain: true,
            showClose: false,
            scope: $scope,
            controller: function controller($scope) {
              $scope.confirmDelete = function (confirm) {
                $scope.loadingAction = true;
                drill.key = drill.drillkey;
                config.dataProvider.deleteDrill(drill.sessionkey, drill).then(function () {
                  $scope.loadingAction = false;
                  $scope.drills.splice(index, 1);
                });
                $scope.closeThisDialog(0);
              };
            }
          });
        } else if (selected.value == 'tosession') {
          $state.go('app.chooser', { sessionkey: drill.sessionkey, drillkey: drill.key,
            mode: 'session',
            callback: 'app.library' });
        } else if (selected.value == 'share') {
          ngDialog.open({
            template: config.templateBasePath + 'share.html',
            showClose: true,
            controller: function controller($scope, $window) {
              $scope.showSessionShare = false;
              $scope.shareUrl = $state.href('app.drillshare', { drillkey: drill.drill.key, sharekey: drill.drill.shareToken }, { absolute: true });
            }
          });
        } else if (selected.value == 'view') {
          $state.go('app.drillprint', { 'drillkey': drill.drill.key });
        } else if (selected.value == 'copy') {
          config.dataProvider.copyDrill(drill.drill.key).then(function (data) {
            if (data.data.ok) {
              config.dataProvider.attachDrill(drill.sessionkey, data.data.drill.key).then(function () {
                var newDrill = data.data.drill;
                var drillParams = {
                  key: newDrill.key,
                  drillKey: newDrill.key,
                  name: newDrill.name,
                  setupText: newDrill.setupText,
                  coachText: newDrill.coachText,
                  instructText: newDrill.instructText,

                  orderIndex: drill.orderIndex,
                  pitch: drill.pitch,
                  duration: drill.duration
                };
                config.dataProvider.saveSessionDrill(drill.sessionkey, drillParams).then(function () {
                  $scope.post = false;
                  var newSessionDrill = angular.copy(drill);
                  newSessionDrill.drill = newDrill;
                  $scope.drills.push(newSessionDrill);
                  // console.log("Session Drill Saved");
                });

                resolve();
              }, function () {
                reject();
              });
            }
          }, function (err) {
            //console.log('Error in copying drill', err)
          });
        }
      };

      $scope.newDrill = function () {
        var passValue = {
          sessionkey: $scope.sessionKey
        };
        $state.go('app.drilleditor', { drillkey: 'new', passValue: passValue });
      };

      $scope.drillEdit = function (drill) {
        if (!$scope.isShareMode) {
          var passValue = {
            sessionkey: $scope.sessionKey
          };
          $state.go('app.drilleditor', { 'drillkey': drill.drill.key, passValue: passValue });
        }
      };

      $scope.editsessiondrill = function (drill, indx) {
        $scope.editMode = true;
        $scope.activeDrillKey = drill.drillkey;
        $scope.activeDrillIndex = drill.orderIndex;
        $scope.activeIndex = indx;
      };

      $scope.updateDrillOnChg = function (drill) {
        var drillParams = {
          key: drill.drillkey,
          drillKey: drill.drillkey,
          name: drill.drill.name,
          setupText: drill.drill.setupText,
          coachText: drill.drill.coachText,
          instructText: drill.drill.instructText,

          orderIndex: drill.orderIndex,
          pitch: drill.pitch,
          duration: drill.duration
        };
        config.dataProvider.saveSessionDrill(drill.sessionkey, drillParams).then(function () {
          $scope.post = false;
          // console.log("Session Drill Saved");
        });
      };

      $scope.updateAlSessionDrills = function () {

        for (var i = 0; i < $scope.drills.length; i++) {
          var drill = $scope.drills[i];
          $scope.updateDrillOnChg(drill);
        };
      };

      $scope.updateSessiondrill = function (drill, indx) {
        $scope.post = true;

        $scope.editMode = false;
        $scope.activeDrillKey = drill.drillkey;
        $scope.activeDrillIndex = drill.orderIndex;
        $scope.activeIndex = null;
        var tmpDrills = $scope.drills;

        // console.log(indx, drillParams.orderIndex, drill, tmpDrills);
        var tmpDrillDate = tmpDrills[indx];
        tmpDrills.splice(indx, 1);
        tmpDrills.splice(drill.orderIndex - 1, 0, tmpDrillDate);
        for (var i = 0; i < tmpDrills.length; i++) {
          tmpDrills[i].orderIndex = i + 1;
        };
        $scope.updateAlSessionDrills();
      };

      $scope.selectedAction = {};
    }
  }]);

  return SpSessionDrills;
})();

exports.SpSessionDrills = SpSessionDrills;

function Draggable() {
  return function (scope, element, attrs) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener('dragstart', function (e) {
      Utils.fixEventObject(e, this);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('_sp_offsetX', e._sp_offsetX);
      e.dataTransfer.setData('_sp_offsetY', e._sp_offsetY);
      e.dataTransfer.setData('ref', attrs.spData);
      this.classList.add('drag');
      return false;
    }, false);

    el.addEventListener('dragend', function (e) {
      this.classList.remove('drag');
      return false;
    }, false);
  };
}

function Droppable() {
  return {
    scope: {
      drop: '&',
      bin: '='
    },
    link: function link(scope, element) {
      // again we need the native object
      var el = element[0];

      el.addEventListener('dragover', function (e) {
        e.dataTransfer.dropEffect = 'move';
        // allows us to drop
        if (e.preventDefault) e.preventDefault();
        this.classList.add('over');
        return false;
      }, false);

      el.addEventListener('dragenter', function (e) {
        this.classList.add('over');
        return false;
      }, false);

      el.addEventListener('dragleave', function (e) {
        this.classList.remove('over');
        return false;
      }, false);

      el.addEventListener('drop', function (e) {
        // Stops some browsers from redirecting.
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        this.classList.remove('over');

        var ref = e.dataTransfer.getData('ref');
        // var binId = this.id;
        //
        // var item = document.getElementById(e.dataTransfer.getData('ref'));
        // this.appendChild(item);

        // call the passed drop function
        scope.$apply(function (scope) {
          var fn = scope.drop();
          if ('undefined' !== typeof fn) {
            fn(ref, e, e.dataTransfer.getData('_sp_offsetX'), e.dataTransfer.getData('_sp_offsetY'));
          }
        });

        return false;
      }, false);
    }
  };
}

var Draggable;
exports.Draggable = Draggable;
var Droppable;
exports.Droppable = Droppable;

},{"../editor/utils.js":13}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Asserts = {};

Asserts.sp_svg_player_to_left = "<g id=\"sp_svg_player_to_left\" sp-width=\"27\" sp-height=\"33\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 14.25 21.6 L 14.15 21.6 13.95 21.75 13.7 22 13.35 22.15 13.1 22.3 13.05 22.3 12.8 22.4 12.55 22.6 12.55 22.55 12.35 22.7 12.2 22.85 12.25 22.9 12.3 23 12.25 23 12.3 23.1 12.4 23.25 12.4 23.2 12.55 23.6 12.55 23.65 12.65 24.05 12.85 24.4 12.8 24.4 12.9 24.45 12.95 24.7 12.95 24.95 13.05 25.45 13.05 25.8 13.1 25.8 13.05 25.85 13.1 25.85 13.15 28.45 14.35 29.25 19.7 31.5 19.3 32.85 19.3 33.05 20.05 33.35 20.7 33.25 20.9 33.1 21.05 32.95 21.25 32.85 21.2 32.65 21.3 32.25 21.8 31 21.8 30.9 19.4 29.75 17.4 28.45 16.15 28.15 16.1 27.7 Q 16.15 27.5 16.45 27.6 L 16.9 27.05 16.85 26.4 Q 16.5 26.15 16.45 25.75 L 16.25 24.95 Q 15.95 23.85 14.55 23 L 15.9 22.35 15.7 22 15.75 22.05 15.75 22 15.7 21.9 15.75 21.85 15.7 21.8 15.7 21.75 15.75 21.75 15.7 21.65 15.75 21.15 15.55 21 14.95 21.5 14.8 21.65 14.55 21.7 14.25 21.6 M 6.9 16.5 L 6.55 16.35 6.15 16.35 5.85 16.15 5.8 16.05 5.75 16.05 Q 4.7 15.8 3.05 16.4 L 2 16.9 1.55 17.3 2.45 17.75 3.75 19.25 4.5 19.8 3.85 20.3 3.7 20.5 3.85 21 5.3 22.4 5.25 22.55 3.45 22.85 3.3 22.9 1.15 22.75 Q -0.85 22.9 0.7 24.05 L 1.65 24.2 3.9 23.8 4.85 23.95 6.8 23.65 8.25 23.85 8.25 24 6.9 24.9 5.7 26.55 5 27.25 5 27.7 5.4 28.25 8.55 31.2 7.9 31.85 6.7 32.75 Q 6.4 33.1 7.2 33.25 L 9.35 33.1 9.05 33 9.1 33 8.8 32.75 8.6 32.5 8.6 32.3 9.15 31.65 10.05 30.8 10.25 30.45 10.3 30.4 10.25 30.2 9.3 28.55 8.95 28.2 8.75 28.05 10.3 27.35 10.25 27.3 10 26.5 9.4 25.15 9.4 25 9.35 24.9 9.35 24.8 8.9 23.1 8.8 22.9 8.8 22.5 9.05 21.7 9.1 21.75 9.75 20.95 10.2 20.2 10.15 20.2 10.6 19.5 10.8 19.1 10.25 19.05 8.3 19.05 8 18.85 Q 7.8 18.7 7.95 18.6 L 8.45 18.55 9.2 18.1 9.3 17.6 Q 9.15 17.3 8.45 17.3 L 7.85 17.1 6.9 16.5 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 20.4 9.05 L 20.35 9.1 19.8 8.5 19.8 8.45 19.65 8.4 19.5 8.25 19.35 8.05 19.15 7.85 18.15 7 17.9 6.9 17.65 6.85 15.6 6.9 15.2 6.8 15.15 6.8 15.05 6.25 15 6.3 14.95 6.05 14.95 5.95 15 6 15.1 5.9 15.1 5.95 15.35 5.95 15.5 5.9 15.9 5.65 16.4 5.1 16.4 4.85 16.35 4.85 16.4 4.75 16.45 4.8 16.5 4.7 16.6 4.55 16.65 4.4 16.6 4.15 16.7 3.95 Q 16.7 3.6 16.35 3.6 L 15.95 3.6 15.85 3.55 15.8 3.55 15.8 3.5 15.75 3.5 15.4 3.2 15.45 3.15 15.55 3.1 15.55 2.85 15.1 2.45 14.65 2.2 14.6 2.1 14.5 2.05 14.5 2 13.8 1.75 13.85 1.7 13.9 1.55 13.85 1.35 13.65 1.25 13.4 1.25 12.8 1.45 12.75 1.4 11.95 1.75 11.85 1.65 11.75 1.6 11.25 1.6 10.85 1.9 10.85 1.85 10.8 1.95 10.8 1.9 10.35 2.55 10.05 2.35 9.8 2.35 9.55 2.7 9.55 3.15 9.45 3.3 9.2 3.35 9.15 3.45 9.15 3.4 9.05 3.6 9.8 4.45 10.05 4.45 10.05 4.55 10 4.75 10 5.1 9.95 5.5 10.25 5.9 10.25 5.95 10.3 5.95 10.35 6.1 10.3 6.1 10.3 6.55 10.55 7.15 10.55 7.1 10.6 7.2 11.1 8.05 11.1 8 11.2 8.3 11.1 8.35 10.4 9.1 10.4 9.05 10.35 9.15 10.3 9.1 10.25 9.3 10.1 9.45 10.15 9.5 10.05 9.9 10.05 10.55 10.3 11.7 10.6 12.2 10.7 12.5 10.9 12.8 Q 10.7 13 10.75 13.15 L 10.8 13.2 10.9 13.35 10.35 13.5 10.35 13.55 9.6 13.7 9 13.95 9 13.9 8.8 14.05 7.95 13.8 7.9 13.8 7.7 13.75 7.45 13.75 7.2 13.7 6.75 13.7 6.55 13.8 6.3 13.85 Q 6.25 14.1 5.6 14.3 L 5.45 14.5 Q 5.35 14.55 5.4 14.65 L 5.4 15.05 5.8 16.05 5.85 16.15 6.15 16.35 6.55 16.35 7.15 16.15 7.55 15.95 7.75 15.8 8.4 16.2 8.95 16.2 9.55 16 Q 9.55 15.9 9.7 15.9 L 9.85 15.95 9.95 15.9 10 15.95 11.15 15.75 11.25 15.65 11.3 15.7 12.05 15.4 12.05 15.45 12.1 15.4 12.1 15.45 12.6 15.25 12.6 15.3 12.8 15.2 12.8 15.25 Q 12.8041015625 15.0994140625 13.2 15.05 L 13.3 15.15 13.3 15.3 Q 13.2 15.55 13.35 15.65 L 13.45 15.85 13.35 16 12.25 16.95 Q 12 17 11.85 17.2 L 11.85 17.4 11.9 17.55 11.7 17.65 11.7 17.6 11.15 17.75 10.8 18.1 10.8 18.5 10.9 18.6 11.05 18.7 11.05 18.75 11 18.85 10.8 19.1 10.6 19.5 10.15 20.2 10.2 20.2 9.75 20.95 9.1 21.75 9.05 21.7 8.8 22.5 8.8 22.9 8.9 23.1 9.35 24.8 9.35 24.9 9.4 25 9.4 25.15 10 26.5 10.25 27.3 10.3 27.35 10.4 27.55 11 28.95 11.1 29.25 10.3 30.4 10.25 30.45 10.05 30.8 9.15 31.65 8.6 32.3 8.6 32.5 8.8 32.75 9.1 33 9.05 33 9.35 33.1 9.45 33.15 9.5 33.1 9.6 33.15 9.75 33.2 10.2 33.1 Q 10.15 33.05 10.5 32.95 L 11.1 32.65 11.4 32.55 11.6 32.4 11.65 32.45 11.95 32.15 12.05 32.2 12.25 32.15 12.45 32 12.4 32 13.3 31.55 13.25 31.55 13.8 31 14 30.3 13.7 29.5 13.65 29.55 13.6 29.45 13.55 29.4 13.55 29.35 13.4 29.25 13.35 29.2 13.35 29.15 13.3 29.15 13.25 29.1 13.2 29.1 13.15 28.45 13.1 25.85 13.05 25.85 13.1 25.8 13.05 25.8 13.05 25.45 12.95 24.95 12.95 24.7 12.9 24.45 12.8 24.4 12.85 24.4 12.65 24.05 12.55 23.65 12.55 23.6 12.4 23.2 12.4 23.25 12.3 23.1 12.25 23 12.3 23 12.25 22.9 12.2 22.85 12.35 22.7 12.55 22.55 12.55 22.6 12.8 22.4 13.05 22.3 13.1 22.3 13.35 22.15 13.7 22 13.95 21.75 14.15 21.6 14.25 21.6 14.55 21.7 14.8 21.65 14.95 21.5 15.55 21 15.6 20.95 15.7 20.9 15.8 20.9 15.8 20.95 15.75 21.15 15.7 21.65 15.75 21.75 15.7 21.75 15.7 21.8 15.75 21.85 15.7 21.9 15.75 22 15.75 22.05 15.7 22 15.9 22.35 16 22.4 16.25 22.4 16.5 23.75 16.75 24.5 16.9 25.15 17.1 25.45 17.35 25.6 17.65 25.7 17.95 25.9 17.95 25.95 18.25 26.1 18.4 26.25 18.55 26.35 18.55 26.4 18.7 26.5 18.95 26.8 20.25 28.05 20.45 28.2 20.45 28.25 21.05 28.75 21.05 28.7 21.5 29.2 21.7 29.3 21.85 29.5 22.05 29.6 22.2 29.8 22.05 30.35 21.8 30.9 21.8 31 21.3 32.25 21.2 32.65 21.25 32.85 21.45 33.05 21.9 33.2 22.65 32.9 22.7 32.95 22.7 32.9 23.05 32.5 23.4 32.25 24.45 31.15 25.4 29.55 Q 25.4 29.25 25 28.85 24.6 28.4 24.25 28.4 L 24.2 28.4 24.2 28.35 24.1 28.35 22.55 26.8 22.2 26.2 21.35 24.6 21.35 24.65 20.9 24.2 20.1 23.8 20.05 23.8 19.8 23.6 19.95 23.3 20 22.95 20 22.7 20.05 22.75 20.05 22.55 20.1 22.45 20.3 22.6 20.75 22.15 20.95 21.6 20.95 21.3 20.9 21.25 20.9 21.2 20.8 21.05 20.95 20.9 21 20.9 21.05 20.7 21.15 20.5 20.7 19.45 20.7 19.3 20.85 18.7 21.05 18.25 21.05 18.2 21.45 17.6 21.45 17.1 21.25 16.8 21.2 16.45 20.8 15.8 20.7 15.8 20.65 15.7 20.45 15.55 20.25 15.25 20.25 15.3 20.2 15.25 20.35 15.1 20.35 14.8 20.2 14.6 20.1 14.4 20.1 14.3 20.05 14.15 21.2 13.35 21.45 13.05 21.95 12.6 21.9 12.6 22 12.5 22.1 12.35 22.15 12.25 22.2 11.95 22.2 11.65 22.1 11.1 21.8 10.65 20.4 9.1 20.4 9.05 M 21.25 10.8 L 21.3 10.8 21.7 11.7 21.45 12.4 21.4 12.35 21.35 12.5 21.25 12.55 21.1 12.65 20.9 12.85 20.85 12.85 20.85 12.9 20.35 13.3 20.35 13.25 19.35 14 19.35 14.05 19.25 14.05 19.2 14.1 19.2 14.15 18.5 14.7 18.5 14.6 18.45 14.4 18.35 14.15 18.35 14.2 17.5 13.45 17.95 13.15 17.95 13.1 18.05 13.05 18.1 13.05 18.1 13 18.15 12.95 18.5 12.65 Q 18.85 12.35 18.95 12.35 L 19.5 12.75 19.5 12.7 19.55 12.75 19.7 12.8 19.8 12.85 20 12.65 19.85 12.35 19.65 12.05 19.85 12.05 20.15 12.1 20.35 12.05 20.4 12.05 20.65 12.1 20.85 11.9 20.75 11.75 20.6 11.6 20.15 11.5 20.1 11.55 19.9 11.5 19.6 11.5 19.4 11.4 18.9 10.85 18.5 10.55 18.45 10.55 17.95 9.75 17.95 9.8 17.75 9.7 17.55 9.9 17.65 10.2 17.3 10.1 17.1 10.1 17 10.2 17 10.45 17.05 10.4 17.1 10.5 17.15 10.55 17.25 10.55 17.5 10.65 17.55 10.6 18.3 11 18.7 11.3 18.6 11.45 18.6 11.65 18.65 11.75 18.6 11.95 18.45 12.05 18.4 12.05 17.8 12.55 17.75 12.6 17.2 13.05 17.15 13 17.15 13.1 17.1 13.05 17.1 13.1 16.6 13.5 15.35 14.05 15.35 14.1 15.25 14.1 14.8 14.6 14.75 14.6 14.3 15.25 14.25 15.3 14.2 15.3 14.2 15.25 14 15.7 13.95 15.7 13.85 15.55 13.85 15.3 13.5 14.45 13.3 14.2 13.1 13.8 13.05 13.8 13 13.65 12.9 13.55 12.9 13.45 12.85 13.5 12.75 13.1 Q 12.45 12.8 12.45 12.5 L 12.35 12.4 12.3 12.45 12.25 12.15 12.2 12.2 12 11.7 11.55 11.35 Q 11.25 11.35 11.3 11.55 L 11.7 12.3 11.85 12.5 11.95 12.75 11.95 12.85 11.3 12.4 11.3 12.45 11.2 12.35 11.2 12.05 Q 10.85 11.8 10.85 11.6 L 10.8 11.6 10.5 10.8 10.5 10.65 10.45 10.45 10.5 10.05 10.65 9.55 10.95 9.1 11.05 9 11.1 9 11.1 8.95 11.2 8.95 Q 11.15 8.85 11.45 8.7 L 11.45 8.8 11.5 8.8 11.75 8.95 12.05 9.05 12.05 9 12.15 9.05 12.45 9.05 12.45 9 12.55 9 12.5 9.2 12.95 9.8 13.6 10.1 13.8 10 13.95 10.1 14.05 10.2 14.2 10.15 14.3 10.05 14.95 9.05 15 9.1 15.75 7.45 17.45 7.45 17.55 7.4 17.75 7.45 18.75 8.25 20.05 9.55 20.05 9.5 21.15 10.75 21.2 10.75 21.25 10.8 M 20.25 16.05 Q 20.85 16.8 20.85 17.3 L 20.05 19.25 20.1 19.25 20.1 19.3 20.2 19.75 20.4 20.15 19.9 19.75 19.25 19.45 19.15 19.5 19.1 19.65 19.25 19.9 19.45 20.05 19.5 20.05 20.15 20.55 19.9 20.5 19.75 20.45 19.65 20.5 19.05 20.4 18.75 20.4 18.35 20.5 18.3 20.45 18.25 20.5 Q 17.95 20.5 17.95 20.65 L 17.95 20.8 18.05 20.85 18.55 20.85 18.8 20.9 19.1 20.9 20.2 21.05 20.3 21.35 20.2 21.7 20 21.6 19.8 21.6 18.35 21.4 17.95 21.4 17.15 21.6 17.1 21.6 16.9 21.65 16.9 21.7 16.4 21.85 16.3 21.8 16.3 21.5 16.4 21 16.4 20.05 16.35 19.95 16.35 19.55 16.25 19.35 16.1 19.25 15.9 19.25 15.65 18.9 15.5 18.8 15.3 18.7 15.3 18.75 15.2 18.75 15.2 18.7 15.05 18.8 15.05 18.95 15.15 19.15 15.25 19.3 15.3 19.3 15.5 19.7 15.55 19.7 15.75 20.15 15.15 20.7 14.5 21.1 14.1 20.45 13.85 20.2 13.85 20.15 13.8 20.1 13.75 20.1 13.6 19.85 12.7 19 11.55 18.35 11.55 18.25 Q 11.8 18.1 12.2 18 L 12.5 18.2 12.65 18.15 12.8 18.05 12.8 18.1 13 17.9 13.1 17.75 13 17.6 12.8 17.4 12.8 17.45 12.7 17.35 13.35 16.9 13.75 16.35 13.8 16.35 13.8 16.25 13.9 16.25 14.1 16.55 14.15 16.65 14.6 16.95 15 16.95 15 16.9 15.05 16.95 15.4 16.8 15.8 16.75 16.1 16.8 16.9 16.4 16.9 16.35 17.05 16.2 17.25 16.1 17.45 16.15 17.7 16.1 18.5 16.15 18.75 16.1 18.75 16.05 19.1 16 19.85 15.6 20.25 16.05 M 15.7 4.25 L 15.75 4.4 15.85 4.55 15.7 4.8 15.65 4.8 15.5 4.75 15.5 4.8 15.35 4.8 15 4.85 14.8 4.85 14.6 4.65 14.4 4.55 14.4 4.6 13.7 4.4 13.6 4.4 13.65 4.35 13.4 4.25 13.4 4.3 13.1 4.05 13.05 4.1 12.3 3.8 12.25 3.85 12.25 3.65 12.3 3.6 12.35 3.65 12.35 3.6 12.8 3.55 13.15 3.55 13.2 3.6 14.15 3.65 14.3 3.5 14.2 3.35 14 3.25 12.8 3.15 12.65 3.15 12.45 3.2 12.4 3.2 11.85 3.35 11.75 3.4 11.75 3.65 11.7 3.6 11.2 3.75 11.1 3.85 10.35 4.1 9.9 4 9.7 3.8 10.15 3.25 10.15 3.05 10.1 3.05 10.1 2.95 10.4 3.05 10.7 3.05 10.85 2.85 10.95 2.6 11.4 2.1 11.75 2.35 12.05 2.3 12.25 2.2 12.6 1.95 13.1 1.85 13.2 2.1 13.3 2.25 13.7 2.25 13.85 2.4 13.9 2.4 13.95 2.35 14.7 2.8 14.55 2.95 14.55 3.15 15.3 3.85 15.75 4.15 15.7 4.25 M 15.3 5.4 L 15.3 5.35 15.25 5.4 15.25 5.25 15.6 5.15 15.65 5.2 15.45 5.4 15.25 5.5 15.3 5.4 M 11.8 4.1 L 11.95 4.15 12.05 4.25 12.05 4.2 12.35 4.3 12.35 4.25 14.35 5.3 14.35 5.55 14.55 5.7 14.45 5.75 14.4 5.75 14.2 5.95 14.2 6 14.25 6 14.2 6.05 14.25 6.15 14.3 6.3 14.15 7.1 13.8 7.65 13.15 8.3 13.15 8.25 12.8 8.55 12.35 8.55 12.1 8.6 11.95 8.55 11.85 8.4 11.6 7.75 11.8 7.85 12.4 7.75 12.75 7.35 12.6 7.1 12.6 7.15 12.5 7.1 12.45 7.1 12.45 7.15 12.4 7.1 12.35 7.1 12 7.2 11.6 7.25 11.55 7.25 11.4 7.35 11.35 7.35 11.2 7.15 11.2 7.1 11.4 7.1 11.6 7.05 11.9 6.8 11.8 6.65 11.65 6.55 11.35 6.55 11.4 6.3 11.4 5.85 11.05 5.5 10.55 5.4 10.55 4.45 11.1 4.45 11.8 4.1 M 14.8 7.35 L 14.75 7.6 14.75 7.7 14.55 8.1 14.55 8.05 14.15 8.65 13.6 9.2 13.5 9.1 13.45 9.15 13.2 8.9 13.45 8.65 13.65 8.55 13.7 8.55 13.75 8.5 13.75 8.45 Q 13.7 8.35 14 8.2 L 14.65 7.55 14.8 7.25 14.8 7.35 M 14.25 9.15 L 14.4 9.1 14.45 9.05 14.6 8.85 14.6 8.95 14.5 9.1 13.8 9.75 13.8 9.65 14.05 9.5 14.2 9.35 14.2 9.3 14.25 9.15 M 8.4 14.45 L 8.45 14.45 8.6 14.5 8.7 14.55 Q 8.95 14.45 9.1 14.75 L 9.25 15.25 9.2 15.6 8.95 15.65 8.55 15.65 8.35 15.5 8.15 15.4 8.15 15.45 7.45 14.85 7.35 14.85 7.4 14.75 7.8 14.85 7.75 14.85 8.15 14.95 8.4 14.85 8.45 14.65 8.45 14.55 8.4 14.45 M 9.7 14.65 L 10 15.1 10 15.3 9.85 15.4 9.8 15.4 9.7 14.65 M 6 14.9 L 5.95 14.85 Q 5.9 14.75 6.2 14.6 L 6.45 14.45 6.5 14.45 6.5 14.4 6.8 14.25 6.85 14.25 6.9 14.2 6.95 14.2 6.95 14.35 6.8 14.5 6.7 14.7 6.75 15 6.8 14.95 7.1 15.3 7.15 15.25 7.25 15.45 6.4 15.8 6.35 15.75 6.4 15.6 6.3 15.55 6.15 15.5 6.2 15.45 6.15 15.4 6.1 15.45 6.1 15.4 6.05 15.3 6 15.15 6 14.9 M 9.5 22.15 L 9.55 22.05 10.35 21.15 Q 10.65 20.4 10.85 20.25 L 10.8 20.25 11.55 19.1 11.6 19.15 11.65 19 11.7 19.05 12.5 19.55 13.2 20.2 13.2 20.3 13.05 20.5 12.95 20.5 12.95 20.6 12.9 20.6 12.85 20.65 12.85 20.7 12.6 20.95 12.3 21.35 12.35 21.45 12.5 21.5 12.8 21.35 13 21.2 13 21.15 13.15 21 13.35 20.9 13.35 20.85 13.4 20.85 13.5 20.75 13.65 20.9 13.8 21.15 13.45 21.5 12.6 21.95 12.55 21.9 12.35 22.05 12.15 22.15 11.9 22.4 11.7 22.55 11.55 22.8 11.9 23.55 11.8 23.45 11.65 23.45 11.6 23.5 11.55 23.5 11.55 23.75 11.6 24.15 11.55 24.15 11.55 24.2 11.6 24.2 11.6 24.35 11.7 24.55 11.7 24.65 11.65 24.65 11.65 24.7 11.45 24.7 11.35 24.75 11 24.75 10.9 24.8 10.85 24.75 10.8 24.8 10.2 24.8 9.95 24.75 9.7 23.95 9.75 23.95 9.65 23.8 9.65 23.65 9.6 23.5 9.65 23.5 9.85 23.4 Q 9.85 23.3 10 23.3 L 10 23.25 10.05 23 10.15 22.75 10.1 22.7 10.15 22.65 10.15 22.6 10.1 22.65 Q 10.1 22.55 9.9 22.55 L 9.7 22.7 9.6 22.9 9.55 22.95 9.6 22.95 9.5 23.2 9.4 22.9 9.4 22.6 9.5 22.15 M 18 14.7 L 18 14.75 17.95 14.8 17.45 14.05 17.8 14.35 18 14.7 M 18.85 15.05 L 18.95 15 Q 18.95 14.9 19.55 14.5 L 19.7 14.7 19.75 14.9 19.35 15.35 18.65 15.6 18.5 15.6 18.45 15.65 17.7 15.65 Q 17.8 15.55 17.95 15.55 L 18.85 15.1 18.85 15.05 M 15.95 14.4 L 16.1 14.3 16.6 14.05 17.15 14.5 17.5 15.15 17.25 15.45 17.2 15.45 17.2 15.5 17.15 15.45 16.5 16 16.5 16.05 16.45 16.05 16.4 16.1 16.2 16.1 15.6 16.25 15.45 16.2 15.25 16.25 14.8 16.25 14.7 16.35 Q 14.6 16.2 14.45 16.2 L 14.35 16.1 Q 14.3 15.85 14.7 15.5 L 15.05 15.05 15.25 14.85 Q 15.45 14.55 15.6 14.55 15.7 14.5 15.95 14.4 M 11.4 13.75 L 11.5 13.8 11.65 13.9 11.9 13.9 12 13.7 12 13.6 12.15 13.5 12.25 13.35 12.95 14.55 11.7 15 11.65 14.95 11.3 15.15 11 15.25 11 15.2 10.8 15.3 10.8 15.25 10.75 15.3 10.55 15.3 10.55 15.05 10.25 14.5 9.9 14.1 10.7 13.9 10.7 13.95 Q 10.70234375 13.849609375 11 13.8 L 11.3 13.75 11.4 13.75 M 16.9 22.25 L 17.35 22.15 17.35 22.1 18.1 21.95 18.4 22 Q 18.65 22 18.65 22.2 L 18.6 22.25 18.6 22.45 18.65 22.5 18.65 23.05 18.95 23.8 19.05 23.8 19.15 23.75 19.15 22.95 19.1 22.9 19.1 22.45 19.05 22.2 19.05 22.15 19.1 22.05 19.45 22.05 19.6 22.2 19.3 23.75 19.25 23.7 19.25 24 19.3 24.15 19.45 24.35 19.5 24.3 19.55 24.35 19.7 24.15 20.55 24.75 20.35 25.1 20.05 25.4 20.05 25.45 20 25.5 20 25.55 Q 19.75 25.65 19.35 26.05 L 19.15 26.1 18.4 25.45 17.7 25.1 Q 17.3 24.85 17.4 24.4 L 17.35 24.2 17.3 24.2 16.95 22.45 16.85 22.3 16.9 22.25 M 20.15 26.05 L 20.2 26.1 20.65 25.6 21 25.1 21.1 25.2 21.15 25.35 21.25 25.55 21.3 25.55 22.4 27.5 22.95 27.95 23.3 28.55 22.95 28.9 22.5 29.2 22.05 28.8 22 28.8 21.65 28.55 21.3 28.2 19.45 26.6 19.5 26.55 20.05 26.2 20.05 26.15 20.15 26.05 M 11.45 25.3 L 11.5 25.3 12.15 25.05 12.3 25.05 12.4 24.95 12.45 25.05 12.45 25.5 12.55 26 12.55 26.6 12.6 26.65 12.65 29.05 12.3 29.15 12.15 29.15 12.1 29.2 Q 11.7 29.2 11.65 29 L 11.45 28.45 11.4 28.45 11.3 28.15 11.3 28.1 11.2 27.9 11.1 27.6 11.05 27.6 10.6 26.3 10.55 26.3 10.25 25.6 10.2 25.65 10.15 25.45 10.15 25.35 10.9 25.35 11.45 25.25 11.45 25.3 M 18.3 24.4 L 18.3 24.3 18.25 24.35 18.1 24.3 Q 17.85 24.3 17.85 24.5 L 18.1 25.05 18.1 25 18.3 25.2 18.4 25.25 18.6 25.1 18.6 24.85 18.4 24.45 18.35 24.4 18.3 24.4 M 12.15 4.95 L 12.1 4.9 11.6 5.3 11.55 5.3 11.55 5.4 Q 11.5 5.6 11.85 5.65 L 12.05 5.6 12.3 5.65 12.55 5.65 12.7 5.5 12.85 5.4 13.1 5.45 13.4 5.15 13.3 5 13.05 4.9 12.7 4.85 12.55 4.85 12.15 4.95 M 15.2 4.4 L 15.25 4.4 15.4 4.3 15.45 4.15 Q 15.45 4 15.2 4 L 14.75 4.1 14.45 4.05 14.2 3.95 14 3.95 14 4 13.95 4 13.9 4.15 13.95 4.3 14.1 4.35 14.05 4.4 14.75 4.45 15.2 4.4 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 11.5 25.3 L 11.45 25.3 11.45 25.25 10.9 25.35 10.15 25.35 10.15 25.45 10.2 25.65 10.25 25.6 10.55 26.3 10.6 26.3 11.05 27.6 11.1 27.6 11.2 27.9 11.3 28.1 11.3 28.15 11.4 28.45 11.45 28.45 11.65 29 Q 11.7 29.2 12.1 29.2 L 12.15 29.15 12.3 29.15 12.65 29.05 12.6 26.65 12.55 26.6 12.55 26 12.45 25.5 12.45 25.05 12.4 24.95 12.3 25.05 12.15 25.05 11.5 25.3 M 20.2 26.1 L 20.15 26.05 20.05 26.15 20.05 26.2 19.5 26.55 19.45 26.6 21.3 28.2 21.65 28.55 22 28.8 22.05 28.8 22.5 29.2 22.95 28.9 23.3 28.55 22.95 27.95 22.4 27.5 21.3 25.55 21.25 25.55 21.15 25.35 21.1 25.2 21 25.1 20.65 25.6 20.2 26.1 M 11.5 13.8 L 11.4 13.75 11.3 13.75 11 13.8 Q 10.70234375 13.849609375 10.7 13.95 L 10.7 13.9 9.9 14.1 10.25 14.5 10.55 15.05 10.55 15.3 10.75 15.3 10.8 15.25 10.8 15.3 11 15.2 11 15.25 11.3 15.15 11.65 14.95 11.7 15 12.95 14.55 12.25 13.35 12.15 13.5 12 13.6 12 13.7 11.9 13.9 11.65 13.9 11.5 13.8 M 18.95 15 L 18.85 15.05 18.85 15.1 17.95 15.55 Q 17.8 15.55 17.7 15.65 L 18.45 15.65 18.5 15.6 18.65 15.6 19.35 15.35 19.75 14.9 19.7 14.7 19.55 14.5 Q 18.95 14.9 18.95 15 M 18 14.75 L 18 14.7 17.8 14.35 17.45 14.05 17.95 14.8 18 14.75 M 10 15.1 L 9.7 14.65 9.8 15.4 9.85 15.4 10 15.3 10 15.1 M 14.4 9.1 L 14.25 9.15 14.2 9.3 14.2 9.35 14.05 9.5 13.8 9.65 13.8 9.75 14.5 9.1 14.6 8.95 14.6 8.85 14.45 9.05 14.4 9.1 M 21.3 10.8 L 21.25 10.8 21.2 10.75 21.15 10.75 20.05 9.5 20.05 9.55 18.75 8.25 17.75 7.45 17.55 7.4 17.45 7.45 15.75 7.45 15 9.1 14.95 9.05 14.3 10.05 14.2 10.15 14.05 10.2 13.95 10.1 13.8 10 13.6 10.1 12.95 9.8 12.5 9.2 12.55 9 12.45 9 12.45 9.05 12.15 9.05 12.05 9 12.05 9.05 11.75 8.95 11.5 8.8 11.45 8.8 11.45 8.7 Q 11.15 8.85 11.2 8.95 L 11.1 8.95 11.1 9 11.05 9 10.95 9.1 10.65 9.55 10.5 10.05 10.45 10.45 10.5 10.65 10.5 10.8 10.8 11.6 10.85 11.6 Q 10.85 11.8 11.2 12.05 L 11.2 12.35 11.3 12.45 11.3 12.4 11.95 12.85 11.95 12.75 11.85 12.5 11.7 12.3 11.3 11.55 Q 11.25 11.35 11.55 11.35 L 12 11.7 12.2 12.2 12.25 12.15 12.3 12.45 12.35 12.4 12.45 12.5 Q 12.45 12.8 12.75 13.1 L 12.85 13.5 12.9 13.45 12.9 13.55 13 13.65 13.05 13.8 13.1 13.8 13.3 14.2 13.5 14.45 13.85 15.3 13.85 15.55 13.95 15.7 14 15.7 14.2 15.25 14.2 15.3 14.25 15.3 14.3 15.25 14.75 14.6 14.8 14.6 15.25 14.1 15.35 14.1 15.35 14.05 16.6 13.5 17.1 13.1 17.1 13.05 17.15 13.1 17.15 13 17.2 13.05 17.75 12.6 17.8 12.55 18.4 12.05 18.45 12.05 18.6 11.95 18.65 11.75 18.6 11.65 18.6 11.45 18.7 11.3 18.3 11 17.55 10.6 17.5 10.65 17.25 10.55 17.15 10.55 17.1 10.5 17.05 10.4 17 10.45 17 10.2 17.1 10.1 17.3 10.1 17.65 10.2 17.55 9.9 17.75 9.7 17.95 9.8 17.95 9.75 18.45 10.55 18.5 10.55 18.9 10.85 19.4 11.4 19.6 11.5 19.9 11.5 20.1 11.55 20.15 11.5 20.6 11.6 20.75 11.75 20.85 11.9 20.65 12.1 20.4 12.05 20.35 12.05 20.15 12.1 19.85 12.05 19.65 12.05 19.85 12.35 20 12.65 19.8 12.85 19.7 12.8 19.55 12.75 19.5 12.7 19.5 12.75 18.95 12.35 Q 18.85 12.35 18.5 12.65 L 18.15 12.95 18.1 13 18.1 13.05 18.05 13.05 17.95 13.1 17.95 13.15 17.5 13.45 18.35 14.2 18.35 14.15 18.45 14.4 18.5 14.6 18.5 14.7 19.2 14.15 19.2 14.1 19.25 14.05 19.35 14.05 19.35 14 20.35 13.25 20.35 13.3 20.85 12.9 20.85 12.85 20.9 12.85 21.1 12.65 21.25 12.55 21.35 12.5 21.4 12.35 21.45 12.4 21.7 11.7 21.3 10.8 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 17.35 22.15 L 16.9 22.25 16.85 22.3 16.95 22.45 17.3 24.2 17.35 24.2 17.4 24.4 Q 17.3 24.85 17.7 25.1 L 18.4 25.45 19.15 26.1 19.35 26.05 Q 19.75 25.65 20 25.55 L 20 25.5 20.05 25.45 20.05 25.4 20.35 25.1 20.55 24.75 19.7 24.15 19.55 24.35 19.5 24.3 19.45 24.35 19.3 24.15 19.25 24 19.25 23.7 19.3 23.75 19.6 22.2 19.45 22.05 19.1 22.05 19.05 22.15 19.05 22.2 19.1 22.45 19.1 22.9 19.15 22.95 19.15 23.75 19.05 23.8 18.95 23.8 18.65 23.05 18.65 22.5 18.6 22.45 18.6 22.25 18.65 22.2 Q 18.65 22 18.4 22 L 18.1 21.95 17.35 22.1 17.35 22.15 M 18.3 24.3 L 18.3 24.4 18.35 24.4 18.4 24.45 18.6 24.85 18.6 25.1 18.4 25.25 18.3 25.2 18.1 25 18.1 25.05 17.85 24.5 Q 17.85 24.3 18.1 24.3 L 18.25 24.35 18.3 24.3 M 16.1 14.3 L 15.95 14.4 Q 15.7 14.5 15.6 14.55 15.45 14.55 15.25 14.85 L 15.05 15.05 14.7 15.5 Q 14.3 15.85 14.35 16.1 L 14.45 16.2 Q 14.6 16.2 14.7 16.35 L 14.8 16.25 15.25 16.25 15.45 16.2 15.6 16.25 16.2 16.1 16.4 16.1 16.45 16.05 16.5 16.05 16.5 16 17.15 15.45 17.2 15.5 17.2 15.45 17.25 15.45 17.5 15.15 17.15 14.5 16.6 14.05 16.1 14.3 M 9.55 22.05 L 9.5 22.15 9.4 22.6 9.4 22.9 9.5 23.2 9.6 22.95 9.55 22.95 9.6 22.9 9.7 22.7 9.9 22.55 Q 10.1 22.55 10.1 22.65 L 10.15 22.6 10.15 22.65 10.1 22.7 10.15 22.75 10.05 23 10 23.25 10 23.3 Q 9.85 23.3 9.85 23.4 L 9.65 23.5 9.6 23.5 9.65 23.65 9.65 23.8 9.75 23.95 9.7 23.95 9.95 24.75 10.2 24.8 10.8 24.8 10.85 24.75 10.9 24.8 11 24.75 11.35 24.75 11.45 24.7 11.65 24.7 11.65 24.65 11.7 24.65 11.7 24.55 11.6 24.35 11.6 24.2 11.55 24.2 11.55 24.15 11.6 24.15 11.55 23.75 11.55 23.5 11.6 23.5 11.65 23.45 11.8 23.45 11.9 23.55 11.55 22.8 11.7 22.55 11.9 22.4 12.15 22.15 12.35 22.05 12.55 21.9 12.6 21.95 13.45 21.5 13.8 21.15 13.65 20.9 13.5 20.75 13.4 20.85 13.35 20.85 13.35 20.9 13.15 21 13 21.15 13 21.2 12.8 21.35 12.5 21.5 12.35 21.45 12.3 21.35 12.6 20.95 12.85 20.7 12.85 20.65 12.9 20.6 12.95 20.6 12.95 20.5 13.05 20.5 13.2 20.3 13.2 20.2 12.5 19.55 11.7 19.05 11.65 19 11.6 19.15 11.55 19.1 10.8 20.25 10.85 20.25 Q 10.65 20.4 10.35 21.15 L 9.55 22.05 M 5.95 14.85 L 6 14.9 6 15.15 6.05 15.3 6.1 15.4 6.1 15.45 6.15 15.4 6.2 15.45 6.15 15.5 6.3 15.55 6.4 15.6 6.35 15.75 6.4 15.8 7.25 15.45 7.15 15.25 7.1 15.3 6.8 14.95 6.75 15 6.7 14.7 6.8 14.5 6.95 14.35 6.95 14.2 6.9 14.2 6.85 14.25 6.8 14.25 6.5 14.4 6.5 14.45 6.45 14.45 6.2 14.6 Q 5.9 14.75 5.95 14.85 M 8.45 14.45 L 8.4 14.45 8.45 14.55 8.45 14.65 8.4 14.85 8.15 14.95 7.75 14.85 7.8 14.85 7.4 14.75 7.35 14.85 7.45 14.85 8.15 15.45 8.15 15.4 8.35 15.5 8.55 15.65 8.95 15.65 9.2 15.6 9.25 15.25 9.1 14.75 Q 8.95 14.45 8.7 14.55 L 8.6 14.5 8.45 14.45 M 14.75 7.6 L 14.8 7.35 14.8 7.25 14.65 7.55 14 8.2 Q 13.7 8.35 13.75 8.45 L 13.75 8.5 13.7 8.55 13.65 8.55 13.45 8.65 13.2 8.9 13.45 9.15 13.5 9.1 13.6 9.2 14.15 8.65 14.55 8.05 14.55 8.1 14.75 7.7 14.75 7.6 M 11.95 4.15 L 11.8 4.1 11.1 4.45 10.55 4.45 10.55 5.4 11.05 5.5 11.4 5.85 11.4 6.3 11.35 6.55 11.65 6.55 11.8 6.65 11.9 6.8 11.6 7.05 11.4 7.1 11.2 7.1 11.2 7.15 11.35 7.35 11.4 7.35 11.55 7.25 11.6 7.25 12 7.2 12.35 7.1 12.4 7.1 12.45 7.15 12.45 7.1 12.5 7.1 12.6 7.15 12.6 7.1 12.75 7.35 12.4 7.75 11.8 7.85 11.6 7.75 11.85 8.4 11.95 8.55 12.1 8.6 12.35 8.55 12.8 8.55 13.15 8.25 13.15 8.3 13.8 7.65 14.15 7.1 14.3 6.3 14.25 6.15 14.2 6.05 14.25 6 14.2 6 14.2 5.95 14.4 5.75 14.45 5.75 14.55 5.7 14.35 5.55 14.35 5.3 12.35 4.25 12.35 4.3 12.05 4.2 12.05 4.25 11.95 4.15 M 12.1 4.9 L 12.15 4.95 12.55 4.85 12.7 4.85 13.05 4.9 13.3 5 13.4 5.15 13.1 5.45 12.85 5.4 12.7 5.5 12.55 5.65 12.3 5.65 12.05 5.6 11.85 5.65 Q 11.5 5.6 11.55 5.4 L 11.55 5.3 11.6 5.3 12.1 4.9 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 15.3 5.35 L 15.3 5.4 15.25 5.5 15.45 5.4 15.65 5.2 15.6 5.15 15.25 5.25 15.25 5.4 15.3 5.35 M 15.75 4.4 L 15.7 4.25 15.75 4.15 15.3 3.85 14.55 3.15 14.55 2.95 14.7 2.8 13.95 2.35 13.9 2.4 13.85 2.4 13.7 2.25 13.3 2.25 13.2 2.1 13.1 1.85 12.6 1.95 12.25 2.2 12.05 2.3 11.75 2.35 11.4 2.1 10.95 2.6 10.85 2.85 10.7 3.05 10.4 3.05 10.1 2.95 10.1 3.05 10.15 3.05 10.15 3.25 9.7 3.8 9.9 4 10.35 4.1 11.1 3.85 11.2 3.75 11.7 3.6 11.75 3.65 11.75 3.4 11.85 3.35 12.4 3.2 12.45 3.2 12.65 3.15 12.8 3.15 14 3.25 14.2 3.35 14.3 3.5 14.15 3.65 13.2 3.6 13.15 3.55 12.8 3.55 12.35 3.6 12.35 3.65 12.3 3.6 12.25 3.65 12.25 3.85 12.3 3.8 13.05 4.1 13.1 4.05 13.4 4.3 13.4 4.25 13.65 4.35 13.6 4.4 13.7 4.4 14.4 4.6 14.4 4.55 14.6 4.65 14.8 4.85 15 4.85 15.35 4.8 15.5 4.8 15.5 4.75 15.65 4.8 15.7 4.8 15.85 4.55 15.75 4.4 M 15.25 4.4 L 15.2 4.4 14.75 4.45 14.05 4.4 14.1 4.35 13.95 4.3 13.9 4.15 13.95 4 14 4 14 3.95 14.2 3.95 14.45 4.05 14.75 4.1 15.2 4 Q 15.45 4 15.45 4.15 L 15.4 4.3 15.25 4.4 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 20.85 17.3 Q 20.85 16.8 20.25 16.05 L 19.85 15.6 19.1 16 18.75 16.05 18.75 16.1 18.5 16.15 17.7 16.1 17.45 16.15 17.25 16.1 17.05 16.2 16.9 16.35 16.9 16.4 16.1 16.8 15.8 16.75 15.4 16.8 15.05 16.95 15 16.9 15 16.95 14.6 16.95 14.15 16.65 14.1 16.55 13.9 16.25 13.8 16.25 13.8 16.35 13.75 16.35 13.35 16.9 12.7 17.35 12.8 17.45 12.8 17.4 13 17.6 13.1 17.75 13 17.9 12.8 18.1 12.8 18.05 12.65 18.15 12.5 18.2 12.2 18 Q 11.8 18.1 11.55 18.25 L 11.55 18.35 12.7 19 13.6 19.85 13.75 20.1 13.8 20.1 13.85 20.15 13.85 20.2 14.1 20.45 14.5 21.1 15.15 20.7 15.75 20.15 15.55 19.7 15.5 19.7 15.3 19.3 15.25 19.3 15.15 19.15 15.05 18.95 15.05 18.8 15.2 18.7 15.2 18.75 15.3 18.75 15.3 18.7 15.5 18.8 15.65 18.9 15.9 19.25 16.1 19.25 16.25 19.35 16.35 19.55 16.35 19.95 16.4 20.05 16.4 21 16.3 21.5 16.3 21.8 16.4 21.85 16.9 21.7 16.9 21.65 17.1 21.6 17.15 21.6 17.95 21.4 18.35 21.4 19.8 21.6 20 21.6 20.2 21.7 20.3 21.35 20.2 21.05 19.1 20.9 18.8 20.9 18.55 20.85 18.05 20.85 17.95 20.8 17.95 20.65 Q 17.95 20.5 18.25 20.5 L 18.3 20.45 18.35 20.5 18.75 20.4 19.05 20.4 19.65 20.5 19.75 20.45 19.9 20.5 20.15 20.55 19.5 20.05 19.45 20.05 19.25 19.9 19.1 19.65 19.15 19.5 19.25 19.45 19.9 19.75 20.4 20.15 20.2 19.75 20.1 19.3 20.1 19.25 20.05 19.25 20.85 17.3 Z\"/>\n</g>\n";

Asserts.sp_svg_player_walk_left = "<g id=\"sp_svg_player_walk_left\" sp-width=\"28\" sp-height=\"33\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 18.6 29.95 L 18.65 30.1 19.35 30.75 Q 21.05 31.5 21.1 30.45 L 20.95 29.6 20.45 28.85 19.55 28.7 18.6 29.95 M 2.8 19.95 L 4.6 20.8 4.2 21.7 4.35 21.85 Q 4.1 22.6 3.05 23.1 L 2.5 23.3 1.6 23.8 1.7 23.9 0.95 24.1 Q 0.9 24.05 0.8 24.2 L 0.65 24.3 Q 0.15 24.6 0 25.1 L 0.1 25.3 1.35 25.65 2.25 25.35 3.3 24.7 Q 4.75 23.9 6.05 23.9 L 6.65 23.4 7.25 22.7 8.35 23.2 8.25 23.3 8.35 23.45 9.6 23.85 9.6 24.05 9.9 24.25 9.85 24.75 9.4 25.15 9.15 25.8 Q 9.15 26.2 10.2 26.25 10.2 26.95 10.6 27.6 L 10.8 28.05 10.95 28.15 11 28.2 12.8 28.6 13.15 28.6 13.1 28.7 13.35 29.8 Q 13.6 30.55 13.45 30.8 13.25 31.15 12.15 31.4 L 10.6 31.9 Q 10.1 32.3 11.8 32.45 L 12.6 32.5 12.55 32.3 12.55 32 Q 12.55 31.75 13.3 31.5 L 15.5 30.4 16.4 29.55 16.8 28.2 16.55 28.1 17.1 27.1 17.1 27 17.15 27 17.8 25.25 17.7 24.95 17.7 24.9 17.65 24.9 16.75 24.7 16.1 24.1 16.05 23.95 15.4 23.45 Q 14.3 22.6 15.9 22.8 L 16.3 22.7 16.45 21.7 14.05 20.7 Q 11.7 19.9 10.3 19.75 L 8.9 19.8 7.1 19.6 7.05 19.35 7.45 19.25 7.9 18.65 5.7 18.05 Q 2.3 17.15 1.45 17.65 L 0.4 18.9 1.85 19.35 2.35 19.65 Q 2.85 19.85 2.8 19.95 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 22.65 6.1 L 22.35 6.1 22 6.15 21.7 6.25 21.55 6.2 21.4 6.2 21.35 6.25 21.25 6.2 21.25 6.25 21.2 6.2 20.7 6.3 20.3 6.3 19.8 6.2 19.7 5.85 19.55 5.65 19.65 5.25 20.25 5 21.2 3.7 Q 21.2 3.4 20.8 3.4 L 20.65 3.4 Q 20.35 3.4 20.45 3.2 L 19.9 2.85 19.45 2.45 19.5 2.45 18.8 1.9 18.05 1.45 17.8 1.4 17.6 1.45 17.2 1.25 16.9 1.25 16.6 1.3 16.3 1.3 15.95 1.4 15.25 1.95 14.5 2.25 14.3 2.4 14.15 2.7 14.2 2.75 14.15 2.8 14.35 3.3 14.2 3.4 13.95 3.4 Q 13.8 3.4 13.7 3.5 L 13.6 3.75 13.65 3.8 13.55 3.95 13.45 4.2 13.5 4.2 13.45 4.25 Q 13.45 4.6 13.8 4.9 L 14.5 5.25 14.5 5.55 15 6.35 15 6.55 16.05 8.3 Q 14.9 9.35 14.9 10.2 L 14.9 10.5 14 11.95 13.4 12.6 12.5 13.25 Q 12.3 13.25 12.3 13.35 L 11.55 13.85 11.5 13.85 11.5 13.9 11 14.25 10.5 14.7 10.5 14.9 10.05 15.15 Q 9.8 15.3 9.6 15.4 L 8.7 16.1 7.85 17.4 7.85 17.35 7.7 17.75 7.7 17.95 Q 8.1 18.65 8.65 18.65 L 9.1 18.5 9.55 18.2 10.4 17.15 11.25 16.6 11.85 16.35 12.15 16.15 12.2 16.1 12.25 16 12.5 15.9 12.7 15.75 Q 12.7 15.7 13.25 15.4 L 13.75 15.1 14.55 14.85 14.6 14.85 14.6 14.9 14.85 14.9 Q 15.15 14.75 15.45 14.4 L 15.95 13.85 15.9 13.85 16.65 13 16.8 12.6 17.1 12.35 17.7 13.5 17.55 13.7 17.55 13.95 17.8 14.6 18.4 14.85 18.25 15.3 18.3 15.55 18.4 15.7 17.9 16.8 17.5 17.25 Q 17.15 17.4 17.15 17.55 L 17.15 17.75 17.3 18 17 18.25 16.7 18.6 16.75 18.75 16.1 19.25 16.1 19.45 16.45 19.7 16.75 19.75 17 19.85 16.5 21.4 16.45 21.7 16.3 22.7 16.25 22.75 16.3 22.75 16.05 23.75 16.05 23.8 16.1 23.8 16.05 23.9 16.05 23.95 16.1 24.1 16.75 24.7 17.65 24.9 17.7 24.9 17.95 24.9 17.8 25.1 17.85 25.1 17.8 25.25 17.15 27 16.8 28.2 16.4 29.55 15.5 30.4 13.3 31.5 Q 12.55 31.75 12.55 32 L 12.55 32.3 12.6 32.5 12.6 32.55 12.7 32.7 12.65 32.75 12.95 33.05 13.2 33.2 13.2 33.15 13.6 33.25 14.15 33.25 14.5 33.2 14.85 33.2 15.1 33.15 15.2 33.2 15.2 33.15 15.45 33.15 17.35 32.75 17.65 32.55 17.95 32.55 18.15 32.25 18.3 31.9 18.3 31.7 18.2 31.4 18.25 30.5 18.5 30.05 18.6 29.95 19.55 28.7 21.05 26.5 21.1 26.3 21.25 26.1 21.8 26.3 22.25 26.55 22.35 26.9 22.4 27.4 22.3 29.55 22.55 29.9 23 30.05 23.5 29.95 23.8 29.7 24.05 29.55 24.1 29.4 24.15 29.3 24.45 28.95 24.65 28.55 25.05 26.55 25.05 25.45 Q 24.95 25.35 24.5 25.15 L 23.95 25 23.35 25 23.1 24.9 21.75 23.8 23.15 21.85 23.1 21.85 23.3 21.5 23.75 21.75 24.35 22 24.55 22 24.8 21.7 24.8 21.1 24.75 20.7 24.75 20.55 24.8 20.2 25.6 17.15 25.6 16.8 25.1 15.35 24.6 14.55 24.55 14 24.45 13.55 24.5 13.5 24.45 13.45 24.5 13.4 24.45 13.35 24.45 13.05 24.9 12.8 25.35 12.65 25.6 12.65 26.3 12.35 26.8 11.95 27.05 11.95 27.5 11.6 27.7 11.05 27.25 10.25 26.3 8.9 25.65 8.2 24.85 7.6 24.05 6.75 Q 23.4 6.1 22.65 6.1 M 20.35 3.9 L 20.25 4.05 20.2 4 Q 20.1 4.6 19.65 4.75 L 19.6 4.75 19.65 4.6 19.5 4.4 19.25 4.4 19.05 4.45 17.55 3.95 17.45 3.95 16.75 4.15 16.15 4.45 15.95 4.4 15.9 4.45 15.85 4.4 15.8 4.45 15.75 4.45 15.75 4.4 15.45 4.4 14.6 4.8 14.25 4.65 14.05 4.35 14.15 4.1 14.35 3.85 14.7 3.7 14.95 3.35 14.65 2.8 14.65 2.7 14.95 2.7 15.5 2.4 15.95 1.95 16.1 1.85 16.35 1.8 16.7 1.8 17.05 1.7 17.5 2 17.75 2 17.8 1.95 17.9 1.9 18.7 2.4 19.6 3.3 Q 19.8 3.8 20.35 3.9 M 23.6 6.9 L 24.65 8 25.4 8.6 26.6 10.2 26.9 10.55 27.15 10.95 26.95 11.35 26.6 11.6 26.6 11.55 26.55 11.6 26.55 11.65 22.65 12.95 22.55 12.95 22.55 12.7 22.4 12.45 21.9 12 24.05 10.8 24.7 10.8 24.75 10.85 25.35 10.9 25.55 10.7 Q 25.55 10.55 25.15 10.4 L 25.25 10.3 25.25 10.2 Q 25.25 9.85 24.8 9.85 L 24 10.05 23.5 9.65 Q 23.1 9.25 22.9 9.25 L 22.7 9.4 22.7 9.45 22.75 9.55 22.6 9.6 22.55 9.7 Q 22.55 10 23 10.1 L 23.4 10.25 23.65 10.45 21.25 11.7 21.2 11.65 20.75 11.85 19.75 12.15 Q 18.8 12.4 18.8 12.5 L 18 13.15 17.25 11.8 17.3 11.8 17.1 11.65 Q 16.95 11.5 16.85 11.5 L 16.65 11.5 16.55 11.65 16.7 11.85 16.5 12.05 16.05 12.65 15.9 13 15.8 13.15 15.1 14 14.75 14.1 14.45 14.3 13.5 14.75 Q 12.85 15 12.55 15.2 L 12.1 15.5 11.35 14.9 11.4 14.85 11.15 14.75 12.55 13.8 Q 13.75 13.2 13.75 12.9 L 13.85 12.9 13.95 12.95 14.4 13.35 14.35 13.4 14.5 13.45 14.85 13.25 14.55 12.75 14.25 12.4 14.7 11.9 15.25 11.05 15.3 11.1 15.5 10.55 15.5 10.3 15.45 10.15 15.5 10 15.85 9.25 16.45 8.75 16.9 8.8 17.15 8.8 17.95 9.45 17.95 9.4 18 9.4 18.85 9.6 19.15 9.5 Q 19.9 8.8 20.15 7.9 L 20.35 7.5 20.45 7.05 20.45 6.85 20.8 6.9 21.25 6.7 22.05 6.7 22.3 6.6 22.5 6.55 22.75 6.55 23.6 6.9 M 21.35 12.2 L 21.5 12.2 21.8 12.4 22 12.75 22.05 12.9 22.15 13 21.95 13.1 21.75 12.8 21.8 12.8 21.35 12.2 M 24 13.3 L 24 13.55 24.1 14.15 23.75 14.5 23.3 14.65 23 14.55 22.7 14.55 21.1 15.1 20.65 14.95 20.7 14.95 20.35 14.8 20.2 14.8 20.05 15 Q 20.05 15.25 20.4 15.35 L 19.95 15.55 19.45 15.65 19.25 15.65 19.1 15.6 18.8 15.35 19 15 19 14.7 20.05 14.4 20.25 14.4 20.5 14.25 21.8 13.6 22 13.6 22.3 13.55 22.6 13.45 22.6 13.5 22.65 13.5 23.9 13.2 23.95 13.2 24 13.3 M 24.25 14.85 L 24.4 15.2 Q 25 16.25 25 16.75 L 25 17.1 24.6 18.75 24.55 18.9 24.2 20.25 24.15 21.3 24.1 21.35 23.65 21.05 23 20.75 22.6 20.9 21.45 20.65 20.5 20.65 20.5 20.6 20.4 20.65 20.35 20.6 19.85 20.6 19.95 20.45 20.05 20.25 20.6 18.75 20.6 18.6 20.4 18.15 20.05 17.7 19.9 17.7 19.85 17.75 19.8 17.75 19.85 17.8 19.75 17.8 19.75 18.05 20 18.6 19.35 20.25 Q 18.9 19.9 18.25 19.7 L 17 19.3 17.25 19.1 17.5 19.05 17.8 19.1 18 19.1 18.6 19.2 18.8 19.15 18.9 19 18.65 18.75 18.3 18.65 18.25 18.65 18.25 18.7 17.55 18.55 17.95 18.35 18.25 18.4 18.45 18.25 18.15 17.95 17.75 17.75 18.25 17.3 18.55 16.7 18.7 16.3 18.7 16.05 18.75 16 18.85 16 19.4 16.1 19.5 16.1 20.95 15.75 21 15.75 Q 21.2 15.6 21.75 15.35 L 22.3 15.2 22.6 15.2 23.6 15.05 24.15 14.85 24.25 14.85 M 20.25 12.55 L 20.45 12.5 20.8 12.5 21.15 12.75 21.35 13.15 20.6 13.65 19.8 14 18.7 14.25 18.55 14.35 18.5 14.3 18.45 14.35 18.15 14.1 18.15 13.7 18.2 13.65 18.2 13.55 18.4 13.5 18.55 13.4 18.5 13.4 Q 19 13.15 20.25 12.55 M 20.45 21.15 L 20.8 21.2 21.15 21.2 21.15 21.25 21.35 21.25 21.4 21.2 21.65 21.3 20.8 23 20.8 23.2 20.9 23.25 21.7 22.4 22.2 21.35 22.65 21.5 21.85 22.8 21.45 23.3 21.35 23.45 21.05 23.7 Q 20.65 24.1 20.65 24.65 L 20.65 24.95 20.6 25 20.65 25.05 20.6 25.1 20.6 25.3 20.55 25.65 20.6 25.8 20.1 25.95 19.8 25.95 19.05 25.75 18.35 25.45 18.5 25.1 18.6 24.7 18.65 24.65 18.7 24.7 18.9 24.7 19 24.65 19.1 24.55 19.1 24.35 18.85 23.85 19.2 22.7 19.15 22.5 19.7 21.2 20 21.15 20.45 21.15 M 21.3 24.6 L 21.45 24.2 21.5 24.2 22.95 25.45 22.85 25.5 22.8 25.6 22.85 25.6 22.65 25.85 22.45 25.95 21.65 25.7 21.7 25.7 21.15 25.45 21.25 25.1 21.2 25.05 21.3 24.6 M 17.05 4.55 L 17.5 4.4 18.2 4.65 Q 18.8 4.85 18.8 4.95 L 18.7 5.2 18.7 5.4 18.75 5.5 18.8 5.5 18.85 5.55 19 5.55 19.1 5.45 18.85 5.75 18.85 5.95 18.9 6.05 18.9 6.5 18.3 7.5 17.35 8.3 16.75 8.3 16.35 7.9 15.75 7.15 Q 15.4 6.75 15.4 6.4 L 15.4 6.35 15.45 6.35 15.4 6.25 15.75 6 15.8 6 15.85 6.2 15.9 6.55 16.3 7 16.7 7 16.95 6.9 17.1 6.7 17.05 6.6 16.95 6.5 16.9 6.5 16.7 6.55 16.55 6.55 16.35 6.3 16.3 6.1 16.2 5.9 16.2 5.65 15.85 5.5 15.4 5.6 15.3 5.7 15.2 5.75 15.05 5.6 15 5.35 15.15 5.1 15.45 4.9 16.3 4.9 17.1 4.55 17.05 4.55 M 19.5 6.6 L 19.75 7.05 19.25 8 18.6 8.75 18.25 8.65 17.95 8.5 18.6 7.8 19.5 6.6 M 9.25 16.8 Q 9.25 16.75 9.8 16.4 L 10.55 15.95 10.55 15.8 10.4 15.7 10.2 15.65 10.4 15.55 10.6 15.5 10.9 15.75 11.05 16.1 10.2 16.6 9.25 16.9 9.25 16.8 M 8.7 17.05 L 8.8 17.35 9.1 17.5 9.1 17.55 9.15 17.55 9.3 17.5 9.3 17.45 9.45 17.45 9.6 17.35 9.3 17.7 8.85 18 8.6 18 8.55 17.95 8.5 17.95 8.35 18 8.3 17.85 8.45 17.45 8.7 17.05 M 11.55 15.65 L 11.5 15.7 11.35 15.45 11.55 15.65 M 19 20.55 L 19.15 20.55 18.85 21.25 17.95 22.8 17.75 23.3 17.9 23.4 18.65 22.55 18.55 23.05 18.45 23.35 18.3 23.65 18.3 23.85 18.35 24.1 18.15 24.55 17 24.25 16.6 23.7 17.45 19.95 19 20.55 M 18.1 25.95 L 18.3 26.05 19.75 26.5 20.2 26.5 20.35 26.45 20.45 26.45 20.05 27.05 19.75 27.4 19.8 27.4 19.45 27.75 19.25 28.05 19.3 28.05 17.8 30.3 17.75 30.25 17.75 30.3 17.55 30.3 17.3 30.25 17.35 30.2 17.15 30.05 17.05 29.9 17 29.7 17.05 29.55 17.1 29.25 18.1 25.95 M 17.6 6.9 L 17.45 6.85 16.95 6.95 16.3 7.2 16.3 7.4 16.4 7.55 16.45 7.5 16.6 7.55 16.8 7.55 16.9 7.6 Q 17.15 7.6 17.4 7.4 L 17.75 7 17.6 6.9 M 17.4 4.9 L 17.2 4.9 16.7 5.15 16.4 5.55 16.6 5.75 16.7 5.7 16.85 5.65 17.1 5.65 17.55 5.45 17.85 5.45 18 5.25 17.75 5 17.4 4.9 M 19.55 3.7 L 19.15 3.8 18.95 3.8 18.3 3.65 Q 18.15 3.65 18.15 3.8 L 18.5 4.05 18.9 4.2 19.15 4.2 19.45 4.1 19.7 3.85 19.55 3.7 M 17.35 3.05 L 17.55 2.85 Q 17.55 2.7 17.35 2.7 L 16.75 3.05 16.2 3.6 16.2 3.85 16.3 3.95 16.45 3.95 17.15 3.15 17.35 3.05 M 18 2.8 L 17.8 2.8 17.7 2.9 Q 17.85 3.3 18.35 3.35 L 19.05 3.75 19.3 3.75 19.35 3.6 18.85 3.15 18.35 2.9 18.3 2.95 18.15 2.85 18 2.8 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 18.3 26.05 L 18.1 25.95 17.1 29.25 17.05 29.55 17 29.7 17.05 29.9 17.15 30.05 17.35 30.2 17.3 30.25 17.55 30.3 17.75 30.3 17.75 30.25 17.8 30.3 19.3 28.05 19.25 28.05 19.45 27.75 19.8 27.4 19.75 27.4 20.05 27.05 20.45 26.45 20.35 26.45 20.2 26.5 19.75 26.5 18.3 26.05 M 21.45 24.2 L 21.3 24.6 21.2 25.05 21.25 25.1 21.15 25.45 21.7 25.7 21.65 25.7 22.45 25.95 22.65 25.85 22.85 25.6 22.8 25.6 22.85 25.5 22.95 25.45 21.5 24.2 21.45 24.2 M 24 13.55 L 24 13.3 23.95 13.2 23.9 13.2 22.65 13.5 22.6 13.5 22.6 13.45 22.3 13.55 22 13.6 21.8 13.6 20.5 14.25 20.25 14.4 20.05 14.4 19 14.7 19 15 18.8 15.35 19.1 15.6 19.25 15.65 19.45 15.65 19.95 15.55 20.4 15.35 Q 20.05 15.25 20.05 15 L 20.2 14.8 20.35 14.8 20.7 14.95 20.65 14.95 21.1 15.1 22.7 14.55 23 14.55 23.3 14.65 23.75 14.5 24.1 14.15 24 13.55 M 21.5 12.2 L 21.35 12.2 21.8 12.8 21.75 12.8 21.95 13.1 22.15 13 22.05 12.9 22 12.75 21.8 12.4 21.5 12.2 M 24.65 8 L 23.6 6.9 22.75 6.55 22.5 6.55 22.3 6.6 22.05 6.7 21.25 6.7 20.8 6.9 20.45 6.85 20.45 7.05 20.35 7.5 20.15 7.9 Q 19.9 8.8 19.15 9.5 L 18.85 9.6 18 9.4 17.95 9.4 17.95 9.45 17.15 8.8 16.9 8.8 16.45 8.75 15.85 9.25 15.5 10 15.45 10.15 15.5 10.3 15.5 10.55 15.3 11.1 15.25 11.05 14.7 11.9 14.25 12.4 14.55 12.75 14.85 13.25 14.5 13.45 14.35 13.4 14.4 13.35 13.95 12.95 13.85 12.9 13.75 12.9 Q 13.75 13.2 12.55 13.8 L 11.15 14.75 11.4 14.85 11.35 14.9 12.1 15.5 12.55 15.2 Q 12.85 15 13.5 14.75 L 14.45 14.3 14.75 14.1 15.1 14 15.8 13.15 15.9 13 16.05 12.65 16.5 12.05 16.7 11.85 16.55 11.65 16.65 11.5 16.85 11.5 Q 16.95 11.5 17.1 11.65 L 17.3 11.8 17.25 11.8 18 13.15 18.8 12.5 Q 18.8 12.4 19.75 12.15 L 20.75 11.85 21.2 11.65 21.25 11.7 23.65 10.45 23.4 10.25 23 10.1 Q 22.55 10 22.55 9.7 L 22.6 9.6 22.75 9.55 22.7 9.45 22.7 9.4 22.9 9.25 Q 23.1 9.25 23.5 9.65 L 24 10.05 24.8 9.85 Q 25.25 9.85 25.25 10.2 L 25.25 10.3 25.15 10.4 Q 25.55 10.55 25.55 10.7 L 25.35 10.9 24.75 10.85 24.7 10.8 24.05 10.8 21.9 12 22.4 12.45 22.55 12.7 22.55 12.95 22.65 12.95 26.55 11.65 26.55 11.6 26.6 11.55 26.6 11.6 26.95 11.35 27.15 10.95 26.9 10.55 26.6 10.2 25.4 8.6 24.65 8 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 19.15 20.55 L 19 20.55 17.45 19.95 16.6 23.7 17 24.25 18.15 24.55 18.35 24.1 18.3 23.85 18.3 23.65 18.45 23.35 18.55 23.05 18.65 22.55 17.9 23.4 17.75 23.3 17.95 22.8 18.85 21.25 19.15 20.55 M 8.8 17.35 L 8.7 17.05 8.45 17.45 8.3 17.85 8.35 18 8.5 17.95 8.55 17.95 8.6 18 8.85 18 9.3 17.7 9.6 17.35 9.45 17.45 9.3 17.45 9.3 17.5 9.15 17.55 9.1 17.55 9.1 17.5 8.8 17.35 M 9.8 16.4 Q 9.25 16.75 9.25 16.8 L 9.25 16.9 10.2 16.6 11.05 16.1 10.9 15.75 10.6 15.5 10.4 15.55 10.2 15.65 10.4 15.7 10.55 15.8 10.55 15.95 9.8 16.4 M 19.75 7.05 L 19.5 6.6 18.6 7.8 17.95 8.5 18.25 8.65 18.6 8.75 19.25 8 19.75 7.05 M 17.5 4.4 L 17.05 4.55 17.1 4.55 16.3 4.9 15.45 4.9 15.15 5.1 15 5.35 15.05 5.6 15.2 5.75 15.3 5.7 15.4 5.6 15.85 5.5 16.2 5.65 16.2 5.9 16.3 6.1 16.35 6.3 16.55 6.55 16.7 6.55 16.9 6.5 16.95 6.5 17.05 6.6 17.1 6.7 16.95 6.9 16.7 7 16.3 7 15.9 6.55 15.85 6.2 15.8 6 15.75 6 15.4 6.25 15.45 6.35 15.4 6.35 15.4 6.4 Q 15.4 6.75 15.75 7.15 L 16.35 7.9 16.75 8.3 17.35 8.3 18.3 7.5 18.9 6.5 18.9 6.05 18.85 5.95 18.85 5.75 19.1 5.45 19 5.55 18.85 5.55 18.8 5.5 18.75 5.5 18.7 5.4 18.7 5.2 18.8 4.95 Q 18.8 4.85 18.2 4.65 L 17.5 4.4 M 17.2 4.9 L 17.4 4.9 17.75 5 18 5.25 17.85 5.45 17.55 5.45 17.1 5.65 16.85 5.65 16.7 5.7 16.6 5.75 16.4 5.55 16.7 5.15 17.2 4.9 M 17.45 6.85 L 17.6 6.9 17.75 7 17.4 7.4 Q 17.15 7.6 16.9 7.6 L 16.8 7.55 16.6 7.55 16.45 7.5 16.4 7.55 16.3 7.4 16.3 7.2 16.95 6.95 17.45 6.85 M 20.8 21.2 L 20.45 21.15 20 21.15 19.7 21.2 19.15 22.5 19.2 22.7 18.85 23.85 19.1 24.35 19.1 24.55 19 24.65 18.9 24.7 18.7 24.7 18.65 24.65 18.6 24.7 18.5 25.1 18.35 25.45 19.05 25.75 19.8 25.95 20.1 25.95 20.6 25.8 20.55 25.65 20.6 25.3 20.6 25.1 20.65 25.05 20.6 25 20.65 24.95 20.65 24.65 Q 20.65 24.1 21.05 23.7 L 21.35 23.45 21.45 23.3 21.85 22.8 22.65 21.5 22.2 21.35 21.7 22.4 20.9 23.25 20.8 23.2 20.8 23 21.65 21.3 21.4 21.2 21.35 21.25 21.15 21.25 21.15 21.2 20.8 21.2 M 20.45 12.5 L 20.25 12.55 Q 19 13.15 18.5 13.4 L 18.55 13.4 18.4 13.5 18.2 13.55 18.2 13.65 18.15 13.7 18.15 14.1 18.45 14.35 18.5 14.3 18.55 14.35 18.7 14.25 19.8 14 20.6 13.65 21.35 13.15 21.15 12.75 20.8 12.5 20.45 12.5 Z\"/>\n\n  <path fill=\"#FFFFFF\" stroke=\"none\" d=\" M 11.5 15.7 L 11.55 15.65 11.35 15.45 11.5 15.7 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 24.4 15.2 L 24.25 14.85 24.15 14.85 23.6 15.05 22.6 15.2 22.3 15.2 21.75 15.35 Q 21.2 15.6 21 15.75 L 20.95 15.75 19.5 16.1 19.4 16.1 18.85 16 18.75 16 18.7 16.05 18.7 16.3 18.55 16.7 18.25 17.3 17.75 17.75 18.15 17.95 18.45 18.25 18.25 18.4 17.95 18.35 17.55 18.55 18.25 18.7 18.25 18.65 18.3 18.65 18.65 18.75 18.9 19 18.8 19.15 18.6 19.2 18 19.1 17.8 19.1 17.5 19.05 17.25 19.1 17 19.3 18.25 19.7 Q 18.9 19.9 19.35 20.25 L 20 18.6 19.75 18.05 19.75 17.8 19.85 17.8 19.8 17.75 19.85 17.75 19.9 17.7 20.05 17.7 20.4 18.15 20.6 18.6 20.6 18.75 20.05 20.25 19.95 20.45 19.85 20.6 20.35 20.6 20.4 20.65 20.5 20.6 20.5 20.65 21.45 20.65 22.6 20.9 23 20.75 23.65 21.05 24.1 21.35 24.15 21.3 24.2 20.25 24.55 18.9 24.6 18.75 25 17.1 25 16.75 Q 25 16.25 24.4 15.2 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 20.25 4.05 L 20.35 3.9 Q 19.8 3.8 19.6 3.3 L 18.7 2.4 17.9 1.9 17.8 1.95 17.75 2 17.5 2 17.05 1.7 16.7 1.8 16.35 1.8 16.1 1.85 15.95 1.95 15.5 2.4 14.95 2.7 14.65 2.7 14.65 2.8 14.95 3.35 14.7 3.7 14.35 3.85 14.15 4.1 14.05 4.35 14.25 4.65 14.6 4.8 15.45 4.4 15.75 4.4 15.75 4.45 15.8 4.45 15.85 4.4 15.9 4.45 15.95 4.4 16.15 4.45 16.75 4.15 17.45 3.95 17.55 3.95 19.05 4.45 19.25 4.4 19.5 4.4 19.65 4.6 19.6 4.75 19.65 4.75 Q 20.1 4.6 20.2 4 L 20.25 4.05 M 17.8 2.8 L 18 2.8 18.15 2.85 18.3 2.95 18.35 2.9 18.85 3.15 19.35 3.6 19.3 3.75 19.05 3.75 18.35 3.35 Q 17.85 3.3 17.7 2.9 L 17.8 2.8 M 17.55 2.85 L 17.35 3.05 17.15 3.15 16.45 3.95 16.3 3.95 16.2 3.85 16.2 3.6 16.75 3.05 17.35 2.7 Q 17.55 2.7 17.55 2.85 M 19.15 3.8 L 19.55 3.7 19.7 3.85 19.45 4.1 19.15 4.2 18.9 4.2 18.5 4.05 18.15 3.8 Q 18.15 3.65 18.3 3.65 L 18.95 3.8 19.15 3.8 Z\"/>\n</g>\n";

Asserts.sp_svg_player_face = "<g id=\"sp_svg_player_face\" sp-width=\"29\" sp-height=\"33\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 15.2 23.6 L 15.35 24.35 15.35 24.75 15.3 24.9 15.3 25.1 15.25 25.25 15.25 25.7 15.2 25.8 15.15 26.1 15.15 26.3 15.05 26.55 15.2 26.6 16.65 26.75 18.2 27.4 21 29.6 Q 24.1 31.75 24.65 32.45 L 25.1 32.75 25.05 32.65 25.1 32.55 25.05 32.5 25.1 32.4 25.1 31.75 25.15 31.55 25.2 31.1 25.2 31.05 25.15 31 25.2 30.85 25.2 30.35 22.9 28.25 21.85 27.45 21.3 27.15 18.45 24.9 16.3 23.75 15.4 23 15.2 23.25 15.2 23.6 M 18.5 21.35 L 18.45 21.6 18.25 21.75 18.05 21.8 17.75 21.75 17.45 21.55 17.35 21.55 Q 17.15 21.55 17 21.9 L 16.5 22.25 16.35 22.4 16.55 22.35 16.85 22.4 18.45 22 Q 18.8 21.75 18.55 21.4 L 18.5 21.35 M 8.3 16.75 L 8.3 16.5 8.25 16.25 7.7 16.05 6.05 15.9 4.35 15.6 3.4 15.7 2.65 16.25 2.2 16.25 2.1 16.45 2.15 16.65 Q 1.75 17.05 2.35 17.45 L 2.6 17.75 2.55 17.85 2.5 17.9 Q 2.4 18.1 3.45 18.35 L 4.45 18.55 4.65 18.95 4.15 19 Q 2.9 19 2.3 19.35 0.85 20.2 0 21.45 L 1.7 22.3 3.85 22.95 6.15 23.2 6.55 23.15 7.3 22.65 7.7 23.15 7.95 23.55 7.35 24.75 Q 7.05 25.55 7.45 25.6 7.35 26.65 7.95 27.75 L 8.5 28.65 9.1 29.4 Q 9.65 30.3 9.6 30.85 9.5 31.6 8.3 32.35 L 8.5 32.55 8.8 32.75 8.95 32.8 8.9 32.75 8.8 32.7 8.8 32.25 11.05 30.45 11.25 30.25 11.55 29.8 11.6 29.6 11.6 29.4 11.65 29.2 11.65 28.9 10.8 27.5 11.7 27 11.65 25.2 11.7 24.9 12.6 21.6 13.4 19.65 13.3 19.6 13.25 19.5 13.25 19.4 13.35 19.2 12.4 18.85 10.1 18.6 9.2 18.65 9.3 17.9 9.3 17 Q 9.2 16.8 8.8 16.8 L 8.3 16.75 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 21.5 3.05 L 21.5 2.95 21.4 2.8 21.65 2.6 21.75 2.4 21.55 2.15 20.3 1.9 20.25 1.95 20.1 1.85 18.8 1.3 18.3 1.3 18.1 1.25 17.65 1.25 17.35 1.35 16.7 1.7 Q 16.15 2.1 16.15 2.4 L 16.15 2.45 16.2 2.55 16.05 2.45 15.65 2.45 Q 15.55 2.45 15.5 2.55 L 15.5 2.75 15.3 2.8 15.2 2.95 15.35 3.15 15.3 3.2 15.05 3.4 14.85 3.7 14.8 4 14.7 4.3 14.75 4.45 14.9 4.65 14.9 4.7 14.8 4.85 14.7 4.95 14.7 5.2 14.8 5.4 14.8 5.5 14.7 5.5 14.6 5.6 14.5 5.75 14.6 5.9 14.8 6.05 15.5 6.3 Q 16.1 6.55 16.1 6.7 L 16.1 6.95 16.15 7.1 16.3 7.2 16.35 7.45 16.15 7.45 15.95 7.4 14.95 7.4 14.5 7.5 13.9 7.75 13.3 8.15 13.25 8.2 12.25 8.9 10.95 10.2 10.65 10.4 10.45 10.6 10.4 10.7 9.8 11.25 Q 9.3 11.75 9.3 12 L 9.4 12.35 9.6 12.8 9.65 12.95 9.75 13.15 10 13.3 Q 10 13.6 11.95 14.8 12 14.8 12.3 14.95 L 13.1 15.45 13.35 15.45 14.4 15.25 14.8 14.95 14.8 14.9 15.25 14.5 Q 15.6 14.25 15.65 14.25 L 15.8 14.75 15.5 15.7 15.55 15.9 15.05 16.6 Q 14.55 17.2 14.55 17.45 L 14.2 18.25 13.4 19.1 13.35 19.2 13.25 19.4 13.25 19.5 13.3 19.6 13.4 19.65 12.6 21.6 11.7 24.9 11.65 25.2 11.7 27 11.7 28.7 11.65 28.75 11.65 28.9 11.65 29.2 11.6 29.4 11.6 29.6 11.55 29.8 11.25 30.25 11.05 30.45 8.8 32.25 8.8 32.7 8.9 32.75 8.95 32.8 8.95 32.85 9 32.95 10.05 33.25 11.6 33.05 12.6 32.75 Q 12.95 32.45 13.3 32.5 L 14.1 32.05 14.15 31.3 14.1 31.25 14.05 30.9 13.95 30.65 13.9 30.4 13.8 30.15 13.75 29.95 14.25 28.3 14.5 27.7 14.85 27.1 14.9 26.95 14.95 26.85 15.05 26.55 15.15 26.3 15.15 26.1 15.2 25.8 15.25 25.7 15.25 25.25 15.3 25.1 15.3 24.9 15.35 24.75 15.35 24.35 15.2 23.6 15.2 23.25 15.4 23 15.55 22.85 16.1 22.6 16 22.6 16.15 22.55 16.35 22.4 16.5 22.25 17 21.9 Q 17.15 21.55 17.35 21.55 L 17.45 21.55 17.75 21.75 18.05 21.8 18.25 21.75 18.45 21.6 18.5 21.35 18.65 21 19 20.45 19.4 20 Q 19.65 20 20.1 20.9 L 20.85 22 21.1 22 21.5 21.9 21.7 21.8 22.7 23.05 22.7 23.15 22.8 23.25 22.85 23.4 22.8 23.75 22.8 24.7 23.35 26.45 23.7 27.15 23.95 27.45 24.05 27.75 24.1 27.75 24.1 27.85 25 29.6 25.2 30.35 25.2 30.85 25.15 31 25.2 31.05 25.2 31.1 25.15 31.55 25.1 31.75 25.1 32.4 25.05 32.5 25.1 32.55 25.05 32.65 25.1 32.75 25.1 32.8 25.2 33 25.4 33.1 25.55 33.05 25.7 33.05 26 33.15 26.05 33.2 26.95 33.2 27.75 33 28.25 32.8 Q 28.35 32.6 28.6 32.6 L 28.8 32.3 28.8 32.1 28.35 31.2 28.1 30.85 28 30.75 27.45 29.9 26.95 28.85 26.7 24.65 26.65 24.45 26.65 24.1 26.55 23.65 26.3 23.1 26.25 23.05 26.2 22.9 26.2 22.8 26.1 22.7 25.85 22.1 Q 25.75 22 25.8 21.75 L 25.75 21.65 25.8 21.6 25.55 20.55 25.6 20.5 25.7 20.3 25.7 20 25.6 19.6 25.65 19.55 25.1 18.85 24.95 18.6 25 18.55 24.6 18.15 24.4 17.9 23.7 16.3 23.45 15.85 23.55 15.65 23.55 15.45 23.45 15.1 23.45 14.8 23.35 14.5 23.4 14.2 23.4 13.9 Q 23.4 13.7 23.7 13.7 L 24 13.55 24 13.6 24.45 13.8 24.8 13.8 25.35 13.7 25.4 13.75 26.6 13.55 26.8 13.45 27.05 13.4 Q 27.15 13.2 27.45 13.1 L 27.95 12.65 28.1 12.4 28.1 12 27.9 11.5 27.75 11.4 27.6 11.2 27.5 11.1 27.3 10.8 27.2 10.6 26.9 10.15 26.85 10.15 26.3 9.55 26.25 9.45 26.2 9.4 26.2 9.35 25.9 9.25 25.65 9.05 23.7 7.1 22.7 6.7 22.2 6.7 21.45 6.85 21.4 6.8 20.9 6.9 20.75 6.9 20.75 6.8 20.85 6.45 21.4 6.05 21.55 5.65 21.8 5.35 21.75 5.3 21.85 5.1 21.85 5.05 21.9 5 21.9 4.95 21.95 4.8 21.95 4.4 21.9 4.2 22 4.1 22.2 3.75 22.1 3.55 22.1 3.45 21.9 3.4 21.6 3.45 21.4 3.4 21.5 3.05 M 20.45 2.4 L 20.45 2.45 20.95 2.55 20.65 2.95 20.9 3.2 20.85 3.35 20.9 3.5 20.9 3.6 20.95 3.6 21 3.65 21.05 3.65 21.25 3.75 21.45 3.9 21.45 4.15 21.1 4 21.05 4 21.05 4.05 20.95 4 20.9 4.05 19.65 3.75 19.8 3.65 19.9 3.55 19.4 3.25 19.15 3.25 19.2 3.15 19.25 3.1 19.25 2.9 19.2 2.95 19.2 2.85 19.15 2.9 18.85 2.8 18.8 2.8 18.75 2.85 18.75 2.8 18.7 2.8 18.4 2.9 18.35 2.85 17.7 3.2 17.2 3.4 17.1 3.55 17.05 3.5 17.05 3.55 17 3.6 16.75 4 16.65 4 Q 16.5 4 16.3 4.45 L 16.1 4.9 15.5 5.55 15.5 5.8 15.45 5.9 15.2 5.8 15.35 5.6 15.45 5.5 15.45 5.2 15.35 5.15 15.3 5.1 15.35 5 15.45 4.95 15.45 4.6 15.35 4.4 15.25 4.3 15.35 4 15.9 3.25 16.15 3.05 16.2 2.85 16.3 2.65 16.25 2.6 16.25 2.55 16.3 2.6 16.5 2.6 16.65 2.45 16.75 2.3 Q 17.1 2 17.5 1.9 L 17.8 1.75 18 1.7 18.25 1.75 18.45 1.95 18.5 1.9 18.55 2 18.8 2.05 19.55 2.05 19.75 2.2 19.75 2.15 20.05 2.35 20.05 2.3 20.45 2.4 M 21 4.5 L 21.45 4.35 21.4 4.7 21.1 4.95 Q 20.3 4.95 19.95 4.4 L 20.1 4.4 21 4.5 M 20.25 5.9 L 20.25 5.95 20.2 5.95 20.2 6.05 20.25 6.15 20.35 6.3 20.1 7 19.5 7.85 18.8 8.2 18.7 8.2 18.55 8.25 18.45 8.2 18.4 8.25 18.35 8.2 18.3 8.25 18.1 8.25 18 8.15 17.9 8.1 16.6 6.8 16.55 6.5 16.35 6.3 16.4 6.3 16.5 6.1 16.35 5.65 16.35 5.7 16.25 5.6 16.15 5.6 16.8 4.6 16.75 4.6 16.8 4.2 Q 17.05 4.25 17.3 4 L 17.55 3.75 17.75 3.8 18.2 3.7 18.3 3.8 19.2 4.1 19.2 4.05 19.25 4.05 19.6 4.25 19.55 4.3 19.55 4.55 19.85 4.9 19.4 4.9 19.3 4.85 19.05 4.9 18.8 5 18.5 5.2 18.55 5.3 18.5 5.35 18.65 5.5 19.5 5.5 19.85 5.4 20.05 5.15 20.2 5.2 20.3 5.3 20.25 5.55 20.25 5.65 20.4 5.8 20.35 5.85 20.25 5.9 M 23.2 7.5 L 23.25 7.45 23.8 7.8 23.8 7.75 24.05 8.05 24.1 8 24.65 8.7 24.95 9.15 25.35 9.55 25.35 9.5 25.75 9.8 25.8 9.75 26.15 10.1 27.05 11.35 27 11.4 27.15 11.55 27.35 11.85 27.45 12.1 27.45 12.3 27.15 12.6 26.8 12.8 26.85 12.85 26.7 12.9 26.6 12.95 26.55 12.9 26.55 12.95 25.95 13.1 25.55 13.15 25.25 13.15 25.35 12.45 Q 25.35 11.75 24.75 11.4 L 25.45 11.3 26.4 11.55 26.7 11.3 Q 26.7 11.1 26.2 10.9 L 26.05 10.85 25.85 10.75 25.8 10.8 25.7 10.8 25.7 10.75 25.25 10.75 25.25 10.8 25.2 10.8 25.1 10.75 24.65 10.9 24.15 11 23.45 10.45 23 10.35 22.8 10.4 22.7 10.35 22.7 10.25 22.5 10.05 22.45 10.05 22 9.7 21.95 9.75 21.8 9.65 21.25 9.65 20.55 10.2 20.15 10.6 20.15 10.9 20.2 11.15 20.2 11.45 20.55 12 Q 19.7 11.9 19.7 12.5 L 19.95 12.95 20.3 13.35 21.25 13.7 22.3 13.85 22.85 13.8 22.8 14.95 22.9 15.3 22.9 15.55 Q 22.75 15.85 22.35 15.9 L 21.65 16 21.4 16 20.9 16.1 20.85 16.1 21.05 16 21.25 15.85 21.25 15.7 21.1 15.6 20.95 15.55 20.65 15.65 20.6 15.6 20.05 15.9 20.05 15.85 19.4 16.2 19.3 16.15 19.3 16.2 19.1 16.25 19.05 16.3 18.95 16.35 18.95 16.3 18.75 16.4 18.7 16.35 18.6 16.4 18.55 16.35 18.55 16.4 17.2 15.6 17 15.75 16.95 15.95 16.9 15.95 16.45 15.85 16.15 15.6 16.5 14.7 16.5 14.55 16.35 14.4 16.35 14.45 16.1 13.9 16.25 13.65 16.45 13.2 16.2 12.65 15.7 12.2 15.55 11.95 15.35 11.7 15.35 11.75 15.2 11.55 15.3 11.4 15.2 11.2 14.7 11.05 14.55 11.1 14.55 11.05 14.35 11.1 14 10.95 14 11 13.9 11 13.9 10.95 13.85 11 13.8 11 13.75 10.95 13.2 11.25 13.15 11.25 12.9 11.4 12.9 11.25 12.75 10.85 Q 12.55 10.6 12.35 10.6 12.15 10.6 12.15 10.75 L 12.2 10.75 12.2 10.85 12.15 10.85 11.95 10.8 11.6 10.9 11.45 11.15 11.85 11.6 12.45 12 12.25 12.4 12.25 12.45 11.8 14 11.35 13.65 11.3 13.65 10.3 12.8 10.2 12.65 10.15 12.4 10.1 12.4 10 12.2 10 11.95 11.6 10.3 11.6 10.35 12.5 9.45 12.55 9.45 12.85 9.15 13.15 8.95 13.15 9 14.45 8.1 14.75 8 15.65 7.95 15.75 7.9 16.1 7.9 16.15 7.95 16.3 7.95 16.35 8.2 Q 16.4 8.65 16.75 9.1 L 17.05 9.45 17.4 9.75 17.4 9.8 17.45 9.75 18.35 10.55 18.6 10.55 19 10.4 19.3 10.2 19.4 10.2 19.4 10.15 19.5 10.05 19.55 10.05 20.5 9.25 20.55 9.25 20.5 9.2 20.6 9.2 20.6 9.15 21.1 8.15 21.1 7.8 21.05 7.5 21.05 7.4 22.45 7.25 22.6 7.25 22.75 7.3 22.95 7.4 22.95 7.35 Q 23.2 7.45 23.2 7.5 M 21.55 10.15 L 21.9 10.3 22.1 10.5 23.05 11.7 23.1 11.65 23.3 12 23.35 12.05 23.45 12.1 23.55 12.1 23.75 11.95 23.8 12.1 23.9 12.2 23.9 12.6 23.6 13.15 22.85 13.15 22.8 13.2 22.75 13.2 22.35 13.35 20.7 12.9 20.65 12.95 20.5 12.85 20.35 12.65 20.35 12.55 20.45 12.55 20.4 12.6 20.9 12.8 21.3 12.8 21.55 12.65 21.6 12.4 21.55 12.15 21.5 12.1 21.35 11.9 20.9 11.5 20.75 11.2 20.8 11.1 20.75 11.1 20.75 10.9 21.55 10.15 M 23.5 11.1 L 23.55 11.2 23.5 11.35 23.4 11.2 23.3 11 23.4 11 23.5 11.1 M 24.45 11.85 L 24.5 11.95 24.5 11.9 24.7 12.55 24.75 12.5 24.75 12.75 24.65 12.7 24.5 12.75 24.4 12.9 24.35 12.85 24.45 12.35 24.25 11.75 24.35 11.8 24.45 11.8 24.4 11.85 24.45 11.85 M 20.65 16.65 L 22.2 16.5 22.95 16.2 23 16.2 23.15 16.4 23.25 16.6 23.4 17.05 Q 23.6 18.05 24.5 19 L 24.5 19.05 25 19.9 24.4 20.6 Q 23.95 20.95 23.5 21.1 L 22.75 21.2 21.95 21.2 21.3 21.35 21.25 21.3 21.15 21.4 21.05 21.4 20.75 20.8 19.95 19.75 20.4 19.45 20.35 19.4 20.3 19.3 20.4 19.15 20.55 19 20.55 18.9 20.45 18.8 20.3 18.75 20.15 18.8 20.05 18.85 Q 19 19.45 18.5 20.2 L 18.5 20.15 18.3 20.4 18.15 20.65 18.1 20.65 18.1 20.7 18.05 20.7 18.05 20.75 18 20.9 17.85 21.15 17.55 21 16.9 20.55 16.9 20.6 16.5 20.3 16.5 20.35 16.05 20.05 16.05 20.1 15.5 19.75 15.5 19.8 14.35 19.35 14.35 19.4 14.05 19.3 14.1 19.2 14.2 19.1 14.7 18.5 14.7 18.55 15.2 17.5 Q 15.5 16.8 15.65 16.8 L 15.65 16.85 15.8 16.55 16 16.3 16.15 16.4 16.15 16.35 16.4 16.45 16.7 16.5 17.4 16.5 17.45 16.45 17.55 16.45 18.2 16.85 18.4 16.9 18.85 16.9 19.55 16.7 19.6 16.7 19.6 16.65 19.85 16.6 20.05 16.6 20.15 16.65 20.65 16.65 M 23.7 21.65 L 23.85 21.6 23.9 21.6 25 20.9 25.05 21.1 25.1 21.5 25.15 21.55 25.15 22.35 25.35 22.7 25.5 22.85 25.9 23.7 25.9 24.1 25.95 24.45 25.75 24.7 25.5 24.85 25.5 24.8 24.2 25.1 23.95 25.05 23.9 24.95 23.85 24.8 23.85 24.85 23.55 23.55 Q 23.4 22.8 22.95 22.4 L 22.9 22.4 22.45 21.75 23.2 21.75 23.45 21.7 23.7 21.7 23.7 21.65 M 13.4 11.8 L 13.65 11.65 13.8 11.5 13.95 11.65 14.05 11.9 14 11.95 14.05 12 14.05 12.05 14 12.05 14.05 12.15 14 12.2 14.05 12.3 14 12.35 14.05 12.35 14.05 12.95 14.15 13.4 14.35 13.55 14.6 13.65 14.8 13.65 15.5 13.2 15.5 13.15 15.6 13.1 15.8 13.1 15.8 13.4 15.6 13.6 15.4 13.75 15.35 13.7 15.35 13.8 15.3 13.85 15.3 13.8 14.4 14.5 14.45 14.5 14.25 14.6 14.1 14.7 13.35 14.95 13.05 14.75 12.9 14.45 12.85 14.5 12.55 13.65 12.55 13.4 12.6 13.25 12.6 13.05 12.65 13.1 13.25 11.75 13.4 11.8 M 14.5 12.2 L 14.55 11.95 14.65 11.65 14.9 11.95 15.3 12.65 14.6 13.1 14.5 12.2 M 18.7 8.75 L 18.95 8.7 19.65 8.45 19.65 8.4 19.75 8.4 19.75 8.3 19.8 8.3 19.95 8.2 19.4 8.85 18.75 9.35 18 8.75 18.7 8.75 M 17.25 8.85 L 17.15 8.6 17.3 8.75 17.35 8.9 17.25 8.8 17.25 8.85 M 17.55 9.1 L 17.4 8.95 17.45 8.95 17.65 9.2 17.65 9.15 17.7 9.2 17.65 9.25 17.55 9.1 M 18.9 9.9 L 18.75 9.95 18.65 10.05 18.4 9.8 18.5 9.85 18.9 9.9 M 14.05 19.85 L 14.35 19.9 Q 14.75 19.95 14.85 20.15 L 14.9 20.1 15.2 20.25 15.4 20.4 15.45 20.4 15.65 20.5 15.8 20.6 15.8 20.55 15.9 20.65 15.3 21.65 15.3 21.6 15.1 21.9 14.9 22.3 15.05 22.45 15.2 22.45 15.3 22.4 16.1 21.3 16.15 21.35 16.35 20.95 16.4 20.95 16.55 21.1 16.6 21.05 16.85 21.25 16.45 21.7 16 22 16 22.05 15.95 22.1 15.95 22.05 15.25 22.6 15.15 22.75 15.1 22.7 Q 14.6 22.95 14.6 23.45 L 14.6 23.8 14.65 23.95 14.7 24.2 14.65 24.2 14.65 24.25 14.7 24.25 14.7 24.75 Q 14.7 24.95 14.35 24.95 L 13.65 24.95 13.05 24.8 13 24.8 13 24.85 12.7 24.7 12.45 24.5 12.65 23.75 12.8 23.85 13.1 23.85 13.3 23.55 13.3 23.5 13.25 23.4 12.85 23.25 12.85 22.65 13.6 20.55 13.65 20.6 14.05 19.85 M 14.6 25.65 L 14.5 26.1 13.95 27.5 13.9 27.6 13.4 28.8 13.4 28.75 13.25 29.15 13.2 29.55 12.75 29.85 12.4 29.75 12.2 29.55 12.25 29.45 12.2 29.4 12.25 29.35 12.25 29.3 12.2 29.25 12.3 28.7 12.3 27.2 12.4 27.2 12.4 26.05 12.3 25.7 12.3 25.15 12.4 25.15 12.45 25.2 12.55 25.2 12.65 25.3 12.7 25.3 12.9 25.35 13.25 25.4 13.6 25.5 14 25.55 14.55 25.5 14.6 25.65 M 26.1 25.1 L 26.1 25.15 26.15 25.15 26.15 25.45 26.2 25.55 26.15 25.6 26.1 25.6 26.15 26.15 26.2 26.3 26.15 26.45 26.15 26.55 26.25 27.15 26.25 28.4 26.35 28.8 26.35 28.85 26.5 29.3 26.35 29.4 26.25 29.5 26.2 29.5 26.2 29.55 26.1 29.55 26.05 29.6 25.95 29.65 25.75 29.65 25.65 29.5 25.65 29.4 25.6 29.4 25.15 28.5 25.2 28.45 24.55 27.25 24.55 27.2 24.45 26.95 24.1 26.6 24.1 26.3 24.05 26.15 24 26.2 24 26.1 23.75 25.7 23.75 25.65 24 25.6 24.2 25.65 24.55 25.6 25 25.6 25 25.55 26.1 25.1 M 25.15 23.2 L 25 23.15 24.7 23.25 24.4 23.4 24.35 23.35 24.15 23.25 23.95 23.25 23.7 23.45 23.9 23.75 24.15 23.85 24.55 23.9 24.65 23.85 24.85 23.85 25.1 23.6 25.2 23.35 25.15 23.2 M 19.05 7.35 L 19.1 7.3 19.25 7.25 19.3 7.1 19.2 6.85 18.55 6.85 18.55 6.9 18.15 6.95 17.95 7.05 17.9 7 17.8 7.25 18.05 7.45 18.75 7.35 18.8 7.35 18.85 7.4 18.85 7.35 18.9 7.35 18.95 7.4 19.05 7.35 M 17.5 5.1 L 17.15 5.2 16.95 5.35 16.85 5.5 Q 16.85 5.8 17.4 5.8 L 17.45 5.75 17.5 5.75 17.55 5.8 Q 17.65 5.65 17.85 5.65 L 17.9 5.65 17.95 5.9 17.85 6.25 17.85 6.5 17.95 6.7 18.1 6.75 18.25 6.85 18.55 6.85 18.65 6.8 18.7 6.8 18.75 6.6 18.9 6.5 18.9 6.2 18.85 6.05 18.8 5.8 18.55 5.5 18.45 5.55 18.35 5.65 18.35 5.55 18.15 5.35 18.2 5.3 18.15 5.25 18.1 5.3 18.1 5.2 18.05 5.25 18 5.2 17.8 5.1 17.5 5.1 M 18.4 6.2 L 18.45 6.35 18.35 6.35 18.25 6.3 18.35 6.25 18.4 6.1 18.4 6.2 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 26.1 25.15 L 26.1 25.1 25 25.55 25 25.6 24.55 25.6 24.2 25.65 24 25.6 23.75 25.65 23.75 25.7 24 26.1 24 26.2 24.05 26.15 24.1 26.3 24.1 26.6 24.45 26.95 24.55 27.2 24.55 27.25 25.2 28.45 25.15 28.5 25.6 29.4 25.65 29.4 25.65 29.5 25.75 29.65 25.95 29.65 26.05 29.6 26.1 29.55 26.2 29.55 26.2 29.5 26.25 29.5 26.35 29.4 26.5 29.3 26.35 28.85 26.35 28.8 26.25 28.4 26.25 27.15 26.15 26.55 26.15 26.45 26.2 26.3 26.15 26.15 26.1 25.6 26.15 25.6 26.2 25.55 26.15 25.45 26.15 25.15 26.1 25.15 M 14.5 26.1 L 14.6 25.65 14.55 25.5 14 25.55 13.6 25.5 13.25 25.4 12.9 25.35 12.7 25.3 12.65 25.3 12.55 25.2 12.45 25.2 12.4 25.15 12.3 25.15 12.3 25.7 12.4 26.05 12.4 27.2 12.3 27.2 12.3 28.7 12.2 29.25 12.25 29.3 12.25 29.35 12.2 29.4 12.25 29.45 12.2 29.55 12.4 29.75 12.75 29.85 13.2 29.55 13.25 29.15 13.4 28.75 13.4 28.8 13.9 27.6 13.95 27.5 14.5 26.1 M 18.75 9.95 L 18.9 9.9 18.5 9.85 18.4 9.8 18.65 10.05 18.75 9.95 M 17.4 8.95 L 17.55 9.1 17.65 9.25 17.7 9.2 17.65 9.15 17.65 9.2 17.45 8.95 17.4 8.95 M 17.15 8.6 L 17.25 8.85 17.25 8.8 17.35 8.9 17.3 8.75 17.15 8.6 M 24.5 11.95 L 24.45 11.85 24.4 11.85 24.45 11.8 24.35 11.8 24.25 11.75 24.45 12.35 24.35 12.85 24.4 12.9 24.5 12.75 24.65 12.7 24.75 12.75 24.75 12.5 24.7 12.55 24.5 11.9 24.5 11.95 M 23.25 7.45 L 23.2 7.5 Q 23.2 7.45 22.95 7.35 L 22.95 7.4 22.75 7.3 22.6 7.25 22.45 7.25 21.05 7.4 21.05 7.5 21.1 7.8 21.1 8.15 20.6 9.15 20.6 9.2 20.5 9.2 20.55 9.25 20.5 9.25 19.55 10.05 19.5 10.05 19.4 10.15 19.4 10.2 19.3 10.2 19 10.4 18.6 10.55 18.35 10.55 17.45 9.75 17.4 9.8 17.4 9.75 17.05 9.45 16.75 9.1 Q 16.4 8.65 16.35 8.2 L 16.3 7.95 16.15 7.95 16.1 7.9 15.75 7.9 15.65 7.95 14.75 8 14.45 8.1 13.15 9 13.15 8.95 12.85 9.15 12.55 9.45 12.5 9.45 11.6 10.35 11.6 10.3 10 11.95 10 12.2 10.1 12.4 10.15 12.4 10.2 12.65 10.3 12.8 11.3 13.65 11.35 13.65 11.8 14 12.25 12.45 12.25 12.4 12.45 12 11.85 11.6 11.45 11.15 11.6 10.9 11.95 10.8 12.15 10.85 12.2 10.85 12.2 10.75 12.15 10.75 Q 12.15 10.6 12.35 10.6 12.55 10.6 12.75 10.85 L 12.9 11.25 12.9 11.4 13.15 11.25 13.2 11.25 13.75 10.95 13.8 11 13.85 11 13.9 10.95 13.9 11 14 11 14 10.95 14.35 11.1 14.55 11.05 14.55 11.1 14.7 11.05 15.2 11.2 15.3 11.4 15.2 11.55 15.35 11.75 15.35 11.7 15.55 11.95 15.7 12.2 16.2 12.65 16.45 13.2 16.25 13.65 16.1 13.9 16.35 14.45 16.35 14.4 16.5 14.55 16.5 14.7 16.15 15.6 16.45 15.85 16.9 15.95 16.95 15.95 17 15.75 17.2 15.6 18.55 16.4 18.55 16.35 18.6 16.4 18.7 16.35 18.75 16.4 18.95 16.3 18.95 16.35 19.05 16.3 19.1 16.25 19.3 16.2 19.3 16.15 19.4 16.2 20.05 15.85 20.05 15.9 20.6 15.6 20.65 15.65 20.95 15.55 21.1 15.6 21.25 15.7 21.25 15.85 21.05 16 20.85 16.1 20.9 16.1 21.4 16 21.65 16 22.35 15.9 Q 22.75 15.85 22.9 15.55 L 22.9 15.3 22.8 14.95 22.85 13.8 22.3 13.85 21.25 13.7 20.3 13.35 19.95 12.95 19.7 12.5 Q 19.7 11.9 20.55 12 L 20.2 11.45 20.2 11.15 20.15 10.9 20.15 10.6 20.55 10.2 21.25 9.65 21.8 9.65 21.95 9.75 22 9.7 22.45 10.05 22.5 10.05 22.7 10.25 22.7 10.35 22.8 10.4 23 10.35 23.45 10.45 24.15 11 24.65 10.9 25.1 10.75 25.2 10.8 25.25 10.8 25.25 10.75 25.7 10.75 25.7 10.8 25.8 10.8 25.85 10.75 26.05 10.85 26.2 10.9 Q 26.7 11.1 26.7 11.3 L 26.4 11.55 25.45 11.3 24.75 11.4 Q 25.35 11.75 25.35 12.45 L 25.25 13.15 25.55 13.15 25.95 13.1 26.55 12.95 26.55 12.9 26.6 12.95 26.7 12.9 26.85 12.85 26.8 12.8 27.15 12.6 27.45 12.3 27.45 12.1 27.35 11.85 27.15 11.55 27 11.4 27.05 11.35 26.15 10.1 25.8 9.75 25.75 9.8 25.35 9.5 25.35 9.55 24.95 9.15 24.65 8.7 24.1 8 24.05 8.05 23.8 7.75 23.8 7.8 23.25 7.45 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 14.35 19.9 L 14.05 19.85 13.65 20.6 13.6 20.55 12.85 22.65 12.85 23.25 13.25 23.4 13.3 23.5 13.3 23.55 13.1 23.85 12.8 23.85 12.65 23.75 12.45 24.5 12.7 24.7 13 24.85 13 24.8 13.05 24.8 13.65 24.95 14.35 24.95 Q 14.7 24.95 14.7 24.75 L 14.7 24.25 14.65 24.25 14.65 24.2 14.7 24.2 14.65 23.95 14.6 23.8 14.6 23.45 Q 14.6 22.95 15.1 22.7 L 15.15 22.75 15.25 22.6 15.95 22.05 15.95 22.1 16 22.05 16 22 16.45 21.7 16.85 21.25 16.6 21.05 16.55 21.1 16.4 20.95 16.35 20.95 16.15 21.35 16.1 21.3 15.3 22.4 15.2 22.45 15.05 22.45 14.9 22.3 15.1 21.9 15.3 21.6 15.3 21.65 15.9 20.65 15.8 20.55 15.8 20.6 15.65 20.5 15.45 20.4 15.4 20.4 15.2 20.25 14.9 20.1 14.85 20.15 Q 14.75 19.95 14.35 19.9 M 18.95 8.7 L 18.7 8.75 18 8.75 18.75 9.35 19.4 8.85 19.95 8.2 19.8 8.3 19.75 8.3 19.75 8.4 19.65 8.4 19.65 8.45 18.95 8.7 M 13.65 11.65 L 13.4 11.8 13.25 11.75 12.65 13.1 12.6 13.05 12.6 13.25 12.55 13.4 12.55 13.65 12.85 14.5 12.9 14.45 13.05 14.75 13.35 14.95 14.1 14.7 14.25 14.6 14.45 14.5 14.4 14.5 15.3 13.8 15.3 13.85 15.35 13.8 15.35 13.7 15.4 13.75 15.6 13.6 15.8 13.4 15.8 13.1 15.6 13.1 15.5 13.15 15.5 13.2 14.8 13.65 14.6 13.65 14.35 13.55 14.15 13.4 14.05 12.95 14.05 12.35 14 12.35 14.05 12.3 14 12.2 14.05 12.15 14 12.05 14.05 12.05 14.05 12 14 11.95 14.05 11.9 13.95 11.65 13.8 11.5 13.65 11.65 M 23.85 21.6 L 23.7 21.65 23.7 21.7 23.45 21.7 23.2 21.75 22.45 21.75 22.9 22.4 22.95 22.4 Q 23.4 22.8 23.55 23.55 L 23.85 24.85 23.85 24.8 23.9 24.95 23.95 25.05 24.2 25.1 25.5 24.8 25.5 24.85 25.75 24.7 25.95 24.45 25.9 24.1 25.9 23.7 25.5 22.85 25.35 22.7 25.15 22.35 25.15 21.55 25.1 21.5 25.05 21.1 25 20.9 23.9 21.6 23.85 21.6 M 25 23.15 L 25.15 23.2 25.2 23.35 25.1 23.6 24.85 23.85 24.65 23.85 24.55 23.9 24.15 23.85 23.9 23.75 23.7 23.45 23.95 23.25 24.15 23.25 24.35 23.35 24.4 23.4 24.7 23.25 25 23.15 M 21.9 10.3 L 21.55 10.15 20.75 10.9 20.75 11.1 20.8 11.1 20.75 11.2 20.9 11.5 21.35 11.9 21.5 12.1 21.55 12.15 21.6 12.4 21.55 12.65 21.3 12.8 20.9 12.8 20.4 12.6 20.45 12.55 20.35 12.55 20.35 12.65 20.5 12.85 20.65 12.95 20.7 12.9 22.35 13.35 22.75 13.2 22.8 13.2 22.85 13.15 23.6 13.15 23.9 12.6 23.9 12.2 23.8 12.1 23.75 11.95 23.55 12.1 23.45 12.1 23.35 12.05 23.3 12 23.1 11.65 23.05 11.7 22.1 10.5 21.9 10.3 M 20.25 5.95 L 20.25 5.9 20.35 5.85 20.4 5.8 20.25 5.65 20.25 5.55 20.3 5.3 20.2 5.2 20.05 5.15 19.85 5.4 19.5 5.5 18.65 5.5 18.5 5.35 18.55 5.3 18.5 5.2 18.8 5 19.05 4.9 19.3 4.85 19.4 4.9 19.85 4.9 19.55 4.55 19.55 4.3 19.6 4.25 19.25 4.05 19.2 4.05 19.2 4.1 18.3 3.8 18.2 3.7 17.75 3.8 17.55 3.75 17.3 4 Q 17.05 4.25 16.8 4.2 L 16.75 4.6 16.8 4.6 16.15 5.6 16.25 5.6 16.35 5.7 16.35 5.65 16.5 6.1 16.4 6.3 16.35 6.3 16.55 6.5 16.6 6.8 17.9 8.1 18 8.15 18.1 8.25 18.3 8.25 18.35 8.2 18.4 8.25 18.45 8.2 18.55 8.25 18.7 8.2 18.8 8.2 19.5 7.85 20.1 7 20.35 6.3 20.25 6.15 20.2 6.05 20.2 5.95 20.25 5.95 M 17.15 5.2 L 17.5 5.1 17.8 5.1 18 5.2 18.05 5.25 18.1 5.2 18.1 5.3 18.15 5.25 18.2 5.3 18.15 5.35 18.35 5.55 18.35 5.65 18.45 5.55 18.55 5.5 18.8 5.8 18.85 6.05 18.9 6.2 18.9 6.5 18.75 6.6 18.7 6.8 18.65 6.8 18.55 6.85 19.2 6.85 19.3 7.1 19.25 7.25 19.1 7.3 19.05 7.35 18.95 7.4 18.9 7.35 18.85 7.35 18.85 7.4 18.8 7.35 18.75 7.35 18.05 7.45 17.8 7.25 17.9 7 17.95 7.05 18.15 6.95 18.55 6.9 18.55 6.85 18.25 6.85 18.1 6.75 17.95 6.7 17.85 6.5 17.85 6.25 17.95 5.9 17.9 5.65 17.85 5.65 Q 17.65 5.65 17.55 5.8 L 17.5 5.75 17.45 5.75 17.4 5.8 Q 16.85 5.8 16.85 5.5 L 16.95 5.35 17.15 5.2 M 18.45 6.35 L 18.4 6.2 18.4 6.1 18.35 6.25 18.25 6.3 18.35 6.35 18.45 6.35 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 22.2 16.5 L 20.65 16.65 20.15 16.65 20.05 16.6 19.85 16.6 19.6 16.65 19.6 16.7 19.55 16.7 18.85 16.9 18.4 16.9 18.2 16.85 17.55 16.45 17.45 16.45 17.4 16.5 16.7 16.5 16.4 16.45 16.15 16.35 16.15 16.4 16 16.3 15.8 16.55 15.65 16.85 15.65 16.8 Q 15.5 16.8 15.2 17.5 L 14.7 18.55 14.7 18.5 14.2 19.1 14.1 19.2 14.05 19.3 14.35 19.4 14.35 19.35 15.5 19.8 15.5 19.75 16.05 20.1 16.05 20.05 16.5 20.35 16.5 20.3 16.9 20.6 16.9 20.55 17.55 21 17.85 21.15 18 20.9 18.05 20.75 18.05 20.7 18.1 20.7 18.1 20.65 18.15 20.65 18.3 20.4 18.5 20.15 18.5 20.2 Q 19 19.45 20.05 18.85 L 20.15 18.8 20.3 18.75 20.45 18.8 20.55 18.9 20.55 19 20.4 19.15 20.3 19.3 20.35 19.4 20.4 19.45 19.95 19.75 20.75 20.8 21.05 21.4 21.15 21.4 21.25 21.3 21.3 21.35 21.95 21.2 22.75 21.2 23.5 21.1 Q 23.95 20.95 24.4 20.6 L 25 19.9 24.5 19.05 24.5 19 Q 23.6 18.05 23.4 17.05 L 23.25 16.6 23.15 16.4 23 16.2 22.95 16.2 22.2 16.5 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 21.45 4.35 L 21 4.5 20.1 4.4 19.95 4.4 Q 20.3 4.95 21.1 4.95 L 21.4 4.7 21.45 4.35 M 20.45 2.45 L 20.45 2.4 20.05 2.3 20.05 2.35 19.75 2.15 19.75 2.2 19.55 2.05 18.8 2.05 18.55 2 18.5 1.9 18.45 1.95 18.25 1.75 18 1.7 17.8 1.75 17.5 1.9 Q 17.1 2 16.75 2.3 L 16.65 2.45 16.5 2.6 16.3 2.6 16.25 2.55 16.25 2.6 16.3 2.65 16.2 2.85 16.15 3.05 15.9 3.25 15.35 4 15.25 4.3 15.35 4.4 15.45 4.6 15.45 4.95 15.35 5 15.3 5.1 15.35 5.15 15.45 5.2 15.45 5.5 15.35 5.6 15.2 5.8 15.45 5.9 15.5 5.8 15.5 5.55 16.1 4.9 16.3 4.45 Q 16.5 4 16.65 4 L 16.75 4 17 3.6 17.05 3.55 17.05 3.5 17.1 3.55 17.2 3.4 17.7 3.2 18.35 2.85 18.4 2.9 18.7 2.8 18.75 2.8 18.75 2.85 18.8 2.8 18.85 2.8 19.15 2.9 19.2 2.85 19.2 2.95 19.25 2.9 19.25 3.1 19.2 3.15 19.15 3.25 19.4 3.25 19.9 3.55 19.8 3.65 19.65 3.75 20.9 4.05 20.95 4 21.05 4.05 21.05 4 21.1 4 21.45 4.15 21.45 3.9 21.25 3.75 21.05 3.65 21 3.65 20.95 3.6 20.9 3.6 20.9 3.5 20.85 3.35 20.9 3.2 20.65 2.95 20.95 2.55 20.45 2.45 Z\"/>\n\n</g>\n";

Asserts.sp_svg_player_to_right = "<g id=\"sp_svg_player_to_right\" sp-width=\"29\" sp-height=\"33\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 11.35 31.95 L 11.3 32 11.45 32 11.35 31.95 M 19.65 26.9 L 19.3 26.4 18.7 25.95 18.45 25.8 17.4 25.35 17.1 25.25 16.25 24.8 16.05 24.95 15.7 25.15 15.6 25.3 15.45 25.4 15.45 25.45 Q 15.3 25.4 15.3 25.55 L 14.55 26.3 15.35 26.5 16 26.75 16.15 27.25 Q 16.45 27.85 17.5 28.9 L 18.2 29.85 18.15 30 18.2 30.45 19.6 31.15 23.5 32 22.35 31.45 22 31.2 21.95 31.25 21.55 31.05 21.6 31.05 20.7 30.6 20.2 30 19.95 29.35 20.25 28.7 19.65 26.9 M 17.55 22.55 Q 17.45 22.6 17.5 22.8 L 17.5 22.85 17.85 22.85 18.65 22.75 Q 18.65 22 17.7 21.65 L 17.55 22.55 M 9.1 18.45 L 9.05 18.25 9.1 17.9 8.65 17.05 Q 8.25 16.4 8.4 16.4 L 8.7 15.95 Q 8.2 15.6 5.9 15.05 3.45 14.4 2.85 14.65 L 2.3 15.15 2.1 15.7 1.8 15.95 Q 1.1 15.95 1.4 16.25 L 2.15 16.75 3.5 17.2 4.05 17.2 4.35 17.5 4.25 17.65 3.75 17.7 2.4 17.7 Q 1.5 17.7 1.05 18.1 L 0.45 18.7 0.3 18.9 0 19.2 0 20.45 0.2 20.6 0.65 20.8 3.4 21.7 Q 3.2 22.55 4.35 23.6 L 5.2 24.4 5.7 25.1 6.55 25.75 7.7 26.25 8.25 26.4 8.75 26.85 7.95 27.15 7.85 27.3 7.7 28.45 7 29.4 6.4 30.05 Q 8.1 31 9.3 31.35 L 11.05 31.9 11.3 32 11.3 31.9 11.25 31.95 10.95 31.55 10.6 31.3 10.25 30.9 10.25 30.95 9.55 30.2 Q 8.6 28.85 8.6 28.6 L 9 27.85 9.7 27.4 9.8 27.4 9.9 27.35 11.45 25.85 11.55 25.6 11.6 25.6 11.35 25.4 11.7 25.45 11.7 25.4 11.8 25.25 12.6 23.65 12.65 23.7 12.95 23.35 11.05 22.65 10.9 22.55 Q 10.65 22.15 12 22.3 L 14.15 22.6 14.05 22.35 14 21.95 14 21.75 13.95 21.75 13.95 21.55 13.8 21.5 13.65 21.6 13.45 21.45 12.1 21.2 11.8 20.95 11.45 19.7 10.8 19.1 9.1 18.45 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 23.15 0.85 L 23.1 0.85 22.75 0.6 22.2 0.6 22.15 0.65 22.05 0.7 21.25 0.4 21.2 0.4 20.6 0.25 20.35 0.25 20.15 0.35 20.05 0.5 20.1 0.7 20.2 0.75 19.5 1 19.5 1.05 19.4 1.1 19.35 1.15 18.9 1.45 18.85 1.45 18.45 1.85 18.45 2.1 18.6 2.2 18.2 2.5 18.2 2.55 18.15 2.5 18.15 2.55 18.05 2.6 17.75 2.6 17.65 2.55 Q 17.3 2.55 17.3 2.9 L 17.35 3.05 17.4 3.15 17.35 3.35 17.4 3.55 17.5 3.7 17.55 3.75 17.65 3.8 17.6 3.85 17.6 4.1 18.1 4.65 18.35 4.8 18.5 4.85 18.6 4.95 18.85 4.95 18.9 4.9 18.95 4.95 19.05 4.95 19.05 5 19 5.3 18.95 5.25 18.8 5.8 18.8 5.75 18.6 5.8 18.4 5.9 16.3 5.85 15.85 5.95 14.85 6.8 14.35 7.35 14.2 7.45 14.2 7.5 14.15 7.55 14.15 7.5 13.6 8.05 13.55 8.15 13.5 8.2 13.45 8.15 12.2 9.65 11.9 10.1 11.85 10.35 11.75 10.6 11.75 10.95 11.8 11.2 11.95 11.5 12.1 11.6 12.05 11.6 12.8 12.3 13.95 13.15 13.9 13.3 13.85 13.4 13.8 13.6 13.65 13.8 13.65 14.1 13.75 14.25 13.3 14.75 13.2 14.8 12.8 15.45 12.7 15.8 12.55 16.1 12.55 16.55 12.95 17.15 12.95 17.25 13.15 17.7 13.3 18.3 13.3 18.4 13.05 18.9 12.85 19.5 12.95 19.7 13 19.9 13.15 20.1 13.05 20.25 13.1 20.3 13.05 20.35 13.05 20.65 13.25 21.2 13.45 21.45 13.65 21.6 13.8 21.5 13.9 21.45 13.95 21.55 13.95 21.75 14 21.75 14 21.95 14.05 22.35 14.15 22.6 14.15 22.65 13.9 22.85 13.85 22.85 13.55 23.05 13.05 23.25 12.95 23.35 12.65 23.7 12.6 23.65 11.8 25.25 11.7 25.4 11.7 25.45 11.6 25.6 11.55 25.6 11.45 25.85 9.9 27.35 9.8 27.4 9.7 27.4 9 27.85 8.6 28.6 Q 8.6 28.85 9.55 30.2 L 10.25 30.95 10.25 30.9 10.6 31.3 10.95 31.55 11.25 31.95 11.3 31.9 11.3 32 11.35 31.95 11.45 32 12.1 32.25 12.5 32.1 12.75 31.7 12.75 31.5 12.7 31.25 12.65 31.3 12.25 30.2 12.2 30 12.2 30.05 12.15 29.95 12.15 29.8 12.1 29.85 11.8 28.8 12.1 28.5 12.15 28.55 12.15 28.5 12.3 28.35 12.5 28.2 12.95 27.75 12.95 27.8 13.5 27.3 13.55 27.3 13.55 27.25 14.55 26.3 15.3 25.55 Q 15.3 25.4 15.45 25.45 L 15.45 25.4 15.6 25.3 15.7 25.15 16.05 24.95 16.25 24.8 16.3 24.75 16.65 24.65 17.1 24.2 17.25 23.55 17.5 22.85 17.5 22.8 Q 17.45 22.6 17.55 22.55 L 17.7 21.65 17.75 21.45 17.95 21.45 18.15 21.3 18.3 20.95 18.25 20.95 18.25 20.9 18.3 20.85 18.25 20.8 18.3 20.7 18.2 20 18.2 19.85 18.25 19.95 18.3 19.9 18.4 20 19.05 20.55 19.05 20.6 19.15 20.65 19.2 20.7 19.45 20.75 19.75 20.6 19.75 20.65 19.8 20.65 19.8 20.6 20.3 21 20.9 21.35 20.95 21.35 21.65 21.7 21.8 21.9 21.7 22 21.75 22.05 21.7 22.15 21.6 22.3 21.6 22.25 21.55 22.45 21.45 22.65 21.45 22.7 21.35 23.1 21.15 23.4 21.2 23.45 21.1 23.5 21.05 23.75 21.05 24 20.9 24.85 20.95 24.9 20.9 24.9 20.75 28.15 20.7 28.2 20.65 28.2 20.65 28.25 20.6 28.3 20.55 28.25 20.45 28.4 20.45 28.45 20.35 28.45 20.4 28.5 20.35 28.55 20.3 28.5 20.25 28.7 19.95 29.35 20.2 30 20.7 30.6 21.6 31.05 21.55 31.05 21.95 31.25 22 31.2 22.35 31.45 23.5 32 23.8 32.1 24 32.2 24.25 32.25 24.4 32.2 24.5 32.15 24.5 32.2 24.9 32.05 24.9 32 25.2 31.8 25.4 31.5 25.4 31.3 24.85 30.65 24.85 30.7 23.95 29.8 23.75 29.45 23.7 29.45 22.85 28.25 22.95 28 23.15 27.7 23.6 26.6 Q 23.6 26.4 23.75 26.35 23.8 25.8 24 25.55 24 25.15 24.35 24.85 24.3 24.45 24.6 24.2 L 24.6 23.95 25.05 22.4 25.05 22.15 25.15 21.95 25.2 21.55 24.9 20.75 24.9 20.8 24.25 19.95 24.25 20 23 17.85 22.95 17.75 22.95 17.7 23.2 17.45 23.2 17.05 22.85 16.75 22.3 16.6 22.25 16.65 22.1 16.5 22.15 16.4 22.15 16.2 21.75 15.95 Q 21.2 15.8 20.65 14.95 L 20.6 15 20.55 14.85 20.55 14.75 20.65 14.65 20.65 14.3 20.7 14.15 20.8 14 21.15 14.25 21.2 14.2 21.3 14.2 21.35 14.3 21.4 14.25 21.65 14.35 21.9 14.4 21.95 14.4 22.7 14.7 22.7 14.65 22.85 14.75 24 14.95 24.05 14.9 24.15 14.95 24.25 14.9 24.45 15 25.05 15.2 25.1 15.15 25.2 15.2 25.25 15.15 25.3 15.2 25.4 15.15 25.4 15.2 25.45 15.2 25.5 15.15 25.55 15.2 26.05 14.9 26.1 14.9 26.25 14.8 26.45 14.9 26.6 15.05 26.65 15.05 26.85 15.1 27.1 15.2 27.1 15.25 27.45 15.35 27.8 15.35 28.15 15.1 28.6 14.05 28.6 13.6 28.4 13.3 Q 27.75 13.1 27.7 12.85 L 27.45 12.75 27.2 12.7 26.8 12.7 26.5 12.75 26.3 12.75 26.1 12.8 26.05 12.75 25.15 13.05 25 12.9 24.95 12.95 23.1 12.3 23.2 12.2 23.2 12.15 23.1 11.8 23.3 11.5 23.4 11.15 23.65 10.7 23.95 9.5 23.95 8.9 23.85 8.45 23.75 8.3 23.65 8.1 23.65 8.15 23.6 8.05 22.8 7.3 22.9 7 22.9 7.05 Q 23 6.65 23.4 6.2 L 23.4 6.1 23.45 6.1 23.7 5.55 23.7 5.1 23.65 5.1 23.65 4.95 23.75 4.95 23.7 4.9 24.05 4.5 24 4.1 24 3.75 23.95 3.55 23.95 3.45 24.2 3.45 24.95 2.6 24.85 2.4 24.85 2.45 24.8 2.35 24.75 2.35 24.55 2.25 24.45 2.15 24.45 1.7 24.2 1.35 23.95 1.35 23.65 1.55 23.2 0.9 23.2 0.95 23.15 0.85 M 23 1.6 L 23.25 2.05 23.6 2.05 23.9 1.95 23.9 2.05 23.85 2.05 23.85 2.25 24.3 2.75 24.05 2.95 Q 24.05 3.1 23.65 3.1 22.85 3.1 22.85 2.8 L 22.8 2.7 22.3 2.6 22.25 2.6 22.2 2.4 22.15 2.35 21.55 2.2 21.55 2.15 20 2.25 19.8 2.35 19.7 2.5 19.85 2.65 20.3 2.55 20.85 2.55 21.15 2.5 21.6 2.55 21.65 2.6 21.75 2.6 21.75 2.8 21.7 2.8 Q 21.65 2.8 21.35 2.95 L 20.95 3.05 20.9 3.05 20.6 3.25 20.55 3.25 20.35 3.35 20.4 3.4 20.3 3.35 19.6 3.6 19.6 3.55 19.35 3.65 19.2 3.85 19.05 3.85 19.05 3.8 19 3.85 18.6 3.75 18.6 3.8 18.5 3.8 18.45 3.75 18.35 3.8 18.3 3.8 18.15 3.55 18.25 3.4 18.3 3.25 18.25 3.15 18.7 2.85 19.45 2.15 19.45 1.95 19.3 1.8 Q 20 1.35 20.05 1.35 L 20.1 1.35 20.1 1.4 20.3 1.25 20.65 1.2 20.75 1.1 20.9 0.8 21.35 0.95 21.75 1.2 22.25 1.35 22.6 1.1 23 1.6 M 21.6 3.25 L 21.65 3.25 21.9 3.2 21.95 3.2 22.05 3.15 Q 22.15 3.05 22.2 3.05 L 22.5 3.25 22.9 3.45 23.45 3.45 23.45 4.35 22.95 4.45 Q 22.6 4.6 22.6 4.85 L 22.6 5.3 22.65 5.5 22.6 5.55 22.5 5.5 22.4 5.55 22.35 5.5 22.2 5.65 22.1 5.8 22.35 6.05 22.8 6.1 22.8 6.15 22.65 6.35 22.65 6.3 22.55 6.3 22.4 6.2 22.35 6.25 22 6.15 21.6 6.1 21.35 6.1 21.25 6.35 Q 21.25 6.55 21.6 6.75 L 22.2 6.85 22.4 6.75 22.15 7.4 22.05 7.55 22 7.5 21.85 7.55 21.65 7.55 21.65 7.5 21.6 7.55 21.5 7.5 21.4 7.55 21.35 7.5 21.25 7.55 21.25 7.5 21.2 7.55 20.85 7.25 20.8 7.3 20.15 6.6 19.85 6.05 19.7 5.3 19.75 5.15 19.8 5.05 19.75 5 19.8 5 19.8 4.95 19.6 4.75 19.55 4.75 19.45 4.65 19.65 4.5 19.65 4.3 20.4 3.8 21.6 3.25 M 22.8 7.9 L 22.9 7.95 22.9 8 22.95 8 23 8.05 23 8.1 23.3 8.5 23.5 9.05 23.55 9.45 23.5 9.65 23.5 9.8 23.2 10.6 23.15 10.6 22.8 11.05 22.8 11.3 22.7 11.45 22.7 11.4 22 11.9 21.95 11.85 22.05 11.8 22 11.75 22.3 11.3 22.7 10.5 22.45 10.3 Q 22.2 10.3 22 10.7 L 21.75 11.2 21.75 11.15 21.65 11.45 21.65 11.4 21.55 11.5 21.25 12.1 21.15 12.45 21.1 12.45 21.1 12.55 21 12.65 20.9 12.8 20.9 12.75 20.7 13.2 20.5 13.45 20.3 13.8 20.15 14.25 20.15 14.55 20.05 14.7 20 14.7 19.8 14.25 19.75 14.3 19.75 14.25 19.7 14.25 19.2 13.55 19.2 13.6 18.75 13.1 18.65 13.1 18.65 13.05 18 12.75 18 12.8 17.4 12.5 16.9 12.1 16.9 12.05 16.85 12.05 16.8 12 16.8 12.05 16.25 11.6 16.25 11.55 16.2 11.55 15.4 10.95 15.35 10.7 15.4 10.65 15.4 10.45 15.25 10.3 16.05 9.8 16.45 9.6 16.5 9.6 16.75 9.55 16.8 9.55 16.85 9.5 16.9 9.4 16.95 9.4 16.95 9.15 16.9 9.1 16.7 9.05 16.3 9.15 16.4 8.9 16.35 8.8 16.25 8.7 16.05 8.8 16.05 8.75 15.5 9.55 Q 15.4 9.55 15.05 9.85 L 14.6 10.4 14.4 10.5 14.1 10.5 13.9 10.55 13.85 10.5 13.4 10.6 13.25 10.7 13.15 10.9 13.35 11.05 13.6 11 13.6 11.05 13.65 11 13.8 11.05 14.1 11 14.15 11.05 14.15 11 14.25 11 14.25 11.05 14.3 11 14.35 11.05 14.15 11.3 14 11.65 14.2 11.85 14.3 11.8 14.45 11.75 14.5 11.7 15.05 11.35 15.45 11.6 15.85 11.95 15.85 11.9 15.9 12 16 12.05 15.95 12.05 16.05 12.1 16.05 12.15 16.5 12.45 16.05 12.8 15.65 13.2 15.65 13.15 15.5 13.55 15.5 13.65 14.8 13.15 14.65 13 13.65 12.25 13.65 12.3 13.15 11.9 13.15 11.85 13.05 11.85 12.85 11.65 12.7 11.55 12.6 11.35 12.55 11.4 12.45 11.05 12.3 10.7 12.7 9.8 12.75 9.8 12.75 9.7 12.8 9.7 13.9 8.5 13.95 8.5 16.25 6.45 16.45 6.4 16.55 6.45 18.25 6.4 Q 18.35 6.95 19 8.05 L 19.05 8.05 19.7 9 19.8 9.1 19.9 9.15 20.05 9.1 20.2 9 20.4 9.1 21.05 8.8 21.5 8.2 21.4 8 21.95 8 22.25 7.95 22.5 7.8 22.55 7.8 22.55 7.7 22.8 7.9 M 20.25 7.45 L 20.25 7.5 20.3 7.55 20.35 7.5 20.8 7.9 20.55 8.15 20.5 8.1 20.4 8.2 19.8 7.65 19.45 7.05 19.45 7.1 19.25 6.65 19.25 6.6 19.15 6.35 19.2 6.3 19.2 6.2 19.35 6.5 19.55 6.75 20.25 7.45 M 28.05 13.85 L 28 13.9 28 14.15 27.9 14.3 27.85 14.4 27.8 14.45 27.8 14.5 27.6 14.6 27.6 14.8 26.7 14.4 26.75 14.4 26.85 14.25 26.85 14.3 27.2 13.95 27.3 13.7 27.15 13.4 27.05 13.35 27.05 13.3 27 13.3 27.05 13.2 27.1 13.2 27.15 13.25 27.15 13.2 27.3 13.3 27.5 13.4 27.5 13.45 27.55 13.4 28.05 13.85 M 26.6 13.7 L 26.6 13.8 26.55 13.85 25.85 14.4 25.65 14.5 25.45 14.65 25.05 14.65 24.8 14.55 24.75 14.25 24.85 13.75 Q 25 13.45 25.25 13.55 L 25.4 13.5 25.55 13.4 25.6 13.4 25.55 13.55 25.5 13.65 25.6 13.85 25.8 13.95 26.25 13.85 26.2 13.85 26.6 13.7 M 23 12.8 L 23.25 12.95 23.3 12.9 24.05 13.1 23.45 14 23.45 14.3 23.25 14.3 23.2 14.25 23.15 14.3 23 14.2 23 14.25 22.35 13.95 22.3 13.95 21.85 13.85 21.05 13.5 21.75 12.35 21.85 12.5 22 12.6 21.95 12.7 22.1 12.9 22.3 12.9 22.45 12.75 22.5 12.8 22.7 12.7 23 12.8 M 24 14.3 L 24 14.05 24.3 13.6 Q 24.1548828125 13.8544921875 24.2 14.35 L 24.1 14.4 24 14.3 M 20.65 15.85 L 21.3 16.35 21.2 16.45 21.15 16.4 21 16.55 20.9 16.75 21.15 17.1 21.2 17.05 21.35 17.15 21.5 17.2 21.8 16.95 22.45 17.25 22.45 17.3 21.3 18 20.2 19.05 20.15 19.05 20.15 19.15 20.1 19.2 19.9 19.45 19.45 20.15 18.25 19.15 18.4 18.7 18.5 18.7 18.7 18.3 18.75 18.3 18.85 18.15 18.95 17.9 18.9 17.8 18.8 17.7 18.75 17.75 18.7 17.75 18.65 17.7 18.35 17.9 18.1 18.25 17.9 18.25 17.7 18.35 17.65 18.55 17.65 18.95 17.6 19 17.6 20.05 17.7 20.55 17.7 20.85 17.6 20.85 17.1 20.75 17.1 20.7 16.9 20.6 16.85 20.65 16 20.4 15.95 20.45 15.9 20.4 15.8 20.45 15.8 20.4 15.65 20.45 15.65 20.4 15.35 20.5 14.95 20.5 14.2 20.6 13.95 20.6 13.8 20.75 13.7 20.4 13.8 20.1 14.9 19.9 15.2 19.9 15.45 19.85 15.9 19.85 16 19.8 16.05 19.75 16.05 19.65 Q 16.05 19.45 15.7 19.5 L 15.7 19.45 15.65 19.5 15.25 19.4 14.9 19.4 14.3 19.5 14.25 19.45 13.85 19.55 14.5 19.05 14.55 19.05 14.7 18.9 14.9 18.6 14.85 18.45 14.7 18.45 Q 14.45 18.45 14.1 18.75 L 13.6 19.1 13.8 18.7 13.9 18.3 13.9 18.2 13.15 16.3 Q 13.15 15.85 13.75 15.05 L 13.9 14.8 14.15 14.6 14.6 14.8 14.6 14.85 14.9 15 15.25 15.05 15.25 15.1 16.25 15.1 16.55 15.15 16.75 15.1 17.1 15.35 17.1 15.4 17.9 15.8 18.15 15.7 18.95 15.95 19 15.9 19 15.95 19.35 15.95 19.6 15.8 19.85 15.6 19.85 15.65 19.9 15.55 20.1 15.25 20.15 15.25 20.2 15.35 20.25 15.35 20.65 15.85 M 21.5 18.55 L 21.5 18.5 22.3 18 22.4 18.1 22.6 18.35 23.2 19.25 23.15 19.25 23.65 20.2 24.45 21.1 24.5 21.2 24.45 21.2 24.6 21.6 24.6 21.95 24.5 22.25 24.4 22 24.4 21.95 24.3 21.75 24.1 21.55 Q 23.9 21.55 23.9 21.65 L 23.85 21.65 23.85 21.7 23.9 21.75 23.85 21.8 23.95 22.05 24 22.25 24 22.35 24.3 22.55 24.4 22.55 24.35 22.7 24.3 22.75 24.3 22.85 24.05 23.75 23.8 23.8 23.75 23.85 23.2 23.85 23.15 23.8 23 23.8 22.65 23.75 22.55 23.75 22.35 23.7 22.3 23.7 22.3 23.6 22.4 23.4 22.4 23.2 22.45 22.8 22.4 22.55 22.35 22.5 22.2 22.5 22.05 22.6 22.45 21.85 22.3 21.6 21.45 20.95 21.4 20.95 20.55 20.55 20.15 20.2 20.35 19.95 20.5 19.7 20.6 19.85 20.65 19.85 20.65 19.9 20.85 20.05 21 20.2 20.95 20.25 21.5 20.55 21.65 20.5 21.65 20.35 21.15 19.7 21.05 19.6 21.05 19.5 20.95 19.5 20.8 19.3 20.8 19.2 21.5 18.55 M 21.7 24.1 L 21.75 24.05 21.85 24.1 21.9 24.15 21.95 24.15 22.5 24.35 22.55 24.3 23.05 24.4 23.15 24.35 23.2 24.4 23.25 24.4 23.3 24.35 23.3 24.4 23.35 24.4 23.4 24.35 23.45 24.4 23.55 24.35 23.55 24.4 23.6 24.4 23.7 24.35 23.7 24.4 23.85 24.4 23.85 24.45 23.75 24.65 23.7 24.65 23.55 25 23.45 25.35 23.4 25.35 22.9 26.65 22.85 26.65 22.8 26.95 22.65 27.15 22.7 27.15 22.6 27.5 22.55 27.5 22.35 28.05 21.9 28.25 21.8 28.2 21.65 28.2 21.35 28.1 21.35 26.65 21.4 26.6 21.4 25.65 21.45 25.6 21.45 25 21.55 24.5 21.55 24.1 21.6 24 21.7 24.1 M 18.35 4.2 L 18.35 4.15 18.7 4.25 18.7 4.5 18.5 4.35 18.35 4.2 M 19.7 8.15 L 19.8 8.3 19.75 8.35 19.95 8.45 20.15 8.65 20.15 8.75 19.75 8.35 19.5 8.1 19.4 7.95 19.35 7.85 19.6 8.1 19.7 8.15 M 17.85 13.3 L 18.05 13.4 18.4 13.5 18.4 13.55 18.95 14.05 19.65 15.05 19.55 15.2 19.3 15.35 19.2 15.25 18.7 15.25 18.75 15.2 18.55 15.2 18.35 15.25 18.15 15.15 17.8 15.1 17.6 15.1 17.55 15.05 17.5 15.05 17.5 15 Q 17.3 15.05 16.85 14.5 L 16.8 14.5 16.75 14.45 16.75 14.4 16.6 14.3 16.5 14.15 Q 16.5 13.9 16.85 13.5 L 17.35 13.05 17.9 13.3 17.85 13.3 M 16.3 13.3 L 16.05 13.75 16 13.7 16.2 13.35 16.5 13.05 16.3 13.3 M 15.55 14.65 L 15.5 14.6 15.15 14.55 14.65 14.35 14.4 14.15 14.2 13.9 14.4 13.5 15.05 14 15.1 14.05 15.1 14.1 15.65 14.3 15.7 14.4 15.75 14.4 16.3 14.65 15.55 14.65 M 14.4 21.2 L 14.55 21.1 14.85 21.05 14.85 21.1 14.9 21.05 14.9 21.2 14.95 21.2 14.9 21.5 14.9 21.9 14.85 22 14.85 22.75 14.95 22.85 15 22.8 15.05 22.85 15.3 22.1 15.35 21.55 15.4 21.5 15.4 21.3 15.35 21.2 15.6 21 15.9 21 16.6 21.1 16.65 21.15 16.85 21.2 17.1 21.3 17.15 21.35 17.05 21.5 16.9 22.4 16.65 23.2 16.6 23.25 16.6 23.45 Q 16.7 23.9 16.3 24.15 L 15.6 24.5 14.85 25.15 14.65 25.05 14 24.55 14 24.5 13.9 24.5 13.95 24.45 13.65 24.15 13.45 23.8 14.3 23.2 14.4 23.35 14.5 23.35 14.7 23.2 14.75 23.05 14.7 22.75 14.7 22.8 14.4 21.2 M 12.8 24.4 L 13 24.1 13.35 24.65 13.8 25.1 Q 13.95 25.1 13.95 25.2 L 13.95 25.25 14.5 25.55 14.55 25.65 13.55 26.55 13.55 26.5 12.65 27.25 12.65 27.3 12.6 27.3 12 27.85 11.95 27.85 11.75 28.05 11.5 28.2 11.05 27.95 10.7 27.6 Q 10.7 27.3 11.05 27 L 11.55 26.55 11.9 26.05 12.7 24.55 12.75 24.55 Q 12.7 24.45 12.8 24.4 M 16.15 23.55 L 15.9 23.3 15.7 23.35 15.65 23.4 15.65 23.45 15.6 23.5 15.55 23.45 15.4 23.9 15.4 24.15 15.55 24.3 15.7 24.25 15.9 24.05 15.9 24.1 16.15 23.55 M 21.9 3.9 L 21.85 3.9 21.4 3.8 21.35 3.85 21.3 3.8 20.65 4 20.6 4.15 20.9 4.4 21.15 4.35 21.3 4.45 21.45 4.65 21.7 4.65 21.95 4.6 22.15 4.6 22.4 4.4 22.4 4.3 21.9 3.9 M 19.25 3.05 L 19.05 3.05 18.8 3 Q 18.55 3 18.55 3.15 L 18.6 3.25 18.75 3.4 19.25 3.45 19.9 3.35 20.05 3.25 20.1 3.15 20 3 19.95 2.95 19.8 2.95 19.25 3.05 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 13 24.1 L 12.8 24.4 Q 12.7 24.45 12.75 24.55 L 12.7 24.55 11.9 26.05 11.55 26.55 11.05 27 Q 10.7 27.3 10.7 27.6 L 11.05 27.95 11.5 28.2 11.75 28.05 11.95 27.85 12 27.85 12.6 27.3 12.65 27.3 12.65 27.25 13.55 26.5 13.55 26.55 14.55 25.65 14.5 25.55 13.95 25.25 13.95 25.2 Q 13.95 25.1 13.8 25.1 L 13.35 24.65 13 24.1 M 15.5 14.6 L 15.55 14.65 16.3 14.65 15.75 14.4 15.7 14.4 15.65 14.3 15.1 14.1 15.1 14.05 15.05 14 14.4 13.5 14.2 13.9 14.4 14.15 14.65 14.35 15.15 14.55 15.5 14.6 M 16.05 13.75 L 16.3 13.3 16.5 13.05 16.2 13.35 16 13.7 16.05 13.75 M 19.95 8.45 L 19.75 8.35 20.15 8.75 20.15 8.65 19.95 8.45 M 19.8 8.3 L 19.7 8.15 19.6 8.1 19.35 7.85 19.4 7.95 19.5 8.1 19.75 8.35 19.8 8.3 M 21.75 24.05 L 21.7 24.1 21.6 24 21.55 24.1 21.55 24.5 21.45 25 21.45 25.6 21.4 25.65 21.4 26.6 21.35 26.65 21.35 28.1 21.65 28.2 21.8 28.2 21.9 28.25 22.35 28.05 22.55 27.5 22.6 27.5 22.7 27.15 22.65 27.15 22.8 26.95 22.85 26.65 22.9 26.65 23.4 25.35 23.45 25.35 23.55 25 23.7 24.65 23.75 24.65 23.85 24.45 23.85 24.4 23.7 24.4 23.7 24.35 23.6 24.4 23.55 24.4 23.55 24.35 23.45 24.4 23.4 24.35 23.35 24.4 23.3 24.4 23.3 24.35 23.25 24.4 23.2 24.4 23.15 24.35 23.05 24.4 22.55 24.3 22.5 24.35 21.95 24.15 21.9 24.15 21.85 24.1 21.75 24.05 M 24 14.05 L 24 14.3 24.1 14.4 24.2 14.35 Q 24.1548828125 13.8544921875 24.3 13.6 L 24 14.05 M 23.25 12.95 L 23 12.8 22.7 12.7 22.5 12.8 22.45 12.75 22.3 12.9 22.1 12.9 21.95 12.7 22 12.6 21.85 12.5 21.75 12.35 21.05 13.5 21.85 13.85 22.3 13.95 22.35 13.95 23 14.25 23 14.2 23.15 14.3 23.2 14.25 23.25 14.3 23.45 14.3 23.45 14 24.05 13.1 23.3 12.9 23.25 12.95 M 22.9 7.95 L 22.8 7.9 22.55 7.7 22.55 7.8 22.5 7.8 22.25 7.95 21.95 8 21.4 8 21.5 8.2 21.05 8.8 20.4 9.1 20.2 9 20.05 9.1 19.9 9.15 19.8 9.1 19.7 9 19.05 8.05 19 8.05 Q 18.35 6.95 18.25 6.4 L 16.55 6.45 16.45 6.4 16.25 6.45 13.95 8.5 13.9 8.5 12.8 9.7 12.75 9.7 12.75 9.8 12.7 9.8 12.3 10.7 12.45 11.05 12.55 11.4 12.6 11.35 12.7 11.55 12.85 11.65 13.05 11.85 13.15 11.85 13.15 11.9 13.65 12.3 13.65 12.25 14.65 13 14.8 13.15 15.5 13.65 15.5 13.55 15.65 13.15 15.65 13.2 16.05 12.8 16.5 12.45 16.05 12.15 16.05 12.1 15.95 12.05 16 12.05 15.9 12 15.85 11.9 15.85 11.95 15.45 11.6 15.05 11.35 14.5 11.7 14.45 11.75 14.3 11.8 14.2 11.85 14 11.65 14.15 11.3 14.35 11.05 14.3 11 14.25 11.05 14.25 11 14.15 11 14.15 11.05 14.1 11 13.8 11.05 13.65 11 13.6 11.05 13.6 11 13.35 11.05 13.15 10.9 13.25 10.7 13.4 10.6 13.85 10.5 13.9 10.55 14.1 10.5 14.4 10.5 14.6 10.4 15.05 9.85 Q 15.4 9.55 15.5 9.55 L 16.05 8.75 16.05 8.8 16.25 8.7 16.35 8.8 16.4 8.9 16.3 9.15 16.7 9.05 16.9 9.1 16.95 9.15 16.95 9.4 16.9 9.4 16.85 9.5 16.8 9.55 16.75 9.55 16.5 9.6 16.45 9.6 16.05 9.8 15.25 10.3 15.4 10.45 15.4 10.65 15.35 10.7 15.4 10.95 16.2 11.55 16.25 11.55 16.25 11.6 16.8 12.05 16.8 12 16.85 12.05 16.9 12.05 16.9 12.1 17.4 12.5 18 12.8 18 12.75 18.65 13.05 18.65 13.1 18.75 13.1 19.2 13.6 19.2 13.55 19.7 14.25 19.75 14.25 19.75 14.3 19.8 14.25 20 14.7 20.05 14.7 20.15 14.55 20.15 14.25 20.3 13.8 20.5 13.45 20.7 13.2 20.9 12.75 20.9 12.8 21 12.65 21.1 12.55 21.1 12.45 21.15 12.45 21.25 12.1 21.55 11.5 21.65 11.4 21.65 11.45 21.75 11.15 21.75 11.2 22 10.7 Q 22.2 10.3 22.45 10.3 L 22.7 10.5 22.3 11.3 22 11.75 22.05 11.8 21.95 11.85 22 11.9 22.7 11.4 22.7 11.45 22.8 11.3 22.8 11.05 23.15 10.6 23.2 10.6 23.5 9.8 23.5 9.65 23.55 9.45 23.5 9.05 23.3 8.5 23 8.1 23 8.05 22.95 8 22.9 8 22.9 7.95 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 14.55 21.1 L 14.4 21.2 14.7 22.8 14.7 22.75 14.75 23.05 14.7 23.2 14.5 23.35 14.4 23.35 14.3 23.2 13.45 23.8 13.65 24.15 13.95 24.45 13.9 24.5 14 24.5 14 24.55 14.65 25.05 14.85 25.15 15.6 24.5 16.3 24.15 Q 16.7 23.9 16.6 23.45 L 16.6 23.25 16.65 23.2 16.9 22.4 17.05 21.5 17.15 21.35 17.1 21.3 16.85 21.2 16.65 21.15 16.6 21.1 15.9 21 15.6 21 15.35 21.2 15.4 21.3 15.4 21.5 15.35 21.55 15.3 22.1 15.05 22.85 15 22.8 14.95 22.85 14.85 22.75 14.85 22 14.9 21.9 14.9 21.5 14.95 21.2 14.9 21.2 14.9 21.05 14.85 21.1 14.85 21.05 14.55 21.1 M 15.9 23.3 L 16.15 23.55 15.9 24.1 15.9 24.05 15.7 24.25 15.55 24.3 15.4 24.15 15.4 23.9 15.55 23.45 15.6 23.5 15.65 23.45 15.65 23.4 15.7 23.35 15.9 23.3 M 18.05 13.4 L 17.85 13.3 17.9 13.3 17.35 13.05 16.85 13.5 Q 16.5 13.9 16.5 14.15 L 16.6 14.3 16.75 14.4 16.75 14.45 16.8 14.5 16.85 14.5 Q 17.3 15.05 17.5 15 L 17.5 15.05 17.55 15.05 17.6 15.1 17.8 15.1 18.15 15.15 18.35 15.25 18.55 15.2 18.75 15.2 18.7 15.25 19.2 15.25 19.3 15.35 19.55 15.2 19.65 15.05 18.95 14.05 18.4 13.55 18.4 13.5 18.05 13.4 M 21.5 18.5 L 21.5 18.55 20.8 19.2 20.8 19.3 20.95 19.5 21.05 19.5 21.05 19.6 21.15 19.7 21.65 20.35 21.65 20.5 21.5 20.55 20.95 20.25 21 20.2 20.85 20.05 20.65 19.9 20.65 19.85 20.6 19.85 20.5 19.7 20.35 19.95 20.15 20.2 20.55 20.55 21.4 20.95 21.45 20.95 22.3 21.6 22.45 21.85 22.05 22.6 22.2 22.5 22.35 22.5 22.4 22.55 22.45 22.8 22.4 23.2 22.4 23.4 22.3 23.6 22.3 23.7 22.35 23.7 22.55 23.75 22.65 23.75 23 23.8 23.15 23.8 23.2 23.85 23.75 23.85 23.8 23.8 24.05 23.75 24.3 22.85 24.3 22.75 24.35 22.7 24.4 22.55 24.3 22.55 24 22.35 24 22.25 23.95 22.05 23.85 21.8 23.9 21.75 23.85 21.7 23.85 21.65 23.9 21.65 Q 23.9 21.55 24.1 21.55 L 24.3 21.75 24.4 21.95 24.4 22 24.5 22.25 24.6 21.95 24.6 21.6 24.45 21.2 24.5 21.2 24.45 21.1 23.65 20.2 23.15 19.25 23.2 19.25 22.6 18.35 22.4 18.1 22.3 18 21.5 18.5 M 26.6 13.8 L 26.6 13.7 26.2 13.85 26.25 13.85 25.8 13.95 25.6 13.85 25.5 13.65 25.55 13.55 25.6 13.4 25.55 13.4 25.4 13.5 25.25 13.55 Q 25 13.45 24.85 13.75 L 24.75 14.25 24.8 14.55 25.05 14.65 25.45 14.65 25.65 14.5 25.85 14.4 26.55 13.85 26.6 13.8 M 28 13.9 L 28.05 13.85 27.55 13.4 27.5 13.45 27.5 13.4 27.3 13.3 27.15 13.2 27.15 13.25 27.1 13.2 27.05 13.2 27 13.3 27.05 13.3 27.05 13.35 27.15 13.4 27.3 13.7 27.2 13.95 26.85 14.3 26.85 14.25 26.75 14.4 26.7 14.4 27.6 14.8 27.6 14.6 27.8 14.5 27.8 14.45 27.85 14.4 27.9 14.3 28 14.15 28 13.9 M 20.25 7.5 L 20.25 7.45 19.55 6.75 19.35 6.5 19.2 6.2 19.2 6.3 19.15 6.35 19.25 6.6 19.25 6.65 19.45 7.1 19.45 7.05 19.8 7.65 20.4 8.2 20.5 8.1 20.55 8.15 20.8 7.9 20.35 7.5 20.3 7.55 20.25 7.5 M 21.65 3.25 L 21.6 3.25 20.4 3.8 19.65 4.3 19.65 4.5 19.45 4.65 19.55 4.75 19.6 4.75 19.8 4.95 19.8 5 19.75 5 19.8 5.05 19.75 5.15 19.7 5.3 19.85 6.05 20.15 6.6 20.8 7.3 20.85 7.25 21.2 7.55 21.25 7.5 21.25 7.55 21.35 7.5 21.4 7.55 21.5 7.5 21.6 7.55 21.65 7.5 21.65 7.55 21.85 7.55 22 7.5 22.05 7.55 22.15 7.4 22.4 6.75 22.2 6.85 21.6 6.75 Q 21.25 6.55 21.25 6.35 L 21.35 6.1 21.6 6.1 22 6.15 22.35 6.25 22.4 6.2 22.55 6.3 22.65 6.3 22.65 6.35 22.8 6.15 22.8 6.1 22.35 6.05 22.1 5.8 22.2 5.65 22.35 5.5 22.4 5.55 22.5 5.5 22.6 5.55 22.65 5.5 22.6 5.3 22.6 4.85 Q 22.6 4.6 22.95 4.45 L 23.45 4.35 23.45 3.45 22.9 3.45 22.5 3.25 22.2 3.05 Q 22.15 3.05 22.05 3.15 L 21.95 3.2 21.9 3.2 21.65 3.25 M 21.85 3.9 L 21.9 3.9 22.4 4.3 22.4 4.4 22.15 4.6 21.95 4.6 21.7 4.65 21.45 4.65 21.3 4.45 21.15 4.35 20.9 4.4 20.6 4.15 20.65 4 21.3 3.8 21.35 3.85 21.4 3.8 21.85 3.9 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 18.35 4.15 L 18.35 4.2 18.5 4.35 18.7 4.5 18.7 4.25 18.35 4.15 M 23.25 2.05 L 23 1.6 22.6 1.1 22.25 1.35 21.75 1.2 21.35 0.95 20.9 0.8 20.75 1.1 20.65 1.2 20.3 1.25 20.1 1.4 20.1 1.35 20.05 1.35 Q 20 1.35 19.3 1.8 L 19.45 1.95 19.45 2.15 18.7 2.85 18.25 3.15 18.3 3.25 18.25 3.4 18.15 3.55 18.3 3.8 18.35 3.8 18.45 3.75 18.5 3.8 18.6 3.8 18.6 3.75 19 3.85 19.05 3.8 19.05 3.85 19.2 3.85 19.35 3.65 19.6 3.55 19.6 3.6 20.3 3.35 20.4 3.4 20.35 3.35 20.55 3.25 20.6 3.25 20.9 3.05 20.95 3.05 21.35 2.95 Q 21.65 2.8 21.7 2.8 L 21.75 2.8 21.75 2.6 21.65 2.6 21.6 2.55 21.15 2.5 20.85 2.55 20.3 2.55 19.85 2.65 19.7 2.5 19.8 2.35 20 2.25 21.55 2.15 21.55 2.2 22.15 2.35 22.2 2.4 22.25 2.6 22.3 2.6 22.8 2.7 22.85 2.8 Q 22.85 3.1 23.65 3.1 24.05 3.1 24.05 2.95 L 24.3 2.75 23.85 2.25 23.85 2.05 23.9 2.05 23.9 1.95 23.6 2.05 23.25 2.05 M 19.05 3.05 L 19.25 3.05 19.8 2.95 19.95 2.95 20 3 20.1 3.15 20.05 3.25 19.9 3.35 19.25 3.45 18.75 3.4 18.6 3.25 18.55 3.15 Q 18.55 3 18.8 3 L 19.05 3.05 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 21.3 16.35 L 20.65 15.85 20.25 15.35 20.2 15.35 20.15 15.25 20.1 15.25 19.9 15.55 19.85 15.65 19.85 15.6 19.6 15.8 19.35 15.95 19 15.95 19 15.9 18.95 15.95 18.15 15.7 17.9 15.8 17.1 15.4 17.1 15.35 16.75 15.1 16.55 15.15 16.25 15.1 15.25 15.1 15.25 15.05 14.9 15 14.6 14.85 14.6 14.8 14.15 14.6 13.9 14.8 13.75 15.05 Q 13.15 15.85 13.15 16.3 L 13.9 18.2 13.9 18.3 13.8 18.7 13.6 19.1 14.1 18.75 Q 14.45 18.45 14.7 18.45 L 14.85 18.45 14.9 18.6 14.7 18.9 14.55 19.05 14.5 19.05 13.85 19.55 14.25 19.45 14.3 19.5 14.9 19.4 15.25 19.4 15.65 19.5 15.7 19.45 15.7 19.5 Q 16.05 19.45 16.05 19.65 L 16.05 19.75 16 19.8 15.9 19.85 15.45 19.85 15.2 19.9 14.9 19.9 13.8 20.1 13.7 20.4 13.8 20.75 13.95 20.6 14.2 20.6 14.95 20.5 15.35 20.5 15.65 20.4 15.65 20.45 15.8 20.4 15.8 20.45 15.9 20.4 15.95 20.45 16 20.4 16.85 20.65 16.9 20.6 17.1 20.7 17.1 20.75 17.6 20.85 17.7 20.85 17.7 20.55 17.6 20.05 17.6 19 17.65 18.95 17.65 18.55 17.7 18.35 17.9 18.25 18.1 18.25 18.35 17.9 18.65 17.7 18.7 17.75 18.75 17.75 18.8 17.7 18.9 17.8 18.95 17.9 18.85 18.15 18.75 18.3 18.7 18.3 18.5 18.7 18.4 18.7 18.25 19.15 19.45 20.15 19.9 19.45 20.1 19.2 20.15 19.15 20.15 19.05 20.2 19.05 21.3 18 22.45 17.3 22.45 17.25 21.8 16.95 21.5 17.2 21.35 17.15 21.2 17.05 21.15 17.1 20.9 16.75 21 16.55 21.15 16.4 21.2 16.45 21.3 16.35 Z\"/>\n</g>\n";

Asserts.sp_svg_player_back_right = "<g id=\"sp_svg_player_back_right\" sp-width=\"37\" sp-height=\"37\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 26.5 29.95 Q 26.45 29.75 25.4 29.15 L 24.55 28.75 23.1 30.7 25.2 33.1 25.8 33.9 25.85 34.1 25.75 34.35 Q 25.7 34.7 26.35 35.3 L 26.95 35.5 Q 27 35.1 27.35 34.6 L 28 33.65 28.1 33.45 27.85 32.8 27.35 32 27.05 31.25 Q 26.8 31 26.5 29.95 M 20.25 22 L 20.35 21.45 20.2 21.25 19.35 20.5 18.8 20.25 18.3 20.1 17.8 20.15 Q 17.7 20.25 17.75 20.45 L 17.75 20.75 17.5 21.05 16.55 20.5 16.2 20.45 Q 16.05 20.4 15.9 20.6 L 15.9 20.85 16.45 21.4 16.75 21.6 17.05 21.75 17.25 21.95 16.7 22.2 16.5 22.6 13.4 21 Q 11.6 20.15 10.85 20.15 L 9.15 19.95 8.45 19.65 Q 9.15 19.65 8.95 19.3 L 8.25 18.65 8.15 18.45 8.1 18.3 7.45 18.05 6.5 17.3 6.65 17.1 6.6 16.85 6 16.35 5.75 16.2 5.4 16.2 5.45 16.25 5.35 16.2 4.85 15.9 4.5 15.85 4.15 15.95 1.6 15.6 1.45 15.65 1.45 15.75 1.3 15.8 1.15 15.8 0.1 16.2 0 16.8 0.05 17.35 0.35 17.6 0.45 17.65 0.65 17.65 0.7 17.6 0.75 17.65 Q 0.75 17.95 1.3 18.25 L 1.95 18.5 2 18.65 2 18.85 3 19.15 3.1 19.25 3 19.3 3.65 19.55 4.05 19.6 4.4 19.6 4.15 19.9 3.45 19.95 2.8 20.4 2.45 20.9 2.45 21.3 2.4 21.7 2.4 22.5 Q 2.45 23 2.9 23.35 L 3.85 23.7 4.8 23.85 6.85 23.6 7.3 24.1 7.55 24.45 8.9 25.3 9.05 25.6 9.35 26 10.75 26.9 12.05 27.55 13.7 28.95 14.8 29.3 15.85 29.8 Q 15.45 30.25 15.9 31.15 L 16.95 32.7 17.15 33.15 Q 17.1 34.15 17.65 34.65 L 19.3 35 18.9 34.55 Q 18.9 34.15 19.4 33.4 L 19.35 33.35 19.7 31.75 19.5 30.35 19.35 30.05 18.45 29.05 18.1 28.8 18.1 28.7 18.25 28.8 18.3 28.7 20 29.4 20.7 29.35 20.95 29.45 20.95 29.4 Q 21.15 28.55 21.7 27.6 L 20.15 27.05 19.7 26.75 19.6 26.75 18.95 26.35 17.15 25.6 15.95 25.35 15.55 25.1 15.5 24.95 15.35 24.75 Q 14.8 24.6 14.8 24.5 L 14.7 24.5 14.75 24.45 14.45 24.3 14.15 24.1 13.85 23.2 17.8 24.55 18.5 24.7 19.55 24.15 Q 20.15 23.65 19.9 23.4 20.25 23.1 20.05 22.6 20 22.45 20.25 22 Z\"/>\n\n  <path fill=\"#040404\" stroke=\"none\" d=\" M 34.5 10.45 L 34.2 10.25 34.1 9.9 34.1 9.5 33.85 9.35 Q 33.5 9.35 33.25 9.9 L 33.1 10.7 33.3 11.8 33.15 12 32.2 12.7 31.6 13.25 30.3 10.4 29.8 9.6 Q 29.15 8.7 28.3 8.7 L 27.45 8.6 Q 27 8.45 26.9 7.95 L 26.75 7.85 26.65 7.7 26.65 7.65 27.25 7.65 27.45 7.6 27.7 6.95 27.75 5.9 28 5.5 27.7 4.9 27.75 4.45 27.55 3.65 28.15 2.8 28.05 2.35 28.1 1.8 27.85 1.8 27.7 1.85 27.6 1.8 27.6 1.7 27.7 1.4 27.6 1.2 Q 27.5 1.05 27.35 1.05 L 26.85 1.25 24.65 0.65 24.5 0.9 Q 23.65 1.05 22.75 1.6 L 21.8 2.7 21.2 3.75 21.2 4.05 Q 21.65 3.95 21.65 4.2 L 21.5 4.45 21.4 4.7 21.45 4.75 21.45 4.85 21.4 4.95 21.35 5.1 21.6 5.4 21.8 5.8 21.5 6.35 21.8 6.55 22.1 6.85 22 7.25 Q 22 7.5 22.5 7.5 L 22.85 7.5 23.05 7.65 Q 23.05 8.15 22.1 8.35 L 21.1 8.5 Q 20.05 9.25 19.1 10.7 L 17.5 13.15 Q 17.15 13.7 17.15 14.2 17.15 14.6 17.5 14.9 L 18.3 15.2 20.65 14.8 20.8 15 20.85 15.25 20.5 16.6 20.5 17.1 21 17.9 20.55 19.2 Q 20.55 19.9 21.05 20.8 21.55 21.75 21.55 22.4 L 21.55 24.3 22.2 24.95 Q 22.7 25.55 22.7 26 L 21.7 27.6 Q 21.15 28.55 20.95 29.4 L 20.95 29.45 20.65 30.85 20.15 32.25 19.4 33.35 19.4 33.4 Q 18.9 34.15 18.9 34.55 L 19.3 35 19.5 35.1 20.25 35.25 21.9 34.95 Q 23.2 34.55 23.2 33.8 L 21.95 32.35 22.95 30.85 23.1 30.7 24.55 28.75 25.1 27.8 25.8 26.2 25.8 25.7 26 24.35 25.95 24.25 25.95 24.2 Q 25.95 24 26.1 23.95 L 26.35 23.85 27.55 25.2 27.8 25.15 28.05 25.05 29.6 26.35 28.95 27.8 28.6 29.45 28.6 29.9 28.5 30.35 28.5 31.3 28.35 32.55 28.1 33.45 28 33.65 27.35 34.6 Q 27 35.1 26.95 35.5 L 26.95 35.6 Q 26.95 36.05 28.2 36.4 L 29.75 36.65 31.1 36.5 Q 32.2 36.25 32.2 35.7 L 30.15 33.8 32.95 26.25 32.35 24.1 31.45 22.6 30.2 21.25 29.75 20.1 Q 29.45 19.35 28.95 19.05 L 28.7 18.6 27.85 18.15 27.65 17.65 27.85 17.1 27.85 16.95 Q 27.45 16.9 27.45 16.25 L 27.45 15.65 28.2 13.95 28.3 13.95 29.6 15.45 Q 30.75 16.7 31.25 16.7 31.9 16.7 33.25 15.4 L 34.8 13.8 35.05 13.3 Q 35.2 12.85 36.1 11.95 36.9 11.15 36.9 10.55 L 36.8 10.15 36.6 9.65 36.4 8.8 Q 36.35 8.6 36.15 8.6 35.9 8.6 35.7 8.9 L 35.05 10.15 Q 34.8 10.45 34.5 10.45 M 33.5 10.1 L 33.6 9.9 33.75 9.9 33.8 10.4 34.1 10.85 Q 34.8 10.85 35.25 10.35 L 36 9.05 36.15 9.05 36.15 9.55 35.9 10.15 35.6 10.65 35.6 10.8 35.75 10.85 36.15 10.35 36.15 10.55 36.1 10.7 36.05 10.8 36.05 10.95 36.15 11 36.3 10.85 36.45 10.65 36.45 10.9 35.8 11.9 34.95 12.55 34.5 11.95 33.6 11.6 Q 33.45 11.5 33.45 11.1 L 33.5 10.95 33.55 10.85 33.5 10.8 33.5 10.1 M 33.95 12.15 L 34.2 12.15 34.45 12.45 34.65 12.85 33.95 12.15 M 27.3 1.55 L 27.35 1.55 27.35 1.75 27.3 1.85 27.3 1.9 27.7 2.25 27.7 2.45 27.65 2.6 27.55 2.75 27.7 2.95 27.7 3.05 26.85 3.85 26.35 4.8 26.1 5.05 Q 25.85 5.2 25.85 5.25 L 25.95 5.4 26 5.35 26.1 5.3 26.25 5.3 26.25 5.6 25.85 6.75 24.9 7.4 24.4 7.3 23.7 7.4 Q 23.65 7.1 23.35 7.1 L 22.8 7.2 22.45 7.15 22.45 6.65 22 6.25 22.1 5.8 21.9 5.4 21.7 4.85 22.1 4.05 21.7 3.65 Q 21.7 3.3 23.05 1.75 L 25.05 0.95 26.95 1.55 27.2 1.5 27.3 1.55 M 26.75 4.55 L 26.95 4.15 27.25 3.85 27.4 4.35 27.3 4.9 27.45 5.85 27.35 6.55 27.35 7.05 27.2 7.3 26.8 7.3 26.7 6.9 26.55 6.75 Q 26.35 6.75 26.35 7.15 L 26.35 7.6 26.2 7.85 25.85 7.9 25.05 7.9 25.7 7.35 26.3 6.7 26.45 5.85 26.7 5.4 26.8 5.05 26.75 4.55 M 25.3 8.8 L 25.1 8.5 Q 24.45 8.3 25.15 8.25 L 26.4 8.2 26.65 8.35 26.25 8.7 26.45 8.95 26.75 9 27 8.9 Q 28.6 8.45 30 10.85 30.55 11.75 30.9 12.85 L 31.25 14.5 31.85 15.3 32.2 14.95 32.2 14.8 32.55 14.65 32.4 14.1 32.1 13.65 Q 32.1 13.25 33.4 12.45 33.75 12.45 34.05 12.8 L 34.4 13.4 31.85 15.95 Q 31.1 16.4 30.6 15.95 L 30.15 15.4 29.65 14.6 Q 28.85 13.55 27.8 13 L 27.6 13.15 27.65 13.4 27.7 13.55 27.35 13.75 27.45 14.1 27.65 14.05 27.4 14.85 Q 27.05 15.65 27.05 16 L 27.4 17.25 27.1 17.7 26.65 17.95 25.9 17.95 25.1 17.85 25.6 17.65 26 17.35 25.65 17.05 23.95 17.85 22.95 17.15 22.6 17.35 22.45 17.6 21.55 17.55 20.95 17 21.2 14.5 Q 21.15 12.4 20.9 12.25 L 19.25 14.05 19.55 14.35 19.8 14.15 19.9 14 19.9 14.2 20.25 14.3 20.55 13.55 20.6 14.35 Q 18.4 15 17.95 14.35 17.55 13.8 18.3 12.45 18.95 11.35 20.05 10.15 L 21.45 8.9 23.05 8.6 24.2 9 Q 25.2 9.2 25.3 8.8 M 21.45 18.1 L 24.45 18.45 27.35 18.2 27.75 18.6 Q 27.15 19.15 26.65 20.05 L 26.9 20.25 27.3 20.4 28.35 18.95 30.9 22.65 29.45 24.05 Q 28.35 24.75 27.6 24.7 L 25.8 22.45 26.8 22.45 26.9 22.3 25.25 21.65 23.7 21.25 23.45 21.45 23.85 21.75 24.55 22.05 Q 25.6 22.6 25.85 23.65 25.1 24.55 24 24.55 L 21.95 24.15 21.9 22.45 21.7 21.3 21.35 20.45 21.15 19.55 Q 21.15 18.95 21.45 18.1 M 25.4 24.5 L 25.6 24.5 25.6 25.3 25.5 26.05 Q 25.45 26.95 24.55 28.1 L 24.25 27.95 24.05 27.7 24.1 27.45 24.2 27.25 24.05 27.05 23.75 27.6 22.7 27.3 22.25 27.3 22.15 27.25 22.15 27.1 22.75 26.55 23.1 26.15 22.7 25.25 22.7 25.05 23.8 25.05 23.95 25.25 23.95 25.95 24.1 26.15 24.15 26.15 24.25 26.05 24.25 25.2 Q 24.25 24.95 24.7 24.8 L 25.4 24.5 M 31.15 23.05 L 31.9 23.8 32.6 26.3 32.35 27.3 31.75 28 31.25 27.9 30.9 27.7 31.1 27.3 30.95 27.15 Q 30.8 27.15 30.75 27.45 L 30.45 27.75 29.9 27.65 29.45 27.5 29.45 27.4 29.65 26.9 30 26.45 30.15 26.55 30.25 26.6 30.4 26.5 28.55 24.95 29.45 24.45 30.35 25.45 30.45 25.3 29.85 24.3 31.15 23.05 M 29.75 28.1 L 29.75 28.05 31.8 28.5 29.75 33.75 28.95 33.7 Q 28.5 33.55 28.5 33.15 L 28.95 30.2 Q 29.05 28.7 29.35 28.1 L 29.75 28.1 M 23.15 27.9 L 24.2 28.45 24.1 28.55 22.6 30.75 21.05 32.5 20.7 32.25 22 27.7 23.15 27.9 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 24.2 28.45 L 23.15 27.9 22 27.7 20.7 32.25 21.05 32.5 22.6 30.75 24.1 28.55 24.2 28.45 M 29.75 28.05 L 29.75 28.1 29.35 28.1 Q 29.05 28.7 28.95 30.2 L 28.5 33.15 Q 28.5 33.55 28.95 33.7 L 29.75 33.75 31.8 28.5 29.75 28.05 M 25.1 8.5 L 25.3 8.8 Q 25.2 9.2 24.2 9 L 23.05 8.6 21.45 8.9 20.05 10.15 Q 18.95 11.35 18.3 12.45 17.55 13.8 17.95 14.35 18.4 15 20.6 14.35 L 20.55 13.55 20.25 14.3 19.9 14.2 19.9 14 19.8 14.15 19.55 14.35 19.25 14.05 20.9 12.25 Q 21.15 12.4 21.2 14.5 L 20.95 17 21.55 17.55 22.45 17.6 22.6 17.35 22.95 17.15 23.95 17.85 25.65 17.05 26 17.35 25.6 17.65 25.1 17.85 25.9 17.95 26.65 17.95 27.1 17.7 27.4 17.25 27.05 16 Q 27.05 15.65 27.4 14.85 L 27.65 14.05 27.45 14.1 27.35 13.75 27.7 13.55 27.65 13.4 27.6 13.15 27.8 13 Q 28.85 13.55 29.65 14.6 L 30.15 15.4 30.6 15.95 Q 31.1 16.4 31.85 15.95 L 34.4 13.4 34.05 12.8 Q 33.75 12.45 33.4 12.45 32.1 13.25 32.1 13.65 L 32.4 14.1 32.55 14.65 32.2 14.8 32.2 14.95 31.85 15.3 31.25 14.5 30.9 12.85 Q 30.55 11.75 30 10.85 28.6 8.45 27 8.9 L 26.75 9 26.45 8.95 26.25 8.7 26.65 8.35 26.4 8.2 25.15 8.25 Q 24.45 8.3 25.1 8.5 M 34.2 12.15 L 33.95 12.15 34.65 12.85 34.45 12.45 34.2 12.15 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 31.9 23.8 L 31.15 23.05 29.85 24.3 30.45 25.3 30.35 25.45 29.45 24.45 28.55 24.95 30.4 26.5 30.25 26.6 30.15 26.55 30 26.45 29.65 26.9 29.45 27.4 29.45 27.5 29.9 27.65 30.45 27.75 30.75 27.45 Q 30.8 27.15 30.95 27.15 L 31.1 27.3 30.9 27.7 31.25 27.9 31.75 28 32.35 27.3 32.6 26.3 31.9 23.8 M 25.6 24.5 L 25.4 24.5 24.7 24.8 Q 24.25 24.95 24.25 25.2 L 24.25 26.05 24.15 26.15 24.1 26.15 23.95 25.95 23.95 25.25 23.8 25.05 22.7 25.05 22.7 25.25 23.1 26.15 22.75 26.55 22.15 27.1 22.15 27.25 22.25 27.3 22.7 27.3 23.75 27.6 24.05 27.05 24.2 27.25 24.1 27.45 24.05 27.7 24.25 27.95 24.55 28.1 Q 25.45 26.95 25.5 26.05 L 25.6 25.3 25.6 24.5 M 26.95 4.15 L 26.75 4.55 26.8 5.05 26.7 5.4 26.45 5.85 26.3 6.7 25.7 7.35 25.05 7.9 25.85 7.9 26.2 7.85 26.35 7.6 26.35 7.15 Q 26.35 6.75 26.55 6.75 L 26.7 6.9 26.8 7.3 27.2 7.3 27.35 7.05 27.35 6.55 27.45 5.85 27.3 4.9 27.4 4.35 27.25 3.85 26.95 4.15 M 33.6 9.9 L 33.5 10.1 33.5 10.8 33.55 10.85 33.5 10.95 33.45 11.1 Q 33.45 11.5 33.6 11.6 L 34.5 11.95 34.95 12.55 35.8 11.9 36.45 10.9 36.45 10.65 36.3 10.85 36.15 11 36.05 10.95 36.05 10.8 36.1 10.7 36.15 10.55 36.15 10.35 35.75 10.85 35.6 10.8 35.6 10.65 35.9 10.15 36.15 9.55 36.15 9.05 36 9.05 35.25 10.35 Q 34.8 10.85 34.1 10.85 L 33.8 10.4 33.75 9.9 33.6 9.9 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 24.45 18.45 L 21.45 18.1 Q 21.15 18.95 21.15 19.55 L 21.35 20.45 21.7 21.3 21.9 22.45 21.95 24.15 24 24.55 Q 25.1 24.55 25.85 23.65 25.6 22.6 24.55 22.05 L 23.85 21.75 23.45 21.45 23.7 21.25 25.25 21.65 26.9 22.3 26.8 22.45 25.8 22.45 27.6 24.7 Q 28.35 24.75 29.45 24.05 L 30.9 22.65 28.35 18.95 27.3 20.4 26.9 20.25 26.65 20.05 Q 27.15 19.15 27.75 18.6 L 27.35 18.2 24.45 18.45 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 27.35 1.55 L 27.3 1.55 27.2 1.5 26.95 1.55 25.05 0.95 23.05 1.75 Q 21.7 3.3 21.7 3.65 L 22.1 4.05 21.7 4.85 21.9 5.4 22.1 5.8 22 6.25 22.45 6.65 22.45 7.15 22.8 7.2 23.35 7.1 Q 23.65 7.1 23.7 7.4 L 24.4 7.3 24.9 7.4 25.85 6.75 26.25 5.6 26.25 5.3 26.1 5.3 26 5.35 25.95 5.4 25.85 5.25 Q 25.85 5.2 26.1 5.05 L 26.35 4.8 26.85 3.85 27.7 3.05 27.7 2.95 27.55 2.75 27.65 2.6 27.7 2.45 27.7 2.25 27.3 1.9 27.3 1.85 27.35 1.75 27.35 1.55 Z\"/>\n</g>\n";

Asserts.sp_svg_player_back_left = "<g id=\"sp_svg_player_back_left\" sp-width=\"33\" sp-height=\"37\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 21.2 25.65 L 20.85 25.35 20.45 25.75 Q 20.4 25.95 20.7 26.55 L 21.05 27.2 21.4 28.9 21.4 29.3 21.5 29.8 21.5 30.75 21.55 30.9 26.05 33 25.4 33.5 25.6 33.95 Q 25.9 34.3 26.3 34.25 L 29.5 34.7 29.8 34.65 28.1 34.4 Q 26.85 34 26.85 33.25 L 27.35 32.5 25.1 30.8 Q 23.75 29.95 22.4 29.45 L 22.4 28.95 22.85 28.65 21.6 27.2 21.6 26.55 21.2 25.65 M 8.8 15.45 L 8.6 15.45 8.4 15.4 8.2 15.3 7.9 15.25 7.25 15.35 6.7 15.55 6.1 15.6 5.25 15.55 Q 5.07734375 15.6794921875 5.35 15.85 L 5.05 15.9 5.05 16 5.55 16.55 6.45 16.95 Q 6.5 17.3 7 17.7 L 6.9 17.95 7.2 18.1 8.1 18.95 9.25 19.3 9.15 19.45 Q 9.1 19.55 9.2 19.65 L 7.85 19.8 Q 7.1 19.8 7.1 20.7 L 7.25 21.9 7.2 22.1 7.2 22.25 5.05 21.6 4.9 21.4 4.9 21.25 4.8 21.05 4.2 20.5 Q 4.1 20.4 3.65 20.25 L 3.05 20.1 2.85 20.15 3.05 20.7 1.5 20.1 Q 0.75 19.7 0.25 19.75 L 0.1 19.9 0 20.15 0.65 20.9 7.3 23.85 9.45 24.35 9.9 24.25 10.15 24.05 11 22.85 12.55 23.75 12.7 23.95 12.65 24.1 12.8 24.15 12.75 24.15 Q 12.95 24.25 12.65 24.4 L 13.2 24.75 13.25 25 13 25.15 12.6 25.25 12.35 25.8 12.3 26 12.45 26.4 12.35 26.4 12.45 26.7 12.4 26.95 12.1 27.2 Q 11.65 27.45 11.9 27.7 L 11.7 28.05 Q 11.5 28.4 11.6 28.85 11.6 29.4 12.05 29.6 L 18.6 33.75 18.3 34.25 Q 16.9 34.55 17.7 35 L 17.8 35.05 19.85 33.2 19.65 32.7 18.15 31.35 Q 16.45 29.9 15.75 29.65 L 16.15 29.3 Q 16.5 29 16.65 29 L 17.4 29.05 17.65 28.35 17.9 28.45 17.95 28.4 18.05 28.45 17.05 25.7 17.25 24.75 17.65 23.55 18.55 22.05 19.15 21.35 19.25 21.25 16.45 20.05 14.8 19.6 14.4 19.55 14.05 19.55 13.25 19.25 13.85 19.2 Q 14.2 19.15 14 18.95 L 13.7 18.8 Q 13.5 18.65 13.9 18.65 L 14.05 18.5 13.75 18.35 13.45 18.15 13.5 18.05 13.55 17.9 12.9 17.3 12.9 17.25 13 17.3 13.25 17.3 13.25 17.25 13 17 10.65 15.85 8.8 15.45 Z\"/>\n\n  <path fill=\"#040404\" stroke=\"none\" d=\" M 25.5 0.3 L 25.35 0.1 24.1 0.4 23.8 0.6 23.15 0.7 22.65 0.5 22.4 0.6 22.35 0.85 22.4 1.1 22.4 1.25 22.3 1.3 22.15 1.25 22.05 1.2 21.9 1.25 21.95 1.8 21.95 2.05 21.9 2.25 22.15 2.7 22.45 3.1 22.25 3.85 22.35 4.35 22.05 4.9 22.25 5.3 22.3 6.4 22.55 7.05 23.1 7.1 23.35 7.1 23.35 7.15 23.25 7.3 23.1 7.4 22.55 8.05 21.7 8.15 Q 20.85 8.15 20.2 9.05 L 19.7 9.85 18.4 12.7 17.8 12.15 16.85 11.45 16.7 11.25 16.9 10.1 16.75 9.35 Q 16.5 8.8 16.15 8.8 L 15.95 8.9 15.95 9.35 15.8 9.7 15.5 9.85 Q 15.05 9.85 14.6 8.95 L 14.3 8.35 13.85 8.05 Q 13.65 8.05 13.6 8.2 13.4 8.6 13.45 9.1 L 13.1 10 Q 13.05 10.55 13.9 11.4 L 14.55 12.05 15.25 13.2 16.75 14.8 Q 18.1 16.15 18.75 16.15 19.2 16.15 20.4 14.85 L 21.7 13.35 21.8 13.35 22.55 15.1 22.55 15.7 Q 22.55 16.35 22.15 16.35 L 22.15 16.55 22.35 17.05 22.15 17.6 21.3 18 21.1 18.5 Q 20.55 18.8 20.25 19.5 L 19.85 20.7 19.25 21.25 19.15 21.35 18.55 22.05 17.65 23.55 17.25 24.75 17.05 25.7 18.05 28.45 19.65 32.7 19.85 33.2 17.8 35.05 17.8 35.15 Q 17.75 35.65 18.9 35.9 L 20.25 36.1 21.8 35.8 Q 23.05 35.45 23.05 35.05 L 22.65 34.05 22 33.1 21.65 31.95 21.55 30.9 21.5 30.75 21.5 29.8 21.4 29.3 21.4 28.9 21.05 27.2 20.7 26.55 Q 20.4 25.95 20.45 25.75 L 20.85 25.35 21.15 25.05 Q 21.85 24.5 21.95 24.5 L 22.45 24.6 23.65 23.25 23.9 23.4 24.05 23.6 24.05 23.7 24 23.75 24.2 25.15 24.2 25.65 Q 24.2 26.05 24.9 27.25 L 28.05 31.75 27.35 32.5 26.85 33.25 Q 26.85 34 28.1 34.4 L 29.8 34.65 30.55 34.5 31.1 33.95 30.6 32.75 29.85 31.7 29.35 30.3 29.05 28.8 28.05 26.5 27.5 25.75 27.3 25.4 Q 27.3 25 27.8 24.4 L 28.45 23.75 28.45 21.85 Q 28.45 21.2 28.95 20.25 L 29.45 18.6 29 17.3 29.5 16.5 29.5 16.05 29.15 14.7 29.2 14.4 29.35 14.2 31.7 14.65 32.5 14.35 32.9 13.65 Q 32.9 13.15 32.5 12.6 L 30.9 10.1 Q 29.95 8.7 28.9 7.95 L 27.9 7.8 Q 27 7.6 27 7.05 L 27.5 6.95 Q 28 6.9 28 6.7 L 27.9 6.3 Q 27.9 6 28.2 5.95 L 28.4 5.95 28.5 5.8 28.2 5.2 28.65 4.5 28.55 4.3 28.6 4.2 28.6 4.15 28.35 3.6 28.8 3.5 28.8 3.2 28.2 2.15 27.25 1 25.5 0.3 M 25.8 0.65 L 26.95 1.15 Q 28.3 2.75 28.3 3.1 L 28.1 3.25 27.9 3.5 28.3 4.3 28.1 4.85 27.9 5.25 28 5.65 Q 27.6 5.9 27.55 6.1 L 27.55 6.6 27.2 6.65 26.9 6.55 26.65 6.5 Q 26.35 6.5 26.3 6.85 L 25.6 6.75 25.1 6.85 Q 24.6 6.85 24.15 6.15 23.8 5.55 23.8 5 L 23.8 4.75 23.9 4.75 24 4.8 24.05 4.85 24.15 4.7 23.65 4.2 23.15 3.3 22.35 2.5 22.35 2.35 22.45 2.2 22.35 2.05 22.3 1.85 22.3 1.7 Q 22.7 1.5 22.7 1.35 L 22.7 1.25 22.65 1.2 22.65 1 22.8 0.95 23.05 1 24 0.7 Q 24.65 0.4 24.95 0.4 L 25.8 0.65 M 22.65 3.5 L 22.75 3.3 23.05 3.6 23.25 4 23.2 4.5 23.3 4.85 23.55 5.3 23.7 6.15 24.3 6.8 24.95 7.35 24.2 7.35 23.8 7.3 23.65 7.05 23.65 6.55 Q 23.65 6.15 23.45 6.15 L 23.3 6.35 23.2 6.75 22.8 6.75 22.65 6.45 22.65 5.95 22.55 5.3 22.7 4.35 22.6 3.75 22.65 3.5 M 24.55 7.65 L 24.9 7.7 Q 25.55 7.75 24.9 7.95 L 24.7 8.2 Q 24.8 8.6 25.8 8.45 26.7 8.3 26.95 8 L 28.55 8.35 29.95 9.6 31.7 11.9 Q 32.45 13.25 32.1 13.8 L 31.25 14.1 29.4 13.75 29.45 12.95 29.8 13.75 30.1 13.65 30.1 13.45 30.2 13.6 30.5 13.8 30.75 13.5 29.1 11.7 Q 28.85 11.85 28.85 13.95 28.8 16.05 29.1 16.4 L 28.45 16.95 27.6 17 27.4 16.8 27.05 16.6 26.05 17.25 24.35 16.5 24 16.8 24.4 17.1 24.9 17.25 23.35 17.4 22.9 17.1 22.6 16.7 22.95 15.45 22.65 14.25 22.35 13.5 22.55 13.55 22.65 13.2 22.3 12.95 22.4 12.6 22.2 12.45 Q 21.15 13 20.35 14.05 L 19.4 15.4 18.9 15.65 18.2 15.35 Q 17.35 14.85 15.65 12.85 15.6 12.55 15.95 12.2 16.2 11.9 16.6 11.9 17.9 12.7 17.9 13.1 L 17.6 13.55 Q 17.4 13.85 17.45 14.1 L 17.8 14.25 17.8 14.4 18.15 14.7 18.75 13.9 Q 18.7 13.3 19.1 12.25 19.4 11.2 20 10.25 20.65 9.2 21.35 8.7 22.15 8.1 23 8.3 L 23.25 8.4 23.55 8.35 23.75 8.1 23.35 7.75 23.6 7.65 24.55 7.65 M 25.55 17.85 L 28.55 17.5 28.85 19 28.65 19.9 28.3 20.7 28.1 21.9 28.05 23.6 26 24 Q 24.9 23.95 24.15 23.1 24.4 22 25.45 21.5 L 26.2 21.2 26.55 20.9 26.3 20.65 23.1 21.7 23.2 21.85 24.2 21.9 23.25 22.95 Q 22.65 23.6 22.4 24.1 21.65 24.2 20.55 23.45 L 19.1 22.1 21.65 18.4 22.7 19.8 23.1 19.65 23.35 19.45 22.3 18.05 22.65 17.65 25.55 17.85 M 20.55 23.9 Q 20.7 24 21 24.1 L 21.45 24.4 19.6 25.9 19.75 26.05 19.9 25.95 20.05 25.9 20.35 26.35 20.6 26.85 20.6 26.95 20.15 27.1 19.55 27.15 19.25 26.85 19.05 26.6 Q 18.85 26.6 18.9 26.75 L 19 26.95 19.1 27.1 18.75 27.3 18.25 27.45 Q 18 27.45 17.7 26.7 17.35 26.1 17.4 25.7 L 17.65 24.6 Q 17.95 23.55 18.15 23.25 18.45 22.55 18.85 22.5 L 20.15 23.7 19.55 24.75 19.65 24.9 20.55 23.9 M 24.6 23.9 L 25.3 24.2 25.75 24.65 25.75 25.45 25.85 25.55 25.9 25.55 26.05 25.4 26.05 24.65 26.2 24.45 27.3 24.45 27.3 24.65 26.9 25.55 27.85 26.55 27.85 26.65 27.75 26.7 27.3 26.7 26.3 27 26.1 26.75 25.95 26.45 25.8 26.65 25.9 26.9 25.95 27.15 25.75 27.4 25.45 27.55 Q 24.55 26.4 24.5 25.5 L 24.4 23.9 24.6 23.9 M 13.85 8.5 L 14 8.5 Q 14.4 9.4 14.75 9.75 15.15 10.3 15.9 10.3 L 16.2 9.8 16.25 9.35 16.4 9.35 16.5 9.5 16.5 10.2 Q 16.4 10.2 16.45 10.3 L 16.55 10.5 16.4 11.05 15.5 11.35 15.05 11.95 14.2 11.35 Q 13.5 10.7 13.55 10.35 L 13.55 10.05 13.7 10.3 13.9 10.45 13.95 10.4 13.95 10.25 13.9 10.1 13.85 10 13.85 9.8 14.3 10.3 14.4 10.25 14.4 10.05 14.1 9.6 13.85 9 13.85 8.5 M 15.35 12.25 L 15.55 11.85 15.8 11.55 16.05 11.55 15.35 12.25 M 27.4 30.2 L 25.8 27.85 Q 25.85 27.7 26.85 27.35 L 28 27.15 29.3 31.7 29 31.95 27.4 30.2 M 20.3 27.55 L 20.65 27.55 Q 20.95 28.1 21.05 29.6 L 21.35 31.85 21.55 32.6 21.05 33.15 20.25 33.2 18.2 27.9 20.25 27.5 20.3 27.55 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 20.65 27.55 L 20.3 27.55 20.25 27.5 18.2 27.9 20.25 33.2 21.05 33.15 21.55 32.6 21.35 31.85 21.05 29.6 Q 20.95 28.1 20.65 27.55 M 25.8 27.85 L 27.4 30.2 29 31.95 29.3 31.7 28 27.15 26.85 27.35 Q 25.85 27.7 25.8 27.85 M 15.55 11.85 L 15.35 12.25 16.05 11.55 15.8 11.55 15.55 11.85 M 24.9 7.7 L 24.55 7.65 23.6 7.65 23.35 7.75 23.75 8.1 23.55 8.35 23.25 8.4 23 8.3 Q 22.15 8.1 21.35 8.7 20.65 9.2 20 10.25 19.4 11.2 19.1 12.25 18.7 13.3 18.75 13.9 L 18.15 14.7 17.8 14.4 17.8 14.25 17.45 14.1 Q 17.4 13.85 17.6 13.55 L 17.9 13.1 Q 17.9 12.7 16.6 11.9 16.2 11.9 15.95 12.2 15.6 12.55 15.65 12.85 17.35 14.85 18.2 15.35 L 18.9 15.65 19.4 15.4 20.35 14.05 Q 21.15 13 22.2 12.45 L 22.4 12.6 22.3 12.95 22.65 13.2 22.55 13.55 22.35 13.5 22.65 14.25 22.95 15.45 22.6 16.7 22.9 17.1 23.35 17.4 24.9 17.25 24.4 17.1 24 16.8 24.35 16.5 26.05 17.25 27.05 16.6 27.4 16.8 27.6 17 28.45 16.95 29.1 16.4 Q 28.8 16.05 28.85 13.95 28.85 11.85 29.1 11.7 L 30.75 13.5 30.5 13.8 30.2 13.6 30.1 13.45 30.1 13.65 29.8 13.75 29.45 12.95 29.4 13.75 31.25 14.1 32.1 13.8 Q 32.45 13.25 31.7 11.9 L 29.95 9.6 28.55 8.35 26.95 8 Q 26.7 8.3 25.8 8.45 24.8 8.6 24.7 8.2 L 24.9 7.95 Q 25.55 7.75 24.9 7.7 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 14 8.5 L 13.85 8.5 13.85 9 14.1 9.6 14.4 10.05 14.4 10.25 14.3 10.3 13.85 9.8 13.85 10 13.9 10.1 13.95 10.25 13.95 10.4 13.9 10.45 13.7 10.3 13.55 10.05 13.55 10.35 Q 13.5 10.7 14.2 11.35 L 15.05 11.95 15.5 11.35 16.4 11.05 16.55 10.5 16.45 10.3 Q 16.4 10.2 16.5 10.2 L 16.5 9.5 16.4 9.35 16.25 9.35 16.2 9.8 15.9 10.3 Q 15.15 10.3 14.75 9.75 14.4 9.4 14 8.5 M 25.3 24.2 L 24.6 23.9 24.4 23.9 24.5 25.5 Q 24.55 26.4 25.45 27.55 L 25.75 27.4 25.95 27.15 25.9 26.9 25.8 26.65 25.95 26.45 26.1 26.75 26.3 27 27.3 26.7 27.75 26.7 27.85 26.65 27.85 26.55 26.9 25.55 27.3 24.65 27.3 24.45 26.2 24.45 26.05 24.65 26.05 25.4 25.9 25.55 25.85 25.55 25.75 25.45 25.75 24.65 25.3 24.2 M 21 24.1 Q 20.7 24 20.55 23.9 L 19.65 24.9 19.55 24.75 20.15 23.7 18.85 22.5 Q 18.45 22.55 18.15 23.25 17.95 23.55 17.65 24.6 L 17.4 25.7 Q 17.35 26.1 17.7 26.7 18 27.45 18.25 27.45 L 18.75 27.3 19.1 27.1 19 26.95 18.9 26.75 Q 18.85 26.6 19.05 26.6 L 19.25 26.85 19.55 27.15 20.15 27.1 20.6 26.95 20.6 26.85 20.35 26.35 20.05 25.9 19.9 25.95 19.75 26.05 19.6 25.9 21.45 24.4 21 24.1 M 22.75 3.3 L 22.65 3.5 22.6 3.75 22.7 4.35 22.55 5.3 22.65 5.95 22.65 6.45 22.8 6.75 23.2 6.75 23.3 6.35 23.45 6.15 Q 23.65 6.15 23.65 6.55 L 23.65 7.05 23.8 7.3 24.2 7.35 24.95 7.35 24.3 6.8 23.7 6.15 23.55 5.3 23.3 4.85 23.2 4.5 23.25 4 23.05 3.6 22.75 3.3 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 28.55 17.5 L 25.55 17.85 22.65 17.65 22.3 18.05 23.35 19.45 23.1 19.65 22.7 19.8 21.65 18.4 19.1 22.1 20.55 23.45 Q 21.65 24.2 22.4 24.1 22.65 23.6 23.25 22.95 L 24.2 21.9 23.2 21.85 23.1 21.7 26.3 20.65 26.55 20.9 26.2 21.2 25.45 21.5 Q 24.4 22 24.15 23.1 24.9 23.95 26 24 L 28.05 23.6 28.1 21.9 28.3 20.7 28.65 19.9 28.85 19 28.55 17.5 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 26.95 1.15 L 25.8 0.65 24.95 0.4 Q 24.65 0.4 24 0.7 L 23.05 1 22.8 0.95 22.65 1 22.65 1.2 22.7 1.25 22.7 1.35 Q 22.7 1.5 22.3 1.7 L 22.3 1.85 22.35 2.05 22.45 2.2 22.35 2.35 22.35 2.5 23.15 3.3 23.65 4.2 24.15 4.7 24.05 4.85 24 4.8 23.9 4.75 23.8 4.75 23.8 5 Q 23.8 5.55 24.15 6.15 24.6 6.85 25.1 6.85 L 25.6 6.75 26.3 6.85 Q 26.35 6.5 26.65 6.5 L 26.9 6.55 27.2 6.65 27.55 6.6 27.55 6.1 Q 27.6 5.9 28 5.65 L 27.9 5.25 28.1 4.85 28.3 4.3 27.9 3.5 28.1 3.25 28.3 3.1 Q 28.3 2.75 26.95 1.15 Z\"/>\n</g>\n";

Asserts.sp_svg_player_push_left = "<g id=\"sp_svg_player_push_left\" sp-width=\"30\" sp-height=\"36\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 22.45 30.4 L 22.4 30.4 22.7 31.25 24.5 33.25 Q 24 34.15 22.9 34.65 L 22.9 34.7 23.7 35.2 24.1 35.2 24.05 35.1 24.05 34.45 Q 24.1 34.35 24.5 34.15 L 26.25 33.15 24.75 32.25 22.45 30.4 M 7.6 18.2 L 7.35 18.1 8.25 17.6 8 17.25 Q 7.95 17.05 8.25 17 6.6 15.95 4.85 15.4 4.85 14.95 4 14.85 L 2.5 14.7 Q 1.8 14.6 1 15.1 L 0 15.8 1 16.4 1.35 17 1.9 17.35 2.25 17.95 4.85 19.25 6.1 19.35 Q 5.85 20.15 6.6 21.25 L 4.8 21.55 Q 4 20.9 1.05 20.05 0.75 20.05 0.75 20.2 L 0.9 20.45 3.9 22.35 6.6 22.7 4.65 23.05 1.1 21.9 0.7 22.35 4.45 24.1 Q 8.7 24.6 10.5 24 L 11.75 25 11.05 27.5 11.35 27.75 Q 11.5 29.6 12.45 30.15 L 18.9 33.5 18.4 34.05 17.65 34.5 17.55 35.05 18.6 35.25 18.4 35.15 Q 18.25 34.4 19 34.25 L 19.15 34.2 19.25 34.15 20.7 33.15 19.9 32.8 17.8 31.05 Q 16.6 30.15 15.15 29.55 L 15.85 28.85 16.85 28.95 Q 18.4 30.25 20.4 31.35 L 20.2 31.15 17.5 26.75 17.35 25.8 17.65 24.85 17.6 24.85 17.3 24.55 16.5 23.45 14.45 22.45 13.15 21.15 9.7 18.8 7.6 18.2 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 23.5 2.35 L 23 1.75 22.35 1.25 22.35 0.7 Q 22.15 0.75 22 0.55 L 21.95 0.5 21.95 0.45 22.15 0.3 22.2 0.1 21.85 0.05 21.15 0.15 21.1 0.2 20.65 0.05 20.1 0.2 19.6 0.2 Q 19.15 0.2 18.2 0.9 17.25 1.55 17.2 1.95 17.15 2.15 17.4 2.45 L 17.7 3.05 17.65 3.55 17.5 4.05 17.65 4.3 17.75 4.65 17.6 5.7 Q 18.1 5.85 18.45 6.9 L 18.7 7.6 19.1 7.95 19.8 7.8 Q 20.25 7.7 20.25 8.1 L 19.55 9.55 19.2 11.35 17.1 11.9 16.8 11.45 16.6 10.95 15.7 9.95 Q 14.9 9.2 14.6 9.3 L 14.25 9.45 14.1 9.65 14.15 10 Q 14 10.35 14.25 10.85 L 15.25 12.35 15.55 13.25 15.9 13.45 16.3 13.55 17.25 13.6 Q 17.95 13.7 17.95 13.9 L 15.75 14.45 14.6 13.15 Q 13.8 12.45 13.15 12.45 12.8 12.45 12.6 12.65 12.35 12.9 12.35 13.25 L 13.35 14.85 14.65 16.25 16.15 16.6 16.7 16.55 17.25 16.7 18.8 16.7 20.7 16.1 Q 20.95 16.15 21 16.35 L 21 16.75 20.9 17.2 21 17.55 21.15 17.8 19.45 20.55 18.8 21.35 18.3 22.25 18.4 22.65 17.65 24.85 17.35 25.8 17.5 26.75 20.2 31.15 20.4 31.35 20.75 31.75 21.15 32.45 20.7 33.15 19.25 34.15 19.15 34.2 19 34.25 Q 18.25 34.4 18.4 35.15 L 18.6 35.25 19.25 35.65 19.8 35.65 22.9 34.7 22.9 34.65 Q 24 34.15 24.5 33.25 L 22.7 31.25 22.4 30.4 21.6 26.85 20.7 25.65 21.3 25.05 Q 21.85 24.5 21.95 24.55 L 22.3 24.65 22.9 24.7 23.7 27.45 24.45 28.85 Q 24.8 29.8 25.45 30.55 L 26.75 32.2 Q 26.75 32.65 26.25 33.15 L 24.5 34.15 Q 24.1 34.35 24.05 34.45 L 24.05 35.1 24.1 35.2 24.45 35.45 25.4 35.45 25.45 35.4 Q 26.15 35.45 27.55 34.75 L 29.6 33.7 29.6 33.2 28.9 32.05 28.25 31.55 27.85 30.1 27.85 29.65 27.25 27.15 Q 26.3 26.25 26.25 25.85 L 26.35 24.45 26.45 24.35 26.5 23.8 26.65 23.55 Q 26.8 23.3 26.55 22.45 L 26.5 22.45 26.5 21.55 26.55 21.5 26.55 20.5 26.65 20.45 27.1 18 27.15 17.95 27.15 17.5 27.1 17.5 27.1 17.05 Q 26.6 16.65 26.85 16.05 L 27.1 15.55 27.25 15.1 26.05 13.4 26.05 12.7 25.95 12.7 25.95 11.85 25.9 11.85 25.9 11.15 25.85 11.15 25.35 9.05 Q 24.8 7.55 24.35 7.15 L 23.45 6.6 23.05 6.25 22.55 6.05 22.55 5.95 23.4 5.7 Q 23.95 5.5 23.9 5.05 L 23.85 5.05 23.9 4.85 23.9 4.4 24.4 4 Q 23.7 3.2 23.5 2.35 M 21.65 0.85 L 21.85 1.05 21.95 1.25 22.7 2 Q 23.15 2.35 23.2 2.8 L 23.7 3.7 23.3 4.25 23.45 4.5 23.6 4.65 23.15 5.35 22.95 5.35 Q 22.7 5 22.15 4.75 L 21.35 4.35 19.75 3.2 19.6 3.25 18.55 2.2 18 2.35 17.5 2.4 Q 17.5 1.8 17.75 1.6 L 18.3 1.1 18.95 0.65 19.65 0.65 19.7 0.6 20.45 0.6 20.75 0.7 20.85 0.7 20.95 0.65 21.2 0.8 21.45 0.9 21.5 0.85 21.65 0.85 M 21.2 4.85 L 21.25 5.25 21.3 5.3 21.3 6.15 21.4 6.2 21.45 6.25 21.7 5.9 21.85 5.5 21.85 5.6 22.1 6.25 22.4 6.75 21.8 7.55 21.15 8.2 20.85 8.2 20.35 7.45 20.45 7.25 20.6 7.1 20.6 6.95 20.5 6.95 Q 20.35 6.95 19.95 7.25 L 19.35 7.6 Q 19.1 7.6 18.95 7.2 L 18.9 6.65 19.1 6.55 19.2 6.35 19.1 6.15 18.75 6.15 18.1 5.55 18.2 5.25 18.25 5 18.25 4.6 18.4 4.45 18.55 4.4 18.65 4.45 19.05 4.45 19.3 4.4 19.5 4.2 19.2 4 18.8 3.9 Q 18.7 3.9 18.5 4.05 L 18.25 4.25 18.1 4.2 18 4.1 18.35 2.75 18.5 3.1 19.9 4.2 21.2 4.85 M 21.75 10.1 L 21.65 9.9 19.8 12.45 19.6 12.3 19.6 11.25 19.7 11.05 19.7 10.75 19.9 9.75 Q 20.15 8.9 20.35 8.9 21.55 9.05 23.3 7.05 24.2 7.9 25 10.4 25.8 12.7 25.7 13.8 26.45 14.25 26.55 14.95 26.65 15.65 25.8 16.2 L 25.35 16.15 24.6 16.3 Q 23.65 16.5 23.7 16.85 L 22.4 17.25 Q 21.3 17.45 21.35 17.05 L 21.7 15.95 22 15.35 24.35 11.95 Q 24.15 11.05 23.7 11.45 L 21.3 15.1 Q 20.45 16.05 19.6 16.1 L 16.6 15.8 Q 15.95 15.5 16.3 15.15 16.65 14.8 17.45 14.55 L 18.75 14.4 19.4 15.45 19.15 14.4 19.55 14.1 20.8 14.25 19.95 13.65 19.95 13.2 21.75 10.1 M 25.9 16.8 L 26 16.75 26.15 16.7 26.5 16.7 26.75 17.6 26.75 18.15 26.7 18.25 26.7 18.85 26.5 19.3 26.1 19.95 24.75 21.1 Q 23.9 21.75 23.6 22.35 L 23 23.35 22.45 24.05 19.25 22.4 19.4 21.85 19.85 20.8 Q 20.65 19.3 21.55 19.05 L 23.9 19.05 24.15 18.8 24.1 18.7 24.1 18.6 24.05 18.6 23.95 18.55 23.9 18.5 23.3 18.5 23.1 18.4 21.75 18.4 21.65 18.45 21.35 18.4 Q 21.3 18.15 21.4 18 L 21.7 17.7 22.6 17.7 25.4 16.7 25.9 16.8 M 21.2 23.95 Q 21.5 23.95 21.5 24.2 L 20 25.75 20.35 26.1 20.7 26.6 20.45 26.9 20.25 26.8 20.15 26.65 19.8 26.3 19.6 26.5 19.8 26.9 20 27.15 19.55 27.6 19 27.75 Q 18.55 27.65 18.25 27.15 L 17.8 26.25 17.8 25.7 18.25 25 Q 18.6 23.1 19 23.1 L 19.15 23 19.2 22.9 19.9 23.25 20.6 23.8 20.2 24.6 20.35 24.8 20.75 24.35 Q 20.95 23.95 21.2 23.95 M 23.3 24.65 L 23.25 24.5 23.25 23.95 23.35 23.9 24.1 23.95 24.3 24.15 24.3 25.6 24.35 25.85 24.5 25.95 24.7 25.8 24.7 24.5 24.65 24.5 24.65 24.15 24.85 23.85 26.05 23.85 25.95 23.95 26.05 24.4 25.95 24.5 25.95 25 25.7 26.1 26.15 26.6 Q 26.55 26.8 26.55 27.15 L 26.2 27.6 25.75 27.8 25.55 27.65 25.5 27.45 25.35 27.3 25.2 27.25 25.05 27.3 24.95 27.45 25.05 27.6 25.1 27.8 24.8 28.1 24.5 27.95 24.05 27.15 23.5 25.85 23.45 25.55 23.35 25.35 23.35 24.75 23.3 24.65 M 23.8 23.35 L 23.65 23.3 23.65 23.1 24.5 21.95 Q 25.1 21.25 25.75 21.1 L 25.8 21.25 25.35 22.3 25.35 22.5 25.45 22.5 25.7 22.4 25.85 22.65 25.9 22.95 25.85 23.15 25.7 23.25 24.9 23.25 24.8 23.3 24.25 23.3 24.2 23.35 23.8 23.35 M 15.05 10.5 L 14.75 10 14.75 9.85 14.95 9.85 Q 15.1 9.85 15.4 10.15 L 15.75 10.55 17.2 12.6 17.2 12.95 16.3 13.15 15.75 12.55 15.5 11.7 15.5 11.5 15.6 11.45 Q 16.05 11.4 15.55 10.75 L 15.05 10.5 M 18.45 11.95 L 18.9 11.85 19 11.9 19.5 13 19.35 13.2 19.15 13.35 18.45 13.35 18.05 12.2 18.45 11.95 M 15.65 15.75 L 15.45 16.05 15.05 16.05 13.95 15.1 13.05 14.05 13.05 13.65 13.65 14 14.05 14.3 13.55 13.6 12.95 13.25 12.95 12.95 13.25 12.95 14.85 14.05 Q 15.65 14.7 15.65 15.75 M 26.55 27.65 L 26.85 27.65 27.9 31.85 27.75 32.1 27.55 32.15 Q 27.4 32.15 27.2 31.95 L 27 31.6 25.15 29.15 Q 24.85 28.65 25.65 28.15 L 26.55 27.65 M 22.45 31.75 L 22.1 32.15 21.6 32.35 19.15 28.3 Q 20.35 27.85 21.1 27 L 22.1 31.15 22.3 31.4 22.45 31.75 M 19.8 1.6 L 19.6 1.6 19.45 1.75 19.45 1.95 21.6 3.25 19.8 1.7 19.8 1.6 M 22.2 4.4 Q 22.45 4.4 22.45 4.25 L 21.4 3.6 21.3 3.5 21.05 3.5 21.05 3.75 22.2 4.4 M 22.5 3.9 L 22.7 3.9 22.65 3.75 22.65 3.6 22.45 3.5 22.35 3.65 22.4 3.8 22.5 3.9 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 22.1 32.15 L 22.45 31.75 22.3 31.4 22.1 31.15 21.1 27 Q 20.35 27.85 19.15 28.3 L 21.6 32.35 22.1 32.15 M 26.85 27.65 L 26.55 27.65 25.65 28.15 Q 24.85 28.65 25.15 29.15 L 27 31.6 27.2 31.95 Q 27.4 32.15 27.55 32.15 L 27.75 32.1 27.9 31.85 26.85 27.65 M 18.9 11.85 L 18.45 11.95 18.05 12.2 18.45 13.35 19.15 13.35 19.35 13.2 19.5 13 19 11.9 18.9 11.85 M 21.65 9.9 L 21.75 10.1 19.95 13.2 19.95 13.65 20.8 14.25 19.55 14.1 19.15 14.4 19.4 15.45 18.75 14.4 17.45 14.55 Q 16.65 14.8 16.3 15.15 15.95 15.5 16.6 15.8 L 19.6 16.1 Q 20.45 16.05 21.3 15.1 L 23.7 11.45 Q 24.15 11.05 24.35 11.95 L 22 15.35 21.7 15.95 21.35 17.05 Q 21.3 17.45 22.4 17.25 L 23.7 16.85 Q 23.65 16.5 24.6 16.3 L 25.35 16.15 25.8 16.2 Q 26.65 15.65 26.55 14.95 26.45 14.25 25.7 13.8 25.8 12.7 25 10.4 24.2 7.9 23.3 7.05 21.55 9.05 20.35 8.9 20.15 8.9 19.9 9.75 L 19.7 10.75 19.7 11.05 19.6 11.25 19.6 12.3 19.8 12.45 21.65 9.9 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 15.45 16.05 L 15.65 15.75 Q 15.65 14.7 14.85 14.05 L 13.25 12.95 12.95 12.95 12.95 13.25 13.55 13.6 14.05 14.3 13.65 14 13.05 13.65 13.05 14.05 13.95 15.1 15.05 16.05 15.45 16.05 M 14.75 10 L 15.05 10.5 15.55 10.75 Q 16.05 11.4 15.6 11.45 L 15.5 11.5 15.5 11.7 15.75 12.55 16.3 13.15 17.2 12.95 17.2 12.6 15.75 10.55 15.4 10.15 Q 15.1 9.85 14.95 9.85 L 14.75 9.85 14.75 10 M 23.25 24.5 L 23.3 24.65 23.35 24.75 23.35 25.35 23.45 25.55 23.5 25.85 24.05 27.15 24.5 27.95 24.8 28.1 25.1 27.8 25.05 27.6 24.95 27.45 25.05 27.3 25.2 27.25 25.35 27.3 25.5 27.45 25.55 27.65 25.75 27.8 26.2 27.6 26.55 27.15 Q 26.55 26.8 26.15 26.6 L 25.7 26.1 25.95 25 25.95 24.5 26.05 24.4 25.95 23.95 26.05 23.85 24.85 23.85 24.65 24.15 24.65 24.5 24.7 24.5 24.7 25.8 24.5 25.95 24.35 25.85 24.3 25.6 24.3 24.15 24.1 23.95 23.35 23.9 23.25 23.95 23.25 24.5 M 21.5 24.2 Q 21.5 23.95 21.2 23.95 20.95 23.95 20.75 24.35 L 20.35 24.8 20.2 24.6 20.6 23.8 19.9 23.25 19.2 22.9 19.15 23 19 23.1 Q 18.6 23.1 18.25 25 L 17.8 25.7 17.8 26.25 18.25 27.15 Q 18.55 27.65 19 27.75 L 19.55 27.6 20 27.15 19.8 26.9 19.6 26.5 19.8 26.3 20.15 26.65 20.25 26.8 20.45 26.9 20.7 26.6 20.35 26.1 20 25.75 21.5 24.2 M 21.25 5.25 L 21.2 4.85 19.9 4.2 18.5 3.1 18.35 2.75 18 4.1 18.1 4.2 18.25 4.25 18.5 4.05 Q 18.7 3.9 18.8 3.9 L 19.2 4 19.5 4.2 19.3 4.4 19.05 4.45 18.65 4.45 18.55 4.4 18.4 4.45 18.25 4.6 18.25 5 18.2 5.25 18.1 5.55 18.75 6.15 19.1 6.15 19.2 6.35 19.1 6.55 18.9 6.65 18.95 7.2 Q 19.1 7.6 19.35 7.6 L 19.95 7.25 Q 20.35 6.95 20.5 6.95 L 20.6 6.95 20.6 7.1 20.45 7.25 20.35 7.45 20.85 8.2 21.15 8.2 21.8 7.55 22.4 6.75 22.1 6.25 21.85 5.6 21.85 5.5 21.7 5.9 21.45 6.25 21.4 6.2 21.3 6.15 21.3 5.3 21.25 5.25 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 23.65 23.3 L 23.8 23.35 24.2 23.35 24.25 23.3 24.8 23.3 24.9 23.25 25.7 23.25 25.85 23.15 25.9 22.95 25.85 22.65 25.7 22.4 25.45 22.5 25.35 22.5 25.35 22.3 25.8 21.25 25.75 21.1 Q 25.1 21.25 24.5 21.95 L 23.65 23.1 23.65 23.3 M 26 16.75 L 25.9 16.8 25.4 16.7 22.6 17.7 21.7 17.7 21.4 18 Q 21.3 18.15 21.35 18.4 L 21.65 18.45 21.75 18.4 23.1 18.4 23.3 18.5 23.9 18.5 23.95 18.55 24.05 18.6 24.1 18.6 24.1 18.7 24.15 18.8 23.9 19.05 21.55 19.05 Q 20.65 19.3 19.85 20.8 L 19.4 21.85 19.25 22.4 22.45 24.05 23 23.35 23.6 22.35 Q 23.9 21.75 24.75 21.1 L 26.1 19.95 26.5 19.3 26.7 18.85 26.7 18.25 26.75 18.15 26.75 17.6 26.5 16.7 26.15 16.7 26 16.75 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 21.85 1.05 L 21.65 0.85 21.5 0.85 21.45 0.9 21.2 0.8 20.95 0.65 20.85 0.7 20.75 0.7 20.45 0.6 19.7 0.6 19.65 0.65 18.95 0.65 18.3 1.1 17.75 1.6 Q 17.5 1.8 17.5 2.4 L 18 2.35 18.55 2.2 19.6 3.25 19.75 3.2 21.35 4.35 22.15 4.75 Q 22.7 5 22.95 5.35 L 23.15 5.35 23.6 4.65 23.45 4.5 23.3 4.25 23.7 3.7 23.2 2.8 Q 23.15 2.35 22.7 2 L 21.95 1.25 21.85 1.05 M 22.7 3.9 L 22.5 3.9 22.4 3.8 22.35 3.65 22.45 3.5 22.65 3.6 22.65 3.75 22.7 3.9 M 22.45 4.25 Q 22.45 4.4 22.2 4.4 L 21.05 3.75 21.05 3.5 21.3 3.5 21.4 3.6 22.45 4.25 M 19.6 1.6 L 19.8 1.6 19.8 1.7 21.6 3.25 19.45 1.95 19.45 1.75 19.6 1.6 Z\"/>\n</g>\n";

Asserts.sp_svg_player_push_right = "<g id=\"sp_svg_player_push_right\" sp-width=\"33\" sp-height=\"36\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 18.7 30.65 L 18.55 30.85 17.65 31.85 18.65 33.2 18.3 33.85 18.55 33.95 19.9 34.75 19.95 35.05 23.15 35.6 21.05 34.95 Q 19.95 34.45 19.45 33.55 L 20.85 32.1 Q 20.75 31.15 20.95 30.65 L 21 30.55 Q 20.95 30.2 19.5 29.25 L 18.7 30.65 M 7.95 18.3 L 7.15 17.7 7.05 17.35 6.25 16.75 6.1 16.15 Q 2.5 14.95 1.45 15.05 L 0.3 15.2 Q -0.35 15.3 0.45 15.75 -0.25 16.3 0.1 17.35 L 0.8 17.6 1.25 17.95 3.15 18.45 3.1 18.55 2.9 18.65 2.1 19.15 3.1 21.5 4.25 22.8 4.1 23.8 5.45 24.9 5.7 25.2 8 26.85 8.7 27.5 Q 8.9 27.5 9.35 28.05 9.8 28.9 10.7 29.2 L 11.7 30.05 11.65 30.65 11.55 30.8 12.75 32.65 12.95 34.3 13.25 34.6 17.3 35.4 Q 16.2 35 14.45 34 L 14.45 33.45 15.15 32.35 15.45 32.15 15.05 30.65 14.35 29.35 15.2 29.25 16.25 29.65 16.7 27.6 11.85 25.35 11.45 24.75 Q 11.05 24.35 11.25 24.35 14.2 25 17.45 24.45 L 17.5 24.15 17.5 24.05 17.35 23.8 Q 17.2 23.6 17.45 22.7 L 17.5 22.7 17.5 22.6 16.55 22.25 15.2 23.4 12.65 23.05 Q 12.65 22.85 13.5 22.85 L 14.2 22.85 14.65 22.7 13.2 20.6 12.8 20.3 12.25 20.15 Q 11.9 20.4 11.95 20.95 11.95 21.45 12.3 21.9 L 9.85 21.6 Q 8.5 20.5 6.8 19.7 L 7.85 19.6 7.95 18.3 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 26.8 2.2 L 25.75 1.1 Q 24.8 0.45 24.35 0.45 L 23.35 0.25 22.85 0.45 22.8 0.4 22.1 0.25 21.8 0.35 21.8 0.5 22.05 0.65 22.05 0.75 21.95 0.75 21.6 0.95 21.6 1.5 20.95 2 Q 20.55 2.3 20.5 2.6 L 19.55 4.25 20.05 4.65 20.05 5.1 20.1 5.25 20.05 5.3 Q 20 5.75 20.55 5.95 L 21 6.05 21.4 6.2 21.4 6.3 20.9 6.5 20.5 6.85 19.65 7.4 Q 19.15 7.75 18.65 9.25 18.15 10.7 18.15 11.4 L 18.1 11.4 18.1 12.1 18.05 12.05 18.05 12.95 17.95 12.95 17.95 13.6 17.45 14.45 16.75 15.35 17.15 16.3 Q 17.35 16.95 16.9 17.3 L 16.9 17.75 16.85 17.75 16.85 18.2 16.9 18.25 17.35 20.65 17.45 20.75 17.45 21.75 17.5 21.8 17.5 22.6 17.5 22.7 17.45 22.7 Q 17.2 23.6 17.35 23.8 L 17.5 24.05 17.5 24.15 17.55 24.6 17.65 24.65 17.75 26.15 17.5 26.65 16.75 27.45 16.7 27.6 16.25 29.65 16.15 29.95 16.15 30.4 16.05 30.65 16.05 30.7 16 31 15.75 31.8 15.45 32.15 15.15 32.35 14.45 33.45 14.45 34 Q 16.2 35 17.3 35.4 L 18.55 35.65 18.6 35.75 18.95 35.75 Q 19 35.6 19.5 35.75 L 19.9 35.35 19.95 35.05 19.9 34.75 18.55 33.95 18.3 33.85 Q 17.25 33.15 17.25 32.5 L 17.65 31.85 18.55 30.85 18.7 30.65 19.5 29.25 19.5 29.15 20.25 27.75 21.05 24.95 21.65 24.9 22 24.75 22.65 25.3 23.25 25.95 22.35 27.15 Q 22.1 27.75 21.8 29.45 L 21.6 30.65 21.3 31.55 20.85 32.1 19.45 33.55 Q 19.95 34.45 21.05 34.95 L 23.15 35.6 24.15 35.95 24.75 35.95 25.55 35.45 Q 25.75 34.7 24.95 34.5 L 24.8 34.5 24.7 34.4 23.6 33.65 22.85 32.75 Q 22.85 32.55 23.2 32.05 L 23.8 31.45 24.35 30.65 25.1 29.2 Q 25.85 27.7 26.5 27.05 L 26.6 26.1 25.55 22.9 25.65 22.5 25.15 21.6 22.8 18.05 22.95 17.8 23.05 17.45 22.95 17 22.95 16.55 Q 23 16.4 23.25 16.35 L 25.15 16.95 26.75 16.95 Q 26.95 16.8 27.25 16.8 L 27.8 16.8 29.3 16.5 30.6 15.1 31.6 13.5 31.35 12.9 Q 31.15 12.65 30.8 12.65 30.15 12.65 29.35 13.4 L 28.2 14.7 Q 27.35 14.7 26 14.1 26 13.95 26.7 13.85 L 27.65 13.8 28.05 13.7 28.4 13.45 28.7 12.6 Q 28.85 12.05 29.2 11.85 L 29.7 11.1 Q 30 10.6 29.8 10.25 L 29.85 9.9 29.7 9.7 29.35 9.55 Q 29.05 9.45 28.25 10.2 L 27.35 11.2 27.15 11.7 26.85 12.15 24.75 11.6 24.4 9.8 23.7 8.35 Q 23.7 7.95 24.15 8.05 L 24.85 8.15 25.25 7.85 25.5 7.15 Q 25.85 6.1 26.35 5.9 L 26.2 4.85 26.45 4.3 26.3 3.8 26.3 3.25 26.6 2.7 26.8 2.2 M 25.65 1.35 L 26.2 1.85 26.45 2.65 25.95 2.6 25.45 2.45 24.35 3.5 24.2 3.45 22.65 4.6 21.8 5 21 5.6 20.8 5.6 20.55 5.25 20.4 4.9 20.5 4.7 20.65 4.5 20.45 4.15 20.3 3.95 20.75 3.05 Q 20.8 2.55 21.25 2.2 L 22 1.5 22.1 1.3 22.3 1.1 22.45 1.1 22.5 1.15 22.75 1 23 0.9 23.1 0.9 23.2 0.95 23.5 0.85 24.25 0.85 24.3 0.9 25 0.9 25.65 1.35 M 25.75 4.5 L 25.45 4.3 25.15 4.15 24.8 4.25 Q 24.5 4.35 24.5 4.45 L 24.65 4.65 24.9 4.7 25.3 4.7 25.4 4.65 25.55 4.7 25.7 4.8 25.7 5.25 25.8 5.5 25.85 5.8 25.4 6.15 25.25 6.4 24.85 6.4 24.8 6.5 24.8 6.6 24.85 6.75 25.05 6.9 25.05 7.45 24.6 7.85 23.45 7.2 23.35 7.2 23.35 7.35 23.5 7.5 23.6 7.7 23.4 8.05 23.1 8.4 22.85 8.4 21.6 7 22.1 5.85 22.1 5.75 22.25 6.1 Q 22.3 6.45 22.5 6.45 L 22.6 6.45 22.65 6.4 22.65 5.55 22.7 5.5 22.8 5.15 24.05 4.45 Q 25.5 3.65 25.5 3.35 L 25.6 3 25.8 3.6 25.95 4.35 25.85 4.45 25.75 4.5 M 22.3 10.15 L 22.2 10.35 24 13.45 24 13.85 23.15 14.5 24.4 14.35 24.8 14.6 24.55 15.7 25.2 14.65 26.5 14.8 27.65 15.4 Q 28.05 15.8 27.35 16.05 L 24.35 16.35 Q 23.5 16.35 22.65 15.3 L 20.25 11.7 Q 19.8 11.3 19.6 12.2 L 21.95 15.55 22.25 16.15 22.65 17.25 Q 22.65 17.75 21.55 17.5 L 20.25 17.05 Q 20.3 16.75 19.35 16.55 L 18.2 16.4 Q 17.35 15.95 17.45 15.2 17.55 14.5 18.3 14.05 18.15 13 18.95 10.65 19.8 8.15 20.65 7.3 22.4 9.3 23.6 9.15 L 24.05 9.95 24.25 11 24.25 11.3 24.35 11.5 24.35 12.55 24.15 12.65 22.3 10.15 M 24.95 12.1 L 25.05 12.05 25.5 12.2 25.9 12.45 25.55 13.6 24.8 13.6 24.6 13.45 24.45 13.25 24.95 12.1 M 29.2 10.05 L 29.2 10.25 28.9 10.75 28.4 11 Q 27.9 11.7 28.35 11.7 L 28.45 11.7 28.5 11.75 28.5 11.95 28.2 12.8 27.65 13.4 26.75 13.2 26.75 12.8 28.55 10.35 Q 28.9 10.05 29 10.05 L 29.2 10.05 M 28.95 16.3 L 28.5 16.3 28.4 16.1 28.3 15.95 Q 28.3 14.95 29.1 14.25 L 30.7 13.2 31 13.2 31 13.45 30.4 13.85 Q 29.9 14.25 29.9 14.55 L 30.9 13.85 30.9 14.25 30 15.35 28.95 16.3 M 21.35 17.95 L 22.25 17.95 22.55 18.25 22.6 18.65 22.35 18.7 22.2 18.65 22.1 18.6 20.9 18.6 20.65 18.75 20.1 18.75 19.9 18.85 19.85 18.8 19.85 18.95 19.8 19 20.05 19.3 22.4 19.3 Q 23.3 19.55 24.1 21.05 L 24.75 22.65 21.55 24.3 20.95 23.6 20.35 22.6 17.9 20.2 17.5 19.55 17.3 19.05 17.3 18.5 17.25 18.4 17.25 17.85 17.5 16.95 17.9 16.95 18 17 18.1 17 18.65 16.95 21.35 17.95 M 22.45 24.45 L 22.55 24.25 22.75 24.15 23.6 25.05 23.75 24.85 23.35 24 24.05 23.45 24.75 23.15 24.8 23.25 24.95 23.35 Q 25.35 23.35 25.7 25.2 L 26.15 26 26.15 26.55 25.7 27.4 24.95 28.05 24.75 27.95 24.4 27.85 23.95 27.45 24.35 26.8 24.15 26.6 23.95 26.75 23.7 27.1 23.5 27.2 23.25 26.9 23.6 26.4 23.95 26.05 22.45 24.45 M 20.5 24.15 L 20.7 24.2 20.7 24.75 20.65 24.9 20.6 25 20.6 25.6 20.5 25.85 20.45 26.15 19.9 27.45 Q 19.6 27.75 19.6 28 L 19.45 28.25 19.15 28.4 Q 18.85 28.4 18.85 28.1 L 18.9 27.9 19 27.75 18.9 27.6 18.8 27.5 18.65 27.6 18.5 27.75 18.45 27.95 18.25 28.1 17.8 27.85 17.45 27.45 Q 17.45 27.05 17.85 26.9 L 18.15 26.75 18.3 26.4 18.05 25.2 18.05 24.75 18 24.65 17.95 24.6 18.05 24.2 17.95 24.1 19.1 24.1 19.3 24.4 19.3 24.75 19.25 24.75 19.25 26.1 19.45 26.25 19.6 26.1 19.65 25.9 19.65 24.4 19.85 24.15 20.5 24.15 M 20.3 23.35 L 20.3 23.55 20.15 23.6 19.75 23.6 19.7 23.55 19.15 23.55 19.1 23.5 18.35 23.5 18.2 23.4 18.1 23.2 18.15 22.9 18.3 22.65 18.55 22.75 18.65 22.75 18.65 22.55 18.2 21.5 18.25 21.35 Q 18.85 21.5 19.45 22.2 L 20.3 23.35 M 17.15 27.95 L 17.45 27.95 18.35 28.4 Q 19.1 28.95 18.85 29.45 L 16.8 32.25 16.45 32.45 16.25 32.4 16.1 32.15 17.15 27.95 M 24.85 28.55 L 23.65 30.6 23.65 30.65 22.4 32.6 21.85 32.45 21.55 32.05 21.65 31.7 21.85 31.45 22.35 29.15 Q 22.75 27.25 22.85 27.25 23.6 28.15 24.85 28.55 M 21.55 4 L 21.6 3.9 21.5 3.75 21.3 3.8 21.3 4.1 21.45 4.1 21.55 4 M 22.65 3.75 L 22.55 3.85 21.55 4.45 21.75 4.6 22.4 4.35 22.9 4 22.9 3.75 22.65 3.75 M 24.4 1.85 L 24.15 1.85 24.15 1.95 22.35 3.5 24.5 2.2 24.5 2 24.4 1.85 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 23.65 30.6 L 24.85 28.55 Q 23.6 28.15 22.85 27.25 22.75 27.25 22.35 29.15 L 21.85 31.45 21.65 31.7 21.55 32.05 21.85 32.45 22.4 32.6 23.65 30.65 23.65 30.6 M 17.45 27.95 L 17.15 27.95 16.1 32.15 16.25 32.4 16.45 32.45 16.8 32.25 18.85 29.45 Q 19.1 28.95 18.35 28.4 L 17.45 27.95 M 25.05 12.05 L 24.95 12.1 24.45 13.25 24.6 13.45 24.8 13.6 25.55 13.6 25.9 12.45 25.5 12.2 25.05 12.05 M 22.2 10.35 L 22.3 10.15 24.15 12.65 24.35 12.55 24.35 11.5 24.25 11.3 24.25 11 24.05 9.95 23.6 9.15 Q 22.4 9.3 20.65 7.3 19.8 8.15 18.95 10.65 18.15 13 18.3 14.05 17.55 14.5 17.45 15.2 17.35 15.95 18.2 16.4 L 19.35 16.55 Q 20.3 16.75 20.25 17.05 L 21.55 17.5 Q 22.65 17.75 22.65 17.25 L 22.25 16.15 21.95 15.55 19.6 12.2 Q 19.8 11.3 20.25 11.7 L 22.65 15.3 Q 23.5 16.35 24.35 16.35 L 27.35 16.05 Q 28.05 15.8 27.65 15.4 L 26.5 14.8 25.2 14.65 24.55 15.7 24.8 14.6 24.4 14.35 23.15 14.5 24 13.85 24 13.45 22.2 10.35 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 20.3 23.55 L 20.3 23.35 19.45 22.2 Q 18.85 21.5 18.25 21.35 L 18.2 21.5 18.65 22.55 18.65 22.75 18.55 22.75 18.3 22.65 18.15 22.9 18.1 23.2 18.2 23.4 18.35 23.5 19.1 23.5 19.15 23.55 19.7 23.55 19.75 23.6 20.15 23.6 20.3 23.55 M 22.25 17.95 L 21.35 17.95 18.65 16.95 18.1 17 18 17 17.9 16.95 17.5 16.95 17.25 17.85 17.25 18.4 17.3 18.5 17.3 19.05 17.5 19.55 17.9 20.2 20.35 22.6 20.95 23.6 21.55 24.3 24.75 22.65 24.1 21.05 Q 23.3 19.55 22.4 19.3 L 20.05 19.3 19.8 19 19.85 18.95 19.85 18.8 19.9 18.85 20.1 18.75 20.65 18.75 20.9 18.6 22.1 18.6 22.2 18.65 22.35 18.7 22.6 18.65 22.55 18.25 22.25 17.95 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 20.7 24.2 L 20.5 24.15 19.85 24.15 19.65 24.4 19.65 25.9 19.6 26.1 19.45 26.25 19.25 26.1 19.25 24.75 19.3 24.75 19.3 24.4 19.1 24.1 17.95 24.1 18.05 24.2 17.95 24.6 18 24.65 18.05 24.75 18.05 25.2 18.3 26.4 18.15 26.75 17.85 26.9 Q 17.45 27.05 17.45 27.45 L 17.8 27.85 18.25 28.1 18.45 27.95 18.5 27.75 18.65 27.6 18.8 27.5 18.9 27.6 19 27.75 18.9 27.9 18.85 28.1 Q 18.85 28.4 19.15 28.4 L 19.45 28.25 19.6 28 Q 19.6 27.75 19.9 27.45 L 20.45 26.15 20.5 25.85 20.6 25.6 20.6 25 20.65 24.9 20.7 24.75 20.7 24.2 M 22.55 24.25 L 22.45 24.45 23.95 26.05 23.6 26.4 23.25 26.9 23.5 27.2 23.7 27.1 23.95 26.75 24.15 26.6 24.35 26.8 23.95 27.45 24.4 27.85 24.75 27.95 24.95 28.05 25.7 27.4 26.15 26.55 26.15 26 25.7 25.2 Q 25.35 23.35 24.95 23.35 L 24.8 23.25 24.75 23.15 24.05 23.45 23.35 24 23.75 24.85 23.6 25.05 22.75 24.15 22.55 24.25 M 28.5 16.3 L 28.95 16.3 30 15.35 30.9 14.25 30.9 13.85 29.9 14.55 Q 29.9 14.25 30.4 13.85 L 31 13.45 31 13.2 30.7 13.2 29.1 14.25 Q 28.3 14.95 28.3 15.95 L 28.4 16.1 28.5 16.3 M 29.2 10.25 L 29.2 10.05 29 10.05 Q 28.9 10.05 28.55 10.35 L 26.75 12.8 26.75 13.2 27.65 13.4 28.2 12.8 28.5 11.95 28.5 11.75 28.45 11.7 28.35 11.7 Q 27.9 11.7 28.4 11 L 28.9 10.75 29.2 10.25 M 25.45 4.3 L 25.75 4.5 25.85 4.45 25.95 4.35 25.8 3.6 25.6 3 25.5 3.35 Q 25.5 3.65 24.05 4.45 L 22.8 5.15 22.7 5.5 22.65 5.55 22.65 6.4 22.6 6.45 22.5 6.45 Q 22.3 6.45 22.25 6.1 L 22.1 5.75 22.1 5.85 21.6 7 22.85 8.4 23.1 8.4 23.4 8.05 23.6 7.7 23.5 7.5 23.35 7.35 23.35 7.2 23.45 7.2 24.6 7.85 25.05 7.45 25.05 6.9 24.85 6.75 24.8 6.6 24.8 6.5 24.85 6.4 25.25 6.4 25.4 6.15 25.85 5.8 25.8 5.5 25.7 5.25 25.7 4.8 25.55 4.7 25.4 4.65 25.3 4.7 24.9 4.7 24.65 4.65 24.5 4.45 Q 24.5 4.35 24.8 4.25 L 25.15 4.15 25.45 4.3 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 26.2 1.85 L 25.65 1.35 25 0.9 24.3 0.9 24.25 0.85 23.5 0.85 23.2 0.95 23.1 0.9 23 0.9 22.75 1 22.5 1.15 22.45 1.1 22.3 1.1 22.1 1.3 22 1.5 21.25 2.2 Q 20.8 2.55 20.75 3.05 L 20.3 3.95 20.45 4.15 20.65 4.5 20.5 4.7 20.4 4.9 20.55 5.25 20.8 5.6 21 5.6 21.8 5 22.65 4.6 24.2 3.45 24.35 3.5 25.45 2.45 25.95 2.6 26.45 2.65 26.2 1.85 M 24.15 1.85 L 24.4 1.85 24.5 2 24.5 2.2 22.35 3.5 24.15 1.95 24.15 1.85 M 22.55 3.85 L 22.65 3.75 22.9 3.75 22.9 4 22.4 4.35 21.75 4.6 21.55 4.45 22.55 3.85 M 21.6 3.9 L 21.55 4 21.45 4.1 21.3 4.1 21.3 3.8 21.5 3.75 21.6 3.9 Z\"/>\n</g>\n";

Asserts.sp_svg_player_walk_right = "<g id=\"sp_svg_player_walk_right\" sp-width=\"33\" sp-height=\"33\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 24.1 32.2 L 24.3 32.2 24.15 32.15 24.1 32.2 M 18.15 27.8 L 18.15 27.75 16.85 26.9 16.95 28.3 18.25 27.9 18.15 27.8 M 3.65 17.7 L 2.6 18.3 4.25 18.9 4.85 19 5.25 19.25 Q 5.5 19.6 3.9 19.5 L 2.35 19.4 Q 1.35 19.6 0.6 20.4 -0.05 21.1 0 21.75 L 1.1 22.15 1.3 22.15 2.8 22.5 Q 3.95 22.25 4.55 23.15 5 23.75 4.95 24.45 L 7.45 26.15 Q 8.7 26.95 9.75 26.65 L 12.5 27.75 11.7 28.25 11.5 28.3 10.9 28.3 10.05 28.55 11.05 29.3 12.55 30.15 Q 14.6 31.15 14.9 30.45 15 30.25 14.3 29.75 L 13.4 29.05 14.2 28.85 18.7 30.9 Q 21.5 31.95 23.65 32.15 L 24.05 32.2 24.05 32.15 23.8 32.15 21.95 31.75 21.6 31.55 21.3 31.55 21.1 31.25 20.95 30.9 20.95 30.7 21 30.55 20.85 30.45 Q 20.25 30.25 19 29.45 L 17.1 28.35 16.95 28.35 16.95 28.55 16.7 28.9 16.25 29.05 15.75 28.95 15.2 28.55 15.15 28.4 15.1 28.3 14.8 27.95 14.6 27.55 14.2 25.55 14.2 24.95 11.65 23.95 11.55 23.75 11.2 23.55 11.6 23.1 Q 11.55 22.95 11.2 22.9 L 11.2 22.35 14.75 23.55 16.35 23.75 17.2 23.05 16.25 22.8 Q 14.25 22.3 12.5 21.5 L 12.3 21.35 10.2 20.45 10.3 19.6 Q 10.05 19.55 10.25 19.35 L 10.15 19.05 10.7 18.55 7.15 17.35 Q 5.3 16.8 3.65 17.7 M 21.45 24.1 L 21.4 24.1 21.8 25.1 22.95 25.35 23.55 25 23.2 24.8 21.45 24.1 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 25.65 2.75 L 25.55 2.5 25.3 2.4 25.05 2.4 24.9 2.3 25.1 1.8 25.05 1.75 25.1 1.7 25 1.4 24.75 1.25 24 0.95 23.3 0.4 22.95 0.3 22.65 0.3 22.35 0.25 22.05 0.25 21.65 0.45 21.45 0.4 21.2 0.45 20.5 0.9 Q 19.7 1.3 19.75 1.45 L 19.8 1.45 19.35 1.85 18.8 2.2 18.6 2.4 18.45 2.4 Q 18.05 2.4 18.1 2.7 L 18.45 3.3 19 4 19.6 4.25 19.7 4.65 19.65 4.75 19.55 4.85 19.5 5.2 18.95 5.3 18.55 5.3 18.05 5.2 18 5.25 18 5.2 17.9 5.25 17.85 5.2 17.55 5.25 17.25 5.2 16.9 5.1 16.6 5.1 Q 15.8 5.1 15.2 5.75 L 14.4 6.6 13.6 7.2 12.95 7.9 12 9.25 Q 11.55 9.7 11.6 10.05 L 11.75 10.6 Q 11.9 10.95 12.25 10.95 L 12.45 10.95 12.95 11.35 13.65 11.65 13.9 11.65 14.35 11.8 14.8 12.05 14.8 12.35 14.75 12.4 14.8 12.45 14.75 12.5 14.8 12.55 14.7 13 14.65 13.55 14.5 13.85 14.15 14.35 Q 13.6 15.15 13.65 15.8 L 13.7 15.85 13.65 15.9 13.7 15.95 13.65 16 13.7 16.1 13.65 16.15 Q 13.6 16.45 14.05 17.75 L 14.45 19.2 14.5 19.55 14.5 19.7 14.45 20.1 14.45 20.7 14.7 21 14.9 21 15.5 20.75 15.95 20.5 16.15 20.85 16.1 20.85 Q 16.65 22.05 17.5 22.8 L 17.2 23.05 16.35 23.75 16.15 23.9 16.2 23.9 15.9 24 15.3 24 14.75 24.15 Q 14.25 24.35 14.2 24.45 L 14.2 24.75 14.25 24.75 14.2 24.85 14.2 24.95 14.2 25.55 14.6 27.55 14.8 27.95 15.1 28.3 15.15 28.4 15.2 28.55 15.75 28.95 16.25 29.05 16.7 28.9 16.95 28.55 16.95 28.35 16.95 28.3 16.85 26.9 16.9 25.9 17 25.55 17.45 25.3 18 25.1 18.15 25.3 18.2 25.5 19 26.75 20.75 29.05 21 29.5 21.05 30.4 21 30.55 20.95 30.7 20.95 30.9 21.1 31.25 21.3 31.55 21.6 31.55 21.95 31.75 23.8 32.15 24.05 32.15 24.05 32.2 24.1 32.2 24.15 32.15 24.3 32.2 24.75 32.2 25.1 32.25 25.65 32.25 26.05 32.15 26.05 32.2 26.3 32.05 26.35 32.05 26.5 31.9 26.5 31.85 26.6 31.75 26.6 31.7 26.75 31.3 26.7 31 Q 26.7 30.75 25.95 30.5 L 23.75 29.4 22.85 28.6 22.2 26.15 21.8 25.1 21.4 24.1 21.45 24.1 21.3 23.9 21.6 23.9 22.5 23.7 23.15 23.1 23.2 22.9 23.15 22.8 23.2 22.8 23.2 22.75 22.95 21.75 23 21.75 22.75 20.4 22.25 18.85 22.55 18.75 22.8 18.7 23.15 18.45 23.15 18.25 22.5 17.75 22.55 17.6 22.25 17.25 21.95 17 22.1 16.75 22.1 16.55 21.75 16.25 Q 21.3 16.1 21.35 15.8 L 20.85 14.7 20.95 14.55 21 14.3 20.85 13.85 Q 21.15 13.9 21.45 13.6 L 21.7 12.95 21.7 12.7 21.55 12.5 22.15 11.35 22.45 11.6 22.6 12 23.35 12.85 23.3 12.85 23.8 13.45 24.4 13.9 24.65 13.9 24.65 13.85 24.7 13.85 25.5 14.1 26.75 14.9 27 15 27.05 15.1 27.1 15.15 27.4 15.35 28 15.6 28.85 16.15 29.7 17.2 30.15 17.5 30.6 17.65 Q 31.15 17.65 31.6 16.95 L 31.6 16.75 31.4 16.35 31.4 16.4 30.55 15.1 30.15 14.75 30.2 14.75 28.75 13.9 28.75 13.7 28.25 13.25 27.75 12.9 27.7 12.85 26.95 12.35 26.75 12.25 25.85 11.6 25.25 10.95 24.8 10.3 Q 24.3 9.7 24.35 9.5 L 24.35 9.2 Q 24.35 8.35 23.2 7.3 L 24.25 5.55 24.25 5.35 24.75 4.55 24.75 4.25 25.45 3.9 25.8 3.25 25.8 3.2 25.7 2.95 25.6 2.8 25.65 2.75 M 22.9 0.8 L 23.3 0.95 23.75 1.4 24.3 1.7 24.65 1.7 24.65 1.8 24.3 2.35 24.55 2.7 24.9 2.85 25.1 3.1 25.25 3.35 25 3.65 24.65 3.8 23.8 3.4 23.5 3.4 23.5 3.45 23.45 3.45 23.4 3.4 23.35 3.45 23.3 3.45 23.3 3.4 23.1 3.45 22.5 3.15 21.8 2.95 21.7 2.95 20.2 3.45 20 3.4 19.75 3.4 19.6 3.6 19.65 3.75 19.6 3.75 Q 19.1 3.6 19.05 3.05 L 19 3.05 18.9 2.9 Q 19.45 2.8 19.65 2.3 19.8 1.9 20.55 1.4 L 21.35 0.9 21.45 0.95 21.5 1 21.75 1 22.2 0.7 22.55 0.8 22.9 0.8 M 21.75 3.4 L 22.2 3.55 22.15 3.55 22.95 3.9 23.8 3.9 24.1 4.1 24.25 4.35 24.2 4.6 24.05 4.75 23.95 4.7 23.85 4.6 23.4 4.5 Q 23.25 4.5 23.05 4.65 L 23.05 4.9 23 5.1 22.9 5.3 22.7 5.55 22.35 5.5 22.3 5.5 22.2 5.6 22.15 5.7 22.3 5.9 22.6 6 22.95 6 Q 23.25 6 23.35 5.55 L 23.4 5.2 23.45 5 23.5 5 23.85 5.25 23.85 5.4 23.5 6.15 22.75 7.1 22.5 7.3 21.9 7.3 Q 21.6 7.3 20.95 6.5 L 20.35 5.5 20.35 5.05 20.4 4.95 20.4 4.75 20.15 4.45 20.25 4.55 20.45 4.55 20.45 4.5 20.5 4.5 20.55 4.4 20.55 4.2 20.45 3.95 Q 20.4 3.85 21.05 3.65 L 21.75 3.4 M 22.8 7.75 L 23.4 8.25 23.75 9 23.8 9.15 23.75 9.3 23.8 9.55 24 10.1 24 10.05 24.55 10.9 25 11.4 24.7 11.75 24.4 12.25 24.75 12.45 24.9 12.4 24.85 12.35 25.3 11.95 25.4 11.9 25.5 11.9 28.1 13.75 27.9 13.85 27.9 13.9 27.15 14.5 26.7 14.2 Q 26.4 14 25.75 13.75 L 24.8 13.3 24.5 13.1 24.15 13 23.5 12.15 23.35 12 23.2 11.65 22.55 10.85 22.7 10.65 22.6 10.5 22.4 10.5 21.95 10.8 22 10.85 Q 21.35 11.6 21.25 12.15 L 20.45 11.5 18.5 10.85 18.05 10.65 18 10.7 15.6 9.45 15.85 9.25 16.25 9.1 16.7 8.7 16.65 8.6 16.5 8.55 16.55 8.45 16.55 8.4 16.35 8.25 Q 16.15 8.25 15.75 8.65 L 15.25 9.05 14.45 8.85 Q 13.95 8.85 14 9.2 L 14.1 9.4 13.7 9.7 Q 13.65 9.9 13.95 9.9 L 14.5 9.85 14.55 9.8 15.2 9.8 17.35 11 16.85 11.45 16.75 11.7 16.75 11.95 16.6 11.95 14.2 11.25 Q 12.65 10.75 12.7 10.65 L 12.7 10.6 12.65 10.55 12.65 10.6 12.3 10.35 12.15 9.95 12.35 9.55 12.5 9.35 12.65 9.2 13.85 7.6 14.6 7 15.65 5.9 16.5 5.55 16.75 5.55 16.95 5.6 17.2 5.7 18 5.7 18.45 5.9 18.8 5.85 18.8 6.05 18.9 6.5 19.1 6.9 Q 19.3 7.8 20.1 8.5 L 20.4 8.6 21.3 8.4 21.3 8.45 22.1 7.8 22.35 7.8 22.6 7.75 22.8 7.75 M 21.3 7.5 L 21 7.65 20.65 7.75 Q 20.4 7.75 20 7 L 19.5 6.05 19.75 5.6 20.05 6.05 21.3 7.5 M 28.2 15.1 L 28.35 14.75 28.65 14.5 28.85 14.55 29.05 14.65 28.9 14.7 Q 28.75 14.7 28.7 14.8 L 28.7 14.95 29.45 15.4 Q 30 15.75 30 15.8 L 30 15.9 29.05 15.6 28.2 15.1 M 27.75 14.7 L 27.7 14.7 27.8 14.55 27.9 14.45 27.75 14.7 M 29.8 16.45 L 30.1 16.55 30.2 16.55 30.15 16.5 30.45 16.35 30.55 16.05 31 16.85 30.9 17 30.8 16.95 30.7 17 30.4 17 29.95 16.7 29.65 16.35 29.8 16.45 M 21.05 12.55 L 21.05 12.65 21.1 12.7 21.1 13.1 20.8 13.35 20.75 13.3 20.7 13.35 20.55 13.25 19.45 13 18.65 12.65 17.9 12.15 18.1 11.75 18.45 11.5 18.8 11.5 19 11.55 20.75 12.4 20.7 12.4 20.85 12.5 21.05 12.55 M 20.25 14 L 20.45 14.35 20.15 14.6 19.8 14.65 18.85 14.35 19.2 14 19.1 13.8 18.9 13.8 18.55 13.95 18.6 13.95 18.15 14.1 16.55 13.55 16.3 13.55 15.95 13.65 15.5 13.5 15.2 13.15 15.25 12.3 15.3 12.2 15.35 12.2 16.6 12.5 16.65 12.5 16.65 12.45 17.25 12.65 17.45 12.6 18.75 13.25 19 13.4 19.2 13.4 20.25 13.7 20.25 14 M 20.4 15 L 20.5 15 20.55 15.05 20.55 15.3 20.7 15.7 21 16.3 21.5 16.75 21.1 16.95 20.8 17.25 21 17.4 21.35 17.35 21.5 17.45 21.7 17.55 21.35 17.65 21 17.7 21 17.65 20.95 17.65 20.6 17.75 Q 20.3 17.9 20.35 18 L 20.45 18.2 20.65 18.2 21.25 18.1 21.45 18.1 21.75 18.05 22 18.1 22.25 18.3 21.05 18.7 Q 20.3 18.95 19.9 19.25 19.2 18.1 19.25 17.6 19.2 17.55 19.5 17.05 L 19.5 16.8 19.4 16.8 19.45 16.75 19.4 16.75 19.35 16.7 19.2 16.7 18.85 17.2 18.65 17.6 18.65 17.75 19.2 19.25 19.3 19.45 19.4 19.6 18.9 19.6 18.85 19.65 18.75 19.6 18.75 19.65 18.2 19.65 18.1 19.7 17.55 19.7 16.65 19.9 16.3 19.75 Q 16.05 19.75 15.6 20.05 L 15.15 20.35 15.1 20.3 15.05 19.25 14.25 16.1 14.25 15.75 Q 14.2 15.25 14.85 14.2 L 15.05 13.85 15.1 13.85 15.65 14.05 16.65 14.2 16.95 14.2 17.5 14.4 Q 18.05 14.6 18.25 14.75 L 18.3 14.75 19.75 15.1 19.85 15.1 20.4 15 M 20.3 19.55 L 21.8 18.95 22.65 22.7 22.25 23.25 21.1 23.55 20.9 23.1 20.95 22.85 20.95 22.65 20.8 22.35 20.7 22.05 20.6 21.55 20.95 22 21.35 22.4 21.5 22.3 21.35 21.8 20.4 20.25 20.1 19.55 20.3 19.55 M 20.4 22.85 L 20.3 23.15 20.15 23.35 20.15 23.55 20.25 23.65 20.35 23.7 20.55 23.7 20.6 23.65 20.65 23.7 20.75 24.1 20.9 24.45 20.2 24.75 19.45 24.95 19.15 24.95 18.65 24.8 18.7 24.65 18.65 24.3 18.65 24.1 18.6 24.05 18.65 24 18.6 23.95 18.6 23.65 Q 18.6 23.1 18.2 22.7 L 17.9 22.45 17.8 22.3 17.4 21.8 16.6 20.5 17.05 20.35 17.55 21.4 18.35 22.25 18.45 22.2 18.45 22 17.6 20.3 17.85 20.2 17.9 20.25 18.1 20.25 18.1 20.2 18.45 20.2 18.8 20.15 19.25 20.15 19.55 20.2 20.1 21.5 20.05 21.7 20.4 22.85 M 17.45 11.8 L 17.5 11.8 17.3 12.1 17.15 12 17.2 11.9 17.25 11.75 17.45 11.4 17.75 11.2 17.9 11.2 17.45 11.8 M 16.4 24.6 L 16.45 24.6 16.4 24.5 16.3 24.45 17.75 23.2 17.8 23.2 17.95 23.6 18.05 24.05 18 24.05 18 24.1 18.1 24.45 17.55 24.7 17.6 24.7 16.8 24.95 16.6 24.85 16.4 24.6 M 19.05 25.5 L 19.5 25.5 20.95 25.05 21.15 24.95 22.15 28.3 22.2 28.55 22.25 28.7 22.2 28.9 22.1 29.05 21.9 29.2 21.95 29.25 21.7 29.3 21.5 29.3 19.95 27.05 20 27.05 19.45 26.4 19.5 26.4 19.2 26.05 18.8 25.45 18.9 25.45 19.05 25.5 M 21.8 5.85 L 21.65 5.9 21.5 6 21.9 6.4 Q 22.1 6.6 22.35 6.6 L 22.45 6.55 22.65 6.55 22.85 6.5 22.85 6.55 22.95 6.4 22.95 6.2 22.3 5.95 21.8 5.85 M 22.05 3.9 L 21.85 3.9 21.5 4 Q 21.2 4.1 21.25 4.25 21.2 4.45 21.4 4.45 L 21.7 4.45 22.15 4.65 22.4 4.65 22.55 4.7 22.65 4.75 22.85 4.55 22.55 4.15 22.05 3.9 M 20.95 1.9 L 20.4 2.15 Q 19.85 2.4 19.9 2.6 L 19.95 2.75 20.2 2.75 20.9 2.35 Q 21.4 2.35 21.55 1.9 L 21.45 1.8 21.25 1.8 21.1 1.85 20.95 1.95 20.95 1.9 M 20.95 2.65 L 20.3 2.8 20.1 2.8 19.75 2.7 Q 19.5 2.7 19.55 2.85 L 19.8 3.1 20 3.15 20.1 3.2 20.35 3.2 20.75 3.05 21.1 2.8 20.95 2.65 M 23.05 2.85 L 23.05 2.6 22.55 2.05 Q 22.1 1.7 21.9 1.7 L 21.7 1.85 21.9 2.05 22.1 2.15 22.8 2.95 22.95 2.95 23.05 2.85 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 19.5 25.5 L 19.05 25.5 18.9 25.45 18.8 25.45 19.2 26.05 19.5 26.4 19.45 26.4 20 27.05 19.95 27.05 21.5 29.3 21.7 29.3 21.95 29.25 21.9 29.2 22.1 29.05 22.2 28.9 22.25 28.7 22.2 28.55 22.15 28.3 21.15 24.95 20.95 25.05 19.5 25.5 M 16.45 24.6 L 16.4 24.6 16.6 24.85 16.8 24.95 17.6 24.7 17.55 24.7 18.1 24.45 18 24.1 18 24.05 18.05 24.05 17.95 23.6 17.8 23.2 17.75 23.2 16.3 24.45 16.4 24.5 16.45 24.6 M 17.5 11.8 L 17.45 11.8 17.9 11.2 17.75 11.2 17.45 11.4 17.25 11.75 17.2 11.9 17.15 12 17.3 12.1 17.5 11.8 M 20.45 14.35 L 20.25 14 20.25 13.7 19.2 13.4 19 13.4 18.75 13.25 17.45 12.6 17.25 12.65 16.65 12.45 16.65 12.5 16.6 12.5 15.35 12.2 15.3 12.2 15.25 12.3 15.2 13.15 15.5 13.5 15.95 13.65 16.3 13.55 16.55 13.55 18.15 14.1 18.6 13.95 18.55 13.95 18.9 13.8 19.1 13.8 19.2 14 18.85 14.35 19.8 14.65 20.15 14.6 20.45 14.35 M 23.4 8.25 L 22.8 7.75 22.6 7.75 22.35 7.8 22.1 7.8 21.3 8.45 21.3 8.4 20.4 8.6 20.1 8.5 Q 19.3 7.8 19.1 6.9 L 18.9 6.5 18.8 6.05 18.8 5.85 18.45 5.9 18 5.7 17.2 5.7 16.95 5.6 16.75 5.55 16.5 5.55 15.65 5.9 14.6 7 13.85 7.6 12.65 9.2 12.5 9.35 12.35 9.55 12.15 9.95 12.3 10.35 12.65 10.6 12.65 10.55 12.7 10.6 12.7 10.65 Q 12.65 10.75 14.2 11.25 L 16.6 11.95 16.75 11.95 16.75 11.7 16.85 11.45 17.35 11 15.2 9.8 14.55 9.8 14.5 9.85 13.95 9.9 Q 13.65 9.9 13.7 9.7 L 14.1 9.4 14 9.2 Q 13.95 8.85 14.45 8.85 L 15.25 9.05 15.75 8.65 Q 16.15 8.25 16.35 8.25 L 16.55 8.4 16.55 8.45 16.5 8.55 16.65 8.6 16.7 8.7 16.25 9.1 15.85 9.25 15.6 9.45 18 10.7 18.05 10.65 18.5 10.85 20.45 11.5 21.25 12.15 Q 21.35 11.6 22 10.85 L 21.95 10.8 22.4 10.5 22.6 10.5 22.7 10.65 22.55 10.85 23.2 11.65 23.35 12 23.5 12.15 24.15 13 24.5 13.1 24.8 13.3 25.75 13.75 Q 26.4 14 26.7 14.2 L 27.15 14.5 27.9 13.9 27.9 13.85 28.1 13.75 25.5 11.9 25.4 11.9 25.3 11.95 24.85 12.35 24.9 12.4 24.75 12.45 24.4 12.25 24.7 11.75 25 11.4 24.55 10.9 24 10.05 24 10.1 23.8 9.55 23.75 9.3 23.8 9.15 23.75 9 23.4 8.25 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 20.3 23.15 L 20.4 22.85 20.05 21.7 20.1 21.5 19.55 20.2 19.25 20.15 18.8 20.15 18.45 20.2 18.1 20.2 18.1 20.25 17.9 20.25 17.85 20.2 17.6 20.3 18.45 22 18.45 22.2 18.35 22.25 17.55 21.4 17.05 20.35 16.6 20.5 17.4 21.8 17.8 22.3 17.9 22.45 18.2 22.7 Q 18.6 23.1 18.6 23.65 L 18.6 23.95 18.65 24 18.6 24.05 18.65 24.1 18.65 24.3 18.7 24.65 18.65 24.8 19.15 24.95 19.45 24.95 20.2 24.75 20.9 24.45 20.75 24.1 20.65 23.7 20.6 23.65 20.55 23.7 20.35 23.7 20.25 23.65 20.15 23.55 20.15 23.35 20.3 23.15 M 21.8 18.95 L 20.3 19.55 20.1 19.55 20.4 20.25 21.35 21.8 21.5 22.3 21.35 22.4 20.95 22 20.6 21.55 20.7 22.05 20.8 22.35 20.95 22.65 20.95 22.85 20.9 23.1 21.1 23.55 22.25 23.25 22.65 22.7 21.8 18.95 M 21.05 12.65 L 21.05 12.55 20.85 12.5 20.7 12.4 20.75 12.4 19 11.55 18.8 11.5 18.45 11.5 18.1 11.75 17.9 12.15 18.65 12.65 19.45 13 20.55 13.25 20.7 13.35 20.75 13.3 20.8 13.35 21.1 13.1 21.1 12.7 21.05 12.65 M 30.1 16.55 L 29.8 16.45 29.65 16.35 29.95 16.7 30.4 17 30.7 17 30.8 16.95 30.9 17 31 16.85 30.55 16.05 30.45 16.35 30.15 16.5 30.2 16.55 30.1 16.55 M 28.35 14.75 L 28.2 15.1 29.05 15.6 30 15.9 30 15.8 Q 30 15.75 29.45 15.4 L 28.7 14.95 28.7 14.8 Q 28.75 14.7 28.9 14.7 L 29.05 14.65 28.85 14.55 28.65 14.5 28.35 14.75 M 21 7.65 L 21.3 7.5 20.05 6.05 19.75 5.6 19.5 6.05 20 7 Q 20.4 7.75 20.65 7.75 L 21 7.65 M 22.2 3.55 L 21.75 3.4 21.05 3.65 Q 20.4 3.85 20.45 3.95 L 20.55 4.2 20.55 4.4 20.5 4.5 20.45 4.5 20.45 4.55 20.25 4.55 20.15 4.45 20.4 4.75 20.4 4.95 20.35 5.05 20.35 5.5 20.95 6.5 Q 21.6 7.3 21.9 7.3 L 22.5 7.3 22.75 7.1 23.5 6.15 23.85 5.4 23.85 5.25 23.5 5 23.45 5 23.4 5.2 23.35 5.55 Q 23.25 6 22.95 6 L 22.6 6 22.3 5.9 22.15 5.7 22.2 5.6 22.3 5.5 22.35 5.5 22.7 5.55 22.9 5.3 23 5.1 23.05 4.9 23.05 4.65 Q 23.25 4.5 23.4 4.5 L 23.85 4.6 23.95 4.7 24.05 4.75 24.2 4.6 24.25 4.35 24.1 4.1 23.8 3.9 22.95 3.9 22.15 3.55 22.2 3.55 M 21.85 3.9 L 22.05 3.9 22.55 4.15 22.85 4.55 22.65 4.75 22.55 4.7 22.4 4.65 22.15 4.65 21.7 4.45 21.4 4.45 Q 21.2 4.45 21.25 4.25 21.2 4.1 21.5 4 L 21.85 3.9 M 21.65 5.9 L 21.8 5.85 22.3 5.95 22.95 6.2 22.95 6.4 22.85 6.55 22.85 6.5 22.65 6.55 22.45 6.55 22.35 6.6 Q 22.1 6.6 21.9 6.4 L 21.5 6 21.65 5.9 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 20.5 15 L 20.4 15 19.85 15.1 19.75 15.1 18.3 14.75 18.25 14.75 Q 18.05 14.6 17.5 14.4 L 16.95 14.2 16.65 14.2 15.65 14.05 15.1 13.85 15.05 13.85 14.85 14.2 Q 14.2 15.25 14.25 15.75 L 14.25 16.1 15.05 19.25 15.1 20.3 15.15 20.35 15.6 20.05 Q 16.05 19.75 16.3 19.75 L 16.65 19.9 17.55 19.7 18.1 19.7 18.2 19.65 18.75 19.65 18.75 19.6 18.85 19.65 18.9 19.6 19.4 19.6 19.3 19.45 19.2 19.25 18.65 17.75 18.65 17.6 18.85 17.2 19.2 16.7 19.35 16.7 19.4 16.75 19.45 16.75 19.4 16.8 19.5 16.8 19.5 17.05 Q 19.2 17.55 19.25 17.6 19.2 18.1 19.9 19.25 20.3 18.95 21.05 18.7 L 22.25 18.3 22 18.1 21.75 18.05 21.45 18.1 21.25 18.1 20.65 18.2 20.45 18.2 20.35 18 Q 20.3 17.9 20.6 17.75 L 20.95 17.65 21 17.65 21 17.7 21.35 17.65 21.7 17.55 21.5 17.45 21.35 17.35 21 17.4 20.8 17.25 21.1 16.95 21.5 16.75 21 16.3 20.7 15.7 20.55 15.3 20.55 15.05 20.5 15 Z\"/>\n\n  <path fill=\"#FFFFFF\" stroke=\"none\" d=\" M 27.7 14.7 L 27.75 14.7 27.9 14.45 27.8 14.55 27.7 14.7 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 23.3 0.95 L 22.9 0.8 22.55 0.8 22.2 0.7 21.75 1 21.5 1 21.45 0.95 21.35 0.9 20.55 1.4 Q 19.8 1.9 19.65 2.3 19.45 2.8 18.9 2.9 L 19 3.05 19.05 3.05 Q 19.1 3.6 19.6 3.75 L 19.65 3.75 19.6 3.6 19.75 3.4 20 3.4 20.2 3.45 21.7 2.95 21.8 2.95 22.5 3.15 23.1 3.45 23.3 3.4 23.3 3.45 23.35 3.45 23.4 3.4 23.45 3.45 23.5 3.45 23.5 3.4 23.8 3.4 24.65 3.8 25 3.65 25.25 3.35 25.1 3.1 24.9 2.85 24.55 2.7 24.3 2.35 24.65 1.8 24.65 1.7 24.3 1.7 23.75 1.4 23.3 0.95 M 23.05 2.6 L 23.05 2.85 22.95 2.95 22.8 2.95 22.1 2.15 21.9 2.05 21.7 1.85 21.9 1.7 Q 22.1 1.7 22.55 2.05 L 23.05 2.6 M 20.3 2.8 L 20.95 2.65 21.1 2.8 20.75 3.05 20.35 3.2 20.1 3.2 20 3.15 19.8 3.1 19.55 2.85 Q 19.5 2.7 19.75 2.7 L 20.1 2.8 20.3 2.8 M 20.4 2.15 L 20.95 1.9 20.95 1.95 21.1 1.85 21.25 1.8 21.45 1.8 21.55 1.9 Q 21.4 2.35 20.9 2.35 L 20.2 2.75 19.95 2.75 19.9 2.6 Q 19.85 2.4 20.4 2.15 Z\"/>\n</g>\n";

Asserts.sp_svg_player_face_back = "<g id=\"sp_svg_player_face_back\" sp-width=\"40\" sp-height=\"37\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 35.25 36.35 L 35.05 35.9 35.3 34.95 35.35 34.9 34.2 34.35 32.55 32.95 29.45 30.95 27.65 30.1 27.15 29.75 26.8 31.3 26.85 31.3 31.7 33.9 Q 32.85 34.45 33.5 34.9 L 34.65 36.1 35.25 36.35 M 21.15 23.45 L 21.1 23.35 14.15 20.5 Q 12.45 19.95 11.25 19.95 L 8.85 19.65 8.95 19.5 8.6 19.35 8.25 18.95 8.9 19.05 8.9 18.9 8.7 18.65 8.1 18.25 8.75 18.35 Q 8.6 18.1 7.25 17.45 L 5.25 16.6 Q 5.4 16.45 4.8 16.3 L 3.05 15.8 2.25 15.65 2.2 15.75 2.1 15.8 1.45 15.7 0.6 15.7 0.5 15.8 0.2 15.75 0 15.9 0.05 16.2 0.2 16.6 0.45 16.85 0.55 17.1 1.2 17.65 1.35 17.85 1.65 18.15 3.85 19 Q 4.45 19.15 5 19.5 5.75 20.05 3.2 19.9 2.75 20.35 2.65 20.95 L 2.9 22.05 Q 3.15 23.1 3.8 23.55 L 5.2 24.15 6.65 24.3 9.1 24.1 10.35 24.6 11.3 25.25 12.85 27.65 Q 13.55 28.4 13.35 28.8 L 14 28.9 14.65 29.1 16.1 30.3 17.1 31.4 18.1 32.2 21.55 34.65 21.7 34.95 21.5 35.2 21.5 35.35 21.15 35.45 Q 20.65 35.7 21.1 36 21.45 36.25 22.1 36.35 21.6 36.15 21.6 35.7 21.6 35.2 22.4 34.85 22.7 34.75 22.95 34.6 L 23.2 34.3 23.3 34.25 23 33.8 19.55 30.65 19 29.85 19.75 29.65 Q 19.2 29.2 19.15 28.7 L 19.3 28 20.95 28.55 Q 22.15 29.1 22.35 29.35 L 22.5 29.5 24 29.8 24 29.2 24.1 28.5 24.1 27.85 24.15 27.75 19.3 25.55 20.3 25.45 20.95 25.2 20.95 24.7 21.3 24.35 21.45 23.95 21.45 23.8 21.35 23.7 21.2 23.6 21.15 23.45 M 17.8 23.1 Q 18.1 24 18.5 24.3 L 17.35 24.45 16.75 24.05 15.5 22.6 16.35 22.65 17.8 23.1 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 33.25 2.4 Q 33.55 2.2 33.15 1.9 L 32.15 1.05 Q 31.65 0.75 31.55 0.8 L 31.35 0.9 31.2 1 30.65 0.9 29.85 0.85 29.6 1 29.35 0.95 29 1.2 28.15 2.35 28.05 2.85 27.8 3.25 Q 27.45 3.8 27.65 4.2 L 27.4 5.1 Q 27.3 5.75 27.75 5.6 27.9 6.3 28.4 6.55 L 28.7 6.75 28.85 7.35 Q 28.85 7.9 27.85 8.05 L 26.5 8.05 24.4 9.9 24 10.6 23.15 11.8 Q 21.9 13.55 21.95 14.3 21.95 14.95 22.5 15.35 23.05 15.75 23.7 15.65 L 24.25 15.5 24.75 15.45 25.6 15.45 Q 26.2 15.45 26.45 15.25 L 27 16.15 26.95 16.7 27 17.25 25.2 21.4 24.05 23.35 24.55 23.5 24.9 23.9 24.7 25.9 24.15 27.75 24.1 27.85 24.1 28.5 24 29.2 24 29.8 23.95 33.4 23.7 33.95 Q 23.5 34.2 23.3 34.25 L 23.2 34.3 22.95 34.6 Q 22.7 34.75 22.4 34.85 21.6 35.2 21.6 35.7 21.6 36.15 22.1 36.35 L 23.5 36.6 25.75 36.5 25.95 36.45 26 36.35 25.95 35.55 25.7 34.3 26.8 31.3 27.15 29.75 27.65 26.55 Q 27.75 26.1 28.2 25.2 28.3 25 28.7 25 L 29.25 24.8 Q 29.3 24.05 29.95 23.25 L 31.15 21.95 Q 31.5 21.95 31.95 22.95 32.4 23.9 32.3 24.25 L 32.2 24.55 Q 32.15 24.75 32.65 24.9 L 33.25 25.05 33.95 26.4 33.8 27.3 33.9 27.45 33.95 27.65 Q 34.05 29.55 34.45 30.5 L 35.15 32.15 Q 35.55 33.1 35.55 33.85 L 35.35 34.9 35.3 34.95 35.05 35.9 35.25 36.35 35.35 36.4 36 36.5 37.45 36.55 Q 38.75 36.5 38.75 35.95 L 37.9 34.55 Q 37.05 33.35 37.05 32.9 L 37.35 28.9 37.15 27.05 36.55 25.55 36.5 24.6 36.4 24.35 36.4 24.15 36.95 23.7 37.5 23.1 37.15 22.55 36.65 22 34.55 17.8 35.1 17.6 35.7 17.65 36.75 17.2 37.05 16.75 37.4 16.35 39.05 15.05 39.2 14.8 39.2 14.65 39.25 14.45 39.4 14.2 39.5 13.95 38.9 12.5 37.3 10.05 36.55 9.15 Q 35.65 8.2 34.45 8.2 L 33.4 8.15 32.5 7.65 32.75 7.45 32.65 7.1 32.9 6.4 33.4 6.6 33.6 6.35 33.75 5.95 33.75 5.2 33.95 5.4 34.25 5.4 Q 34.45 5 34 3.9 L 33.25 2.4 M 30.85 1.5 L 31.4 1.5 31.9 1.75 32.1 1.65 32.2 1.8 32.8 2.25 32.7 2.5 32.9 2.85 Q 33.6 3.8 33.6 4.6 L 33.6 4.75 33.5 4.75 33.05 4.8 33.2 5.45 33.1 5.7 33.05 6 32.85 6.05 32.55 6 Q 32.25 6.05 32.15 6.8 L 32.1 6.85 Q 31.8 6.7 31.75 6.85 L 31.8 7.05 31.8 7.25 31.65 7.25 31.3 6.95 31.15 6.95 31.1 7.05 31.3 7.3 31.2 7.4 Q 30.8 7.4 30.15 7 L 29.85 6.65 29.55 6.5 29.05 6.5 28.65 6.15 28.05 5 28.35 3.95 28.25 3.7 28.55 3.05 Q 28.85 2.65 28.75 2.35 L 28.9 2.15 29.6 1.55 30.35 1.25 30.85 1.5 M 33.2 8.3 L 34.5 8.6 Q 35.3 8.7 35.8 9.1 L 36.85 10.25 37.3 11.15 Q 39.1 13.5 39.1 13.85 L 38.4 15 37.5 15.9 36.8 15.65 36.1 15.25 36.1 15.15 36.7 14.25 37.5 14.5 Q 38.15 14.7 38.15 14.35 L 36.4 13.05 35.7 12.4 35.8 12.15 35.6 12.05 35.3 12 35.3 11.9 35.75 11.35 35.35 11.4 Q 35 11.55 34.7 11.85 34.35 12.15 34.35 12.35 L 34.6 12.75 34.25 13.7 Q 33.9 14.65 33.9 14.95 33.9 16.45 33.45 16.9 L 32.75 17.2 31.55 17.25 31.3 17.1 29.4 17.2 Q 28.85 17.2 28.25 16.4 L 27.95 16 27.8 16.2 28.1 16.65 28.25 17.15 27.9 17.15 27.4 16.7 27.35 15.95 27.1 14.95 27.1 14.5 27.05 14.1 26.85 13.6 26.9 13.5 26.75 13.2 26.8 12.95 26.65 12.4 26.25 12 Q 26 12 25.1 12.95 24.2 13.9 24.2 14.2 L 23.75 14.75 23.85 14.85 24.2 14.55 24.7 14.45 25.05 13.9 Q 25.2 13.3 25.3 13.25 25.9 13.25 26.1 13.5 L 26.25 14.35 26.25 14.85 25.95 15.15 24.7 14.85 23.45 15.05 Q 22.6 15.05 22.6 14.25 22.6 13.5 23.9 11.8 L 26.75 8.45 27.9 8.55 28.15 8.65 28.45 8.7 28.6 8.55 28.65 8.35 30.5 8.9 32.4 8.6 32.25 8.95 32.4 9 33.2 8.3 M 31.25 8.5 L 30.7 8.5 30.35 8.55 Q 29.55 8.7 29.3 8.05 L 29.15 7.6 29.1 7.35 Q 29.1 7.15 29.45 7.05 L 30.55 7.7 31.85 7.8 32 8 32.05 8.25 Q 32 8.45 31.25 8.5 M 27.1 18.55 L 27.65 17.8 28.75 17.65 Q 28.85 17.65 29.1 17.8 L 29.45 17.9 30.35 17.9 31.2 17.6 31.65 17.75 33.05 17.8 33.85 17.45 34 17.45 36.95 23.2 33.3 24.7 32.95 24.6 32.75 24.45 32.95 23.45 Q 33.05 22.8 32.55 23.2 L 31.9 22.5 31.4 21.75 31.45 21.55 31.6 21.55 32.05 21.9 32.85 21.85 33.35 21.6 32.9 21.5 32 21.55 31.95 21.5 32.35 21.25 32.5 21.3 32.8 21.35 32.95 21.15 Q 32.95 20.9 32.65 20.95 L 31.5 21.25 29.95 21.4 29.05 21.2 28.9 21.35 Q 28.9 21.7 30.7 21.7 L 30.7 21.85 29.35 23.3 28.65 24.3 27.35 24.4 Q 26.2 24.2 26.2 23.8 L 24.75 23.1 25.45 22.2 Q 26.2 21.2 26.2 20.55 L 27.1 18.55 M 25.1 24.35 L 25.3 24.15 25.6 24.3 26 24.6 Q 26.65 25.05 27.65 25.05 L 27.85 25.2 27.1 26.95 26.8 26.75 26.35 26.55 25.65 26.6 27 27.05 27.1 27.5 27.05 28 Q 27.05 28.35 25.8 28.25 L 24.95 28.05 Q 24.55 27.9 24.55 27.7 L 25.1 25.35 25.1 24.35 M 35.7 12.85 L 36.6 13.6 Q 35.6 15.15 35.6 15.6 L 34.25 15.85 Q 34.15 15.85 34.2 15.2 34.25 14.35 34.95 12.75 35.1 12.35 35.7 12.85 M 36.5 16.9 L 36.15 16.95 34.9 16.6 34.5 16.65 34.3 16.45 Q 34.25 16.2 34.55 16.15 L 35.8 15.8 36.95 16.45 36.5 16.9 M 34.75 17 L 34.95 16.85 35.15 17.05 35 17.2 34.8 17.3 34.7 17.25 34.75 17 M 34.7 24.65 L 36 24.3 36.5 26.9 36.3 27.15 36.05 27.25 35.3 27.3 34.55 27.15 34.35 26.45 33.7 25.1 Q 33.7 24.95 34.7 24.65 M 36.5 27.4 L 36.7 27.4 36.95 28.45 36.95 30.4 36.85 30.5 36.7 33.3 36.6 33.5 36.1 33.55 Q 35.8 33.5 35.7 32.9 L 35.55 32 34.9 30.5 Q 34.4 29.5 34.4 29 L 34.4 28.3 34.35 28.3 34.35 27.65 34.45 27.5 35.55 27.7 Q 36.35 27.75 36.5 27.4 M 26.75 28.6 L 26.75 29 26.65 29.35 26.65 29.9 26.1 32.2 Q 25.5 34.05 25.2 34.05 L 24.7 34.05 Q 24.45 34 24.5 33.7 L 24.6 33.2 24.6 29.05 24.75 28.25 25.8 28.5 26.75 28.6 M 35.95 25.8 L 35.95 25.7 Q 35.7 25.55 35.1 25.7 34.55 25.85 34.6 26.05 L 35.95 25.8 M 31.15 9.05 L 30.5 9.15 28.65 8.75 28.65 8.9 30.2 9.45 Q 31.3 9.65 31.75 9.2 L 31.15 9.05 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 26.75 29 L 26.75 28.6 25.8 28.5 24.75 28.25 24.6 29.05 24.6 33.2 24.5 33.7 Q 24.45 34 24.7 34.05 L 25.2 34.05 Q 25.5 34.05 26.1 32.2 L 26.65 29.9 26.65 29.35 26.75 29 M 36.7 27.4 L 36.5 27.4 Q 36.35 27.75 35.55 27.7 L 34.45 27.5 34.35 27.65 34.35 28.3 34.4 28.3 34.4 29 Q 34.4 29.5 34.9 30.5 L 35.55 32 35.7 32.9 Q 35.8 33.5 36.1 33.55 L 36.6 33.5 36.7 33.3 36.85 30.5 36.95 30.4 36.95 28.45 36.7 27.4 M 34.5 8.6 L 33.2 8.3 32.4 9 32.25 8.95 32.4 8.6 30.5 8.9 28.65 8.35 28.6 8.55 28.45 8.7 28.15 8.65 27.9 8.55 26.75 8.45 23.9 11.8 Q 22.6 13.5 22.6 14.25 22.6 15.05 23.45 15.05 L 24.7 14.85 25.95 15.15 26.25 14.85 26.25 14.35 26.1 13.5 Q 25.9 13.25 25.3 13.25 25.2 13.3 25.05 13.9 L 24.7 14.45 24.2 14.55 23.85 14.85 23.75 14.75 24.2 14.2 Q 24.2 13.9 25.1 12.95 26 12 26.25 12 L 26.65 12.4 26.8 12.95 26.75 13.2 26.9 13.5 26.85 13.6 27.05 14.1 27.1 14.5 27.1 14.95 27.35 15.95 27.4 16.7 27.9 17.15 28.25 17.15 28.1 16.65 27.8 16.2 27.95 16 28.25 16.4 Q 28.85 17.2 29.4 17.2 L 31.3 17.1 31.55 17.25 32.75 17.2 33.45 16.9 Q 33.9 16.45 33.9 14.95 33.9 14.65 34.25 13.7 L 34.6 12.75 34.35 12.35 Q 34.35 12.15 34.7 11.85 35 11.55 35.35 11.4 L 35.75 11.35 35.3 11.9 35.3 12 35.6 12.05 35.8 12.15 35.7 12.4 36.4 13.05 38.15 14.35 Q 38.15 14.7 37.5 14.5 L 36.7 14.25 36.1 15.15 36.1 15.25 36.8 15.65 37.5 15.9 38.4 15 39.1 13.85 Q 39.1 13.5 37.3 11.15 L 36.85 10.25 35.8 9.1 Q 35.3 8.7 34.5 8.6 M 30.5 9.15 L 31.15 9.05 31.75 9.2 Q 31.3 9.65 30.2 9.45 L 28.65 8.9 28.65 8.75 30.5 9.15 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 36 24.3 L 34.7 24.65 Q 33.7 24.95 33.7 25.1 L 34.35 26.45 34.55 27.15 35.3 27.3 36.05 27.25 36.3 27.15 36.5 26.9 36 24.3 M 35.95 25.7 L 35.95 25.8 34.6 26.05 Q 34.55 25.85 35.1 25.7 35.7 25.55 35.95 25.7 M 34.95 16.85 L 34.75 17 34.7 17.25 34.8 17.3 35 17.2 35.15 17.05 34.95 16.85 M 36.15 16.95 L 36.5 16.9 36.95 16.45 35.8 15.8 34.55 16.15 Q 34.25 16.2 34.3 16.45 L 34.5 16.65 34.9 16.6 36.15 16.95 M 25.3 24.15 L 25.1 24.35 25.1 25.35 24.55 27.7 Q 24.55 27.9 24.95 28.05 L 25.8 28.25 Q 27.05 28.35 27.05 28 L 27.1 27.5 27 27.05 25.65 26.6 26.35 26.55 26.8 26.75 27.1 26.95 27.85 25.2 27.65 25.05 Q 26.65 25.05 26 24.6 L 25.6 24.3 25.3 24.15 M 30.7 8.5 L 31.25 8.5 Q 32 8.45 32.05 8.25 L 32 8 31.85 7.8 30.55 7.7 29.45 7.05 Q 29.1 7.15 29.1 7.35 L 29.15 7.6 29.3 8.05 Q 29.55 8.7 30.35 8.55 L 30.7 8.5 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 27.65 17.8 L 27.1 18.55 26.2 20.55 Q 26.2 21.2 25.45 22.2 L 24.75 23.1 26.2 23.8 Q 26.2 24.2 27.35 24.4 L 28.65 24.3 29.35 23.3 30.7 21.85 30.7 21.7 Q 28.9 21.7 28.9 21.35 L 29.05 21.2 29.95 21.4 31.5 21.25 32.65 20.95 Q 32.95 20.9 32.95 21.15 L 32.8 21.35 32.5 21.3 32.35 21.25 31.95 21.5 32 21.55 32.9 21.5 33.35 21.6 32.85 21.85 32.05 21.9 31.6 21.55 31.45 21.55 31.4 21.75 31.9 22.5 32.55 23.2 Q 33.05 22.8 32.95 23.45 L 32.75 24.45 32.95 24.6 33.3 24.7 36.95 23.2 34 17.45 33.85 17.45 33.05 17.8 31.65 17.75 31.2 17.6 30.35 17.9 29.45 17.9 29.1 17.8 Q 28.85 17.65 28.75 17.65 L 27.65 17.8 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 31.4 1.5 L 30.85 1.5 30.35 1.25 29.6 1.55 28.9 2.15 28.75 2.35 Q 28.85 2.65 28.55 3.05 L 28.25 3.7 28.35 3.95 28.05 5 28.65 6.15 29.05 6.5 29.55 6.5 29.85 6.65 30.15 7 Q 30.8 7.4 31.2 7.4 L 31.3 7.3 31.1 7.05 31.15 6.95 31.3 6.95 31.65 7.25 31.8 7.25 31.8 7.05 31.75 6.85 Q 31.8 6.7 32.1 6.85 L 32.15 6.8 Q 32.25 6.05 32.55 6 L 32.85 6.05 33.05 6 33.1 5.7 33.2 5.45 33.05 4.8 33.5 4.75 33.6 4.75 33.6 4.6 Q 33.6 3.8 32.9 2.85 L 32.7 2.5 32.8 2.25 32.2 1.8 32.1 1.65 31.9 1.75 31.4 1.5 Z\"/>\n</g>\n";

Asserts.sp_svg_player_fly_right = "<g id=\"sp_svg_player_fly_right\" sp-width=\"36\" sp-height=\"17\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 23.3 22.95 L 24.55 23.4 32.95 23.8 33.85 23.55 Q 34.1 23.35 33.65 23.3 L 29.3 23.05 24.3 22.15 Q 26.7 21.95 25.8 20.45 L 25.55 20.25 25.25 20.15 20.65 20.25 15.7 21.35 4.2 20.4 2.35 19.75 1.1 19.55 Q 0.75 19.6 0.8 19.85 L 1.05 20.15 2.1 20.9 10.9 22.05 11.6 22.3 12.3 22.4 Q 12.9 22.4 12.45 22.65 L 12.05 22.95 11.3 23.2 8.4 22.35 7.75 22 6.8 21.8 4.65 21.7 Q 4.6 22.05 6.1 22.75 L 9.7 23.85 14 24 14.6 23.95 15.15 23.8 16.15 23.35 17.6 23.15 20.65 22.3 22.5 22.5 23.3 22.95 M 30.9 15.2 L 30.85 15.2 30.75 15.15 30.8 15.25 30.9 15.35 31.1 15.3 31.25 15.35 31.3 15.3 31.2 15.3 31 15.2 30.9 15.2 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 24.15 9.15 L 23.85 9.25 23.75 9.55 23.8 9.75 23.85 9.85 23.85 10.15 23.6 10.3 23.4 10.6 23.35 10.55 22.75 10.4 22.5 10.4 21.65 10.7 21.45 10.75 21.25 10.85 21.05 10.9 20.95 11 20.85 11.05 20.8 11.1 20 11.55 19.4 11.8 18.35 12.45 17.9 12.65 15.9 11.8 15.8 11.8 15.3 11.55 14.7 11.45 14 11.45 13.4 11.25 13.25 11.25 12.9 11.15 12.15 11.15 11.85 11.05 11.8 11.1 9 10.35 8.65 10.35 7.6 10.25 7.3 10.25 7 10.2 6.8 10.2 6.35 10.15 4.55 8.35 4.5 8.4 4.35 8.25 4.3 8.15 3.85 7.85 3.25 7.85 3 8.25 3 9 3.2 9.5 4.55 11.8 4.65 11.9 4.65 11.95 4.7 12 5 12 5 12.05 5.15 12.05 5.45 12.1 6 12 6.25 11.8 6.35 11.75 7 11.95 7.45 12.15 8.4 12.8 Q 9.05 13.05 9.3 13.25 L 9.5 13.35 9.85 13.45 10.05 13.55 10.15 13.55 10.25 13.6 10.45 13.55 10.5 13.55 10.85 13.6 11.4 13.6 11.7 13.65 11.9 13.75 11.95 13.75 12.4 14.05 12.85 14.2 13.5 14.5 13.6 14.75 13.6 14.95 13.5 15.2 13.5 15.4 13.65 15.55 13.8 15.6 14.05 15.6 14.45 15.55 14.5 15.5 14.55 15.55 14.6 15.5 14.75 15.55 14.6 15.85 14.4 16.1 13.5 16.35 13.45 16.35 13.4 16.4 13.4 16.65 14.2 17 13.45 17.7 13.4 17.65 13.35 17.7 13.35 17.65 12.95 17.3 12.15 16.75 11.8 16.45 11 16.05 Q 10.55 15.8 10.55 15.4 L 10.5 15.3 10.5 15.2 10.4 15.05 10.25 14.9 10.25 14.8 10.05 14.6 8.95 13.9 8.75 13.9 8.65 13.85 8.6 13.9 7.95 13.75 7.9 13.75 7.4 13.65 6.95 13.5 6.7 13.45 6.3 13.8 6.3 14.05 6.5 14.5 6.9 14.95 7.55 15.5 8.4 16 8.65 16.25 9.1 16.5 9.85 17.6 10.05 17.85 10.2 18.1 13.15 20.85 13.85 20.85 16.15 20 16.25 19.9 16.4 20 16.85 19.75 17.1 19.55 17.15 19.5 17.3 19.4 17.55 19.05 17.7 18.6 17.75 18.5 17.75 18.4 18.1 18.25 18.4 18.2 18.75 17.9 19.15 17.7 19.45 17.75 19.75 17.65 20.1 17.4 22.85 16.75 23.2 16.7 23.45 16.7 Q 23.5 16.6 23.7 16.6 L 24.35 16.45 24.4 16.5 24.45 16.45 24.55 16.5 24.6 16.45 24.8 16.5 25 16.6 Q 25.65 16.7 25.95 16.95 L 26.1 17.05 27.2 17.5 27.35 17.65 28.1 18 30.25 18.65 30.75 18.7 31.65 18.7 31.7 18.75 31.8 18.7 31.85 18.75 31.9 18.7 31.95 18.75 32 18.7 32.1 18.75 32.15 18.7 32.25 18.7 32.3 18.75 32.4 18.7 32.75 18.7 33.4 19.15 33.85 19.35 34 19.35 34.2 19.4 34.4 19.4 34.6 19.35 35.1 19.35 35.55 19.25 35.6 19.3 36 18.95 36 18.15 35.9 18 35.8 17.95 35.25 17.8 34.75 17.5 34.8 17.5 34.8 17.45 34.85 17.4 34.9 17.4 35.1 17.1 35.1 16.85 34.7 16.5 34.55 16.5 34.6 16.35 34.7 16.2 34.7 15.85 34.4 15.55 34.15 15.2 33.7 14.7 33.35 14.6 32.7 14.6 32.65 14.55 31.8 14.55 31.65 14.6 31.55 14.6 31.35 14.65 31.3 14.5 31.2 14.4 30.85 14.3 28.6 13.15 27.6 12.8 27.6 12.75 27.85 12.65 27.85 12.7 27.9 12.7 27.95 12.65 28 12.7 28.4 12.5 28.5 12.4 28.55 12.25 28.45 12.1 28.4 12.05 28.4 11.75 28.3 11.45 28.25 11.35 27.95 10.3 27.8 10.05 27.55 9.95 27.45 9.95 27.4 10 26.3 9.15 26.05 9.1 25.8 9 25.8 9.05 25.75 9.05 25.7 9 25.55 9.1 25.45 9.1 25.4 9.05 25.25 9 24.95 9 24.5 9.2 24.2 9.2 24.15 9.15 M 29.2 15.9 L 29.25 15.95 29.4 16 29.55 16 29.7 16.1 29.75 16.05 30.2 16.15 30.45 16.1 30.8 16.15 31 16.15 31.1 16.1 31.25 16.15 31.35 16.2 31.55 16.25 31.55 16.3 31.9 16.4 32.2 16.55 32.2 16.6 32.25 16.6 32.45 16.7 32.6 16.75 32.55 16.8 32.3 16.7 32.1 16.7 31.85 16.65 31.65 16.7 31.2 16.55 30.95 16.5 30.75 16.4 30.65 16.4 30.55 16.35 30.1 16.35 Q 29.25 16.25 29.1 15.9 L 29.2 15.9 M 32.7 16.85 L 32.85 16.85 32.95 16.9 33.25 17 33.15 17.05 33 17 32.85 17 32.7 16.85 M 24.95 9.65 L 24.95 9.7 25.05 9.55 25.05 9.6 25.15 9.5 25.5 9.6 25.65 9.55 Q 25.75 9.45 25.8 9.45 26.15 9.45 26.55 9.8 L 27.2 10.45 27.4 10.45 27.5 10.4 27.65 10.7 27.75 11.1 27.75 11.4 27.8 11.45 27.75 11.5 27.85 11.6 27.9 11.55 27.95 11.75 27.9 12.05 27.95 12.2 27.95 12.3 27.85 12.3 27.85 12.25 27.8 12.3 27.65 12.25 27.6 12.1 27.7 12 27.75 11.8 27.65 11.6 27.65 11.65 27.55 11.65 27.55 11.6 27.4 11.75 27.3 11.75 27.15 11.45 27.1 11.15 26.85 10.6 26.45 10.15 Q 26.3 10.15 26.3 10.3 L 26.45 10.65 26.6 10.9 26.5 10.9 26.35 11 26.25 11.05 25.75 10.85 25.9 10.8 26 10.65 25.75 10.3 25.7 10.2 25.6 10.1 25.6 10.15 25.55 10.05 25.45 9.95 25.3 9.85 25.1 10 25.35 10.5 25.2 10.5 25.1 10.55 25.05 10.55 24.8 10.45 24.55 10.3 24.4 10.4 24.4 10.15 24.35 10.1 24.3 9.75 24.95 9.65 M 24.05 10.65 L 24.05 10.7 24.35 10.45 24.35 10.6 24.2 10.75 23.95 10.85 23.95 10.7 24 10.65 24.05 10.65 M 10.2 11.15 L 10.25 11.2 9.95 11.65 9.8 12 9.8 11.95 9.75 12.2 9.75 12.6 9.85 12.9 9.2 12.6 9.2 12.55 7.1 11.45 6.45 11.25 6.4 11.3 6.35 11.3 6.35 11.25 6.3 11.3 6.2 11.2 6.1 10.85 6.1 10.5 6.35 10.65 6.55 10.65 6.55 10.7 6.6 10.65 6.8 10.7 7.2 10.7 7.2 10.75 7.25 10.7 7.3 10.75 7.4 10.7 7.45 10.75 7.5 10.7 8.35 10.85 8.8 10.85 8.75 10.9 9.45 10.95 10.15 11.15 10.2 11.15 M 24.8 11.25 L 24.85 11.15 24.9 11 24.95 11 25 11.05 25.1 11.05 25.3 11 25.75 11.3 25.75 11.35 26.45 11.5 26.45 11.55 26.75 11.55 26.75 11.6 26.8 11.75 26.95 12.05 27.25 12.35 27.3 12.5 27.25 12.55 26.8 12.25 26.8 12.3 25.75 11.7 25.4 11.6 24.8 11.25 M 11.05 11.4 L 11.05 11.45 11.15 11.45 11.55 11.6 11.8 11.6 11.9 11.55 11.95 11.6 12.05 11.55 12.05 11.6 12.35 11.6 12.35 11.65 12.4 11.6 12.5 11.65 12.5 11.6 12.55 11.6 13.35 11.75 13.35 11.8 13.4 11.8 13.65 11.9 13.9 12.05 14.1 12.9 14.15 13.5 14.15 13.65 14.1 13.7 14.05 13.55 14 13.55 13.45 13.35 13.25 13.2 13.2 13.25 13 13.2 Q 12.85 13.2 12.85 13.3 L 13.1 13.6 13.65 13.85 13.8 13.9 13.7 14.05 13.7 14.1 13.6 14.1 13.35 13.95 13 13.85 12 13.3 11.95 13.2 11.95 13.25 11.65 13.1 11.55 13.15 11.5 13.15 11.1 13.1 10.55 13.1 10.25 12.9 10.25 12.75 10.4 12.8 10.65 12.8 10.7 12.65 10.7 12.5 10.2 12.3 10.2 12.2 10.4 11.7 10.45 11.7 10.55 11.5 10.75 11.35 11.05 11.4 M 14.35 12.05 L 14.35 11.85 14.7 11.85 15.8 12.2 15.85 12.2 15.85 12.25 15.9 12.2 17.6 12.95 17.6 13.35 17.7 13.9 17.75 13.85 18.15 14.9 18.25 15.8 18.4 16.15 18.6 16.45 18.85 17.35 18.5 17.55 18.45 17.6 18.4 17.7 18.4 17.65 18 17.95 17.7 17.95 17.7 17.9 17.65 17.9 17.65 17.95 17.55 17.9 Q 17.2 17.95 17.2 18.1 L 17.2 18.3 17.15 18.2 17.1 18.15 16.8 17.8 16.45 17.5 16.35 17.65 16.8 18.45 16.8 18.55 16.85 18.55 16.95 18.85 16.55 19.35 16.1 18.55 15 17.25 14.9 17.05 14.85 17.05 14.85 17 14.8 16.95 14.3 16.55 14.4 16.55 14.6 16.45 14.8 16.3 14.85 16.3 14.9 16.25 14.95 16.1 15.15 15.7 15.35 15.4 15.55 15.5 15.6 15.5 15.6 15.45 15.8 15.55 16 15.55 16 15.6 16.3 15.7 16.6 15.95 16.65 16 16.7 16 17 16.15 17.15 16.15 17.2 16.1 17.25 15.95 16.65 15.5 16.65 15.55 16.35 15.4 14.25 14.75 14.05 14.8 14.05 14.65 Q 14.05 14.2 14.35 14.05 L 14.55 13.95 14.65 13.75 14.65 13.55 14.45 12.5 14.45 12.45 14.35 12.05 M 35.5 18.4 L 35.5 18.45 35.55 18.45 35.55 18.6 35.35 18.8 35.15 18.85 34.2 18.85 33.85 18.75 33.8 18.75 33.55 18.6 33.55 18.65 33.35 18.5 33.15 18.4 33.35 17.55 33.65 17.4 33.95 17.3 34.25 17.1 34.3 17.1 34.35 17.15 34.55 17.05 34.55 17.1 34.3 17.35 34.25 17.65 34.3 17.85 34.5 18.05 34.5 18 35.5 18.4 M 31.9 15 L 32.65 15 33.4 15.1 Q 33.4 15.4 33.7 15.65 L 34.15 16 34.2 16 34.2 16.1 34.25 16.05 34.25 16.2 34.2 16.15 34.15 16.35 34.15 16.3 33.9 16.45 33.85 16.4 33.75 16.45 33.55 16.5 33.45 16.45 33.4 16.5 33.3 16.45 33.15 16.4 33.15 16.45 32.8 16.35 32.5 16.2 Q 32.1 16.05 31.95 15.9 L 31.9 15.9 31.8 15.85 31.65 15.8 31.9 15.25 31.9 15 M 9.8 16.65 L 9.8 16.6 9.6 16.25 9.45 16.05 9.45 15.9 9.6 15.85 9.7 15.85 9.7 15.9 10.75 16.45 Q 11.35 16.75 11.55 16.95 L 11.85 17.1 12.5 17.6 12.4 17.6 12.05 17.85 11.95 17.95 11.9 18.05 11.9 18 11.85 18.1 11.85 18.05 11.8 18.15 11.75 18.15 11.5 18.7 11.5 18.75 Q 10.9 18.3 10.25 17.3 L 10.2 17.3 10.2 17.25 9.8 16.65 M 14.05 15.05 L 14.05 14.95 14.3 15.1 14.25 15.1 14.05 15.05 M 12.15 18.45 L 12.2 18.45 12.2 18.4 12.15 18.4 12.25 18.35 12.35 18.25 12.55 18.3 12.75 18.4 12.95 18.2 12.75 17.9 12.85 17.9 13.05 18 13.1 18.15 13.1 18.35 13.3 18.45 13.5 18.35 13.75 18 13.75 18.05 Q 14.3 17.3 14.5 17.3 L 14.7 17.5 14.55 17.55 14.15 17.8 13.8 18.2 13.85 18.4 14 18.4 14.2 18.3 14.35 18.2 14.4 18.2 14.95 17.85 15.25 18.15 15.6 18.65 15.6 18.6 16.05 19.45 16.05 19.5 Q 15.95 19.6 15.8 19.65 L 15.8 19.6 15.35 19.85 13.65 20.45 13.45 20.45 13.35 20.35 13.35 20.3 13.3 20.35 13.3 20.25 13.25 20.3 13.25 20.2 13.2 20.25 12.2 19.5 11.95 19.15 11.95 19.05 12.15 18.45 M 20.8 11.6 L 20.8 11.65 21.75 11.15 21.75 11.1 22.4 10.9 22.65 10.9 22.75 10.85 23.15 10.95 23.5 11.15 23.55 11.2 25.75 12.25 25.75 12.3 25.8 12.25 26.9 12.85 26.9 12.9 26.95 12.85 27.05 12.9 27.2 13 27.2 13.05 Q 27.5 13.15 27.7 13.35 L 27.75 13.35 28.15 13.5 28.1 13.5 Q 28.3 13.55 28.65 13.75 L 29.2 13.95 29.15 14 29.55 14.15 29.8 14.3 29.8 14.25 30.2 14.55 30.8 14.75 30.95 15 30.9 15.1 30.9 15.2 31 15.2 31.2 15.3 31.3 15.3 31.4 15.1 31.45 15.15 31.45 15.35 31.15 15.6 31.3 15.3 31.25 15.35 31.1 15.3 30.9 15.35 30.8 15.25 30.45 15.65 30.05 15.65 29.9 15.6 29.75 15.6 29.65 15.5 29.6 15.55 28.85 15.25 28.6 15.1 27.7 14.8 27.75 14.75 27.1 14.65 27.1 14.6 25.75 14.05 25.7 14.05 25.6 14 25.5 13.9 25.5 13.95 25.3 13.85 25.25 13.8 25.25 13.75 25.2 13.75 Q 23.6 13 23.2 13 L 23.1 12.95 23.05 13 22.2 12.8 21.8 12.75 21.45 12.75 21.4 12.8 21.35 12.75 21.1 12.8 20.9 12.95 20.95 13.05 21 13.05 21 13.1 21.05 13.1 20.95 13.3 21.05 13.45 21.3 13.55 22.05 13.55 22.9 13.45 Q 23.25 13.45 23.4 13.6 L 23.85 14 24.15 14.15 24.55 14.2 24.85 14.15 25.7 14.55 25.75 14.65 25.55 14.7 25.55 14.85 25.6 14.9 25.4 15 25.35 15.05 25.35 15.2 25.4 15.3 25.5 15.35 26.4 15.35 26.45 15.3 26.8 15.3 27.15 15.25 27.85 15.55 27.85 15.6 28.4 16.1 28.45 16.05 29 16.45 29 16.8 29.1 17.05 29.3 17.05 29.45 16.85 29.65 16.95 29.75 17.05 29.95 17.05 30.15 16.85 30.4 16.85 30.65 16.9 30.95 17.05 31 17 31.6 17.2 31.75 17.2 32.25 17.25 32.5 17.7 32.75 17.7 32.75 17.65 32.85 17.6 32.85 17.95 32.65 17.85 32.45 17.95 32.5 18 32.4 18.15 32.4 18.2 32.35 18.2 32.35 18.25 31.3 18.25 31.3 18.2 30.8 18.2 30.15 18.05 30.15 18.1 29.45 17.95 28.6 17.65 28.55 17.7 27.85 17.3 27.75 17.2 27.6 17.1 27.55 17.15 27.35 17.05 27.35 17 27.3 17.05 26.3 16.5 26.25 16.5 26.1 16.4 26.05 16.45 25.5 16.2 24.5 16 24.1 16 23.75 16.1 23.65 16.1 23.65 16.05 23.3 16.15 22.85 16.2 Q 22.35 16.3 22.1 16.5 L 21.8 16.6 21.75 16.6 20.25 16.85 20.05 16.9 19.4 17.3 19.2 16.95 19.05 16.45 19.75 16.6 19.95 16.6 20.05 16.4 Q 20.05 16.2 19.6 16.1 L 19.05 15.95 19.4 15.9 19.55 15.9 21.2 15.65 21.25 15.6 21.25 15.5 21.15 15.3 20.6 15.3 19.8 15.45 19.8 15.4 19.75 15.45 19.25 15.45 19.2 15.5 19.15 15.5 19.15 15.45 19 15.55 18.95 15.5 18.9 15.6 18.85 15.75 18.95 15.85 18.85 15.85 18.7 15.7 18.7 15.1 18.45 14.25 18.45 14.3 18.1 13.4 18.1 13.05 18.35 13 18.3 12.95 18.45 12.85 18.6 12.8 19.4 12.3 19.45 12.35 19.45 12.3 20.7 11.7 20.8 11.6 M 11.3 11.75 L 11.2 11.9 11.15 12.05 11.3 12.3 11.55 12.4 11.8 12.25 11.8 12.1 11.45 11.75 11.3 11.75 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 20.8 11.65 L 20.8 11.6 20.7 11.7 19.45 12.3 19.45 12.35 19.4 12.3 18.6 12.8 18.45 12.85 18.3 12.95 18.35 13 18.1 13.05 18.1 13.4 18.45 14.3 18.45 14.25 18.7 15.1 18.7 15.7 18.85 15.85 18.95 15.85 18.85 15.75 18.9 15.6 18.95 15.5 19 15.55 19.15 15.45 19.15 15.5 19.2 15.5 19.25 15.45 19.75 15.45 19.8 15.4 19.8 15.45 20.6 15.3 21.15 15.3 21.25 15.5 21.25 15.6 21.2 15.65 19.55 15.9 19.4 15.9 19.05 15.95 19.6 16.1 Q 20.05 16.2 20.05 16.4 L 19.95 16.6 19.75 16.6 19.05 16.45 19.2 16.95 19.4 17.3 20.05 16.9 20.25 16.85 21.75 16.6 21.8 16.6 22.1 16.5 Q 22.35 16.3 22.85 16.2 L 23.3 16.15 23.65 16.05 23.65 16.1 23.75 16.1 24.1 16 24.5 16 25.5 16.2 26.05 16.45 26.1 16.4 26.25 16.5 26.3 16.5 27.3 17.05 27.35 17 27.35 17.05 27.55 17.15 27.6 17.1 27.75 17.2 27.85 17.3 28.55 17.7 28.6 17.65 29.45 17.95 30.15 18.1 30.15 18.05 30.8 18.2 31.3 18.2 31.3 18.25 32.35 18.25 32.35 18.2 32.4 18.2 32.4 18.15 32.5 18 32.45 17.95 32.65 17.85 32.85 17.95 32.85 17.6 32.75 17.65 32.75 17.7 32.5 17.7 32.25 17.25 31.75 17.2 31.6 17.2 31 17 30.95 17.05 30.65 16.9 30.4 16.85 30.15 16.85 29.95 17.05 29.75 17.05 29.65 16.95 29.45 16.85 29.3 17.05 29.1 17.05 29 16.8 29 16.45 28.45 16.05 28.4 16.1 27.85 15.6 27.85 15.55 27.15 15.25 26.8 15.3 26.45 15.3 26.4 15.35 25.5 15.35 25.4 15.3 25.35 15.2 25.35 15.05 25.4 15 25.6 14.9 25.55 14.85 25.55 14.7 25.75 14.65 25.7 14.55 24.85 14.15 24.55 14.2 24.15 14.15 23.85 14 23.4 13.6 Q 23.25 13.45 22.9 13.45 L 22.05 13.55 21.3 13.55 21.05 13.45 20.95 13.3 21.05 13.1 21 13.1 21 13.05 20.95 13.05 20.9 12.95 21.1 12.8 21.35 12.75 21.4 12.8 21.45 12.75 21.8 12.75 22.2 12.8 23.05 13 23.1 12.95 23.2 13 Q 23.6 13 25.2 13.75 L 25.25 13.75 25.25 13.8 25.3 13.85 25.5 13.95 25.5 13.9 25.6 14 25.7 14.05 25.75 14.05 27.1 14.6 27.1 14.65 27.75 14.75 27.7 14.8 28.6 15.1 28.85 15.25 29.6 15.55 29.65 15.5 29.75 15.6 29.9 15.6 30.05 15.65 30.45 15.65 30.8 15.25 30.75 15.15 30.85 15.2 30.9 15.2 30.9 15.1 30.95 15 30.8 14.75 30.2 14.55 29.8 14.25 29.8 14.3 29.55 14.15 29.15 14 29.2 13.95 28.65 13.75 Q 28.3 13.55 28.1 13.5 L 28.15 13.5 27.75 13.35 27.7 13.35 Q 27.5 13.15 27.2 13.05 L 27.2 13 27.05 12.9 26.95 12.85 26.9 12.9 26.9 12.85 25.8 12.25 25.75 12.3 25.75 12.25 23.55 11.2 23.5 11.15 23.15 10.95 22.75 10.85 22.65 10.9 22.4 10.9 21.75 11.1 21.75 11.15 20.8 11.65 M 31.4 15.1 L 31.3 15.3 31.15 15.6 31.45 15.35 31.45 15.15 31.4 15.1 M 9.8 16.6 L 9.8 16.65 10.2 17.25 10.2 17.3 10.25 17.3 Q 10.9 18.3 11.5 18.75 L 11.5 18.7 11.75 18.15 11.8 18.15 11.85 18.05 11.85 18.1 11.9 18 11.9 18.05 11.95 17.95 12.05 17.85 12.4 17.6 12.5 17.6 11.85 17.1 11.55 16.95 Q 11.35 16.75 10.75 16.45 L 9.7 15.9 9.7 15.85 9.6 15.85 9.45 15.9 9.45 16.05 9.6 16.25 9.8 16.6 M 10.25 11.2 L 10.2 11.15 10.15 11.15 9.45 10.95 8.75 10.9 8.8 10.85 8.35 10.85 7.5 10.7 7.45 10.75 7.4 10.7 7.3 10.75 7.25 10.7 7.2 10.75 7.2 10.7 6.8 10.7 6.6 10.65 6.55 10.7 6.55 10.65 6.35 10.65 6.1 10.5 6.1 10.85 6.2 11.2 6.3 11.3 6.35 11.25 6.35 11.3 6.4 11.3 6.45 11.25 7.1 11.45 9.2 12.55 9.2 12.6 9.85 12.9 9.75 12.6 9.75 12.2 9.8 11.95 9.8 12 9.95 11.65 10.25 11.2 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 12.2 18.45 L 12.15 18.45 11.95 19.05 11.95 19.15 12.2 19.5 13.2 20.25 13.25 20.2 13.25 20.3 13.3 20.25 13.3 20.35 13.35 20.3 13.35 20.35 13.45 20.45 13.65 20.45 15.35 19.85 15.8 19.6 15.8 19.65 Q 15.95 19.6 16.05 19.5 L 16.05 19.45 15.6 18.6 15.6 18.65 15.25 18.15 14.95 17.85 14.4 18.2 14.35 18.2 14.2 18.3 14 18.4 13.85 18.4 13.8 18.2 14.15 17.8 14.55 17.55 14.7 17.5 14.5 17.3 Q 14.3 17.3 13.75 18.05 L 13.75 18 13.5 18.35 13.3 18.45 13.1 18.35 13.1 18.15 13.05 18 12.85 17.9 12.75 17.9 12.95 18.2 12.75 18.4 12.55 18.3 12.35 18.25 12.25 18.35 12.15 18.4 12.2 18.4 12.2 18.45 M 32.65 15 L 31.9 15 31.9 15.25 31.65 15.8 31.8 15.85 31.9 15.9 31.95 15.9 Q 32.1 16.05 32.5 16.2 L 32.8 16.35 33.15 16.45 33.15 16.4 33.3 16.45 33.4 16.5 33.45 16.45 33.55 16.5 33.75 16.45 33.85 16.4 33.9 16.45 34.15 16.3 34.15 16.35 34.2 16.15 34.25 16.2 34.25 16.05 34.2 16.1 34.2 16 34.15 16 33.7 15.65 Q 33.4 15.4 33.4 15.1 L 32.65 15 M 35.5 18.45 L 35.5 18.4 34.5 18 34.5 18.05 34.3 17.85 34.25 17.65 34.3 17.35 34.55 17.1 34.55 17.05 34.35 17.15 34.3 17.1 34.25 17.1 33.95 17.3 33.65 17.4 33.35 17.55 33.15 18.4 33.35 18.5 33.55 18.65 33.55 18.6 33.8 18.75 33.85 18.75 34.2 18.85 35.15 18.85 35.35 18.8 35.55 18.6 35.55 18.45 35.5 18.45 M 11.05 11.45 L 11.05 11.4 10.75 11.35 10.55 11.5 10.45 11.7 10.4 11.7 10.2 12.2 10.2 12.3 10.7 12.5 10.7 12.65 10.65 12.8 10.4 12.8 10.25 12.75 10.25 12.9 10.55 13.1 11.1 13.1 11.5 13.15 11.55 13.15 11.65 13.1 11.95 13.25 11.95 13.2 12 13.3 13 13.85 13.35 13.95 13.6 14.1 13.7 14.1 13.7 14.05 13.8 13.9 13.65 13.85 13.1 13.6 12.85 13.3 Q 12.85 13.2 13 13.2 L 13.2 13.25 13.25 13.2 13.45 13.35 14 13.55 14.05 13.55 14.1 13.7 14.15 13.65 14.15 13.5 14.1 12.9 13.9 12.05 13.65 11.9 13.4 11.8 13.35 11.8 13.35 11.75 12.55 11.6 12.5 11.6 12.5 11.65 12.4 11.6 12.35 11.65 12.35 11.6 12.05 11.6 12.05 11.55 11.95 11.6 11.9 11.55 11.8 11.6 11.55 11.6 11.15 11.45 11.05 11.45 M 11.2 11.9 L 11.3 11.75 11.45 11.75 11.8 12.1 11.8 12.25 11.55 12.4 11.3 12.3 11.15 12.05 11.2 11.9 M 24.85 11.15 L 24.8 11.25 25.4 11.6 25.75 11.7 26.8 12.3 26.8 12.25 27.25 12.55 27.3 12.5 27.25 12.35 26.95 12.05 26.8 11.75 26.75 11.6 26.75 11.55 26.45 11.55 26.45 11.5 25.75 11.35 25.75 11.3 25.3 11 25.1 11.05 25 11.05 24.95 11 24.9 11 24.85 11.15 Z\"/>\n\n  <path fill=\"#FFFFFF\" stroke=\"none\" d=\" M 14.05 14.95 L 14.05 15.05 14.25 15.1 14.3 15.1 14.05 14.95 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 14.35 11.85 L 14.35 12.05 14.45 12.45 14.45 12.5 14.65 13.55 14.65 13.75 14.55 13.95 14.35 14.05 Q 14.05 14.2 14.05 14.65 L 14.05 14.8 14.25 14.75 16.35 15.4 16.65 15.55 16.65 15.5 17.25 15.95 17.2 16.1 17.15 16.15 17 16.15 16.7 16 16.65 16 16.6 15.95 16.3 15.7 16 15.6 16 15.55 15.8 15.55 15.6 15.45 15.6 15.5 15.55 15.5 15.35 15.4 15.15 15.7 14.95 16.1 14.9 16.25 14.85 16.3 14.8 16.3 14.6 16.45 14.4 16.55 14.3 16.55 14.8 16.95 14.85 17 14.85 17.05 14.9 17.05 15 17.25 16.1 18.55 16.55 19.35 16.95 18.85 16.85 18.55 16.8 18.55 16.8 18.45 16.35 17.65 16.45 17.5 16.8 17.8 17.1 18.15 17.15 18.2 17.2 18.3 17.2 18.1 Q 17.2 17.95 17.55 17.9 L 17.65 17.95 17.65 17.9 17.7 17.9 17.7 17.95 18 17.95 18.4 17.65 18.4 17.7 18.45 17.6 18.5 17.55 18.85 17.35 18.6 16.45 18.4 16.15 18.25 15.8 18.15 14.9 17.75 13.85 17.7 13.9 17.6 13.35 17.6 12.95 15.9 12.2 15.85 12.25 15.85 12.2 15.8 12.2 14.7 11.85 14.35 11.85 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 24.05 10.7 L 24.05 10.65 24 10.65 23.95 10.7 23.95 10.85 24.2 10.75 24.35 10.6 24.35 10.45 24.05 10.7 M 24.95 9.7 L 24.95 9.65 24.3 9.75 24.35 10.1 24.4 10.15 24.4 10.4 24.55 10.3 24.8 10.45 25.05 10.55 25.1 10.55 25.2 10.5 25.35 10.5 25.1 10 25.3 9.85 25.45 9.95 25.55 10.05 25.6 10.15 25.6 10.1 25.7 10.2 25.75 10.3 26 10.65 25.9 10.8 25.75 10.85 26.25 11.05 26.35 11 26.5 10.9 26.6 10.9 26.45 10.65 26.3 10.3 Q 26.3 10.15 26.45 10.15 L 26.85 10.6 27.1 11.15 27.15 11.45 27.3 11.75 27.4 11.75 27.55 11.6 27.55 11.65 27.65 11.65 27.65 11.6 27.75 11.8 27.7 12 27.6 12.1 27.65 12.25 27.8 12.3 27.85 12.25 27.85 12.3 27.95 12.3 27.95 12.2 27.9 12.05 27.95 11.75 27.9 11.55 27.85 11.6 27.75 11.5 27.8 11.45 27.75 11.4 27.75 11.1 27.65 10.7 27.5 10.4 27.4 10.45 27.2 10.45 26.55 9.8 Q 26.15 9.45 25.8 9.45 25.75 9.45 25.65 9.55 L 25.5 9.6 25.15 9.5 25.05 9.6 25.05 9.55 24.95 9.7 Z\"/>\n</g>\n";

Asserts.sp_svg_player_fly_left = "<g id=\"sp_svg_player_fly_left\" sp-width=\"35\" sp-height=\"19\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 24.45 24.6 Q 24 24.35 24.6 24.35 L 34.75 22.85 35.85 22.15 36.1 21.8 35.8 21.55 34.5 21.7 32.7 22.4 21.2 23.3 13.7 21.9 11.65 22.1 11.35 22.25 11.1 22.45 Q 10.2 23.95 12.6 24.1 11.6 24.75 7.6 25.05 L 3.25 25.25 2.95 25.35 Q 2.9 25.45 3 25.55 L 3.95 25.75 12.35 25.4 13.6 24.95 14.4 24.5 16.25 24.3 19.3 25.15 20.75 25.35 Q 21.3 25.45 21.75 25.8 L 22.3 25.95 22.9 26 27.2 25.8 Q 29.15 25.45 30.8 24.7 L 32.25 23.7 31.7 23.5 30.1 23.75 Q 28.45 24.15 28.5 24.3 L 25.6 25.15 24.85 24.9 24.8 24.8 24.45 24.6 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 32.65 10.25 L 32.35 10.25 31.3 10.35 30.95 10.35 28.15 11.1 28.1 11.05 27.8 11.15 27.05 11.15 26.7 11.25 26.55 11.25 25.95 11.45 25.25 11.45 24.65 11.55 24.15 11.8 24.05 11.8 22.05 12.65 21.6 12.45 20.55 11.8 19.95 11.55 19.15 11.1 19.1 11.05 19 11 18.9 10.9 18.7 10.85 18.5 10.75 18.3 10.7 17.45 10.4 17.2 10.4 16.6 10.55 16.55 10.6 16.35 10.3 16.1 10.15 16.1 9.85 16.15 9.75 16.2 9.55 16.1 9.25 15.8 9.15 15.75 9.2 15.45 9.2 15 9 14.7 9 14.55 9.05 14.5 9.1 14.4 9.1 14.25 9 14.2 9.05 14.15 9 13.9 9.1 13.65 9.15 12.55 10 12.5 9.95 12.4 9.95 12.15 10.05 12 10.3 11.7 11.35 11.65 11.45 11.55 11.75 11.55 12.05 11.5 12.1 11.4 12.25 11.45 12.4 11.55 12.5 11.95 12.7 12 12.65 12.05 12.7 12.1 12.7 12.1 12.65 12.35 12.75 12.3 12.8 11.35 13.15 9.1 14.3 8.75 14.4 8.65 14.5 Q 8.55 14.6 8.6 14.65 L 8.4 14.6 8.3 14.6 8.15 14.55 7.3 14.55 7.25 14.6 6.6 14.6 6.25 14.7 5.8 15.2 5.55 15.55 5.25 15.85 5.25 16.2 5.35 16.35 5.4 16.5 5.25 16.5 4.85 16.85 4.85 17.1 5.05 17.4 5.1 17.4 5.15 17.45 5.15 17.5 5.2 17.5 4.7 17.8 4.15 17.95 4.05 18 3.95 18.15 3.95 18.95 4.35 19.3 4.4 19.25 4.85 19.35 5.35 19.35 5.55 19.4 5.75 19.4 5.95 19.35 6.1 19.35 6.55 19.15 7.15 18.7 7.55 18.7 7.65 18.75 7.7 18.7 7.8 18.7 7.85 18.75 7.95 18.7 8 18.75 8.05 18.7 8.1 18.75 8.15 18.7 8.25 18.75 8.3 18.7 9.2 18.7 9.7 18.65 11.85 18 12.6 17.65 13 17.4 13.85 17.05 Q 13.9 16.95 14 16.95 14.3 16.7 14.95 16.6 L 15.15 16.5 15.35 16.45 15.4 16.5 15.5 16.45 15.55 16.5 15.6 16.45 16.25 16.6 16.5 16.7 16.75 16.7 17.1 16.75 19.85 17.4 20.2 17.65 20.5 17.75 20.8 17.7 21.2 17.9 21.55 18.2 21.8 18.25 22.2 18.4 22.2 18.5 22.25 18.6 22.4 19.05 22.65 19.4 22.8 19.5 22.85 19.55 23.1 19.75 Q 23.35 20 23.55 20 L 23.7 19.9 23.8 20 26.1 20.85 26.8 20.85 29.75 18.1 30.85 16.5 Q 31.1 16.4 31.3 16.25 L 31.55 16 Q 31.9 15.8 32 15.75 L 32.2 15.6 32.4 15.5 33.05 14.95 33.45 14.5 33.65 14.05 33.65 13.8 Q 33.45 13.45 33.25 13.45 L 33 13.5 32.55 13.65 32.05 13.75 32 13.75 31.35 13.9 31.3 13.85 31 13.9 29.9 14.6 29.7 14.8 29.7 14.9 29.55 15.05 29.45 15.2 29.4 15.3 29.4 15.4 28.95 16.05 28.15 16.45 27.8 16.75 27 17.3 26.6 17.65 26.6 17.7 26.55 17.65 26.5 17.7 25.75 17 26.55 16.65 26.55 16.4 26.5 16.35 26.45 16.35 Q 26.45 16.2 25.55 16.1 L 25.35 15.85 25.2 15.55 25.35 15.5 25.4 15.55 25.45 15.5 25.5 15.55 25.9 15.6 26.15 15.6 26.3 15.55 26.45 15.4 26.45 15.2 26.35 14.95 26.35 14.75 26.45 14.5 27.1 14.2 Q 27.45 14.05 27.55 14.05 L 28 13.75 28.05 13.75 28.25 13.65 28.55 13.6 29.1 13.6 29.45 13.55 29.5 13.55 29.7 13.6 29.8 13.55 29.9 13.55 30.1 13.45 30.45 13.35 31.55 12.8 Q 31.55 12.7 31.85 12.55 L 32.5 12.15 33.25 11.85 33.6 11.75 33.7 11.8 33.95 12 34.5 12.1 34.8 12.05 34.95 12.05 34.95 12 35.25 12 35.3 11.95 35.3 11.9 35.4 11.8 35.55 11.6 36.75 9.5 36.95 9 36.95 8.25 36.7 7.85 36.1 7.85 35.65 8.15 35.6 8.25 35.45 8.4 35.4 8.35 33.6 10.15 33.15 10.2 32.95 10.2 32.65 10.25 M 32.75 10.75 L 32.75 10.7 33.15 10.7 33.35 10.65 33.4 10.7 33.4 10.65 33.6 10.65 33.85 10.5 33.85 10.85 33.75 11.2 33.65 11.3 33.6 11.25 33.6 11.3 33.55 11.3 33.5 11.25 32.85 11.45 30.75 12.55 30.75 12.6 30.1 12.9 30.2 12.6 30.2 12.2 30.15 11.95 30.15 12 30 11.65 29.7 11.2 29.75 11.15 29.8 11.15 30.5 10.95 31.2 10.9 31.15 10.85 31.6 10.85 32.45 10.7 32.5 10.75 32.55 10.7 32.65 10.75 32.7 10.7 32.75 10.75 M 24.1 12.2 L 24.15 12.2 25.25 11.85 25.6 11.85 25.6 12.05 25.5 12.45 25.5 12.5 25.3 13.55 25.3 13.75 25.4 13.95 25.6 14.05 Q 25.9 14.2 25.9 14.65 L 25.9 14.8 25.7 14.75 24.2 15.15 Q 23.95 15.2 23.6 15.4 L 23.3 15.55 23.3 15.5 22.7 15.95 22.75 16.1 22.8 16.15 22.95 16.15 23.25 16 23.3 16 23.35 15.95 23.65 15.7 23.95 15.6 23.95 15.55 24.15 15.55 24.35 15.45 24.35 15.5 24.4 15.5 24.6 15.4 24.8 15.7 25 16.1 25.05 16.25 25.1 16.3 25.15 16.3 25.35 16.45 25.55 16.55 25.65 16.55 25.5 16.65 25.4 16.75 25.15 16.95 25.1 17 25.1 17.05 25.05 17.05 24.95 17.25 24.25 18.05 Q 23.655078125 18.5458984375 23.85 18.55 L 23.8 18.55 23.4 19.35 23 18.85 23.1 18.55 23.15 18.55 23.15 18.45 23.6 17.65 23.5 17.5 23.15 17.8 22.85 18.15 22.8 18.2 22.75 18.3 22.75 18.1 Q 22.75 17.95 22.35 17.9 L 22.3 17.95 22.3 17.9 22.25 17.9 22.25 17.95 21.95 17.95 21.55 17.65 21.55 17.7 21.5 17.6 21.45 17.55 21.1 17.35 21.35 16.45 21.55 16.15 21.7 15.8 21.8 14.9 22.2 13.85 22.25 13.9 22.35 13.35 22.35 12.95 24.05 12.2 24.1 12.25 24.1 12.2 M 26.05 12.05 Q 26.05 12 26.3 11.9 L 26.55 11.8 26.6 11.8 26.6 11.75 27.4 11.6 27.45 11.6 27.45 11.65 27.55 11.6 27.6 11.65 27.6 11.6 27.9 11.6 27.9 11.55 28 11.6 28.05 11.55 28.15 11.6 28.4 11.6 28.8 11.45 28.9 11.45 28.9 11.4 29.2 11.35 29.4 11.5 29.5 11.7 29.55 11.7 29.75 12.2 29.75 12.3 29.25 12.5 29.25 12.65 29.3 12.8 29.55 12.8 29.7 12.75 29.7 12.9 29.4 13.1 28.85 13.1 28.45 13.15 28.35 13.15 28.3 13.1 28 13.25 28 13.2 27.95 13.3 26.95 13.85 26.6 13.95 26.35 14.1 26.25 14.1 26.25 14.05 26.15 13.9 26.3 13.85 26.85 13.6 27.1 13.3 Q 27.1 13.2 26.95 13.2 L 26.75 13.25 26.7 13.2 26.5 13.35 25.95 13.55 25.9 13.55 25.85 13.7 25.8 13.65 25.8 13.5 25.85 12.9 26.05 12.05 M 25.9 14.95 L 25.9 15.05 25.75 15.1 25.65 15.1 25.9 14.95 M 26.2 18.05 L 26.2 18 26.25 18.1 26.3 18.15 26.45 18.35 26.65 18.45 26.85 18.35 26.85 18.15 26.9 18 27.1 17.9 27.2 17.9 27 18.2 27.2 18.4 27.4 18.3 27.6 18.25 27.7 18.35 27.8 18.4 27.75 18.4 27.75 18.45 27.8 18.45 28 19 27.9 19.3 27.75 19.5 26.75 20.25 26.7 20.2 26.7 20.3 26.65 20.25 26.65 20.35 26.6 20.3 26.6 20.35 26.5 20.45 26.25 20.45 24.6 19.85 24.15 19.6 24.15 19.65 23.9 19.5 23.9 19.45 24.35 18.6 24.35 18.65 24.7 18.15 25 17.85 25.95 18.4 26.1 18.4 26.15 18.2 25.8 17.8 25.4 17.55 25.25 17.5 25.45 17.3 26.2 18.05 M 27.55 17.6 L 27.45 17.6 28.1 17.1 28.4 16.95 29.2 16.45 Q 30.05 15.9 30.25 15.9 L 30.25 15.85 30.35 15.85 30.5 16.05 30.35 16.25 30.15 16.6 30.15 16.65 29.75 17.25 29.7 17.3 28.45 18.75 28.45 18.7 28.2 18.15 28.15 18.15 28.1 18.05 28.1 18.1 28.05 18 28.05 18.05 28 17.95 27.9 17.85 27.55 17.6 M 12.45 10.4 L 12.55 10.45 12.75 10.45 13.4 9.8 Q 13.8 9.45 14.15 9.45 L 14.3 9.55 14.45 9.6 14.8 9.5 14.9 9.6 14.9 9.55 15 9.7 15 9.65 15.65 9.75 15.6 10.1 15.55 10.15 15.55 10.4 15.4 10.3 Q 15.35 10.3 15.15 10.45 L 14.9 10.55 14.75 10.5 14.6 10.5 14.85 10 Q 14.85 9.85 14.65 9.85 L 14.5 9.95 14.4 10.05 14.35 10.15 14.35 10.1 14.25 10.2 14.2 10.3 13.95 10.65 14.05 10.8 14.2 10.85 13.7 11.05 13.6 11 13.45 10.9 13.35 10.9 13.5 10.65 13.65 10.3 13.5 10.15 13.1 10.6 12.85 11.15 12.8 11.45 12.6 11.75 12.55 11.75 12.4 11.6 12.4 11.65 12.3 11.65 12.3 11.6 12.2 11.8 12.25 12 12.35 12.1 12.15 12.3 12.1 12.25 12.1 12.3 12 12.3 12 12.2 12.05 12.05 12 11.75 12.05 11.55 12.1 11.6 12.2 11.5 12.15 11.45 12.2 11.4 12.2 11.1 12.3 10.7 12.45 10.4 M 13.5 11.55 L 13.5 11.5 14.2 11.35 14.2 11.3 14.65 11 14.85 11.05 14.95 11.05 15 11 15.05 11 15.05 11.15 15.15 11.25 14.55 11.6 14.2 11.7 13.15 12.3 13.15 12.25 12.7 12.55 12.65 12.5 12.7 12.35 13 12.05 13.15 11.75 13.2 11.6 13.2 11.55 13.5 11.55 M 15.6 10.6 L 15.6 10.45 15.9 10.7 15.9 10.65 15.95 10.65 16 10.7 16 10.85 15.75 10.75 15.6 10.6 M 8.05 15 L 8.05 15.25 8.3 15.8 8.05 15.9 8 15.9 7.15 16.35 6.8 16.45 6.8 16.4 6.65 16.45 6.55 16.5 6.5 16.45 6.4 16.5 6.2 16.45 6.1 16.4 6.05 16.45 5.8 16.3 5.8 16.35 5.75 16.15 5.7 16.2 5.7 16.05 5.75 16.1 5.75 16 5.8 16 6.25 15.65 6.55 15.1 7.3 15 8.05 15 M 8.5 15.35 L 8.5 15.15 8.55 15.1 8.8 15.6 8.5 15.35 M 6.7 17 L 6.75 17 6.8 16.95 7 16.9 7.1 16.85 7.25 16.85 7.1 17 6.95 17 6.8 17.05 6.7 17 M 7.35 16.75 L 7.5 16.7 Q 7.5 16.6 7.7 16.6 L 7.75 16.6 7.75 16.55 8.4 16.3 8.4 16.25 8.6 16.2 8.7 16.15 8.85 16.1 8.95 16.15 9.15 16.15 9.5 16.1 9.75 16.15 10.2 16.05 10.25 16.1 10.4 16 10.55 16 10.7 15.95 10.75 15.9 10.85 15.9 9.85 16.35 9.4 16.35 9.3 16.4 9.2 16.4 9 16.5 8.75 16.55 8.3 16.7 8.1 16.65 7.85 16.7 7.65 16.7 7.4 16.8 7.35 16.75 M 5.7 17.1 L 6 17.3 6.3 17.4 6.6 17.55 6.8 18.4 6.6 18.5 6.5 18.6 6.4 18.65 6.4 18.6 6.15 18.75 5.75 18.85 4.8 18.85 4.6 18.8 4.4 18.6 4.4 18.45 4.45 18.45 4.45 18.4 5.45 18 5.45 18.05 5.65 17.85 5.7 17.65 5.65 17.35 5.4 17.1 5.4 17.05 5.6 17.15 5.65 17.1 5.7 17.1 M 20.5 12.3 L 20.5 12.35 20.55 12.3 21.35 12.8 21.5 12.85 21.65 12.95 21.6 13 21.85 13.05 21.85 13.4 21.5 14.3 21.5 14.25 21.25 15.1 21.25 15.7 21.1 15.85 21 15.85 21.1 15.75 21.05 15.6 21 15.5 20.95 15.55 20.8 15.45 20.8 15.5 20.75 15.5 20.7 15.45 20.2 15.45 20.15 15.4 20.15 15.45 19.35 15.3 18.8 15.3 18.7 15.5 18.7 15.6 18.75 15.65 20.4 15.9 20.55 15.9 20.9 15.95 20.3 16.1 Q 19.9 16.2 19.85 16.4 L 20 16.6 20.2 16.6 20.9 16.45 20.75 16.95 20.55 17.3 19.9 16.9 19.7 16.85 18.2 16.6 18.15 16.6 17.1 16.2 16.3 16.05 16.3 16.1 16.2 16.1 15.85 16 15.45 16 14.45 16.2 13.9 16.45 13.85 16.4 13.7 16.5 12.65 17.05 12.6 17 12.6 17.05 12.35 17.15 12.35 17.1 12.2 17.2 12.1 17.3 11.35 17.7 11.35 17.65 10.5 17.95 9.8 18.1 9.8 18.05 9.15 18.2 8.65 18.2 8.65 18.25 7.6 18.25 7.6 18.2 7.55 18.2 7.55 18.15 7.45 18 7.5 17.95 7.3 17.85 Q 7.15 17.85 7.1 17.95 L 7.1 17.6 7.2 17.65 7.2 17.7 7.45 17.7 Q 7.5 17.35 7.7 17.25 L 8.2 17.2 8.35 17.2 8.95 17 9 17.05 9.3 16.9 9.55 16.85 9.8 16.85 10 17.05 10.2 17.05 10.3 16.95 10.5 16.85 10.65 17.05 10.85 17.05 10.95 16.8 10.95 16.45 11.5 16.05 11.55 16.1 12.1 15.6 12.1 15.55 12.8 15.25 13.15 15.3 13.5 15.3 13.55 15.35 14.45 15.35 14.55 15.3 14.6 15.2 14.6 15.05 14.55 15.05 14.55 15 14.35 14.9 14.4 14.85 14.4 14.7 14.3 14.65 14.2 14.65 14.25 14.6 14.25 14.55 15.1 14.15 15.4 14.2 15.75 14.15 16.1 14 16.55 13.6 Q 16.7 13.45 17.05 13.45 L 17.9 13.55 18.65 13.55 18.9 13.45 19 13.3 19 13.2 18.85 13.1 18.95 13.1 18.95 13.05 19 13.05 19.05 12.95 Q 19.05 12.75 18.6 12.75 L 18.55 12.8 18.5 12.75 18.15 12.75 17.75 12.8 16.9 13 16.85 12.95 16.75 13 Q 16.35 13 14.75 13.75 L 14.7 13.75 14.7 13.8 14.65 13.85 14.45 13.95 14.45 13.9 14.35 14 14.25 14.05 14.2 14.05 12.85 14.6 12.85 14.65 12.2 14.75 12.25 14.8 11.35 15.1 11.1 15.25 10.35 15.55 10.3 15.5 10.2 15.6 10.05 15.6 9.9 15.65 9.5 15.65 9.05 15.2 9.05 15.1 9 15 9.15 14.75 9.75 14.55 10.15 14.25 10.15 14.3 Q 10.1509765625 14.249609375 10.4 14.15 L 10.8 14 10.75 13.95 11.85 13.5 11.8 13.5 12 13.4 12.2 13.35 12.25 13.35 Q 12.45 13.15 12.75 13.05 L 12.75 13 12.9 12.9 13 12.85 13.05 12.9 13.05 12.85 14.15 12.25 14.2 12.3 14.2 12.25 16.4 11.2 16.45 11.15 16.8 10.95 17.2 10.85 17.3 10.9 17.55 10.9 18.2 11.1 18.2 11.15 19.15 11.65 19.15 11.6 19.25 11.7 20.5 12.3 M 28.15 12.1 L 28.15 12.25 Q 28.15 12.4 28.4 12.4 L 28.65 12.3 28.8 12.05 28.75 11.9 28.65 11.75 28.5 11.75 28.15 12.1 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 20.5 12.35 L 20.5 12.3 19.25 11.7 19.15 11.6 19.15 11.65 18.2 11.15 18.2 11.1 17.55 10.9 17.3 10.9 17.2 10.85 16.8 10.95 16.45 11.15 16.4 11.2 14.2 12.25 14.2 12.3 14.15 12.25 13.05 12.85 13.05 12.9 13 12.85 12.9 12.9 12.75 13 12.75 13.05 Q 12.45 13.15 12.25 13.35 L 12.2 13.35 12 13.4 11.8 13.5 11.85 13.5 10.75 13.95 10.8 14 10.4 14.15 Q 10.1509765625 14.249609375 10.15 14.3 L 10.15 14.25 9.75 14.55 9.15 14.75 9 15 9.05 15.1 9.05 15.2 9.5 15.65 9.9 15.65 10.05 15.6 10.2 15.6 10.3 15.5 10.35 15.55 11.1 15.25 11.35 15.1 12.25 14.8 12.2 14.75 12.85 14.65 12.85 14.6 14.2 14.05 14.25 14.05 14.35 14 14.45 13.9 14.45 13.95 14.65 13.85 14.7 13.8 14.7 13.75 14.75 13.75 Q 16.35 13 16.75 13 L 16.85 12.95 16.9 13 17.75 12.8 18.15 12.75 18.5 12.75 18.55 12.8 18.6 12.75 Q 19.05 12.75 19.05 12.95 L 19 13.05 18.95 13.05 18.95 13.1 18.85 13.1 19 13.2 19 13.3 18.9 13.45 18.65 13.55 17.9 13.55 17.05 13.45 Q 16.7 13.45 16.55 13.6 L 16.1 14 15.75 14.15 15.4 14.2 15.1 14.15 14.25 14.55 14.25 14.6 14.2 14.65 14.3 14.65 14.4 14.7 14.4 14.85 14.35 14.9 14.55 15 14.55 15.05 14.6 15.05 14.6 15.2 14.55 15.3 14.45 15.35 13.55 15.35 13.5 15.3 13.15 15.3 12.8 15.25 12.1 15.55 12.1 15.6 11.55 16.1 11.5 16.05 10.95 16.45 10.95 16.8 10.85 17.05 10.65 17.05 10.5 16.85 10.3 16.95 10.2 17.05 10 17.05 9.8 16.85 9.55 16.85 9.3 16.9 9 17.05 8.95 17 8.35 17.2 8.2 17.2 7.7 17.25 Q 7.5 17.35 7.45 17.7 L 7.2 17.7 7.2 17.65 7.1 17.6 7.1 17.95 Q 7.15 17.85 7.3 17.85 L 7.5 17.95 7.45 18 7.55 18.15 7.55 18.2 7.6 18.2 7.6 18.25 8.65 18.25 8.65 18.2 9.15 18.2 9.8 18.05 9.8 18.1 10.5 17.95 11.35 17.65 11.35 17.7 12.1 17.3 12.2 17.2 12.35 17.1 12.35 17.15 12.6 17.05 12.6 17 12.65 17.05 13.7 16.5 13.85 16.4 13.9 16.45 14.45 16.2 15.45 16 15.85 16 16.2 16.1 16.3 16.1 16.3 16.05 17.1 16.2 18.15 16.6 18.2 16.6 19.7 16.85 19.9 16.9 20.55 17.3 20.75 16.95 20.9 16.45 20.2 16.6 20 16.6 19.85 16.4 Q 19.9 16.2 20.3 16.1 L 20.9 15.95 20.55 15.9 20.4 15.9 18.75 15.65 18.7 15.6 18.7 15.5 18.8 15.3 19.35 15.3 20.15 15.45 20.15 15.4 20.2 15.45 20.7 15.45 20.75 15.5 20.8 15.5 20.8 15.45 20.95 15.55 21 15.5 21.05 15.6 21.1 15.75 21 15.85 21.1 15.85 21.25 15.7 21.25 15.1 21.5 14.25 21.5 14.3 21.85 13.4 21.85 13.05 21.6 13 21.65 12.95 21.5 12.85 21.35 12.8 20.55 12.3 20.5 12.35 M 8.5 15.15 L 8.5 15.35 8.8 15.6 8.55 15.1 8.5 15.15 M 27.45 17.6 L 27.55 17.6 27.9 17.85 28 17.95 28.05 18.05 28.05 18 28.1 18.1 28.1 18.05 28.15 18.15 28.2 18.15 28.45 18.7 28.45 18.75 29.7 17.3 29.75 17.25 30.15 16.65 30.15 16.6 30.35 16.25 30.5 16.05 30.35 15.85 30.25 15.85 30.25 15.9 Q 30.05 15.9 29.2 16.45 L 28.4 16.95 28.1 17.1 27.45 17.6 M 32.75 10.7 L 32.75 10.75 32.7 10.7 32.65 10.75 32.55 10.7 32.5 10.75 32.45 10.7 31.6 10.85 31.15 10.85 31.2 10.9 30.5 10.95 29.8 11.15 29.75 11.15 29.7 11.2 30 11.65 30.15 12 30.15 11.95 30.2 12.2 30.2 12.6 30.1 12.9 30.75 12.6 30.75 12.55 32.85 11.45 33.5 11.25 33.55 11.3 33.6 11.3 33.6 11.25 33.65 11.3 33.75 11.2 33.85 10.85 33.85 10.5 33.6 10.65 33.4 10.65 33.4 10.7 33.35 10.65 33.15 10.7 32.75 10.7 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 6 17.3 L 5.7 17.1 5.65 17.1 5.6 17.15 5.4 17.05 5.4 17.1 5.65 17.35 5.7 17.65 5.65 17.85 5.45 18.05 5.45 18 4.45 18.4 4.45 18.45 4.4 18.45 4.4 18.6 4.6 18.8 4.8 18.85 5.75 18.85 6.15 18.75 6.4 18.6 6.4 18.65 6.5 18.6 6.6 18.5 6.8 18.4 6.6 17.55 6.3 17.4 6 17.3 M 8.05 15.25 L 8.05 15 7.3 15 6.55 15.1 6.25 15.65 5.8 16 5.75 16 5.75 16.1 5.7 16.05 5.7 16.2 5.75 16.15 5.8 16.35 5.8 16.3 6.05 16.45 6.1 16.4 6.2 16.45 6.4 16.5 6.5 16.45 6.55 16.5 6.65 16.45 6.8 16.4 6.8 16.45 7.15 16.35 8 15.9 8.05 15.9 8.3 15.8 8.05 15.25 M 13.5 11.5 L 13.5 11.55 13.2 11.55 13.2 11.6 13.15 11.75 13 12.05 12.7 12.35 12.65 12.5 12.7 12.55 13.15 12.25 13.15 12.3 14.2 11.7 14.55 11.6 15.15 11.25 15.05 11.15 15.05 11 15 11 14.95 11.05 14.85 11.05 14.65 11 14.2 11.3 14.2 11.35 13.5 11.5 M 26.2 18 L 26.2 18.05 25.45 17.3 25.25 17.5 25.4 17.55 25.8 17.8 26.15 18.2 26.1 18.4 25.95 18.4 25 17.85 24.7 18.15 24.35 18.65 24.35 18.6 23.9 19.45 23.9 19.5 24.15 19.65 24.15 19.6 24.6 19.85 26.25 20.45 26.5 20.45 26.6 20.35 26.6 20.3 26.65 20.35 26.65 20.25 26.7 20.3 26.7 20.2 26.75 20.25 27.75 19.5 27.9 19.3 28 19 27.8 18.45 27.75 18.45 27.75 18.4 27.8 18.4 27.7 18.35 27.6 18.25 27.4 18.3 27.2 18.4 27 18.2 27.2 17.9 27.1 17.9 26.9 18 26.85 18.15 26.85 18.35 26.65 18.45 26.45 18.35 26.3 18.15 26.25 18.1 26.2 18 M 26.3 11.9 Q 26.05 12 26.05 12.05 L 25.85 12.9 25.8 13.5 25.8 13.65 25.85 13.7 25.9 13.55 25.95 13.55 26.5 13.35 26.7 13.2 26.75 13.25 26.95 13.2 Q 27.1 13.2 27.1 13.3 L 26.85 13.6 26.3 13.85 26.15 13.9 26.25 14.05 26.25 14.1 26.35 14.1 26.6 13.95 26.95 13.85 27.95 13.3 28 13.2 28 13.25 28.3 13.1 28.35 13.15 28.45 13.15 28.85 13.1 29.4 13.1 29.7 12.9 29.7 12.75 29.55 12.8 29.3 12.8 29.25 12.65 29.25 12.5 29.75 12.3 29.75 12.2 29.55 11.7 29.5 11.7 29.4 11.5 29.2 11.35 28.9 11.4 28.9 11.45 28.8 11.45 28.4 11.6 28.15 11.6 28.05 11.55 28 11.6 27.9 11.55 27.9 11.6 27.6 11.6 27.6 11.65 27.55 11.6 27.45 11.65 27.45 11.6 27.4 11.6 26.6 11.75 26.6 11.8 26.55 11.8 26.3 11.9 M 28.15 12.25 L 28.15 12.1 28.5 11.75 28.65 11.75 28.75 11.9 28.8 12.05 28.65 12.3 28.4 12.4 Q 28.15 12.4 28.15 12.25 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 15.6 10.45 L 15.6 10.6 15.75 10.75 16 10.85 16 10.7 15.95 10.65 15.9 10.65 15.9 10.7 15.6 10.45 M 12.55 10.45 L 12.45 10.4 12.3 10.7 12.2 11.1 12.2 11.4 12.15 11.45 12.2 11.5 12.1 11.6 12.05 11.55 12 11.75 12.05 12.05 12 12.2 12 12.3 12.1 12.3 12.1 12.25 12.15 12.3 12.35 12.1 12.25 12 12.2 11.8 12.3 11.6 12.3 11.65 12.4 11.65 12.4 11.6 12.55 11.75 12.6 11.75 12.8 11.45 12.85 11.15 13.1 10.6 13.5 10.15 13.65 10.3 13.5 10.65 13.35 10.9 13.45 10.9 13.6 11 13.7 11.05 14.2 10.85 14.05 10.8 13.95 10.65 14.2 10.3 14.25 10.2 14.35 10.1 14.35 10.15 14.4 10.05 14.5 9.95 14.65 9.85 Q 14.85 9.85 14.85 10 L 14.6 10.5 14.75 10.5 14.9 10.55 15.15 10.45 Q 15.35 10.3 15.4 10.3 L 15.55 10.4 15.55 10.15 15.6 10.1 15.65 9.75 15 9.65 15 9.7 14.9 9.55 14.9 9.6 14.8 9.5 14.45 9.6 14.3 9.55 14.15 9.45 Q 13.8 9.45 13.4 9.8 L 12.75 10.45 12.55 10.45 Z\"/>\n\n  <path fill=\"#FFFFFF\" stroke=\"none\" d=\" M 25.9 15.05 L 25.9 14.95 25.65 15.1 25.75 15.1 25.9 15.05 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 24.15 12.2 L 24.1 12.2 24.1 12.25 24.05 12.2 22.35 12.95 22.35 13.35 22.25 13.9 22.2 13.85 21.8 14.9 21.7 15.8 21.55 16.15 21.35 16.45 21.1 17.35 21.45 17.55 21.5 17.6 21.55 17.7 21.55 17.65 21.95 17.95 22.25 17.95 22.25 17.9 22.3 17.9 22.3 17.95 22.35 17.9 Q 22.75 17.95 22.75 18.1 L 22.75 18.3 22.8 18.2 22.85 18.15 23.15 17.8 23.5 17.5 23.6 17.65 23.15 18.45 23.15 18.55 23.1 18.55 23 18.85 23.4 19.35 23.8 18.55 23.85 18.55 Q 23.655078125 18.5458984375 24.25 18.05 L 24.95 17.25 25.05 17.05 25.1 17.05 25.1 17 25.15 16.95 25.4 16.75 25.5 16.65 25.65 16.55 25.55 16.55 25.35 16.45 25.15 16.3 25.1 16.3 25.05 16.25 25 16.1 24.8 15.7 24.6 15.4 24.4 15.5 24.35 15.5 24.35 15.45 24.15 15.55 23.95 15.55 23.95 15.6 23.65 15.7 23.35 15.95 23.3 16 23.25 16 22.95 16.15 22.8 16.15 22.75 16.1 22.7 15.95 23.3 15.5 23.3 15.55 23.6 15.4 Q 23.95 15.2 24.2 15.15 L 25.7 14.75 25.9 14.8 25.9 14.65 Q 25.9 14.2 25.6 14.05 L 25.4 13.95 25.3 13.75 25.3 13.55 25.5 12.5 25.5 12.45 25.6 12.05 25.6 11.85 25.25 11.85 24.15 12.2 Z\"/>\n</g>\n";

Asserts.sp_svg_player_catch_right = "<g id=\"sp_svg_player_catch_right\" sp-width=\"36\" sp-height=\"35\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 18.3 32.5 L 18 32.95 17.9 33.4 Q 21.301171875 34.7130859375 19.05 31.75 L 18.3 32.5 M 6.3 16.8 L 5.95 16.45 Q 5.45 16.05 4.75 16.1 L 4 16.7 4.3 17.05 Q 4.45 17.45 4.15 17.45 L 3.5 17.6 2.1 18.75 2.05 18.85 1.75 19.2 3.95 22.4 4.4 23.55 4.45 25.35 4.9 25.8 Q 5 27.25 6.4 28.4 7.65 29.5 10.75 31.05 L 11.25 32.2 Q 13.7 33.4 13.95 32.95 L 13.9 32.3 13.6 31.35 Q 11 30.25 9.6 28.95 8.4 27.85 8.7 27.2 L 10 27.15 14.1 30.85 Q 14.9599609375 31.6845703125 15.6 32.2 15.77421875 31.9203125 16.2 31.75 L 16.65 31.55 16.95 31.35 17.6 30.25 17.1 29.7 Q 17.0470703125 29.7861328125 17 29.85 L 15.7 31.1 15.3 31.35 14.95 31.45 Q 14.75 31.45 14.55 31.25 L 14.35 30.85 14.35 30.7 14.3 30.6 14.35 30.6 14.35 30.35 14.4 29.95 14.4 29.75 15.45 28 13.55 26.05 Q 12.95 25.95 12.9 25.35 L 12.8 24.15 12.9 23.45 Q 13.1 23.15 13.7 23 L 13.9 22.85 14.15 22.85 15.15 22.5 15.35 22.2 12.85 19.5 12.5 18.25 Q 12.3 17.9 9.9 17.35 L 10.2 18.2 Q 7.9 17.25 9.5 18.25 L 11.7 19.55 12.65 21.05 11.15 21.5 10.85 21.25 10.8 20.8 10.45 20.35 10.2 20.15 10.25 19.5 Q 10.3 19.35 9.7 19.2 L 8.35 18.95 Q 6.35 18.6 6.45 18.1 L 7.5 17.35 7 17.1 6.5 17.05 6.3 16.8 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 36.1 5.1 Q 35.9 4.7 35.55 4.7 L 35.35 4.7 Q 35 4.7 34.65 5.45 L 34.4 5.95 34.3 6.3 34.25 6.15 34.2 6.15 34 5.85 33.65 5.65 Q 33.55 5.65 33.35 5.85 L 33.25 6.1 33.15 6.25 33.15 6.75 33.2 6.75 33.6 8.2 33.45 8.35 33.3 8.6 32.45 11.35 31 12.1 30.2 12.3 30.15 12.3 30.45 11.95 30.95 11.2 31.15 10.7 31.15 10.55 31.2 10.45 31.2 10.35 Q 31.2 10.15 31.3 10.1 L 31.4 9.85 31.35 9.8 31.4 9.8 31.4 9.4 32 9.2 32.4 8.65 32.4 8.35 32.35 8.1 32.3 8.1 32.2 8.05 32.05 8.05 31.95 8.1 31.85 7.95 31.8 7.8 31.6 7.65 31.65 7.65 31.5 7.4 31.4 7.1 Q 31.15 6.7 30.9 6.7 L 30.7 6.75 30.6 6.85 30.55 6.8 31.3 6 32.7 5.2 33.25 4.65 33.25 4.45 33.2 4.25 33.05 4.15 32.85 4.15 32.85 4.1 33.1 3.5 33.3 2.75 33.3 2.6 33.15 2.4 32.75 2.35 Q 32.45 2.35 31.8 2.85 L 31.2 3.45 31 3.95 30.5 4.85 30.4 4.9 30.2 4.85 30.05 4.9 29.85 5 29.7 5.05 29.45 5.1 29.4 5.1 26.5 7.2 26.55 7.25 Q 26.35 7.3 26.1 7.55 L 25.65 7.9 25.7 7.9 25.6 8.05 25.45 8.1 23.1 13.1 22.4 14.3 22.45 14.3 22.15 14.75 21.45 15.4 20.8 16.2 20.45 16.75 17.3 19.4 16.7 19.55 16.55 19.9 16.6 20.25 15.35 22.2 15.15 22.5 14.8 23.1 14.8 23.4 15.05 23.85 14.95 24.2 15 24.25 14.95 24.3 15 24.35 14.95 24.45 15 24.5 14.95 24.55 15.1 25.1 15.15 25.4 15.65 27.2 15.7 27.6 15.45 28 14.4 29.75 14.4 29.95 14.35 30.35 14.35 30.6 14.3 30.6 14.35 30.7 14.35 30.85 14.55 31.25 Q 14.75 31.45 14.95 31.45 L 15.3 31.35 15.7 31.1 17 29.85 Q 17.0470703125 29.7861328125 17.1 29.7 17.7 28.8529296875 17.7 28.2 L 17.5 27.3 17.5 27 17.6 26.5 17.55 26.5 17.55 26.45 17.6 26.45 17.6 26.25 17.7 25.65 17.7 25.2 17.75 25.15 17.7 24.35 17.5 23.65 17.75 23.5 18.05 23.4 19.05 22.75 19.25 22.9 19.45 22.9 19.55 22.85 20.55 21.9 20.6 21.9 20.6 22.05 20.55 22.35 20.6 22.4 20.55 22.45 20.55 22.85 20.45 23 20.35 23.2 20.45 23.4 20.7 23.6 20.45 24.3 20.3 25.05 20.3 25.35 20.25 25.5 20.3 25.55 20.25 25.6 20.3 25.65 20.3 25.8 20.25 25.85 20.3 25.95 20.25 26 20.3 26.05 20.3 26.2 19.95 26.8 19.8 26.9 19.85 26.9 18.75 28.2 17.85 29.7 17.9 29.75 17.6 30.25 16.95 31.35 16.65 31.55 16.2 31.75 Q 15.77421875 31.9203125 15.6 32.2 15.572265625 32.248046875 15.55 32.3 L 15.55 32.25 15.45 32.6 15.45 32.85 15.4 33 15.4 33.45 15.45 33.7 15.45 33.75 15.6 34.4 15.6 34.35 15.8 34.85 15.9 35.3 16.2 35.9 16.65 36.35 17.05 36.25 17.4 35.9 17.45 35.8 17.6 35.3 17.65 34.9 17.65 34.7 17.7 34.7 17.7 34.45 17.8 33.7 17.9 33.45 17.9 33.4 18 32.95 18.3 32.5 19.05 31.75 21.35 29.55 21.6 28.8 Q 21.95 28.05 22.25 27.85 L 22.6 27.5 23.4 26.15 23.45 26.15 23.9 25.15 24.1 25.15 24.6 24.5 25 23.05 25 22.55 25.5 20.7 25.55 20.7 25.6 19.75 25.8 19.6 25.85 19.6 26.35 18.95 Q 26.6 18.4 27.75 17.15 L 27.9 17 29.05 15.6 29.35 15.45 30 15.2 30.2 15.05 30.2 15.1 32.7 14 33.75 13.25 34.45 12.3 34.75 11.3 34.8 11 34.9 10.8 35.25 8.9 35.2 8.9 35.2 8.85 35.3 8.6 35.3 8.35 36.3 6.3 36.3 5.8 36.1 5.1 M 35.75 5.4 L 35.85 6.05 35.8 6.35 35.6 6.85 34.9 8.15 34.6 8.05 34.5 8.1 34.3 8.1 34.05 7.95 33.9 7.65 33.75 6.9 33.75 6.3 34 6.7 34.4 6.75 35.5 5.15 35.75 5.4 M 32.3 4.4 L 32.75 4.6 32.75 4.65 32.8 4.65 32.75 4.7 32.65 4.75 32.6 4.75 32.6 4.7 Q 32.4 4.7 31.9 5.05 L 31.15 5.55 31.1 5.5 31.15 5.45 30.85 5.05 31.65 3.75 Q 32.3 2.75 32.75 2.75 L 32.95 2.9 32.3 4.35 32.3 4.4 M 33.95 8.5 L 33.9 8.45 33.95 8.45 34.05 8.5 34.2 8.5 34.1 8.55 33.95 8.5 M 34.1 9 L 34.15 8.95 34.2 9 34.25 8.95 34.3 9 34.6 8.95 34.65 8.95 34.65 9.1 34.6 9.25 34.6 9.45 34.5 10.05 34.1 11.6 Q 33.95 11.7 33.95 11.95 L 33.75 12.6 33.75 12.55 Q 33.1 13.3 31.5 13.95 L 29.3 14.85 Q 28.7 15.1 28.4 15.45 L 28 16 26.35 17.85 25.65 19.1 25.25 19.3 24.2 18.85 24.9 18.5 26.15 17.55 26.15 17.45 26.05 17.3 25.85 17.3 24.7 18.1 23.45 18.7 23 18.3 22.95 18.35 Q 22.55 17.5 22.1 17.4 21.85 17 21.65 17 L 21.5 16.75 21.45 16.5 21.55 16.15 22.25 15.5 23.2 14.05 25.9 8.45 26.3 8 26.85 7.55 27.4 7.2 29.2 5.75 29.5 5.6 29.85 5.5 Q 30.05 5.5 30.3 5.7 L 30.55 6.1 30.25 6.6 29.75 6.9 28.65 7.9 28.5 8 28.1 8.1 27.8 8.35 26.7 9.8 Q 26.2 10.6 26.2 10.95 L 26.2 11.15 26.3 11.25 26.5 11.25 26.75 10.95 26.8 11 26.7 11.2 26.7 11.5 26.65 11.45 26.65 12.1 26.85 12.8 27.05 13.2 27.3 13.5 27.6 13.75 27.75 13.8 28.3 13.6 28.8 13.3 29.4 12.75 29.95 12.85 30.2 12.85 32.1 12.1 32.25 12.2 32.4 12.45 32.7 12.45 32.85 12.25 32.8 12.1 33.05 12.4 33.35 12.6 33.6 12.4 33.4 12.1 32.9 11.6 33.1 11 33.15 10.9 33.75 8.95 33.85 8.95 34.1 9 M 30.9 7.35 L 30.95 7.3 31.05 7.5 31.1 7.75 31.4 8 31.5 8.3 31.8 8.5 31.95 8.5 31.5 9 31.35 9 31.3 8.75 31.1 8.5 30.35 8.05 30.1 8 30.05 8.05 30.05 8 29.6 8 29.6 8.05 29.4 8.05 29.35 7.95 29.25 7.95 29.75 7.45 30.15 7.15 30.6 7.4 30.8 7.4 30.9 7.35 M 30.85 8.85 L 30.95 9.05 31 9.2 31 9.65 30.75 9.7 30.55 9.8 30.45 9.45 30 9.3 29.8 9.3 29.65 9.35 29.45 9.5 29.45 9.65 29.55 9.8 29.8 9.8 29.9 9.75 30.15 9.95 30.5 9.85 30.35 10.25 30.15 10.55 30.15 10.75 30.35 10.85 30.6 10.85 30.5 11.1 30.15 10.9 29.75 10.8 Q 29.45 10.8 29.45 11 L 29.7 11.3 30.05 11.45 30.3 11.45 30 11.75 29.8 12.1 29.1 11.9 28.6 11.6 28.3 11.2 27.75 10.2 27.75 10.1 28 10.1 28.05 9.9 28 9.8 27.9 9.7 28.15 9.5 28.4 9.5 28.6 9.35 28.75 9.2 29.05 9.05 29.25 8.8 29.85 8.35 29.95 8.35 Q 30.7 8.35 30.85 8.85 M 28.5 8.4 L 29 8.15 29.2 8.35 28.9 8.4 28.65 8.65 28.7 8.65 28.45 8.85 28.5 8.85 28.3 8.95 28.15 9.05 28.05 9.05 28.05 9 28.15 8.8 28.5 8.4 M 27.5 9.9 L 27.1 10.55 27 10.55 26.95 10.5 27.4 9.8 27.5 9.9 M 27.6 10.85 L 27.6 10.9 28.45 12.1 28.45 12.25 28.65 12.4 27.95 12.9 27.7 12.65 27.45 12.25 27.35 11.8 27.35 11.65 27.3 11.2 27.3 11.15 27.5 10.65 27.6 10.85 M 21.05 17.1 L 21.25 17.2 21.35 17.2 Q 21.95 18.1 22.3 18.15 L 22.65 18.65 23.05 19 23 19 23.25 19.1 23.5 19.15 23.65 19.15 24.45 19.4 24.75 19.7 25.1 19.8 25.1 20.2 24.65 21.8 Q 24.5 21.95 24.5 22.35 L 24.45 22.95 23.95 24.6 23.85 24.6 23 24.3 22.95 24.3 21.8 23.75 21 23.2 21.1 22.55 21.1 21.55 21 20.75 20.9 20.45 20.65 20.2 20.55 20.2 20.5 20.25 20.55 21.1 20.4 21.2 20.35 21.4 19.25 22.4 17.95 21.3 17.15 20.2 17.15 20.15 17.6 19.9 17.95 19.55 18.5 19.2 20.35 17.35 20.9 17 21.05 17.1 M 21.3 24.05 L 21.35 24.15 20.8 25.8 20.8 25.3 20.85 25.25 20.85 25.05 20.9 24.9 20.85 24.85 21.1 23.95 21.3 24.05 M 21.8 24.35 L 21.85 24.35 23.35 25 22 27.4 21.35 28 21.15 27.9 21 27.85 20.8 27.85 20.7 28 21 28.35 21.2 28.45 20.7 29.25 20.5 29.25 20.2 29.15 19.95 29 19.9 29.05 19.4 28.4 19.35 28.3 Q 19.35 28 20.5 26.95 L 20.6 26.8 20.7 26.6 20.75 26.3 20.95 26.4 21.05 26.35 21.2 25.95 21.2 26 21.8 24.35 M 17.25 22.8 L 17.4 22.95 18.2 22.25 18.6 22.55 18.3 22.7 18.05 22.9 18 22.85 17.5 23.15 17 23.6 17 23.85 17.15 24.25 17.15 24.55 16.65 25 16.15 25.2 15.8 25.2 Q 15.5 25.05 15.5 24.55 L 15.5 23.9 15.8 23.9 16.05 23.8 16.15 23.6 15.95 23.4 Q 15.85 23.4 15.55 23.55 L 15.55 23.5 15.45 23.65 15.35 23.3 Q 15.35 23.15 15.9 22.1 L 16.85 20.7 17.65 21.7 17.9 21.95 17.5 22.35 17.25 22.8 M 17.2 25.2 L 17.1 25.6 17.1 26.25 17 26.5 17.05 26.5 17 26.55 17 26.9 Q 17 28 16.6 28 L 16.2 27.7 16.2 27.55 16.05 26.85 16.05 26.8 16 26.8 16 26.55 15.95 26.4 15.95 26.3 15.9 26.3 15.85 25.95 15.75 25.65 16.15 25.65 17.2 25.2 M 19 28.7 L 19.35 29.15 19.75 29.5 19.7 29.5 20.4 29.7 19.95 30.2 19.9 30.2 19.9 30.25 19.85 30.25 19.4 30.8 18.8 31.3 18.85 31.3 18.75 31.35 18.5 31.55 18.2 31.85 Q 18.05 32 18.05 32.1 L 17.55 32.45 17.45 32.45 17.4 32.25 17.3 32.05 17.35 32.05 17.3 31.9 18.45 29.85 18.4 29.85 18.6 29.4 18.75 29.2 18.95 28.85 19 28.7 M 24.45 14.55 L 24.5 12.5 24.35 12.3 Q 24.2 12.3 24.15 12.65 L 24 14.35 23.95 14.3 23.9 15.1 23.8 15.3 23.8 15.5 24 15.75 24.3 15.2 24.45 14.55 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 19.35 29.15 L 19 28.7 18.95 28.85 18.75 29.2 18.6 29.4 18.4 29.85 18.45 29.85 17.3 31.9 17.35 32.05 17.3 32.05 17.4 32.25 17.45 32.45 17.55 32.45 18.05 32.1 Q 18.05 32 18.2 31.85 L 18.5 31.55 18.75 31.35 18.85 31.3 18.8 31.3 19.4 30.8 19.85 30.25 19.9 30.25 19.9 30.2 19.95 30.2 20.4 29.7 19.7 29.5 19.75 29.5 19.35 29.15 M 17.1 25.6 L 17.2 25.2 16.15 25.65 15.75 25.65 15.85 25.95 15.9 26.3 15.95 26.3 15.95 26.4 16 26.55 16 26.8 16.05 26.8 16.05 26.85 16.2 27.55 16.2 27.7 16.6 28 Q 17 28 17 26.9 L 17 26.55 17.05 26.5 17 26.5 17.1 26.25 17.1 25.6 M 34.15 8.95 L 34.1 9 33.85 8.95 33.75 8.95 33.15 10.9 33.1 11 32.9 11.6 33.4 12.1 33.6 12.4 33.35 12.6 33.05 12.4 32.8 12.1 32.85 12.25 32.7 12.45 32.4 12.45 32.25 12.2 32.1 12.1 30.2 12.85 29.95 12.85 29.4 12.75 28.8 13.3 28.3 13.6 27.75 13.8 27.6 13.75 27.3 13.5 27.05 13.2 26.85 12.8 26.65 12.1 26.65 11.45 26.7 11.5 26.7 11.2 26.8 11 26.75 10.95 26.5 11.25 26.3 11.25 26.2 11.15 26.2 10.95 Q 26.2 10.6 26.7 9.8 L 27.8 8.35 28.1 8.1 28.5 8 28.65 7.9 29.75 6.9 30.25 6.6 30.55 6.1 30.3 5.7 Q 30.05 5.5 29.85 5.5 L 29.5 5.6 29.2 5.75 27.4 7.2 26.85 7.55 26.3 8 25.9 8.45 23.2 14.05 22.25 15.5 21.55 16.15 21.45 16.5 21.5 16.75 21.65 17 Q 21.85 17 22.1 17.4 22.55 17.5 22.95 18.35 L 23 18.3 23.45 18.7 24.7 18.1 25.85 17.3 26.05 17.3 26.15 17.45 26.15 17.55 24.9 18.5 24.2 18.85 25.25 19.3 25.65 19.1 26.35 17.85 28 16 28.4 15.45 Q 28.7 15.1 29.3 14.85 L 31.5 13.95 Q 33.1 13.3 33.75 12.55 L 33.75 12.6 33.95 11.95 Q 33.95 11.7 34.1 11.6 L 34.5 10.05 34.6 9.45 34.6 9.25 34.65 9.1 34.65 8.95 34.6 8.95 34.3 9 34.25 8.95 34.2 9 34.15 8.95 M 24.5 12.5 L 24.45 14.55 24.3 15.2 24 15.75 23.8 15.5 23.8 15.3 23.9 15.1 23.95 14.3 24 14.35 24.15 12.65 Q 24.2 12.3 24.35 12.3 L 24.5 12.5 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 17.4 22.95 L 17.25 22.8 17.5 22.35 17.9 21.95 17.65 21.7 16.85 20.7 15.9 22.1 Q 15.35 23.15 15.35 23.3 L 15.45 23.65 15.55 23.5 15.55 23.55 Q 15.85 23.4 15.95 23.4 L 16.15 23.6 16.05 23.8 15.8 23.9 15.5 23.9 15.5 24.55 Q 15.5 25.05 15.8 25.2 L 16.15 25.2 16.65 25 17.15 24.55 17.15 24.25 17 23.85 17 23.6 17.5 23.15 18 22.85 18.05 22.9 18.3 22.7 18.6 22.55 18.2 22.25 17.4 22.95 M 21.85 24.35 L 21.8 24.35 21.2 26 21.2 25.95 21.05 26.35 20.95 26.4 20.75 26.3 20.7 26.6 20.6 26.8 20.5 26.95 Q 19.35 28 19.35 28.3 L 19.4 28.4 19.9 29.05 19.95 29 20.2 29.15 20.5 29.25 20.7 29.25 21.2 28.45 21 28.35 20.7 28 20.8 27.85 21 27.85 21.15 27.9 21.35 28 22 27.4 23.35 25 21.85 24.35 M 21.35 24.15 L 21.3 24.05 21.1 23.95 20.85 24.85 20.9 24.9 20.85 25.05 20.85 25.25 20.8 25.3 20.8 25.8 21.35 24.15 M 27.6 10.9 L 27.6 10.85 27.5 10.65 27.3 11.15 27.3 11.2 27.35 11.65 27.35 11.8 27.45 12.25 27.7 12.65 27.95 12.9 28.65 12.4 28.45 12.25 28.45 12.1 27.6 10.9 M 30.95 9.05 L 30.85 8.85 Q 30.7 8.35 29.95 8.35 L 29.85 8.35 29.25 8.8 29.05 9.05 28.75 9.2 28.6 9.35 28.4 9.5 28.15 9.5 27.9 9.7 28 9.8 28.05 9.9 28 10.1 27.75 10.1 27.75 10.2 28.3 11.2 28.6 11.6 29.1 11.9 29.8 12.1 30 11.75 30.3 11.45 30.05 11.45 29.7 11.3 29.45 11 Q 29.45 10.8 29.75 10.8 L 30.15 10.9 30.5 11.1 30.6 10.85 30.35 10.85 30.15 10.75 30.15 10.55 30.35 10.25 30.5 9.85 30.15 9.95 29.9 9.75 29.8 9.8 29.55 9.8 29.45 9.65 29.45 9.5 29.65 9.35 29.8 9.3 30 9.3 30.45 9.45 30.55 9.8 30.75 9.7 31 9.65 31 9.2 30.95 9.05 M 32.75 4.6 L 32.3 4.4 32.3 4.35 32.95 2.9 32.75 2.75 Q 32.3 2.75 31.65 3.75 L 30.85 5.05 31.15 5.45 31.1 5.5 31.15 5.55 31.9 5.05 Q 32.4 4.7 32.6 4.7 L 32.6 4.75 32.65 4.75 32.75 4.7 32.8 4.65 32.75 4.65 32.75 4.6 M 35.85 6.05 L 35.75 5.4 35.5 5.15 34.4 6.75 34 6.7 33.75 6.3 33.75 6.9 33.9 7.65 34.05 7.95 34.3 8.1 34.5 8.1 34.6 8.05 34.9 8.15 35.6 6.85 35.8 6.35 35.85 6.05 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 21.25 17.2 L 21.05 17.1 20.9 17 20.35 17.35 18.5 19.2 17.95 19.55 17.6 19.9 17.15 20.15 17.15 20.2 17.95 21.3 19.25 22.4 20.35 21.4 20.4 21.2 20.55 21.1 20.5 20.25 20.55 20.2 20.65 20.2 20.9 20.45 21 20.75 21.1 21.55 21.1 22.55 21 23.2 21.8 23.75 22.95 24.3 23 24.3 23.85 24.6 23.95 24.6 24.45 22.95 24.5 22.35 Q 24.5 21.95 24.65 21.8 L 25.1 20.2 25.1 19.8 24.75 19.7 24.45 19.4 23.65 19.15 23.5 19.15 23.25 19.1 23 19 23.05 19 22.65 18.65 22.3 18.15 Q 21.95 18.1 21.35 17.2 L 21.25 17.2 Z\"/>\n\n  <path fill=\"#FFFFFF\" stroke=\"none\" d=\" M 27.1 10.55 L 27.5 9.9 27.4 9.8 26.95 10.5 27 10.55 27.1 10.55 M 33.9 8.45 L 33.95 8.5 34.1 8.55 34.2 8.5 34.05 8.5 33.95 8.45 33.9 8.45 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 29 8.15 L 28.5 8.4 28.15 8.8 28.05 9 28.05 9.05 28.15 9.05 28.3 8.95 28.5 8.85 28.45 8.85 28.7 8.65 28.65 8.65 28.9 8.4 29.2 8.35 29 8.15 M 30.95 7.3 L 30.9 7.35 30.8 7.4 30.6 7.4 30.15 7.15 29.75 7.45 29.25 7.95 29.35 7.95 29.4 8.05 29.6 8.05 29.6 8 30.05 8 30.05 8.05 30.1 8 30.35 8.05 31.1 8.5 31.3 8.75 31.35 9 31.5 9 31.95 8.5 31.8 8.5 31.5 8.3 31.4 8 31.1 7.75 31.05 7.5 30.95 7.3 Z\"/>\n</g>\n";

Asserts.sp_svg_player_catch_left = "<g id=\"sp_svg_player_catch_left\" sp-width=\"30\" sp-height=\"35\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 4.9 19.55 Q 4.1 19.5 4.3 19.95 L 4.5 20.25 4.75 20.5 4.4 20.6 4.3 20.8 6.7 21.6 Q 7.25 21.9 7 22.1 L 6.2 22.45 5.25 22.65 Q 4.9 22.8 5.25 23 L 6.35 23.6 6.5 23.85 6.9 24.25 7.65 24.75 Q 8.1 25.05 7.8 25 L 5.45 24.5 3.9 23.05 3.85 21.75 Q 3.7 20.75 3.1 21.7 L 1.9 20.85 1.2 21.15 Q 0.55 21.5 0.8 21.7 L 2.65 23 4.95 25.9 7.1 26.35 7.35 26.35 7.8 26.5 Q 9.2 26.75 10.6 27.6 L 12.6 28.85 Q 13.6 29.4 13.15 29.55 L 15.35 32 18.85 35.15 Q 21 36.8 22.45 37.25 24.2 37.75 24.8 36.5 24.95 36.05 24.4 35.75 L 23 35.35 20.35 33.15 19.15 31.9 Q 18.65 30.95 18.65 30.65 L 20 30.7 21.2 31.25 22.1 31.85 Q 22.85 32.55 22.15 33.6 L 24.55 35.2 25.4 35.3 25.9 34.45 24.45 33.3 24.8 32.45 22.65 30.45 22.35 29.65 21.7 28.7 21.4 28.35 21.35 28.25 20.8 28.05 Q 17.5 26.8 16.5 25.85 L 13.25 22.7 12.35 22.35 12.05 22.2 8.7 21.05 7.8 20.9 7 20.55 6.7 20.15 4.9 19.55 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 23.55 17.6 L 23.2 17.05 Q 23.05 16.7 22.5 16.3 L 21.85 15.65 20.45 13.1 19.75 11.35 18.5 9 18.3 8.8 18.3 8.75 17.9 8.4 17.45 8.1 17.5 8.1 14.55 6 14.5 6 14.55 5.95 14.3 5.9 14.15 5.9 13.95 5.75 13.75 5.7 13.55 5.75 13.5 5.7 12.8 4.35 12.15 3.7 Q 11.55 3.2 11.25 3.2 L 10.8 3.25 10.65 3.45 10.7 3.45 10.65 3.6 10.85 4.35 11.1 4.95 11.15 4.95 11.15 5 10.8 5.1 10.7 5.3 10.75 5.35 10.7 5.4 10.75 5.45 10.75 5.5 10.7 5.5 Q 10.7 5.8 11.3 6.1 L 11.95 6.5 11.95 6.45 12.65 6.9 12.8 6.95 13.45 7.7 13.4 7.7 13.25 7.6 13.1 7.6 Q 12.8 7.6 12.6 8 L 12.35 8.5 12.15 8.7 12.1 8.85 12.05 8.95 11.95 8.9 11.75 8.9 11.65 9 11.65 8.95 11.55 9.2 11.55 9.55 11.95 10.05 12.6 10.3 12.6 10.75 12.8 11.2 12.8 11.4 13.05 12.05 13.8 13.2 13.75 13.2 12.95 12.95 11.55 12.2 11.45 11.85 11.4 11.9 10.7 9.45 10.5 9.25 10.4 9.05 10.75 7.65 10.8 7.6 10.8 7.15 10.75 6.95 10.6 6.7 10.3 6.5 9.95 6.75 9.75 7.05 9.75 7 9.7 7.15 9.55 6.85 9.35 6.3 Q 9 5.55 8.65 5.55 L 8.55 5.6 8.45 5.6 Q 8.1 5.55 7.85 5.95 L 7.65 6.65 7.7 6.75 7.65 6.75 7.65 7.2 Q 7.85 8 8.7 9.2 L 8.7 9.45 8.8 9.75 8.75 9.75 9.1 11.65 9.15 11.65 9.1 11.7 9.55 13.15 Q 9.6 13.7 10.2 14.15 L 11.25 14.9 11.3 14.85 13.15 15.65 13.1 15.7 13.8 15.95 14.3 16.2 14.65 16.3 14.95 16.45 16.1 17.85 16.25 18 18.15 20.5 18.15 20.45 18.4 20.6 18.45 21.55 18.95 23.4 19 23.95 19.35 25.4 19.85 26 20.05 26 20.55 27.05 20.55 27 21.35 28.25 21.4 28.35 21.7 28.7 22.35 29.65 22.65 30.45 24.8 32.45 26 33.8 26.3 35.35 26.3 35.8 26.55 36.65 26.6 36.75 26.9 37.1 27.35 37.2 27.8 36.75 28.05 36.15 28.15 35.7 28.35 35.25 28.4 35.25 28.55 34.6 28.5 34.6 28.55 34.35 28.55 34.3 28.6 34.25 28.6 33.85 28.55 33.7 28.55 33.45 28.45 33.1 28.4 33.15 27.8 32.6 27.75 32.6 27.35 32.45 27.05 32.2 26.1 30.6 26.15 30.6 25.25 29.05 24.15 27.75 24 27.65 23.7 27.1 23.7 25.95 23.3 24.45 23.5 24.3 23.6 24.05 23.55 23.9 23.45 23.7 23.4 23.3 23.4 22.75 23.45 22.75 24.45 23.7 24.55 23.75 24.75 23.75 24.95 23.65 26.2 24.4 26.45 24.5 26.25 25.25 26.3 26.55 26.4 27.1 26.4 27.3 26.45 27.35 26.4 27.35 26.4 27.4 26.5 27.9 26.5 28.2 26.4 28.6 Q 26.25 28.9 26.25 29.1 26.3 29.75 27 30.7 L 28.3 31.95 28.5 32.05 28.65 32.2 29.05 32.3 29.4 32.15 29.6 31.75 29.65 31.55 29.65 31.2 29.55 30.8 29.55 30.6 28.85 29.3 28.3 28.5 28.4 27.75 28.45 27.75 29 25.4 29 25.05 28.95 24.7 29.15 24.3 29.15 24 28.45 22.6 27.35 21.1 27.45 20.75 27.35 20.5 27.25 20.45 26.65 20.25 25.35 19.3 23.55 17.6 M 11.3 4.55 L 11.05 3.8 Q 11.05 3.6 11.2 3.6 11.7 3.6 12.35 4.6 L 13.15 5.9 12.85 6.35 12.8 6.4 12.05 5.9 11.4 5.6 11.2 5.6 11.2 5.5 11.7 5.25 11.65 5.15 11.65 5.2 11.3 4.55 M 10.25 7.2 L 10.25 7.25 10.2 7.35 10.25 7.4 10.05 8.5 9.95 8.8 9.65 8.95 9.4 8.95 Q 9.15 8.95 9.1 9.05 L 8.35 7.7 8.2 7.2 8.15 6.9 8.15 6.65 8.2 6.25 8.45 6.05 8.95 6.85 9.6 7.65 9.95 7.55 10.25 7.2 M 21.75 16.35 L 22.4 17.05 22.45 17 22.55 17.4 22.5 17.6 22.35 17.85 21.9 18.25 Q 21.45 18.35 21 19.2 L 21 19.15 20.55 19.55 Q 18.4 18.55 18.4 18.4 L 18.1 18.2 17.95 18.2 17.8 18.4 19.75 19.75 18.75 20.15 18.55 20.1 18.35 19.95 17.65 18.7 16.4 17.45 16.45 17.45 15.55 16.3 14.65 15.7 12.5 14.8 Q 10.85 14.15 10.25 13.45 L 10.1 13.2 10.05 12.85 9.9 12.5 9.4 10.35 9.4 10.1 9.35 9.95 9.35 9.8 9.65 9.85 9.9 9.85 10.15 9.8 10.25 9.8 10.85 11.75 10.85 11.9 11.1 12.45 10.55 12.95 10.35 13.25 10.6 13.45 10.95 13.25 11.2 12.95 11.15 13.15 11.3 13.3 11.6 13.3 11.7 13.1 11.85 12.95 13.8 13.7 14.05 13.7 14.6 13.6 15.65 14.5 16.2 14.65 16.4 14.6 16.35 14.6 16.65 14.4 16.95 14.05 17.15 13.65 17.35 12.95 17.3 12.05 17.2 11.9 17.2 11.8 17.5 12.15 17.65 12.15 17.8 12 17.8 11.8 17.3 10.7 16.55 9.7 16.4 9.45 16.2 9.2 15.85 8.95 15.35 8.8 14.2 7.75 13.75 7.45 13.45 7 13.7 6.6 14.15 6.35 14.75 6.6 17.7 8.9 18.1 9.35 20.25 13.9 21.75 16.35 M 13.4 8.3 L 13.85 8.05 14.75 8.8 14.55 8.9 14.4 8.9 14.35 8.85 13.95 8.85 13.95 8.9 13.9 8.9 13.85 8.85 13.6 8.95 12.9 9.4 12.7 9.6 12.6 9.85 12.5 9.85 12.05 9.4 12.1 9.35 12.15 9.35 12.15 9.4 12.45 9.2 12.6 8.85 12.9 8.6 13 8.2 13.1 8.25 13.15 8.3 13.4 8.3 M 14.8 9.2 L 14.9 9.15 15 9 15.45 9.25 15.85 9.65 15.95 9.85 15.95 9.95 15.8 9.9 15.85 9.95 15.65 9.85 15.5 9.7 15.3 9.55 15.3 9.5 15.05 9.3 14.8 9.2 M 14.05 9.2 L 14.15 9.25 14.7 9.65 14.9 9.9 15.1 9.95 15.25 10.05 15.4 10.25 15.6 10.35 15.85 10.35 16.05 10.55 16 10.7 15.9 10.8 16 10.95 16.2 11 16.25 11.05 15.4 12.45 14.9 12.8 14.15 12.95 13.7 12.35 13.95 12.35 14.3 12.15 14.55 11.85 Q 14.55 11.65 14.2 11.65 L 13.8 11.75 13.5 12 13.35 11.7 13.6 11.7 13.85 11.6 13.85 11.4 13.6 11.1 13.5 10.75 13.8 10.8 14.1 10.6 14.15 10.65 14.4 10.65 14.55 10.5 14.55 10.35 14.35 10.2 14 10.15 13.55 10.3 Q 13.3 10.45 13.4 10.65 L 13.2 10.55 13 10.5 12.95 10.05 13 9.9 13.15 9.7 Q 13.3 9.25 14.05 9.2 M 16.5 10.75 L 16.55 10.65 17 11.35 17 11.4 16.95 11.45 16.9 11.45 16.5 10.75 M 16.4 11.75 L 16.35 11.75 16.45 11.55 16.7 12 16.65 12.05 16.65 12.5 16.6 12.6 16.65 12.65 16.5 13.15 16.4 13.35 16.25 13.5 16.05 13.75 15.35 13.3 15.55 13.1 15.5 13 16.4 11.75 M 10 9.4 L 9.8 9.4 10 9.3 10.1 9.3 10 9.4 M 22.65 18.05 L 22.75 18.05 22.95 17.95 23.05 17.85 23.35 18 23.6 18.2 25.45 20.05 25.8 20.3 26 20.4 26.4 20.75 26.8 21 26.8 21.05 26.05 22.15 24.7 23.25 23.65 22.3 23.6 22.1 23.45 21.95 23.5 21.1 23.45 21.1 23.4 21.05 23.35 21.05 23.1 21.3 23 21.65 22.9 22.4 22.9 23.4 23 24.05 22.65 24.35 21 25.2 21 25.15 20.6 25.35 20.15 25.45 20.05 25.45 19.5 23.8 19.5 23.2 18.85 21.05 18.9 21 18.85 20.7 19.25 20.6 19.5 20.25 19.9 20.1 20.3 20.05 20.5 20.05 20.75 19.95 20.95 19.9 20.95 19.85 21.35 19.5 21.65 19 Q 22.05 18.95 22.65 18.05 M 26.5 24 L 25.95 23.75 25.4 23.4 25.8 23.15 26.55 23.85 26.75 23.65 26.5 23.25 26.1 22.85 27.1 21.55 28.65 24.15 28.55 24.5 28.45 24.4 28.4 24.4 28.05 24.25 Q 27.8 24.25 27.8 24.45 L 27.95 24.7 28.15 24.8 28.45 24.8 28.45 24.75 28.5 24.75 28.5 25.45 Q 28.5 25.9 28.15 26.05 L 27.85 26.05 27.3 25.85 26.85 25.4 26.85 25.1 26.95 24.7 26.95 24.45 26.5 24 M 27.85 26.5 L 28.15 26.55 28.15 26.5 28.2 26.5 28.25 26.55 28.05 27.15 28.05 27.2 28 27.2 28.05 27.25 28 27.3 27.95 27.4 28 27.4 27.95 27.65 27.95 27.7 27.8 28.1 27.75 28.45 27.75 28.5 27.8 28.45 27.75 28.55 27.75 28.6 27.8 28.6 27.35 28.85 Q 27 28.85 27 27.8 L 27 27.45 26.95 27.35 26.9 27.1 26.9 26.45 26.8 26.1 Q 27.45 26.55 27.85 26.5 M 25.55 30.75 L 25.6 30.8 26.65 32.75 26.65 32.95 26.55 33.3 26.5 33.3 26.4 33.35 25.95 32.95 25.8 32.75 25.65 32.6 25.5 32.4 Q 25.35 32.25 25.2 32.25 L 25.25 32.2 25.15 32.2 25.15 32.15 24.15 31.15 24.1 31.15 24.1 31.05 24 31.05 23.85 30.85 23.6 30.6 24.25 30.35 24.95 29.6 25 29.7 25.25 30.05 25.35 30.25 25.4 30.25 25.5 30.55 25.6 30.7 25.55 30.7 25.55 30.75 M 22.9 24.8 L 23.05 25.25 23.15 25.75 23.1 25.75 23.15 25.9 23.15 26.1 23.2 26.15 23.2 26.65 22.65 25.05 22.6 25.05 22.9 24.8 M 22.85 27.1 L 22.95 27.2 23.05 27.25 23.25 27.15 23.25 27.5 23.4 27.65 23.5 27.8 24.6 29.15 24.55 29.25 24.05 29.9 23.5 30.1 23.3 30.1 23 29.75 22.75 29.3 23 29.2 23.25 28.85 23.15 28.7 23 28.7 22.85 28.8 22.65 28.85 21.95 28.3 21.9 28.15 20.65 25.85 Q 20.9 25.75 21.2 25.6 L 22.1 25.2 22.2 25.2 22.75 26.85 22.8 26.8 22.85 27.1 M 19.65 13.15 L 19.45 13.35 19.45 14.35 19.5 14.45 19.5 15.1 19.55 15.2 19.55 15.45 19.65 16.1 Q 19.8 16.65 20 16.65 L 20.2 16.4 20.1 16 19.95 14.35 19.9 14.25 19.9 14 19.85 13.5 19.65 13.15 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 22.95 27.2 L 22.85 27.1 22.8 26.8 22.75 26.85 22.2 25.2 22.1 25.2 21.2 25.6 Q 20.9 25.75 20.65 25.85 L 21.9 28.15 21.95 28.3 22.65 28.85 22.85 28.8 23 28.7 23.15 28.7 23.25 28.85 23 29.2 22.75 29.3 23 29.75 23.3 30.1 23.5 30.1 24.05 29.9 24.55 29.25 24.6 29.15 23.5 27.8 23.4 27.65 23.25 27.5 23.25 27.15 23.05 27.25 22.95 27.2 M 23.05 25.25 L 22.9 24.8 22.6 25.05 22.65 25.05 23.2 26.65 23.2 26.15 23.15 26.1 23.15 25.9 23.1 25.75 23.15 25.75 23.05 25.25 M 25.95 23.75 L 26.5 24 26.95 24.45 26.95 24.7 26.85 25.1 26.85 25.4 27.3 25.85 27.85 26.05 28.15 26.05 Q 28.5 25.9 28.5 25.45 L 28.5 24.75 28.45 24.75 28.45 24.8 28.15 24.8 27.95 24.7 27.8 24.45 Q 27.8 24.25 28.05 24.25 L 28.4 24.4 28.45 24.4 28.55 24.5 28.65 24.15 27.1 21.55 26.1 22.85 26.5 23.25 26.75 23.65 26.55 23.85 25.8 23.15 25.4 23.4 25.95 23.75 M 16.35 11.75 L 16.4 11.75 15.5 13 15.55 13.1 15.35 13.3 16.05 13.75 16.25 13.5 16.4 13.35 16.5 13.15 16.65 12.65 16.6 12.6 16.65 12.5 16.65 12.05 16.7 12 16.45 11.55 16.35 11.75 M 14.15 9.25 L 14.05 9.2 Q 13.3 9.25 13.15 9.7 L 13 9.9 12.95 10.05 13 10.5 13.2 10.55 13.4 10.65 Q 13.3 10.45 13.55 10.3 L 14 10.15 14.35 10.2 14.55 10.35 14.55 10.5 14.4 10.65 14.15 10.65 14.1 10.6 13.8 10.8 13.5 10.75 13.6 11.1 13.85 11.4 13.85 11.6 13.6 11.7 13.35 11.7 13.5 12 13.8 11.75 14.2 11.65 Q 14.55 11.65 14.55 11.85 L 14.3 12.15 13.95 12.35 13.7 12.35 14.15 12.95 14.9 12.8 15.4 12.45 16.25 11.05 16.2 11 16 10.95 15.9 10.8 16 10.7 16.05 10.55 15.85 10.35 15.6 10.35 15.4 10.25 15.25 10.05 15.1 9.95 14.9 9.9 14.7 9.65 14.15 9.25 M 10.25 7.25 L 10.25 7.2 9.95 7.55 9.6 7.65 8.95 6.85 8.45 6.05 8.2 6.25 8.15 6.65 8.15 6.9 8.2 7.2 8.35 7.7 9.1 9.05 Q 9.15 8.95 9.4 8.95 L 9.65 8.95 9.95 8.8 10.05 8.5 10.25 7.4 10.2 7.35 10.25 7.25 M 11.05 3.8 L 11.3 4.55 11.65 5.2 11.65 5.15 11.7 5.25 11.2 5.5 11.2 5.6 11.4 5.6 12.05 5.9 12.8 6.4 12.85 6.35 13.15 5.9 12.35 4.6 Q 11.7 3.6 11.2 3.6 11.05 3.6 11.05 3.8 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 25.6 30.8 L 25.55 30.75 25.55 30.7 25.6 30.7 25.5 30.55 25.4 30.25 25.35 30.25 25.25 30.05 25 29.7 24.95 29.6 24.25 30.35 23.6 30.6 23.85 30.85 24 31.05 24.1 31.05 24.1 31.15 24.15 31.15 25.15 32.15 25.15 32.2 25.25 32.2 25.2 32.25 Q 25.35 32.25 25.5 32.4 L 25.65 32.6 25.8 32.75 25.95 32.95 26.4 33.35 26.5 33.3 26.55 33.3 26.65 32.95 26.65 32.75 25.6 30.8 M 28.15 26.55 L 27.85 26.5 Q 27.45 26.55 26.8 26.1 L 26.9 26.45 26.9 27.1 26.95 27.35 27 27.45 27 27.8 Q 27 28.85 27.35 28.85 L 27.8 28.6 27.75 28.6 27.75 28.55 27.8 28.45 27.75 28.5 27.75 28.45 27.8 28.1 27.95 27.7 27.95 27.65 28 27.4 27.95 27.4 28 27.3 28.05 27.25 28 27.2 28.05 27.2 28.05 27.15 28.25 26.55 28.2 26.5 28.15 26.5 28.15 26.55 M 22.4 17.05 L 21.75 16.35 20.25 13.9 18.1 9.35 17.7 8.9 14.75 6.6 14.15 6.35 13.7 6.6 13.45 7 13.75 7.45 14.2 7.75 15.35 8.8 15.85 8.95 16.2 9.2 16.4 9.45 16.55 9.7 17.3 10.7 17.8 11.8 17.8 12 17.65 12.15 17.5 12.15 17.2 11.8 17.2 11.9 17.3 12.05 17.35 12.95 17.15 13.65 16.95 14.05 16.65 14.4 16.35 14.6 16.4 14.6 16.2 14.65 15.65 14.5 14.6 13.6 14.05 13.7 13.8 13.7 11.85 12.95 11.7 13.1 11.6 13.3 11.3 13.3 11.15 13.15 11.2 12.95 10.95 13.25 10.6 13.45 10.35 13.25 10.55 12.95 11.1 12.45 10.85 11.9 10.85 11.75 10.25 9.8 10.15 9.8 9.9 9.85 9.65 9.85 9.35 9.8 9.35 9.95 9.4 10.1 9.4 10.35 9.9 12.5 10.05 12.85 10.1 13.2 10.25 13.45 Q 10.85 14.15 12.5 14.8 L 14.65 15.7 15.55 16.3 16.45 17.45 16.4 17.45 17.65 18.7 18.35 19.95 18.55 20.1 18.75 20.15 19.75 19.75 17.8 18.4 17.95 18.2 18.1 18.2 18.4 18.4 Q 18.4 18.55 20.55 19.55 L 21 19.15 21 19.2 Q 21.45 18.35 21.9 18.25 L 22.35 17.85 22.5 17.6 22.55 17.4 22.45 17 22.4 17.05 M 19.45 13.35 L 19.65 13.15 19.85 13.5 19.9 14 19.9 14.25 19.95 14.35 20.1 16 20.2 16.4 20 16.65 Q 19.8 16.65 19.65 16.1 L 19.55 15.45 19.55 15.2 19.5 15.1 19.5 14.45 19.45 14.35 19.45 13.35 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 22.75 18.05 L 22.65 18.05 Q 22.05 18.95 21.65 19 L 21.35 19.5 20.95 19.85 20.95 19.9 20.75 19.95 20.5 20.05 20.3 20.05 19.9 20.1 19.5 20.25 19.25 20.6 18.85 20.7 18.9 21 18.85 21.05 19.5 23.2 19.5 23.8 20.05 25.45 20.15 25.45 20.6 25.35 21 25.15 21 25.2 22.65 24.35 23 24.05 22.9 23.4 22.9 22.4 23 21.65 23.1 21.3 23.35 21.05 23.4 21.05 23.45 21.1 23.5 21.1 23.45 21.95 23.6 22.1 23.65 22.3 24.7 23.25 26.05 22.15 26.8 21.05 26.8 21 26.4 20.75 26 20.4 25.8 20.3 25.45 20.05 23.6 18.2 23.35 18 23.05 17.85 22.95 17.95 22.75 18.05 Z\"/>\n\n  <path fill=\"#FFFFFF\" stroke=\"none\" d=\" M 9.8 9.4 L 10 9.4 10.1 9.3 10 9.3 9.8 9.4 M 16.55 10.65 L 16.5 10.75 16.9 11.45 16.95 11.45 17 11.4 17 11.35 16.55 10.65 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 14.9 9.15 L 14.8 9.2 15.05 9.3 15.3 9.5 15.3 9.55 15.5 9.7 15.65 9.85 15.85 9.95 15.8 9.9 15.95 9.95 15.95 9.85 15.85 9.65 15.45 9.25 15 9 14.9 9.15 M 13.85 8.05 L 13.4 8.3 13.15 8.3 13.1 8.25 13 8.2 12.9 8.6 12.6 8.85 12.45 9.2 12.15 9.4 12.15 9.35 12.1 9.35 12.05 9.4 12.5 9.85 12.6 9.85 12.7 9.6 12.9 9.4 13.6 8.95 13.85 8.85 13.9 8.9 13.95 8.9 13.95 8.85 14.35 8.85 14.4 8.9 14.55 8.9 14.75 8.8 13.85 8.05 Z\"/>\n</g>\n";

Asserts.sp_svg_player_run_left = "<g id=\"sp_svg_player_run_left\" sp-width=\"30\" sp-height=\"33\">\n  <path fill=\"#000000\" fill-opacity=\"0.5019607843137255\" stroke=\"none\" d=\" M 29.95 35.5 L 30.25 35.05 29.5 35.75 29.95 35.5 M 9.35 21.6 L 9.25 21.55 8.8 21.6 8.65 21.7 7.9 22.4 7.75 22.95 7.85 23.05 10.2 23.9 10.9 24.6 10.6 25.25 9.5 26.75 9 27.1 5.3 28.35 3.65 28.7 Q 2.55 28.95 2.8 29.25 3.1 29.65 3.9 29.65 L 5.35 29.5 5.45 29.7 5.4 29.95 5.8 30.05 6.25 30.1 6.55 30.05 7.4 29.2 8.5 29 11.65 28 12.75 27.4 13.1 27.1 13.35 27.05 13.45 27.15 12.8 27.55 14 28.1 15.15 28.05 15.45 28.25 15.6 28.55 13.25 30.05 13.8 30.25 14.3 30.25 14.25 30.55 14.05 30.8 13.9 30.95 14 31.4 13.9 31.85 15.1 32.2 16.4 32.05 20 31.95 Q 20.3 31.95 20.4 32.1 L 20.9 32.6 Q 21.55 33 22.95 33.5 L 25.45 34.35 25.7 34.4 26.9 34.75 27.25 34.9 26.85 35.6 Q 26.55 36.15 26.6 36.3 L 27.8 36.55 28.2 36.45 28.35 36.35 27.8 36.3 27.75 36.2 27.7 36.15 27.7 36.2 27.6 36.1 27.6 36.05 27.55 35.85 27.5 35.85 27.5 35.45 27.65 35.1 27.9 34.75 27.9 34.8 27.95 34.7 28.2 34.3 28.3 34.05 25.85 32.9 25.6 32.75 23.55 32.2 23.9 31.75 24.25 31.8 24.45 31.8 24.55 31.75 24.5 31.6 24.35 31.45 23.5 30.45 22.3 28.6 Q 21.6 27.3 22.4 27.35 L 23.15 26.95 22.6 26.6 22.45 26.65 22.45 26.6 22.25 26.7 21.05 27 21 26.95 20.95 27 20.45 27.1 20.15 27.05 19.1 27.1 18.6 27.2 18.3 27.2 18.25 27.15 18.05 27.2 17.8 27.2 17.2 26.95 16.8 26.45 16.8 26.2 16.75 26 17.2 24.55 17.3 24.45 17.3 24.25 17.35 24.3 17.45 24 15.45 24.15 15 24.05 14.75 23.85 15 23.75 Q 16.25 23.15 15.5 22.5 14.8 21.95 12.75 21.55 L 10.75 21.6 10.2 22.7 10.2 22.75 10 22.8 9.75 22.8 9.35 22.75 9.1 22.4 9.35 21.6 Z\"/>\n\n  <path fill=\"#000000\" stroke=\"none\" d=\" M 20.75 5.1 L 20.65 4.95 20.2 4.7 20.15 4.75 19.8 4.6 19.5 4.4 19.3 4.4 19.35 4.45 18.75 4.55 18.65 4.5 18.35 4.5 Q 18.2 4.5 17.95 4.65 L 17.7 4.85 17.35 5.05 17.3 5.05 17 5.25 17 4.7 16.85 4.55 16.65 4.45 16.35 4.6 16 4.95 15.45 5.85 15.35 6.15 15.1 6.35 15.15 6.4 15 6.45 15 6.9 14.75 7.3 Q 14.6 7.4 14.6 7.6 L 14.6 7.8 14.65 7.8 Q 14.8 8.35 15.6 8.55 15.85 8.45 15.85 8.75 L 15.85 9.2 Q 15.85 9.5 16.1 9.6 L 16.4 9.8 16.35 10.1 16.5 10.6 16.55 10.55 16.85 11.05 16.85 11 17 11.15 17 11.2 17.1 11.3 17.15 11.3 17.45 11.8 17.45 11.75 17.55 11.9 16.9 12.3 16.15 13.1 15.4 14.3 15.4 14.25 15.1 14.7 14.65 15.65 14.6 15.6 Q 14.2 15.85 14.15 16.35 L 14.1 16.35 13.95 16.55 13.7 16.7 13.7 16.65 13.65 16.7 13.65 16.65 13.3 17 12 17.85 12 17.8 11.85 17.95 11.7 18.05 11.65 18 11.45 18.1 11.15 18.2 11.1 18.15 10.9 18.25 10.7 18.3 Q 10.3 18.95 9.7 19.05 L 9.5 19.1 9.1 19.35 9.05 19.3 8.65 19.5 8.55 19.6 8.55 19.55 8.5 19.6 8.5 19.55 7.5 20.05 7.2 20.25 Q 6.95 20.3 6.85 20.45 L 6.85 21 6.95 21.4 7.1 21.65 7.15 21.65 7.2 21.7 7.85 21.85 8.1 21.85 8.35 21.8 8.7 21.6 8.8 21.6 9.25 21.55 9.35 21.6 9.1 22.4 9.35 22.75 9.75 22.8 10 22.8 10.2 22.75 10.2 22.7 10.75 21.6 11.45 20.8 11.75 20.8 12.15 20.55 12.6 20.35 12.65 20.4 Q 12.8 20.2 13.15 20.1 L 13.75 19.9 13.8 19.9 13.8 19.85 14.25 19.55 14.25 19.6 14.5 19.35 14.9 19.1 14.95 19.1 15 19.15 15.45 18.9 Q 15.55 18.75 15.8 18.65 L 16.2 18.45 17.45 17.15 17.5 17.05 17.55 17.1 17.6 17 18.05 16.4 18.1 16.35 18.15 16.35 18.25 16.25 18.35 16.35 18.45 16.5 18.4 16.5 18.1 16.85 18.05 16.8 17.75 17.05 17.6 17.35 Q 17.6 17.9 18.5 18.5 L 18.75 18.55 18.85 18.55 19.05 18.5 19.2 18.5 19.7 18.35 19.75 18.4 19.9 18.75 19.95 19.1 19.95 19.5 19.8 19.65 19.5 19.85 19.45 19.85 19.35 19.95 19.25 20 19.2 20 19 20.2 18.9 20.5 18.9 20.75 18.7 20.95 18.65 20.9 18.55 21.05 18.45 21.1 18.2 21.3 17.85 21.45 17.8 21.75 17.65 22 17.6 22 17.15 22.35 17.1 22.3 17 22.45 16.95 22.65 17.05 22.9 17.15 23 17.25 23.05 17.65 23.05 17.85 23.1 17.45 24 17.35 24.3 17.3 24.25 17.3 24.45 17.2 24.55 16.75 26 16.8 26.2 16.8 26.45 17.2 26.95 17.8 27.2 18.05 27.2 18.25 27.15 18.3 27.2 18.6 27.2 19.1 27.1 20.15 27.05 20.45 27.1 20.95 27 21 26.95 21.05 27 22.25 26.7 22.45 26.6 22.45 26.65 22.6 26.6 22.85 26.6 22.85 26.55 22.9 26.6 23.05 26.55 23.1 26.55 23.15 26.7 23.15 26.95 23.25 27.4 23.25 27.9 23.4 28.5 24.4 29.4 24.75 29.55 25 29.9 25.1 29.9 25.7 30.45 25.7 30.4 25.8 30.5 25.8 30.55 25.9 30.6 25.95 30.65 26 30.75 26.2 30.85 Q 26.2 31 26.8 31.35 L 26.8 31.4 26.85 31.4 27.4 31.9 27.45 31.85 28.4 32.45 28.75 32.8 28.75 32.9 28.55 33.6 28.55 33.55 28.3 34.05 28.2 34.3 27.95 34.7 27.9 34.8 27.9 34.75 27.65 35.1 27.5 35.45 27.5 35.85 27.55 35.85 27.6 36.05 27.6 36.1 27.7 36.2 27.7 36.15 27.75 36.2 27.8 36.3 28.35 36.35 28.6 36.4 28.75 36.4 28.9 36.3 28.95 36.25 29 36.15 29 36.2 29.5 35.75 30.25 35.05 31.05 34.35 31.1 34.4 31.2 34.2 31.6 33.65 31.85 33 31.75 32.5 31.6 32.25 31.55 32.2 31.55 32.15 31.5 32.15 31.3 31.85 31.1 31.65 30.35 31.4 30.35 31.35 30.1 31.15 29.95 30.85 29.95 30.8 29.9 30.8 29.6 30.45 29.6 30.5 29.15 30 28.75 29.35 28.75 29.3 28.55 29.15 28.4 28.85 28.35 28.85 28.35 28.8 Q 28.15 28.65 28.1 28.35 L 28.05 28.4 Q 27.8 27.9 26.95 27.55 L 26.95 27.5 26.6 27.4 26.3 27.15 26.35 27.05 26.35 26.95 26.4 26.85 26.8 26.25 26.95 26.3 27 26.3 27.3 26.35 27.35 26.3 27.5 26.25 27.5 26 27.45 25.75 27.4 25.75 27.45 25.7 27.4 25.65 27.4 25.1 27.2 24.45 27 24 27 23.8 26.95 23.6 27 23.5 26.9 22.7 27.1 21.85 27.15 21.4 27.15 20.75 27.1 20.35 26.95 19.85 26.95 19.7 26.8 19.45 26.7 19.15 26.4 18.7 26.5 18.5 26.55 18.2 26.5 17.95 26.35 17.7 26.35 17.75 26.3 17.65 26.2 17.55 27.2 17 27.2 16.95 27.25 16.95 27.85 16.65 28.2 16.1 Q 28.2 15.7 27 14 L 26.15 12.75 25.8 12.1 25.8 12.15 25.5 11.65 25.35 11.1 25.3 11.1 Q 24.95 10.45 24.25 9.95 L 24.1 9.9 23.95 9.8 23.25 9.8 22.35 9.95 21.75 10.15 21.5 10.3 21.15 9.55 21.45 9.35 21.45 9.4 22.5 8.35 22.8 7.8 22.6 7.6 22.6 7.55 22.65 7.55 22.6 7.5 22.6 7.45 22.65 7.4 22.55 7.3 22.45 7.25 22.75 7.1 22.9 6.8 22.6 6.5 Q 22.15 6.35 22.05 6.2 L 21.4 5.7 21.4 5.65 20.75 5.3 20.75 5.1 M 20.35 7.1 L 20.4 7 Q 20.4 6.85 20.1 6.85 L 19.7 6.9 19.65 6.85 19.25 6.95 19.15 6.95 19 6.9 18.75 6.9 18.75 6.85 18.7 6.85 18.75 6.75 18.65 6.65 17.9 6.75 17.6 6.7 17.2 6.7 17.45 6.55 17.6 6.3 17.6 6.15 17.55 6.15 17.55 6.1 17.35 6.1 17.15 6.2 17.1 6.2 16.95 6.35 16.75 6.5 16.65 6.55 16.65 6.6 16.6 6.6 16.45 6.75 16.25 6.8 16.05 7.2 15.9 7.65 15.9 7.8 16.05 7.9 15.8 8.05 15.25 7.8 15.2 7.85 15.2 7.7 15.25 7.7 15.25 7.65 15.45 7.6 15.55 7.5 15.55 7.25 15.5 7.05 15.55 6.95 15.75 6.85 15.8 6.9 15.8 6.8 15.85 6.8 16 6.2 16.25 5.6 Q 16.3 6.05 16.65 6.05 L 17 5.95 17.1 5.8 17.3 5.7 17.3 5.75 18 5.35 18.05 5.4 Q 18.4 5.1 18.65 5.1 L 18.9 5.1 19.05 5.15 19.05 5.2 19.85 5.35 19.9 5.3 20.2 5.7 20.6 5.9 21.4 6.5 21.75 6.85 21.5 7.1 21.35 7.45 21.75 7.8 21.7 8 21.6 7.95 21.6 7.9 21.4 7.8 21.4 7.85 21.1 7.9 21.05 7.85 20.35 8 20 7.9 20.3 7.9 20.35 7.85 20.4 7.9 20.95 7.75 20.9 7.7 21 7.7 21 7.65 21.05 7.6 21.05 7.5 21.1 7.5 20.85 7.3 20.05 7.5 20 7.45 19.75 7.6 19.7 7.8 19.45 7.6 19.25 7.55 18.8 7.35 19.6 7.35 20.25 7.2 20.35 7.1 M 20.35 9.05 L 20.35 9 20.45 9 20.55 8.95 20.5 9.05 20.45 9 20.35 9.1 20.2 9.3 20.2 9.45 20.35 9.65 20.4 9.9 19.9 10.75 19.3 11.45 19.25 11.45 18.9 11.7 18.3 11.9 17.95 11.55 17.65 11.15 17.75 11.1 17.85 11.1 18.35 10.95 18.8 10.7 18.75 10.65 18.8 10.6 18.7 10.45 18.6 10.35 18.55 10.4 18.45 10.35 18.45 10.4 18.4 10.4 18.35 10.35 17.95 10.45 17.6 10.6 17.75 10.3 Q 17.75 10.05 17.45 10.05 L 17.3 10.1 17.25 9.9 17.25 9.85 Q 17.25 9.1 16.75 9.1 L 16.45 9.1 16.45 8.65 16.4 8.45 16.2 7.9 16.4 7.5 16.85 7.15 17.05 7.2 17.55 7.2 19.55 8.25 19.55 8.2 Q 19.75 8.45 20.15 8.5 L 20.1 8.65 20.1 8.9 20.35 9.05 M 21.35 8.65 L 21.3 8.7 21.3 8.5 21.7 8.25 21.75 8.3 21.4 8.65 21.4 8.6 21.35 8.7 21.35 8.65 M 20.75 10.4 L 20.8 10.6 20.9 10.8 20.85 11.1 20.6 11.7 20.1 12.4 20.05 12.35 19.9 12.55 19.95 12.6 19.9 12.6 19.85 12.55 19.85 12.6 19.8 12.65 19.65 12.55 19.55 12.45 19.35 12.2 19.4 12.1 19.4 12.05 19.45 12.05 19.85 11.65 19.85 11.6 19.9 11.55 20.75 10.4 M 22.45 10.7 L 22.5 10.7 22.55 10.75 23.05 10.6 Q 23.15 10.4 23.4 10.4 L 23.45 10.45 23.55 10.4 23.6 10.45 23.6 10.4 23.7 10.4 23.7 10.45 23.75 10.45 23.75 10.4 Q 24.25 10.4 24.75 11.3 L 25.1 12.35 25.1 12.3 25.35 12.6 27.25 15.95 27.2 16.15 27.05 16.3 27 16.25 27 16.35 26.95 16.35 Q 26.7 16.6 25.85 16.85 L 25.85 16.8 25.8 16.8 24.2 17.15 24.15 17.15 23.5 17.25 23.3 17.25 23.15 17.3 22.85 17.3 22.75 16.55 22.3 15.95 22.4 15.9 22.4 15.95 23.55 15.55 23.5 15.55 23.8 15.45 24 15.35 24.05 15.35 25.2 15 25.65 15 25.9 14.75 25.85 14.65 25.75 14.5 25.75 14.55 Q 25.65 14.4 25.35 14.4 L 25.35 14.3 25.3 14.15 25.2 14.1 24.95 14.05 24.8 14.1 24.75 14.1 24.6 14 24.45 14 24.15 14.2 23.85 14.3 23.7 14 23.1 13.3 22.95 12.7 22.85 12.7 22.55 12.95 22.4 12.85 22.25 12.85 22.15 12.95 22.15 13.05 Q 22.15 13.4 22.95 14.15 L 23.65 14.85 23.6 14.9 21.95 15.5 21.6 15.75 21.45 15.65 21.45 15.7 21 15.6 21 15.65 20.7 15.55 20.65 15.6 20.05 15.6 19.85 15.65 19.8 15.6 19.2 15.8 19.2 15.85 19.15 15.85 19.15 15.9 18.85 16.1 18.6 15.75 18.55 15.65 18.5 15.7 18.15 15.25 18.1 15.3 18.05 15.2 18 15.2 18 15.25 17.85 15.2 17.65 15.35 17.7 15.5 17.8 15.65 17.8 15.6 17.9 15.65 17.9 15.75 17.35 15.9 17 16.2 Q 16.55 16.4 16.55 16.7 L 16.55 16.75 16.8 16.75 16.8 16.7 17 16.6 17.05 16.65 15.95 17.9 15.9 17.9 15.8 18.05 15.65 18.2 15.65 18.15 Q 15.55 18.35 15 18.45 L 14.45 18.7 13.8 19.2 12.4 19.8 11.85 20.1 11.85 20.15 11.7 20.2 11.3 19.45 11 19.05 11.4 18.75 11.45 18.8 11.45 18.75 11.85 18.65 12.6 18.1 12.65 18.1 12.65 18.05 13 17.9 12.95 17.85 13.3 17.7 13.65 17.45 13.7 17.45 13.9 17.35 13.95 17.5 14.05 17.6 14.25 17.6 14.4 17.4 14.55 17.25 14.6 17.25 14.6 17.2 14.7 17.05 14.85 16.4 Q 14.8 16.2 14.9 16.2 L 14.9 16.15 15 16.15 14.95 16.1 15.3 15.85 15.5 15.55 15.8 14.75 17 13 17.3 12.85 17.45 12.65 17.55 12.65 Q 17.55 12.55 18.05 12.4 L 18.2 12.45 18.45 12.45 18.5 12.4 18.5 12.45 18.6 12.45 18.65 12.6 19 13 19.5 13.4 19.55 13.5 19.55 13.45 19.6 13.55 19.6 13.5 19.8 13.55 20.85 12.75 20.85 12.8 21.25 12.05 21.55 11.2 21.55 10.95 Q 21.6 10.9 21.8 10.8 L 22 10.75 22.05 10.8 22.15 10.75 22.45 10.75 22.45 10.7 M 20.35 16 L 20.4 16 20.45 16.05 20.5 16 20.6 16.05 20.6 16 21.2 16.1 21.6 16.5 21.85 17.2 21.85 17.25 21.35 17.25 21.3 17.3 Q 21.15 17.35 20.75 17.55 L 20.1 17.8 20.1 17.75 20.05 17.75 20 17.8 19.95 17.75 19.9 17.8 19.85 17.8 19.85 17.75 19.55 17.75 19.3 17.8 19.05 17.9 18.8 17.8 18.8 17.85 18.7 17.85 18.5 17.8 18.4 17.65 18.55 17.15 Q 18.7 16.9 18.85 16.95 19.55 16 20.25 16 L 20.35 16.05 20.35 16 M 17.2 10.6 L 17.3 10.65 17.5 10.6 17.35 10.8 17.2 10.6 M 25.35 17.55 L 25.45 17.7 25.7 17.85 25.9 18.15 25.55 18.5 24.7 18.65 24.4 18.8 24.4 18.75 23.85 19.1 23.6 19.2 23.3 19.25 23.05 19.25 22.25 18.9 22 18.9 21.95 19.05 22.05 19.3 22 19.3 22 19.35 21.2 19.5 20.7 19.4 20.65 19.25 20.65 19.1 20.7 18.95 20.75 18.85 20.75 18.8 20.7 18.8 20.8 18.5 20.8 18.35 20.75 18.3 20.65 18.25 20.55 18.25 20.4 18.3 20.4 18.2 20.5 18.15 20.6 18.2 20.6 18.15 20.75 18.1 Q 21.15 17.8 21.3 17.8 L 21.35 17.85 Q 21.4 17.75 21.5 17.75 L 21.55 17.8 21.65 17.7 21.85 17.85 22.6 17.85 22.65 17.8 22.65 17.85 22.75 17.75 23.2 17.8 23.55 17.8 23.85 17.75 23.95 17.8 23.95 17.75 25.2 17.5 25.35 17.55 M 24.45 19.4 L 25.05 19.1 25.8 19 25.8 18.95 25.95 18.95 26.25 19.6 26.2 19.65 26.25 19.65 26.35 20.05 26.4 20.05 26.5 20.3 26.55 20.55 26.55 21.25 26.25 23.05 26.25 23.25 26.2 23.25 26.2 23.3 26.25 23.3 26.25 23.4 25.8 23.3 25.6 23.3 25.5 23.25 25.15 23.25 24.65 23.45 24.95 23.7 25.2 23.7 25.45 23.75 25.3 23.85 25.25 23.8 25.2 24 25.25 24.1 25.35 24.15 25.8 24.15 26.5 24.25 26.6 24.45 26.6 24.5 26.75 25.1 26.75 25.6 26.65 25.6 26.5 25.55 26.45 25.6 26.15 25.5 25.95 25.4 25.9 25.45 25.75 25.4 25.4 25.4 25.15 25.55 24.35 25.45 23.9 25.45 23.65 25.5 23.2 25.5 22.9 25.6 22.85 25.55 22.85 25.6 22.7 25.6 22.75 24.45 22.8 24.35 22.75 23.75 22.8 23.7 22.75 23.4 22.25 22.25 21.8 21.8 21.6 21.8 21.4 21.9 21.4 22.1 Q 22.05 22.75 22.05 23.15 L 21.85 23.5 21.65 23.75 21.6 23.75 21.4 23.95 21.4 24 21.25 24.1 20.55 23.75 20.5 23.75 20.4 23.7 20.3 23.6 19.25 23 19.1 23 19 22.9 18.8 22.8 18.4 22.65 18.4 22.7 17.9 22.55 18.35 22.3 18.85 21.7 19.2 21.95 19.35 21.9 19.45 21.75 19.45 21.5 19.35 21.4 19.4 21.3 19.45 21.35 19.65 21.05 19.6 20.8 19.6 20.55 Q 19.7 20.4 19.9 20.35 L 20.25 20.1 20.25 20.05 20.35 20.05 20.4 20 20.45 19.9 20.8 20 21.45 20 21.75 19.9 21.8 19.95 22.2 19.8 22.65 19.75 22.75 19.75 23.15 19.8 23.25 19.8 23.6 19.75 23.95 19.65 23.95 19.6 24.2 19.45 24.45 19.4 M 8.95 19.9 L 8.95 19.95 9 19.9 10.05 19.5 10.85 20.55 10.05 21.95 9.8 22.3 9.7 22.3 9.75 22.2 9.85 21.85 9.9 21.45 9.8 21.15 9.3 20.95 8.7 21.15 8.2 21.25 7.9 21.35 7.85 21.3 7.85 21.35 7.75 21.35 7.7 21.3 7.7 21.35 7.6 21.35 7.5 21.25 7.4 20.95 7.45 20.8 7.5 20.7 7.55 20.65 7.6 20.55 7.65 20.6 8.25 20.2 8.95 19.9 M 18.2 23.75 L 18.45 23.35 19.5 23.85 19.15 25.3 19.1 25.4 19.1 25.6 19.25 25.65 Q 19.5 25.65 20.15 24.15 L 20.65 24.55 19.5 25.65 19.45 25.6 19.45 25.7 19.4 25.7 19.35 25.9 19.55 26.05 20.05 25.9 20.5 25.5 20.55 25.6 20.5 26 20.45 25.95 20.35 26.3 20.25 26.45 20.05 26.45 19.75 26.55 19.65 26.5 19.6 26.5 19.55 26.55 19.55 26.5 19.5 26.5 19.5 26.55 19.2 26.55 18.95 26.6 18.95 26.55 18.9 26.6 18.5 26.65 18.45 26.6 18.45 26.65 18.15 26.65 18.05 26.6 18.05 26.65 18 26.65 17.75 26.55 17.7 26.6 17.65 26.6 17.4 26.25 17.35 26.05 17.5 25.4 17.5 25.45 18.2 23.75 M 21.7 24.7 L 21.8 24.7 21.95 24.75 22.2 24.7 22.2 24.85 22.15 25.1 22.15 25.9 22.25 26.05 22.1 26.15 22 26.2 21.85 26.25 21.8 26.2 21.75 26.25 21.5 26.25 21.2 26.35 20.9 26.4 21.1 25.8 21.1 25.35 21.05 25.05 21 25.1 21 25 21.15 24.85 21.4 24.85 21.45 24.8 21.45 24.85 21.5 24.8 21.7 24.7 M 25.8 26.1 L 26.1 26.1 25.9 26.65 25.8 27.25 25.8 27.45 25.9 27.45 25.85 27.5 25.9 27.5 26.6 28 26.6 28.1 26.4 28.3 26.4 28.35 25.95 28.85 25.35 29.35 24.8 29 24.3 28.55 24.3 28.45 24.25 28.45 24.2 28.4 23.85 28.15 23.85 28.1 23.9 28.05 23.9 27.85 23.65 27.05 23.6 26.6 23.6 26.5 Q 23.55 26.05 23.75 26 L 24.5 26 24.9 26.1 25.2 26.1 25.25 26.25 25.15 27.3 25.1 27.25 25.05 27.8 25.3 28.1 25.45 28.05 25.45 28 25.5 28 25.8 26.1 M 27.15 28.25 L 27.65 28.75 28 29.4 28.05 29.4 28.8 30.5 28.85 30.45 28.9 30.55 28.95 30.6 29 30.7 29.15 30.8 29.55 31.2 29.75 31.45 29.9 31.75 29.85 31.9 29.8 31.85 29.6 32.1 29.3 32.3 29 32.2 28.7 32 28.7 31.95 28.65 32 28.4 31.8 28.3 31.75 Q 26.25 30.4 26.25 30.25 L 25.8 29.75 26.25 29.3 27.15 28.2 27.15 28.25 M 25 28.6 L 24.95 28.35 24.85 28.15 24.6 28 24.4 28.05 24.35 28.2 24.4 28.5 24.5 28.6 24.6 28.75 24.75 28.85 24.95 28.85 25 28.6 M 18.9 8.5 L 18.8 8.4 18.15 8.4 Q 18 8.4 17.6 8.7 L 17.6 8.65 17.5 8.8 17.4 8.9 17.4 9.05 17.65 9.2 17.85 9.15 17.95 9.1 18 9.1 18 9.05 18.25 9.05 18.4 9 18.45 9.05 Q 18.55 8.95 18.6 8.95 L 18.65 8.95 18.85 8.85 19 8.7 18.9 8.5 Z\"/>\n\n  <path fill=\"#EB283C\" sp-part=\"shirt\" stroke=\"none\" d=\" M 27.65 28.75 L 27.15 28.25 27.15 28.2 26.25 29.3 25.8 29.75 26.25 30.25 Q 26.25 30.4 28.3 31.75 L 28.4 31.8 28.65 32 28.7 31.95 28.7 32 29 32.2 29.3 32.3 29.6 32.1 29.8 31.85 29.85 31.9 29.9 31.75 29.75 31.45 29.55 31.2 29.15 30.8 29 30.7 28.95 30.6 28.9 30.55 28.85 30.45 28.8 30.5 28.05 29.4 28 29.4 27.65 28.75 M 21.8 24.7 L 21.7 24.7 21.5 24.8 21.45 24.85 21.45 24.8 21.4 24.85 21.15 24.85 21 25 21 25.1 21.05 25.05 21.1 25.35 21.1 25.8 20.9 26.4 21.2 26.35 21.5 26.25 21.75 26.25 21.8 26.2 21.85 26.25 22 26.2 22.1 26.15 22.25 26.05 22.15 25.9 22.15 25.1 22.2 24.85 22.2 24.7 21.95 24.75 21.8 24.7 M 25.45 17.7 L 25.35 17.55 25.2 17.5 23.95 17.75 23.95 17.8 23.85 17.75 23.55 17.8 23.2 17.8 22.75 17.75 22.65 17.85 22.65 17.8 22.6 17.85 21.85 17.85 21.65 17.7 21.55 17.8 21.5 17.75 Q 21.4 17.75 21.35 17.85 L 21.3 17.8 Q 21.15 17.8 20.75 18.1 L 20.6 18.15 20.6 18.2 20.5 18.15 20.4 18.2 20.4 18.3 20.55 18.25 20.65 18.25 20.75 18.3 20.8 18.35 20.8 18.5 20.7 18.8 20.75 18.8 20.75 18.85 20.7 18.95 20.65 19.1 20.65 19.25 20.7 19.4 21.2 19.5 22 19.35 22 19.3 22.05 19.3 21.95 19.05 22 18.9 22.25 18.9 23.05 19.25 23.3 19.25 23.6 19.2 23.85 19.1 24.4 18.75 24.4 18.8 24.7 18.65 25.55 18.5 25.9 18.15 25.7 17.85 25.45 17.7 M 22.5 10.7 L 22.45 10.7 22.45 10.75 22.15 10.75 22.05 10.8 22 10.75 21.8 10.8 Q 21.6 10.9 21.55 10.95 L 21.55 11.2 21.25 12.05 20.85 12.8 20.85 12.75 19.8 13.55 19.6 13.5 19.6 13.55 19.55 13.45 19.55 13.5 19.5 13.4 19 13 18.65 12.6 18.6 12.45 18.5 12.45 18.5 12.4 18.45 12.45 18.2 12.45 18.05 12.4 Q 17.55 12.55 17.55 12.65 L 17.45 12.65 17.3 12.85 17 13 15.8 14.75 15.5 15.55 15.3 15.85 14.95 16.1 15 16.15 14.9 16.15 14.9 16.2 Q 14.8 16.2 14.85 16.4 L 14.7 17.05 14.6 17.2 14.6 17.25 14.55 17.25 14.4 17.4 14.25 17.6 14.05 17.6 13.95 17.5 13.9 17.35 13.7 17.45 13.65 17.45 13.3 17.7 12.95 17.85 13 17.9 12.65 18.05 12.65 18.1 12.6 18.1 11.85 18.65 11.45 18.75 11.45 18.8 11.4 18.75 11 19.05 11.3 19.45 11.7 20.2 11.85 20.15 11.85 20.1 12.4 19.8 13.8 19.2 14.45 18.7 15 18.45 Q 15.55 18.35 15.65 18.15 L 15.65 18.2 15.8 18.05 15.9 17.9 15.95 17.9 17.05 16.65 17 16.6 16.8 16.7 16.8 16.75 16.55 16.75 16.55 16.7 Q 16.55 16.4 17 16.2 L 17.35 15.9 17.9 15.75 17.9 15.65 17.8 15.6 17.8 15.65 17.7 15.5 17.65 15.35 17.85 15.2 18 15.25 18 15.2 18.05 15.2 18.1 15.3 18.15 15.25 18.5 15.7 18.55 15.65 18.6 15.75 18.85 16.1 19.15 15.9 19.15 15.85 19.2 15.85 19.2 15.8 19.8 15.6 19.85 15.65 20.05 15.6 20.65 15.6 20.7 15.55 21 15.65 21 15.6 21.45 15.7 21.45 15.65 21.6 15.75 21.95 15.5 23.6 14.9 23.65 14.85 22.95 14.15 Q 22.15 13.4 22.15 13.05 L 22.15 12.95 22.25 12.85 22.4 12.85 22.55 12.95 22.85 12.7 22.95 12.7 23.1 13.3 23.7 14 23.85 14.3 24.15 14.2 24.45 14 24.6 14 24.75 14.1 24.8 14.1 24.95 14.05 25.2 14.1 25.3 14.15 25.35 14.3 25.35 14.4 Q 25.65 14.4 25.75 14.55 L 25.75 14.5 25.85 14.65 25.9 14.75 25.65 15 25.2 15 24.05 15.35 24 15.35 23.8 15.45 23.5 15.55 23.55 15.55 22.4 15.95 22.4 15.9 22.3 15.95 22.75 16.55 22.85 17.3 23.15 17.3 23.3 17.25 23.5 17.25 24.15 17.15 24.2 17.15 25.8 16.8 25.85 16.8 25.85 16.85 Q 26.7 16.6 26.95 16.35 L 27 16.35 27 16.25 27.05 16.3 27.2 16.15 27.25 15.95 25.35 12.6 25.1 12.3 25.1 12.35 24.75 11.3 Q 24.25 10.4 23.75 10.4 L 23.75 10.45 23.7 10.45 23.7 10.4 23.6 10.4 23.6 10.45 23.55 10.4 23.45 10.45 23.4 10.4 Q 23.15 10.4 23.05 10.6 L 22.55 10.75 22.5 10.7 Z\"/>\n\n  <path fill=\"#D5C0AA\" stroke=\"none\" d=\" M 26.1 26.1 L 25.8 26.1 25.5 28 25.45 28 25.45 28.05 25.3 28.1 25.05 27.8 25.1 27.25 25.15 27.3 25.25 26.25 25.2 26.1 24.9 26.1 24.5 26 23.75 26 Q 23.55 26.05 23.6 26.5 L 23.6 26.6 23.65 27.05 23.9 27.85 23.9 28.05 23.85 28.1 23.85 28.15 24.2 28.4 24.25 28.45 24.3 28.45 24.3 28.55 24.8 29 25.35 29.35 25.95 28.85 26.4 28.35 26.4 28.3 26.6 28.1 26.6 28 25.9 27.5 25.85 27.5 25.9 27.45 25.8 27.45 25.8 27.25 25.9 26.65 26.1 26.1 M 24.95 28.35 L 25 28.6 24.95 28.85 24.75 28.85 24.6 28.75 24.5 28.6 24.4 28.5 24.35 28.2 24.4 28.05 24.6 28 24.85 28.15 24.95 28.35 M 18.45 23.35 L 18.2 23.75 17.5 25.45 17.5 25.4 17.35 26.05 17.4 26.25 17.65 26.6 17.7 26.6 17.75 26.55 18 26.65 18.05 26.65 18.05 26.6 18.15 26.65 18.45 26.65 18.45 26.6 18.5 26.65 18.9 26.6 18.95 26.55 18.95 26.6 19.2 26.55 19.5 26.55 19.5 26.5 19.55 26.5 19.55 26.55 19.6 26.5 19.65 26.5 19.75 26.55 20.05 26.45 20.25 26.45 20.35 26.3 20.45 25.95 20.5 26 20.55 25.6 20.5 25.5 20.05 25.9 19.55 26.05 19.35 25.9 19.4 25.7 19.45 25.7 19.45 25.6 19.5 25.65 20.65 24.55 20.15 24.15 Q 19.5 25.65 19.25 25.65 L 19.1 25.6 19.1 25.4 19.15 25.3 19.5 23.85 18.45 23.35 M 8.95 19.95 L 8.95 19.9 8.25 20.2 7.65 20.6 7.6 20.55 7.55 20.65 7.5 20.7 7.45 20.8 7.4 20.95 7.5 21.25 7.6 21.35 7.7 21.35 7.7 21.3 7.75 21.35 7.85 21.35 7.85 21.3 7.9 21.35 8.2 21.25 8.7 21.15 9.3 20.95 9.8 21.15 9.9 21.45 9.85 21.85 9.75 22.2 9.7 22.3 9.8 22.3 10.05 21.95 10.85 20.55 10.05 19.5 9 19.9 8.95 19.95 M 20.4 16 L 20.35 16 20.35 16.05 20.25 16 Q 19.55 16 18.85 16.95 18.7 16.9 18.55 17.15 L 18.4 17.65 18.5 17.8 18.7 17.85 18.8 17.85 18.8 17.8 19.05 17.9 19.3 17.8 19.55 17.75 19.85 17.75 19.85 17.8 19.9 17.8 19.95 17.75 20 17.8 20.05 17.75 20.1 17.75 20.1 17.8 20.75 17.55 Q 21.15 17.35 21.3 17.3 L 21.35 17.25 21.85 17.25 21.85 17.2 21.6 16.5 21.2 16.1 20.6 16 20.6 16.05 20.5 16 20.45 16.05 20.4 16 M 20.8 10.6 L 20.75 10.4 19.9 11.55 19.85 11.6 19.85 11.65 19.45 12.05 19.4 12.05 19.4 12.1 19.35 12.2 19.55 12.45 19.65 12.55 19.8 12.65 19.85 12.6 19.85 12.55 19.9 12.6 19.95 12.6 19.9 12.55 20.05 12.35 20.1 12.4 20.6 11.7 20.85 11.1 20.9 10.8 20.8 10.6 M 20.45 9 L 20.5 9.05 20.55 8.95 20.45 9 M 20.35 9 L 20.35 9.05 20.1 8.9 20.1 8.65 20.15 8.5 Q 19.75 8.45 19.55 8.2 L 19.55 8.25 17.55 7.2 17.05 7.2 16.85 7.15 16.4 7.5 16.2 7.9 16.4 8.45 16.45 8.65 16.45 9.1 16.75 9.1 Q 17.25 9.1 17.25 9.85 L 17.25 9.9 17.3 10.1 17.45 10.05 Q 17.75 10.05 17.75 10.3 L 17.6 10.6 17.95 10.45 18.35 10.35 18.4 10.4 18.45 10.4 18.45 10.35 18.55 10.4 18.6 10.35 18.7 10.45 18.8 10.6 18.75 10.65 18.8 10.7 18.35 10.95 17.85 11.1 17.75 11.1 17.65 11.15 17.95 11.55 18.3 11.9 18.9 11.7 19.25 11.45 19.3 11.45 19.9 10.75 20.4 9.9 20.35 9.65 20.2 9.45 20.2 9.3 20.35 9.1 20.45 9 20.35 9 M 18.8 8.4 L 18.9 8.5 19 8.7 18.85 8.85 18.65 8.95 18.6 8.95 Q 18.55 8.95 18.45 9.05 L 18.4 9 18.25 9.05 18 9.05 18 9.1 17.95 9.1 17.85 9.15 17.65 9.2 17.4 9.05 17.4 8.9 17.5 8.8 17.6 8.65 17.6 8.7 Q 18 8.4 18.15 8.4 L 18.8 8.4 Z\"/>\n\n  <path fill=\"#CCCCFF\" sp-part=\"shorts\" stroke=\"none\" d=\" M 25.05 19.1 L 24.45 19.4 24.2 19.45 23.95 19.6 23.95 19.65 23.6 19.75 23.25 19.8 23.15 19.8 22.75 19.75 22.65 19.75 22.2 19.8 21.8 19.95 21.75 19.9 21.45 20 20.8 20 20.45 19.9 20.4 20 20.35 20.05 20.25 20.05 20.25 20.1 19.9 20.35 Q 19.7 20.4 19.6 20.55 L 19.6 20.8 19.65 21.05 19.45 21.35 19.4 21.3 19.35 21.4 19.45 21.5 19.45 21.75 19.35 21.9 19.2 21.95 18.85 21.7 18.35 22.3 17.9 22.55 18.4 22.7 18.4 22.65 18.8 22.8 19 22.9 19.1 23 19.25 23 20.3 23.6 20.4 23.7 20.5 23.75 20.55 23.75 21.25 24.1 21.4 24 21.4 23.95 21.6 23.75 21.65 23.75 21.85 23.5 22.05 23.15 Q 22.05 22.75 21.4 22.1 L 21.4 21.9 21.6 21.8 21.8 21.8 22.25 22.25 22.75 23.4 22.8 23.7 22.75 23.75 22.8 24.35 22.75 24.45 22.7 25.6 22.85 25.6 22.85 25.55 22.9 25.6 23.2 25.5 23.65 25.5 23.9 25.45 24.35 25.45 25.15 25.55 25.4 25.4 25.75 25.4 25.9 25.45 25.95 25.4 26.15 25.5 26.45 25.6 26.5 25.55 26.65 25.6 26.75 25.6 26.75 25.1 26.6 24.5 26.6 24.45 26.5 24.25 25.8 24.15 25.35 24.15 25.25 24.1 25.2 24 25.25 23.8 25.3 23.85 25.45 23.75 25.2 23.7 24.95 23.7 24.65 23.45 25.15 23.25 25.5 23.25 25.6 23.3 25.8 23.3 26.25 23.4 26.25 23.3 26.2 23.3 26.2 23.25 26.25 23.25 26.25 23.05 26.55 21.25 26.55 20.55 26.5 20.3 26.4 20.05 26.35 20.05 26.25 19.65 26.2 19.65 26.25 19.6 25.95 18.95 25.8 18.95 25.8 19 25.05 19.1 Z\"/>\n\n  <path fill=\"#FFFFFF\" stroke=\"none\" d=\" M 17.3 10.65 L 17.2 10.6 17.35 10.8 17.5 10.6 17.3 10.65 Z\"/>\n\n  <path fill=\"#7E4839\" stroke=\"none\" d=\" M 21.3 8.7 L 21.35 8.65 21.35 8.7 21.4 8.6 21.4 8.65 21.75 8.3 21.7 8.25 21.3 8.5 21.3 8.7 M 20.4 7 L 20.35 7.1 20.25 7.2 19.6 7.35 18.8 7.35 19.25 7.55 19.45 7.6 19.7 7.8 19.75 7.6 20 7.45 20.05 7.5 20.85 7.3 21.1 7.5 21.05 7.5 21.05 7.6 21 7.65 21 7.7 20.9 7.7 20.95 7.75 20.4 7.9 20.35 7.85 20.3 7.9 20 7.9 20.35 8 21.05 7.85 21.1 7.9 21.4 7.85 21.4 7.8 21.6 7.9 21.6 7.95 21.7 8 21.75 7.8 21.35 7.45 21.5 7.1 21.75 6.85 21.4 6.5 20.6 5.9 20.2 5.7 19.9 5.3 19.85 5.35 19.05 5.2 19.05 5.15 18.9 5.1 18.65 5.1 Q 18.4 5.1 18.05 5.4 L 18 5.35 17.3 5.75 17.3 5.7 17.1 5.8 17 5.95 16.65 6.05 Q 16.3 6.05 16.25 5.6 L 16 6.2 15.85 6.8 15.8 6.8 15.8 6.9 15.75 6.85 15.55 6.95 15.5 7.05 15.55 7.25 15.55 7.5 15.45 7.6 15.25 7.65 15.25 7.7 15.2 7.7 15.2 7.85 15.25 7.8 15.8 8.05 16.05 7.9 15.9 7.8 15.9 7.65 16.05 7.2 16.25 6.8 16.45 6.75 16.6 6.6 16.65 6.6 16.65 6.55 16.75 6.5 16.95 6.35 17.1 6.2 17.15 6.2 17.35 6.1 17.55 6.1 17.55 6.15 17.6 6.15 17.6 6.3 17.45 6.55 17.2 6.7 17.6 6.7 17.9 6.75 18.65 6.65 18.75 6.75 18.7 6.85 18.75 6.85 18.75 6.9 19 6.9 19.15 6.95 19.25 6.95 19.65 6.85 19.7 6.9 20.1 6.85 Q 20.4 6.85 20.4 7 Z\"/>\n</g>\n";

Asserts.sp_svg_assert_trash_icon = "<g id=\"sp_svg_assert_trash_icon\" sp-selector-box-close-button=\"true\" opacity=\"1\" fill-opacity=\"1\" stroke-opacity=\"1\"  stroke=\"#FFF\" stroke-width=\"1\">\n<rect opacity=\"0\" width=\"22\" height=\"22\"/>\n<circle fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" cx=\"11\" cy=\"11\" r=\"10\"/>\n<g>\n\t<path d=\"M14.9,6.5l0.6,0.6L11.6,11l3.9,3.9l-0.6,0.6L11,11.6l-3.9,3.9l-0.6-0.6l3.9-3.9L6.5,7.1l0.6-0.6l3.9,3.9L14.9,6.5z\"/>\n</g>\n<g>";

var Asserts;
exports.Asserts = Asserts;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('./snapextra.js');

var _utilsJs = require('./utils.js');

var Utils = _interopRequireWildcard(_utilsJs);

var _setupJs = require('./setup.js');

// import {importDatas} from './import_data.js';

var _editorDrawJs = require('./../editor/draw.js');

var EditorCanvas = (function () {
  function EditorCanvas(version, domElement, editor) {
    _classCallCheck(this, EditorCanvas);

    this.version = version;
    this.editor = editor || {};
    this.activeCursor = _setupJs.EditorSetup.cursors.select;
    this.hasArrowHead = true;
    this.elementSelected = false;
    this.fields = _setupJs.EditorSetup.fields;
    this.activeField = _setupJs.EditorSetup.fields[this.editor.field || 'birds_eyeview'];
    this.activeDrawColor = _setupJs.EditorSetup.colors[_setupJs.EditorSetup.colors.length - 1];
    this.activePlayerColor = _setupJs.EditorSetup.playerColors[0];
    this.activeAssert = null;
    this.activeAssertData = null;
    this.activeDrawThickness = _setupJs.EditorSetup.thickness[0];
    this.activeArrowHead = _setupJs.EditorSetup.arrowHeads[0]['key'];

    this.s = Snap(domElement);
    this.assertSVG = Snap('#svgIconAsserts');
    this.tempSVG = Snap('#spTempSVG');
    this._field = null;
  }

  _createClass(EditorCanvas, [{
    key: 'parseAndLoad',
    value: function parseAndLoad(svg) {
      var _this = this;

      var q = new Promise.Deferred();

      this._field = this.tempSVG.select('[sp-field-bg]');
      if (!this._field) {
        this._field = this.createField();
      } else {
        this.activeField = _setupJs.EditorSetup.fields[this._field.attr('sp-field-bg')];
        this._field = this.s.add(this._field);
      }

      this.tempSVG.selectAll('[sp-handler]').forEach(function (el, i) {
        var _handler = _setupJs.EditorSetup.cursors[el.attr('sp-handler')].handler;
        _handler.loadElement(_this, _this.s, el);
      });

      q.resolve();
      return q.promise;
    }
  }, {
    key: 'clear',
    value: function clear() {
      // this.s.selectAll('[sp-cloneable]').remove();
      this.s.clear();
      this.createField();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var q = new Promise.Deferred();
      q.resolve();
      return q.promise;
    }
  }, {
    key: 'draw',
    value: function draw() {
      var _this2 = this;

      var svg = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var q = new Promise.Deferred();

      this.parseAndLoad(svg).then(function () {
        _this2.s.smartClick(function (evnt) {
          _this2.onClick(evnt);
        });

        _this2.s.drag(function (x, y, dx, dy, evnt) {
          Utils.fixEventObject(evnt, _this2.s.node);
          _this2.activeCursor.handler.onDrawMove(_this2, _this2.s, x, y, dx, dy, evnt);
        }, function (x, y, evnt) {
          Utils.fixEventObject(evnt, _this2.s.node);
          _this2.activeCursor.handler.onDrawStart(_this2, _this2.s, x, y, evnt);
        }, function (evnt) {
          Utils.fixEventObject(evnt, _this2.s.node);
          _this2.activeCursor.handler.onDrawEnd(_this2, _this2.s, null, null, evnt);
        });

        // this._field.node.onload = ()=>{
        //   q.resolve();
        // };
        //
        // this._field.node.onerror = (err)=>{
        //   console.log('Error loading Field', err);
        //   q.reject();
        // }

        q.resolve();
      });

      return q.promise;
    }
  }, {
    key: 'resizeEditor',
    value: function resizeEditor() {
      if (!this.activeField) {
        return;
      }

      var w = this.activeField.width + 'px';
      var h = this.activeField.height + 'px';

      this.s.node.setAttribute('width', w);
      this.s.node.setAttribute('height', h);

      this.tempSVG.node.setAttribute('width', w);
      this.tempSVG.node.setAttribute('height', h);

      var can = document.getElementById('convertCanvas');
      can.setAttribute('width', w);
      can.setAttribute('height', h);
    }
  }, {
    key: 'createField',
    value: function createField() {
      var field = this.s.g();
      field.attr({ 'sp-field-bg': this.activeField.key, 'sp-cloneable': true });

      var _def = this.assertSVG.select(this.activeField.url());
      var bg = field.use(_def);
      bg.attr({ 'sp-field-bg-use': true });

      this.resizeEditor();
      return field;
    }
  }, {
    key: 'updateField',
    value: function updateField() {
      if (this._field == null) {
        return;
      }

      this.s.select('[sp-field-bg]').attr({ 'sp-field-bg': this.activeField.key });
      var bg = this.s.select('[sp-field-bg-use]');
      var _pname = 'xlink:href';
      if (!bg.attr(_pname)) {
        _pname = 'href';
      }
      var attrs = {};
      attrs[_pname] = this.activeField.url();
      bg.attr(attrs);

      this.resizeEditor();
    }
  }, {
    key: 'onClick',
    value: function onClick(evnt) {
      var srcElementOffset = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      Utils.fixEventObject(evnt, this.s.node);
      this.activeCursor.handler.onClick(this, this.s, evnt, srcElementOffset);
    }
  }, {
    key: 'setActiveCursor',
    value: function setActiveCursor(cursor) {

      if (cursor.key != this.activeCursor.key) {
        this.activeAssert = null;
        this.activeAssertData = null;

        if (this.activeCursor) {
          _setupJs.EditorSetup.cursors[this.activeCursor.key].handler.onCursorInactive(this, this.s, cursor);
        }

        this.activeCursor = cursor;
        _setupJs.EditorSetup.cursors[this.activeCursor.key].handler.onCursorActive(this, this.s, cursor);

        if (cursor.defaultColorIndex != null) {
          this.activeDrawColor = _setupJs.EditorSetup.colors[cursor.defaultColorIndex];
        }

        this.hasArrowHead = false;
        this.activeArrowHead = _setupJs.EditorSetup.arrowHeads[cursor.defaultArrowHeadIndex]['code'];
        if (cursor.hasArrowHead) {
          this.hasArrowHead = true;
        }
      }
    }
  }, {
    key: 'drawForCursor',
    value: function drawForCursor(cursorKey, evnt) {
      Utils.fixEventObject(evnt);
      this.setActiveCursor(_setupJs.EditorSetup.cursors[cursorKey]);
      this.activeCursor.handler.drawDefault(this, this.s, evnt);
    }
  }, {
    key: 'chooseAssertHandler',
    value: function chooseAssertHandler(assert) {
      // this.activeCursor = EditorSetup.cursors.assert;
      this.setActiveCursor(_setupJs.EditorSetup.cursors.stuff);
      this.activeAssert = assert;
    }
  }, {
    key: 'chooseLabelHandler',
    value: function chooseLabelHandler(id, text) {
      this.setActiveCursor(_setupJs.EditorSetup.cursors.label);
      this.activeAssert = id;
      this.activeAssertData = { text: text };
    }
  }, {
    key: 'chooseLabelHandlerById',
    value: function chooseLabelHandlerById(idText) {
      var _idText$split = idText.split('_');

      var _idText$split2 = _slicedToArray(_idText$split, 2);

      var id = _idText$split2[0];
      var text = _idText$split2[1];

      this.chooseLabelHandler(id, text);
    }
  }, {
    key: 'deleteActiveElement',
    value: function deleteActiveElement() {
      if (this.activeCursor && this.activeCursor.handler) {
        this.activeCursor.handler.deleteActiveElement(this, this.s);
      }
    }
  }, {
    key: 'moveActiveElement',
    value: function moveActiveElement(direction, faster, evnt) {
      if (faster === undefined) faster = false;

      if (this.activeCursor && this.activeCursor.handler) {
        this.activeCursor.handler.moveActiveElement(this, this.s, direction, faster);
      }
    }
  }]);

  return EditorCanvas;
})();

exports.EditorCanvas = EditorCanvas;

var EditorDriective = (function () {
  function EditorDriective() {
    _classCallCheck(this, EditorDriective);

    this.restrict = 'EA';
    // this.scope = {
    //   'spDrill': '=',
    // }
  }

  _createClass(EditorDriective, [{
    key: 'link',
    value: function link(scope, element, attr) {}
  }, {
    key: 'controller',
    value: function controller($scope, $rootScope, $element, $document, config, $timeout, hotkeys) {
      var editor = new EditorCanvas(config.editorVersion, $element[0]);
      _setupJs.EditorSetup.activeEditor = editor;

      $scope.editorSetup = _setupJs.EditorSetup;
      $scope.editor = editor;
      $scope.OptionalFieldIdx = null;

      $scope.selectCursor = function ($event, key) {
        editor.setActiveCursor(_setupJs.EditorSetup.cursors[key]);
        if (editor.activeCursor.key == "curve" || editor.activeCursor.key == "line" || editor.activeCursor.key == "dashline" || editor.activeCursor.key == "dotline") {
          editor.activeArrowHead = 'head';
        } else {
          editor.activeArrowHead = 'none';
        }

        // editor.activeCursor = EditorSetup.cursors[key];
      };

      $scope.$watch('editor.activeField', function () {
        if (!editor.activeField) {
          return;
        }

        editor.updateField();
        var activeKey = editor.activeField.key;
        var inArray = false;
        var opFldIdx = null;
        for (var i = 0; i < _setupJs.EditorSetup.fieldsOrder.length; i++) {
          // console.log(EditorSetup.fieldsOrder[i].key+" == "+activeKey);
          if (_setupJs.EditorSetup.fieldsOrder[i].key == activeKey) {
            inArray = true;
            opFldIdx = i + 1;
            if (opFldIdx >= _setupJs.EditorSetup.fieldsOrder.length) {
              opFldIdx = 0;
            } else {
              opFldIdx = opFldIdx;
            }
          }
        }
        $scope.OptionalFieldIdx = opFldIdx;
      });

      $scope.onAssertDrop = function (name, evnt, srcOffsetX, srcOffsetY) {
        var _name$split = name.split(',');

        var _name$split2 = _slicedToArray(_name$split, 2);

        var assertName = _name$split2[0];
        var handler = _name$split2[1];

        editor[handler](assertName, evnt);
        editor.onClick(evnt, { x: srcOffsetX + 1, y: srcOffsetY });
        editor.setActiveCursor(_setupJs.EditorSetup.cursors.select);
      };

      hotkeys.add({
        combo: ['del', 'd'],
        description: 'Delete the selected object',
        callback: function callback(e) {
          editor.deleteActiveElement();
        }
      });

      hotkeys.add({
        combo: 'shift+s',
        description: 'Save the Drill',
        callback: function callback(e) {
          $rootScope.saveDrill();
        }
      });

      hotkeys.add({
        combo: 'shift+i',
        callback: function callback(e) {
          //THIS IS FOR DEBUGGING PURPOSE. TO SEE WHATS IN TEMP SVG AND CANVAS

          $document.find('#tempDrawHolder').addClass('debug');

          (0, _editorDrawJs.CreateCanvasElement)('convertCanvas', true).then(function (data) {
            var canvas = data.canvas;
            var imageData = data.imageData;
            var imageDataBlack = data.imageDataBlack;
            var svgText = data.svgText;

            // console.log('svgText', svgText);
          });
        }
      });

      var directions = ['up', 'down', 'right', 'left'];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function () {
          var d = _step.value;

          hotkeys.add({
            combo: d,
            description: 'Move ' + d + ' the selected object',
            callback: function callback(e) {
              e.preventDefault();
              editor.moveActiveElement(d, false, e);
            }
          });

          hotkeys.add({
            combo: 'shift+' + d,
            description: 'Move ' + d + ' the selected object faster',
            callback: function callback(e) {
              e.preventDefault();
              editor.moveActiveElement(d, true, e);
            }
          });
        };

        for (var _iterator = directions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      hotkeys.add({
        combo: 'alt+s',
        description: 'Activate Select and Drag tool',
        callback: function callback(e) {
          editor.setActiveCursor(_setupJs.EditorSetup.cursors.select);
        }
      });

      hotkeys.add({
        combo: 'alt+p',
        description: 'Activate pen tool',
        callback: function callback(e) {
          editor.setActiveCursor(_setupJs.EditorSetup.cursors.pen);
        }
      });

      editor.setup().then(function () {
        return editor.draw();
      }).then(function () {

        // ===== EXAMPLE: HOW DRAW WORKS ===== //
        // importDatas(editor);
        // editor.setActiveCursor(EditorSetup.cursors.pen);
        // editor.activeCursor.handler.draw(editor, editor.s, 300, 300,
        //   [ [10, -9], [20, 21], [-40, 25] ]
        // );
        //
        // editor.setActiveCursor(EditorSetup.cursors.line);
        // editor.activeCursor.handler.draw(editor, editor.s, 250, 100,
        //   [ [40, 25] ]
        // );
        //
        // editor.setActiveCursor(EditorSetup.cursors.triangle);
        // editor.activeCursor.handler.draw(editor, editor.s, 100, 100,
        //   [ [40, 50] ]
        // );
        //
        // editor.chooseAssertHandler('player_black_walk_right');
        // editor.activeCursor.handler.draw(editor, editor.s, 159, 140);
        //
        // editor.chooseAssertHandler('post_post_side_left');
        // editor.activeCursor.handler.draw(editor, editor.s, 400, 140);
        //
        // editor.setActiveCursor(EditorSetup.cursors.shape);
        // editor.activeCursor.handler.draw(editor, editor.s, 360, 160,
        //   [ [80, 40] ]
        // );
        //
        // editor.chooseLabelHandler('letter_Text Here', 'Text Here');
        // editor.activeCursor.handler.draw(editor, editor.s, 260, 260);
        //
        // editor.setActiveCursor(EditorSetup.cursors.select);

        // Sample Player
        // editor.activeField = editor.fields['half_long_bleachers'];
        // editor.chooseAssertHandler('player_black_walk_right');
        // editor.onClick({clientX:100, clientY:100});

        //Curve test
        // editor.activeField = editor.fields['cricle'];
        // editor.setActiveCursor(EditorSetup.cursors.curve);
        //
        // let _d = 190;
        // let _points = [
        //   [_d, 0],           [0, _d],            [-1*_d, 0], [0, -1*_d],
        //   [_d, _d],         [-1*_d, -1*_d],
        //   [_d, -1*_d],    [-1*_d, _d],
        //
        //   // [10, _d],  [10, -1*_d],
        // ]
        //
        // for(let _xy of _points){
        //   editor.activeCursor.handler.draw(editor, editor.s, 580/2, 450/2,
        //     [ _xy ]
        //   );
        // }
        //
        // editor.activeDrawColor = EditorSetup.colors[3];
        // for(let [_x,_y] of _points){
        //   editor.activeCursor.handler.draw(editor, editor.s, (580/2)+_x, (450/2)+_y,
        //     [ [_x*-1, _y*-1] ]
        //   );
        // }

        // ===== EXAMPLE END ===== //

        editor.setActiveCursor(_setupJs.EditorSetup.cursors.select);
        $scope.$digest();
      }, function () {
        console.log('Error drawing');
      });
    }
  }]);

  return EditorDriective;
})();

exports.EditorDriective = EditorDriective;

},{"./../editor/draw.js":9,"./setup.js":11,"./snapextra.js":12,"./utils.js":13}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _get = function get(_x13, _x14, _x15) { var _again = true; _function: while (_again) { var object = _x13, property = _x14, receiver = _x15; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x13 = parent; _x14 = property; _x15 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _editorSetupJs = require('./../editor/setup.js');

var _editorAssertsJs = require('./../editor/asserts.js');

var _editorUtilsJs = require('./../editor/utils.js');

var Utils = _interopRequireWildcard(_editorUtilsJs);

var DrawHandler = (function () {
  function DrawHandler(s) {
    _classCallCheck(this, DrawHandler);

    this.activeElement = null;
    this.activeMainElement = null;
    this.dragInProgress = false;
    this.selected = false;
    this.drawByDrag = true;
    this.start = { x: 0, y: 0 };
    this.disableSelectBox = false;
    this.disableAnimation = false;
    this.hasEndCircle = false;
    this.activeEndCirleElement = null;
  }

  _createClass(DrawHandler, [{
    key: 'onSetup',
    value: function onSetup(canvas, s) {}
  }, {
    key: 'onClick',
    value: function onClick(canvas, s, evnt) {
      var srcElementOffset = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
    }
  }, {
    key: 'onDrag',
    value: function onDrag(canvas, s, evnt) {}
  }, {
    key: 'onDrawMove',
    value: function onDrawMove(canvas, s, x, y, dx, dy) {}
  }, {
    key: 'onDrawStart',
    value: function onDrawStart(canvas, s, x, y) {}
  }, {
    key: 'onDrawEnd',
    value: function onDrawEnd(canvas, s, x, y) {}
  }, {
    key: 'onDragMove',
    value: function onDragMove(canvas, s, ele, ox, oy, dx, dy, evnt) {
      this.doPrespectiveScale(canvas, s, ele);
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(canvas, s, ele, x, y, evnt) {}
  }, {
    key: 'onDragEnd',
    value: function onDragEnd(canvas, s, ele, x, y, evnt) {}
  }, {
    key: 'doPrespectiveScale',
    value: function doPrespectiveScale(canvas, s, ele, ox, oy, dx, dy, evnt) {
      var isScale = ele.attr('sp-perspective-scale') + '' == 'true';
      var box = s.getBBox();

      if (!box.width) {
        box.width = 845;
      }
      if (!box.height) {
        box.height = 449;
      }

      var w = box.width;
      var h = box.height;

      if (canvas.activeField.perspectiveScale && isScale) {

        var ebox = ele.getBBox();
        var x = ebox.x;
        var y = ebox.y;

        if (ox) {
          x = ox;
          y = oy;
        }
        // var [x, y] = [ox, oy];
        // if(evnt){
        //   [x, y] = [evnt._sp_offsetX, evnt._sp_offsetY];
        // }
        //
        // console.log(ebox.x, x, ebox.y, y);

        var minSize = .6;
        var varientSizeRatio = .5;

        var sx = x / w;
        var sy = y / h;

        // sy = Math.min(1, minSize + (Math.max(0.1, sy) / 2) );
        sy = Math.min(1.3, .8 + varientSizeRatio * sy);
        ele.fixedScaleWH(sy, sy);
      }
    }
  }, {
    key: 'onSelect',
    value: function onSelect(canvas, s, ele, evnt) {
      var _this = this;

      if (this.selected) {
        return;
      }

      if (this.disableSelectBox) {
        return;
      }

      this.activeElement = ele;
      this.activeMainElement = ele.select('[sp-main]');
      this.selected = true;

      var _getSelectorBox = this.getSelectorBox(canvas, s, ele);

      var _getSelectorBox2 = _slicedToArray(_getSelectorBox, 4);

      var x = _getSelectorBox2[0];
      var y = _getSelectorBox2[1];
      var w = _getSelectorBox2[2];
      var h = _getSelectorBox2[3];

      var rect = ele.rect(x, y, w, h);
      rect.attr({ 'sp-selector-box': true });
      rect.attr({
        'stroke-dasharray': '4, 10',
        'fill': 'transparent',
        'stroke-width': '2px',
        'stroke': 'rgba(255, 255, 255, 0.42)' });

      var grp = ele.g();
      grp.translateXY(w + x, y);
      // if(this.key == "line" || this.key == "pen" || this.key == "curve" || this.key == "dashline" || this.key == "dotline" || this.key == "path"){
      //   grp.translateXY(0, 0);
      // }
      // else if(this.key == "triangle"){
      //   grp.translateXY((w/2), 0);
      // }
      // else{
      //   grp.translateXY(w, 0);
      // }

      grp.attr({ 'sp-selector-box-close-button': true });
      grp.attr({ 'opacity': 1, 'stroke-dasharray': '0px 0px' });

      var icon = canvas.assertSVG.select('#sp_svg_assert_trash_icon');
      grp.smartClick(function (evnt) {
        _this.deleteActiveElement(canvas, s);
      });
      grp.use(icon);
    }
  }, {
    key: 'onUnselect',
    value: function onUnselect(canvas, s, ele, newEle, evnt) {
      if (ele) {
        ele.selectAll('[sp-selector-box-close-button]').remove();
        ele.selectAll('[sp-selector-box]').remove();
        ele.selectAll('[sp-dragger-tool]').remove();
      }
      this.selected = false;
    }
  }, {
    key: 'onResizeStart',
    value: function onResizeStart(canvas, s, ele) {
      this.hideSelector(canvas, s, ele);
      this.disableDrag(canvas, s, ele);
    }
  }, {
    key: 'onResizeEnd',
    value: function onResizeEnd(canvas, s, ele) {
      this.repositionSelector(canvas, s, ele);
      this.showSelector(canvas, s, ele);
      this.enableDrag(canvas, s, ele);
    }
  }, {
    key: 'getSelectorBox',
    value: function getSelectorBox(canvas, s, ele) {
      var box = ele.getBBox();
      var x = null;
      var y = null;
      var w = null;
      var h = null;

      ele.children().forEach(function (child) {

        if (child.attr('sp-selector-box') || child.attr('sp-dragger-tool')) {
          return;
        }

        var _cbox = child.getBBox();

        if (x == null) {
          x = _cbox.x;
          y = _cbox.y;
          w = _cbox.width;
          h = _cbox.height;
        }

        x = Math.min(x, _cbox.x);
        y = Math.min(y, _cbox.y);
        w = Math.max(w, _cbox.width);
        h = Math.max(h, _cbox.height);
      });

      if (w == 0) {
        w = box.width;
      }

      if (h == 0) {
        h = box.height;
      }

      return [x, y, w, h];
    }
  }, {
    key: 'hideSelector',
    value: function hideSelector(canvas, s, ele) {
      if (!ele.select('[sp-selector-box]')) {
        return;
      }
      ele.select('[sp-selector-box]').attr({ opacity: 0 });
      ele.select('[sp-selector-box-close-button]').attr({ opacity: 0 });
    }
  }, {
    key: 'showSelector',
    value: function showSelector(canvas, s, ele) {
      if (!ele.select('[sp-selector-box]')) {
        return;
      }
      ele.select('[sp-selector-box]').attr({ opacity: 1 });
      ele.select('[sp-selector-box-close-button]').attr({ opacity: 1 });
    }
  }, {
    key: 'repositionSelector',
    value: function repositionSelector(canvas, s, ele) {
      if (!ele.select('[sp-selector-box]')) {
        return;
      }

      var _getSelectorBox3 = this.getSelectorBox(canvas, s, ele);

      var _getSelectorBox32 = _slicedToArray(_getSelectorBox3, 4);

      var x = _getSelectorBox32[0];
      var y = _getSelectorBox32[1];
      var width = _getSelectorBox32[2];
      var height = _getSelectorBox32[3];

      var selector = ele.select('[sp-selector-box]');
      selector.attr({ x: x, y: y, width: width, height: height });

      var trashIcon = ele.select('[sp-selector-box-close-button]');
      trashIcon.translateXY(-trashIcon.matrix.e, -trashIcon.matrix.f);
      trashIcon.translateXY(width + x, y);
    }
  }, {
    key: 'deleteActiveElement',
    value: function deleteActiveElement(canvas, s) {
      var ele = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var el = ele || this.activeElement;
      el.remove();
    }
  }, {
    key: 'draw',
    value: function draw(canvas, s, x, y, points) {
      if (this.drawByDrag) {
        var ele = this.onDrawStart(canvas, s, x, y, null);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var xy = _step.value;

            this.onDrawMove(canvas, s, xy[0], xy[1]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.createAndDragEnd(canvas, s, x, y, null);

        return ele;
      } else {
        var ele = this.drawElement(canvas, s, x, y, null);
        return ele;
      }
    }
  }, {
    key: 'moveActiveElement',
    value: function moveActiveElement(canvas, s, direction) {
      var faster = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
      var ele = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
      var evnt = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

      var el = ele || this.activeElement;
      var step = faster ? 10 : 5;
      el.movePossible(direction, step, true);
      this.doPrespectiveScale(canvas, s, el);
    }
  }, {
    key: 'onCursorInactive',
    value: function onCursorInactive(newCursor) {}
  }, {
    key: 'onCursorActive',
    value: function onCursorActive(newCursor) {}
  }, {
    key: 'drawDefault',
    value: function drawDefault(canvas, s, evnt) {
      console.log('draw default');
    }
  }, {
    key: 'enableDrag',
    value: function enableDrag(canvas, s, ele) {
      var _this2 = this;

      ele.drag();

      ele.drag(function (x, y, dx, dy, evnt) {
        Utils.fixEventObject(evnt, s.node);
        _this2.onDragMove(canvas, s, ele, x, y, dx, dy, evnt);
      }, function (x, y, evnt) {
        Utils.fixEventObject(evnt, s.node);
        _this2.onDragStart(canvas, s, ele, x, y, evnt);
      }, function (evnt) {
        Utils.fixEventObject(evnt, s.node);
        _this2.onDragEnd(canvas, s, ele, null, null, evnt);
      });
    }
  }, {
    key: 'disableDrag',
    value: function disableDrag(canvas, s, ele) {
      ele.undrag();
    }
  }, {
    key: 'selectElement',
    value: function selectElement(canvas, s, ele) {
      _editorSetupJs.EditorSetup.cursors.select.handler.selectElement(canvas, s, ele);
    }
  }, {
    key: 'attachAttrs',
    value: function attachAttrs(canvas, s, ele, evnt) {
      var x = 0;
      var y = 0;

      if (evnt) {
        x = evnt._sp_offsetX;
        y = evnt._sp_offsetY;
      }
      this.start = { x: x, y: y };

      ele.attr({ 'sp-selectable': true, 'sp-handler': this.key, 'sp-cloneable': true });
      this.attachEvents(canvas, s, ele);
      this.attachMainEleAttrs(canvas, s, ele, this.activeMainElement, evnt);
    }
  }, {
    key: 'attachEvents',
    value: function attachEvents(canvas, s, ele) {
      ele.smartClick(function (evnt) {
        canvas.elementSelected = true;
        _editorSetupJs.EditorSetup.cursors.select.handler.onElementSelected(canvas, s, evnt, ele);
      });
    }
  }, {
    key: 'attachMainEleAttrs',
    value: function attachMainEleAttrs(canvas, s, ele, mele, evnt) {
      mele.attr({ 'sp-main': true });

      if (canvas.hasArrowHead && canvas.activeArrowHead && canvas.activeArrowHead != 'none') {
        if (canvas.activeArrowHead == 'head') {
          var markerId = '#sp_markerend_' + canvas.activeDrawColor.label;
          mele.attr({ markerEnd: canvas.assertSVG.select(markerId) });
          ele.attr({ 'sp-marker': markerId });
          ele.attr({ 'sp-marker-position': 'end' });
        } else {
          var markerId = '#sp_markerstart_' + canvas.activeDrawColor.label;
          mele.attr({ markerStart: canvas.assertSVG.select(markerId) });
          ele.attr({ 'sp-marker': markerId });
          ele.attr({ 'sp-marker-position': 'start' });
        }
      }
    }
  }, {
    key: 'attachStrokeAttrs',
    value: function attachStrokeAttrs(canvas, s, ele, evnt) {
      ele.attr({
        strokeWidth: canvas.activeDrawThickness.width,
        stroke: canvas.activeDrawColor.code,
        strokeLinecap: "round",
        fill: "transparent",
        'sp-stroke-width': canvas.activeDrawThickness.width
      });
    }
  }, {
    key: 'attachStrokeEvents',
    value: function attachStrokeEvents(canvas, s, ele) {
      ele.hover(function () {
        if (canvas.activeCursor.key == 'select') {
          var w = parseInt(ele.attr('sp-stroke-width'));
          if (w == 0) {
            w = 1;
          }
          ele.animate({ "strokeWidth": w * 2 }, 100);
        }
      }, function () {
        var w = parseInt(ele.attr('sp-stroke-width'));
        ele.animate({ "strokeWidth": w }, 100);
      });
    }
  }, {
    key: 'attachSizeAttrs',
    value: function attachSizeAttrs(canvas, s, ele, evnt) {
      var r = 1.1;

      ele.hover(function () {
        if (canvas.activeCursor.key == 'select') {
          var mat = ele.fixedScaleMatrixWH(r, r, true);
          ele.animate({ transform: mat }, 200);
        }
      }, function () {
        if (canvas.activeCursor.key == 'select') {
          var mat = ele.fixedScaleMatrixWH(1, 1, true);
          ele.animate({ transform: mat }, 200);
        }
      });
    }
  }, {
    key: 'createGroupElement',
    value: function createGroupElement(canvas, s, ox, oy, evnt) {
      var x = ox;
      var y = oy;

      if (evnt) {
        x = evnt._sp_offsetX;
        y = evnt._sp_offsetY;
      }

      if (x == undefined || x == null) {
        console.log('X can not be null');
      }

      var ele = s.g();
      ele.translateXY(x, y);

      return ele;
    }
  }, {
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {
      return null;
    }
  }, {
    key: 'createEndCircleElement',
    value: function createEndCircleElement(canvas, s, x, y, evnt, ele) {
      var ecele = ele.circle(0, 0, 10);
      ecele.attr({ opacity: 0 });
      return ecele;
    }
  }, {
    key: 'createElement',
    value: function createElement(canvas, s, x, y, evnt) {
      var ele = this.createGroupElement(canvas, s, x, y, evnt);
      var mele = this.createMainElement(canvas, s, x, y, evnt, ele);
      this.activeMainElement = mele;
      if (this.hasEndCircle) {
        var ecele = this.createEndCircleElement(canvas, s, x, y, evnt, ele);
        this.activeEndCirleElement = ecele;
      }
      return ele;
    }
  }, {
    key: 'loadElement',
    value: function loadElement(canvas, s, ele) {
      var el = s.add(ele);
      var aname = ele.attr('sp-assert-name');

      this.activeElement = ele;
      if (aname) {
        canvas.activeAssert = aname;
      }

      this.attachEvents(canvas, s, ele);
    }
  }, {
    key: 'drawElement',
    value: function drawElement(canvas, s, x, y, evnt) {
      var ele = this.createElement(canvas, s, x, y, evnt);
      this.attachAttrs(canvas, s, ele, evnt);
      this.activeElement = ele;
      this.doPrespectiveScale(canvas, s, ele);
      return ele;
    }
  }, {
    key: 'createAndDrag',
    value: function createAndDrag(canvas, s, x, y, evnt) {
      var ele = this.drawElement(canvas, s, x, y, evnt);
      // ele.attr({opacity: 0.5});
      return ele;
    }
  }, {
    key: 'createAndDragEnd',
    value: function createAndDragEnd(canvas, s, x, y, evnt) {
      this.activeElement.attr({ opacity: 1 });
      this.activeElement = null;
    }
  }, {
    key: 'createDraggerElement',
    value: function createDraggerElement(canvas, s, ele, x, y) {
      var enableDrag = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
      var onMove = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

      var _this3 = this;

      var onStart = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];
      var onEnd = arguments.length <= 8 || arguments[8] === undefined ? null : arguments[8];

      var radius = 4;
      var holder = ele.circle(x, y, radius);

      holder.attr({
        fill: "#1D61A5",
        stroke: "#fff",
        strokeWidth: 1,
        'stroke-dasharray': '0'
      });

      holder.attr('sp-dragger-tool', true);

      if (enableDrag) {
        holder.drag();

        holder.drag(function (dx, dy, nx, ny, ev) {
          if (onMove) {
            onMove(dx, dy, nx, ny, ev);
          }
        }, function (ox, oy, ev) {
          if (onStart) {
            onStart(ox, oy, ev);
          }
          _this3.onResizeStart(canvas, s, ele);
        }, function (ox, oy, ev) {
          if (onStart) {
            onStart(ox, oy, ev);
          }
          _this3.onResizeEnd(canvas, s, ele);
        });
      }

      return holder;
    }
  }, {
    key: 'createResizer',
    value: function createResizer(s, ele, end) {
      var _this4 = this;

      // var bbox = ele.getBBox();

      var x = ele.attr('x2');
      var y = ele.attr('y2');

      if (end == 'start') {
        x = ele.attr('x1');
        y = ele.attr('y1');
      }

      var radius = 10;

      var holder = s.circle(x, y, radius).attr({ fill: "blue" });
      holder.attr({
        fill: "#addedd",
        stroke: "#beeeef",
        strokeWidth: 4
      });
      holder.realdrag();
      holder.attr('sp-dragger-tool', true);

      holder.drag(function (dx, dy, nx, ny, ev) {
        var _bbox = holder.getBBox();
        if (end == 'end') {
          ele.attr({ x2: _bbox.x2 - radius, y2: _bbox.y2 - radius });
        } else if (end == 'start') {
          ele.attr({ x1: _bbox.x + radius, y1: _bbox.y + radius });
        }
      }, function (dx, dy) {
        _this4.dragInProgress = true;
      }, function () {
        _this4.dragInProgress = false;
      });

      return holder;
    }
  }]);

  return DrawHandler;
})();

exports.DrawHandler = DrawHandler;

var SelectDrawHandler = (function (_DrawHandler) {
  _inherits(SelectDrawHandler, _DrawHandler);

  function SelectDrawHandler(s) {
    _classCallCheck(this, SelectDrawHandler);

    _get(Object.getPrototypeOf(SelectDrawHandler.prototype), 'constructor', this).call(this, s);
    this.activeHandler = null;
  }

  _createClass(SelectDrawHandler, [{
    key: 'onClick',
    value: function onClick(canvas, s, evnt) {
      if (!canvas.elementSelected && this.activeHandler) {
        _editorSetupJs.EditorSetup.cursors[this.activeHandler].handler.onUnselect(canvas, s, this.activeElement, null, evnt);
        this.activeElement = null;
        this.activeHandler = null;
      }
      canvas.elementSelected = false;
      //this.handleSelection(canvas, s, evnt);
    }
  }, {
    key: 'onCursorInactive',
    value: function onCursorInactive(canvas, s, cursor) {
      var _this5 = this;

      s.selectAll('[sp-handler]').forEach(function (el, i) {
        var _handler = _editorSetupJs.EditorSetup.cursors[el.attr('sp-handler')].handler;
        _handler.disableDrag(canvas, s, el);
        _handler.onUnselect(canvas, s, _this5.activeElement, null, null);
      });
    }
  }, {
    key: 'onCursorActive',
    value: function onCursorActive(canvas, s, cursor) {
      s.selectAll('[sp-handler]').forEach(function (el, i) {
        _editorSetupJs.EditorSetup.cursors[el.attr('sp-handler')].handler.enableDrag(canvas, s, el);
      });
    }
  }, {
    key: 'onElementSelected',
    value: function onElementSelected(canvas, s, evnt, ele) {
      if (canvas.activeCursor.key != 'select') {
        return;
      }

      if (this.activeElement && this.activeElement.id == ele.id) {
        return;
      }

      if (this.activeElement) {
        // console.log('Removing', ele);
        _editorSetupJs.EditorSetup.cursors[this.activeHandler].handler.onUnselect(canvas, s, this.activeElement, ele, evnt);
        this.activeElement = null;
        this.activeHandler = null;
      }

      var handler = ele.attr('sp-handler');
      if (_editorSetupJs.EditorSetup.cursors[handler]) {
        this.activeElement = ele;
        this.activeHandler = handler;
        _editorSetupJs.EditorSetup.cursors[handler].handler.onSelect(canvas, s, ele, evnt);
      }
    }
  }, {
    key: 'selectElement',
    value: function selectElement(canvas, s, ele) {
      this.onElementSelected(canvas, s, null, ele);
    }
  }, {
    key: 'deleteActiveElement',
    value: function deleteActiveElement(canvas, s) {
      if (this.activeElement) {
        var _hand = _editorSetupJs.EditorSetup.cursors[this.activeHandler].handler;
        _hand.onUnselect(canvas, s, this.activeElement);
        _hand.deleteActiveElement(canvas, s, this.activeElement);
      }
    }
  }]);

  return SelectDrawHandler;
})(DrawHandler);

exports.SelectDrawHandler = SelectDrawHandler;

var PenDrawHandler = (function (_DrawHandler2) {
  _inherits(PenDrawHandler, _DrawHandler2);

  function PenDrawHandler(s) {
    _classCallCheck(this, PenDrawHandler);

    _get(Object.getPrototypeOf(PenDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'pen';
    this.hasEndCircle = true;
  }

  _createClass(PenDrawHandler, [{
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {
      return ele.path('M 0 0');
    }
  }, {
    key: 'attachAttrs',
    value: function attachAttrs(canvas, s, ele, evnt) {
      _get(Object.getPrototypeOf(PenDrawHandler.prototype), 'attachAttrs', this).call(this, canvas, s, ele, evnt);
      this.attachAdditionalAttrs(canvas, s, ele, evnt);
    }
  }, {
    key: 'attachAdditionalAttrs',
    value: function attachAdditionalAttrs(canvas, s, ele, evnt) {
      this.attachStrokeAttrs(canvas, s, ele, evnt);
    }
  }, {
    key: 'attachEvents',
    value: function attachEvents(canvas, s, ele) {
      _get(Object.getPrototypeOf(PenDrawHandler.prototype), 'attachEvents', this).call(this, canvas, s, ele);
      this.attachStrokeEvents(canvas, s, ele);
    }
  }, {
    key: 'onDrawStart',
    value: function onDrawStart(canvas, s, x, y, evnt) {
      this.createAndDrag(canvas, s, x, y, evnt);
    }
  }, {
    key: 'onDrawMove',
    value: function onDrawMove(canvas, s, x, y, dx, dy, evnt) {
      var pdata = this.activeMainElement.attr('d');
      var p = pdata + ('L ' + x + ' ' + y);
      this.activeMainElement.attr('d', p);
    }
  }, {
    key: 'onDrawEnd',
    value: function onDrawEnd(canvas, s, x, y, evnt) {
      this.createAndDragEnd(canvas, s, x, y, evnt);
    }
  }]);

  return PenDrawHandler;
})(DrawHandler);

exports.PenDrawHandler = PenDrawHandler;

var CurveDrawHandler = (function (_PenDrawHandler) {
  _inherits(CurveDrawHandler, _PenDrawHandler);

  function CurveDrawHandler(s) {
    _classCallCheck(this, CurveDrawHandler);

    _get(Object.getPrototypeOf(CurveDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'curve';
  }

  _createClass(CurveDrawHandler, [{
    key: 'onDrawMove',
    value: function onDrawMove(canvas, s, x, y, dx, dy, evnt) {

      //// Algorithm 1 = Pythagorean Theorem
      // var [ax, ay] = [Math.abs(x), Math.abs(y)];
      // var distance = Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2));
      // var radius = distance/2;
      // var [centerX, centerY ] = [x*.5, y*.5];
      // var angle = -45;
      // var angleInRadians = (angle * Math.PI) / 180.0;
      // var px = centerX + radius * Math.cos(angleInRadians);
      // var py = centerY + radius * Math.sin(angleInRadians);

      //// Algorithm 1.2 = change angle based on x, y direction
      // let [_x, _y] = [x, y];
      //
      // if(_x < 10 && _x >-10){
      //   _x = 0
      // }
      //
      // if(_y < 10 && _y >-10){
      //   _y = 0
      // }
      //
      // var angle = -45;
      // if(_y>0 && _x>0){
      //   angle = 270;
      // }
      // else if(_y<0 && _x<0){
      //   angle = 90;
      // }
      // else if(_y>0 && _x<0){
      //   angle = 90;
      // }
      // else if(_y<0 && _x>0){
      //   angle = 270;
      // }
      // else if(_y>0){
      //   angle = 135;
      // }
      // else if(_x<0){
      //   angle = 135;
      // }

      // var angleInRadians = (angle * Math.PI) / 180.0;
      // var px = centerX + radius * Math.cos(angleInRadians);
      // var py = centerY + radius * Math.sin(angleInRadians);

      // Algorithm 3 = Same as old verison
      var px = x;
      var py = 0;

      // console.log(`Drawing Angle ${angle} XY ${x},${y} PXY ${px},${py}`)
      // console.log(`Drawing XY ${x},${y} PXY ${px},${py}`)
      // var p = `M 0 0 q ${px} ${py} ${x} ${y}  L ${x} ${y} L ${px} ${py} L 0 0 L ${x} ${y}`;
      // var p = `M 0 0 q ${px} ${py} ${x} ${y} L ${x} ${y} L ${px} ${py}`;
      var p = 'M 0 0 q ' + px + ' ' + py + ' ' + x + ' ' + y;
      this.activeMainElement.attr('d', p);
    }
  }]);

  return CurveDrawHandler;
})(PenDrawHandler);

exports.CurveDrawHandler = CurveDrawHandler;

var LineDrawHandler = (function (_PenDrawHandler2) {
  _inherits(LineDrawHandler, _PenDrawHandler2);

  function LineDrawHandler(s) {
    _classCallCheck(this, LineDrawHandler);

    _get(Object.getPrototypeOf(LineDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'line';
    this.enablePointsDragger = true;
  }

  _createClass(LineDrawHandler, [{
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {
      var lele = ele.line(0, 0, 0, 0);
      return lele;
    }
  }, {
    key: 'onDrawMove',
    value: function onDrawMove(canvas, s, x, y, dx, dy, evnt) {
      this.activeMainElement.attr({ x2: x, y2: y });
      if (this.hasEndCircle) {
        if (canvas.activeArrowHead == 'head') {
          this.activeEndCirleElement.attr({ cx: x, cy: y });
        }
      }
    }
  }, {
    key: 'onSelect',
    value: function onSelect(canvas, s, ele, evnt) {
      _get(Object.getPrototypeOf(LineDrawHandler.prototype), 'onSelect', this).call(this, canvas, s, ele, evnt);
      if (!this.enablePointsDragger) {
        return;
      }

      var mele = this.activeMainElement;

      var sx = parseInt(mele.attr('x1'));
      var sy = parseInt(mele.attr('y1'));
      var ex = parseInt(mele.attr('x2'));
      var ey = parseInt(mele.attr('y2'));

      this.createDraggerElement(canvas, s, ele, sx, sy, true, function (dx, dy, nx, ny, ev) {
        mele.attr({ x1: dx + sx, y1: dy + sy });
      }, function () {
        sx = parseInt(mele.attr('x1'));
        sy = parseInt(mele.attr('y1'));
      });

      this.createDraggerElement(canvas, s, ele, ex, ey, true, function (dx, dy, nx, ny, ev) {
        mele.attr({ x2: dx + ex, y2: dy + ey });
      }, function () {
        ex = parseInt(mele.attr('x2'));
        ey = parseInt(mele.attr('y2'));
      });
    }
  }]);

  return LineDrawHandler;
})(PenDrawHandler);

exports.LineDrawHandler = LineDrawHandler;

var DashedLineDrawHandler = (function (_LineDrawHandler) {
  _inherits(DashedLineDrawHandler, _LineDrawHandler);

  function DashedLineDrawHandler(s) {
    _classCallCheck(this, DashedLineDrawHandler);

    _get(Object.getPrototypeOf(DashedLineDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'dashline';
  }

  _createClass(DashedLineDrawHandler, [{
    key: 'attachAttrs',
    value: function attachAttrs(canvas, s, line, evnt) {
      _get(Object.getPrototypeOf(DashedLineDrawHandler.prototype), 'attachAttrs', this).call(this, canvas, s, line, evnt);
      line.attr('stroke-dasharray', '15, 10');
    }
  }]);

  return DashedLineDrawHandler;
})(LineDrawHandler);

exports.DashedLineDrawHandler = DashedLineDrawHandler;

var DottedLineDrawHandler = (function (_LineDrawHandler2) {
  _inherits(DottedLineDrawHandler, _LineDrawHandler2);

  function DottedLineDrawHandler(s) {
    _classCallCheck(this, DottedLineDrawHandler);

    _get(Object.getPrototypeOf(DottedLineDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'dotline';
  }

  _createClass(DottedLineDrawHandler, [{
    key: 'attachAttrs',
    value: function attachAttrs(canvas, s, line, evnt) {
      _get(Object.getPrototypeOf(DottedLineDrawHandler.prototype), 'attachAttrs', this).call(this, canvas, s, line, evnt);
      line.attr('stroke-dasharray', '2, 10');
    }
  }]);

  return DottedLineDrawHandler;
})(LineDrawHandler);

exports.DottedLineDrawHandler = DottedLineDrawHandler;

var TriangleDrawHandler = (function (_PenDrawHandler3) {
  _inherits(TriangleDrawHandler, _PenDrawHandler3);

  function TriangleDrawHandler(s) {
    _classCallCheck(this, TriangleDrawHandler);

    _get(Object.getPrototypeOf(TriangleDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'triangle';
  }

  _createClass(TriangleDrawHandler, [{
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {
      return ele.polygon(0, 0, 0, 0, 0, 0);
    }
  }, {
    key: 'attachAdditionalAttrs',
    value: function attachAdditionalAttrs(canvas, s, ele, evnt) {

      this.attachStrokeAttrs(canvas, s, ele, evnt);

      ele.attr({
        strokeWidth: 0,
        'sp-stroke-width': 0
      });

      this.activeMainElement.attr({
        fill: canvas.activeDrawColor.code,
        fillOpacity: 0.2 });
    }
  }, {
    key: 'onDrawMove',
    value: function onDrawMove(canvas, s, x, y, dx, dy, evnt) {
      this.activeMainElement.attr('points', '0,0 ' + x + ',' + y + ' ' + -1 * x + ',' + y);
    }
  }]);

  return TriangleDrawHandler;
})(PenDrawHandler);

exports.TriangleDrawHandler = TriangleDrawHandler;

var RectDrawHandler = (function (_LineDrawHandler3) {
  _inherits(RectDrawHandler, _LineDrawHandler3);

  function RectDrawHandler(s) {
    _classCallCheck(this, RectDrawHandler);

    _get(Object.getPrototypeOf(RectDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'rect';
    this.enablePointsDragger = false;
  }

  _createClass(RectDrawHandler, [{
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {
      return ele.rect(0, 0, 0, 0);
    }
  }, {
    key: 'onDrawMove',
    value: function onDrawMove(canvas, s, x, y, dx, dy, evnt) {
      var width = Math.abs(x);
      var height = Math.abs(y);

      this.activeMainElement.attr({ width: width, height: height });
    }
  }]);

  return RectDrawHandler;
})(LineDrawHandler);

exports.RectDrawHandler = RectDrawHandler;

var CircleDrawHandler = (function (_LineDrawHandler4) {
  _inherits(CircleDrawHandler, _LineDrawHandler4);

  function CircleDrawHandler(s) {
    _classCallCheck(this, CircleDrawHandler);

    _get(Object.getPrototypeOf(CircleDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'circle';
    this.enablePointsDragger = false;
  }

  _createClass(CircleDrawHandler, [{
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {
      return ele.circle(0, 0, 0);
    }
  }, {
    key: 'onDrawMove',
    value: function onDrawMove(canvas, s, x, y, dx, dy, evnt) {
      var r = Math.abs(x);
      this.activeMainElement.attr({ r: r });
    }
  }]);

  return CircleDrawHandler;
})(LineDrawHandler);

exports.CircleDrawHandler = CircleDrawHandler;

var HighlightDrawHandler = (function (_DrawHandler3) {
  _inherits(HighlightDrawHandler, _DrawHandler3);

  function HighlightDrawHandler(s) {
    _classCallCheck(this, HighlightDrawHandler);

    _get(Object.getPrototypeOf(HighlightDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'highlight';
  }

  return HighlightDrawHandler;
})(DrawHandler);

exports.HighlightDrawHandler = HighlightDrawHandler;

var AssertDrawHandler = (function (_DrawHandler4) {
  _inherits(AssertDrawHandler, _DrawHandler4);

  function AssertDrawHandler(s) {
    _classCallCheck(this, AssertDrawHandler);

    _get(Object.getPrototypeOf(AssertDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'assert';
  }

  _createClass(AssertDrawHandler, [{
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {}
  }, {
    key: 'onClick',
    value: function onClick(canvas, s, evnt) {
      var srcElementOffset = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      var settings = _editorSetupJs.EditorSetup.getAssertSettings(canvas.activeAssert);
      var imgUrl = _editorSetupJs.EditorSetup.getAssertImageUrl(canvas.activeAssert);
      var assertData = null;
      var x = evnt._sp_offsetX;
      var y = evnt._sp_offsetY;

      var ele = s.image(imgUrl, x, y);
      ele.attr({ opacity: 0 });
      ele.attr({ 'sp-assert-type': settings.type, 'sp-assert-group': settings.group, 'sp-assert-data': assertData });

      ele.hover(function () {
        if (canvas.activeCursor.key == 'select') {
          var r = 1.2;
          var width = ele.attr('_cwidth');
          var height = ele.attr('_cheight');

          ele.animate({ width: width * r, height: height * r }, 200);
        }
      }, function () {
        if (canvas.activeCursor.key == 'select') {
          var width = ele.attr('_cwidth');
          var height = ele.attr('_cheight');

          ele.animate({ width: width, height: height }, 200);
        }
      });

      ele.node.onload = function () {
        ele.attr({ opacity: 0 });
        if (settings.width) {
          ele.aspectResize(settings.width, settings.height);
        }

        var width = ele.attr('width');
        var height = ele.attr('height');

        var _rx = width / 2;

        var _ry = height / 2;

        if (srcElementOffset && srcElementOffset.x != null) {
          _rx = srcElementOffset.x;
          _ry = srcElementOffset.y;
        }

        //Reposition to middle in the position of mouse
        ele.attr({ x: '-=' + _rx, y: '-=' + _ry });

        //Store the size for animation
        ele.attr({ _cwidth: width, _cheight: height });

        ele.attr({ width: "*=.5", height: "*=.5" });
        ele.animate({ width: "*=2", height: "*=2", opacity: 1 }, 200);
      };

      this.attachImageAttr(canvas, s, ele);
    }
  }, {
    key: 'attachAttrs',
    value: function attachAttrs(canvas, s, ele, evnt) {
      _get(Object.getPrototypeOf(AssertDrawHandler.prototype), 'attachAttrs', this).call(this, ele, s, ele, evnt);
    }
  }, {
    key: 'enableDrag',
    value: function enableDrag(canvas, s, ele) {
      ele.realdrag();
    }
  }]);

  return AssertDrawHandler;
})(DrawHandler);

exports.AssertDrawHandler = AssertDrawHandler;

var LabelDrawHandler = (function (_DrawHandler5) {
  _inherits(LabelDrawHandler, _DrawHandler5);

  function LabelDrawHandler(s) {
    _classCallCheck(this, LabelDrawHandler);

    _get(Object.getPrototypeOf(LabelDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'label';
    this.drawByDrag = false;
    this.disableSelectBox = false;
    this.inEditMode = false;

    this.minWidth = 180;
    this.minHeight = 80;
    this.lineHeight = 1.3;
    this.newLineChar = ';NEW_LINE_CH;';
  }

  _createClass(LabelDrawHandler, [{
    key: 'onUnselect',
    value: function onUnselect(canvas, s, ele, newEle, evnt) {
      _get(Object.getPrototypeOf(LabelDrawHandler.prototype), 'onUnselect', this).call(this, canvas, s, ele, newEle, evnt);
      // this.onBlur();
    }
  }, {
    key: 'editModeOn',
    value: function editModeOn(canvas, evnt, ele, tele) {
      this.inEditMode = true;

      this.hideSelector(canvas, canvas.s, ele);

      var w = tele.attr('sp-width');
      var h = tele.attr('sp-height');

      tele.attr({ opacity: 0 });

      var pos = $(evnt.currentTarget).offset();
      pos.width = w + 'px';
      pos.height = h + 'px';

      $('body').append('<div id="svgTextEditorHolder" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index:900"><textarea type="text" id="svgTextEditor" style="z-index:1000;padding:0;background:rgba(255, 255, 255, 0.35);border: 1px solid #fff;" /></textarea></div>');

      var text = tele.attr('text');
      if (text.join) {
        text = text.join(' ');
      }

      var _txtEle = $('#svgTextEditor');
      _txtEle.val(text);
      _txtEle.css(pos);
      _txtEle.focus();

      //// To move the cursor to end
      _txtEle.val('');
      _txtEle.val(text);

      $("#svgTextEditorHolder").click((function () {
        this.updateText(canvas, evnt, ele, tele);
        this.editModeOff(canvas, ele);
      }).bind(this));
    }
  }, {
    key: 'editModeOff',
    value: function editModeOff(canvas, ele) {
      var el = ele || this.activeElement;
      var mele = el.select('[sp-main]');
      $('#svgTextEditorHolder').remove();
      mele.attr({ opacity: 1 });
      this.inEditMode = false;

      this.repositionSelector(canvas, canvas.s, ele);
      this.showSelector(canvas, canvas.s, ele);
    }
  }, {
    key: 'updateText',
    value: function updateText(canvas, evnt, ele, tele) {
      var _this6 = this;

      var _txtEle = $('#svgTextEditor');
      var text = _txtEle.val();
      text = text.replace(/[\n\r]/g, ' ' + this.newLineChar + ' ');

      var w = _txtEle.width();

      var h = _txtEle.height();

      tele.attr({ text: null });
      var words = text.split(/\s+/).reverse(),
          word,
          line = [],
          texts = [],
          tempEle = canvas.s.text(0, 0, '');

      while (word = words.pop()) {
        line.push(word);
        tempEle.attr({ text: line.join(" ") });
        if (word == this.newLineChar || tempEle.getBBox().width > w) {

          line.pop();
          var nline = line.join(" ");

          if (word == this.newLineChar) {
            nline = nline + '\n';
            line = [];
          } else {
            line = [word];
          }

          texts.push(nline);
        }
      }

      if (line) {
        texts.push(line.join(" "));
      }

      tempEle.remove();
      tele.attr({ text: texts });
      tele.selectAll("tspan").forEach(function (tspan, i) {
        tspan.attr({ dy: 0, dx: 0, x: 0, y: _this6.lineHeight * i + "em" });
      });

      var _bbox = tele.getBBox();
      tele.attr({ 'sp-width': Math.max(this.minWidth, w), 'sp-height': Math.max(this.minHeight, _bbox.height) });
    }
  }, {
    key: 'enableEditableMode',
    value: function enableEditableMode(canvas, ele, tele) {
      var _this7 = this;

      ele.smartClick(function (ievnt) {
        if (canvas.activeCursor.key == _editorSetupJs.EditorSetup.cursors.label.key) {
          ievnt.preventDefault();
          _this7.editModeOn(canvas, ievnt, ele, tele);
        }
      });

      ele.dblclick(function (ievnt) {
        _this7.editModeOn(canvas, ievnt, ele, tele);
      });
    }
  }, {
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {
      var settings = _editorSetupJs.EditorSetup.getAssertSettings(canvas.activeAssert);
      var text = canvas.activeAssertData.text;
      ele.attr({ 'sp-assert-type': settings.type, 'sp-assert-data': text });

      var tele = ele.text(0, 0, text);
      tele.attr({ 'sp-main': true, 'sp-width': this.minWidth, 'sp-height': this.minHeight });

      return tele;
    }
  }, {
    key: 'attachEvents',
    value: function attachEvents(canvas, s, ele) {
      _get(Object.getPrototypeOf(LabelDrawHandler.prototype), 'attachEvents', this).call(this, canvas, s, ele);

      var tele = ele.select('[sp-main]');
      var text = tele.attr('text');

      if (text.length > 1) {
        this.enableEditableMode(canvas, ele, tele);
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(canvas, s, evnt) {
      if (this.inEditMode) {
        return null;
      }

      this.drawElement(canvas, s, null, null, evnt);
    }
  }]);

  return LabelDrawHandler;
})(DrawHandler);

exports.LabelDrawHandler = LabelDrawHandler;

var StuffDrawHandler = (function (_DrawHandler6) {
  _inherits(StuffDrawHandler, _DrawHandler6);

  function StuffDrawHandler(s) {
    _classCallCheck(this, StuffDrawHandler);

    _get(Object.getPrototypeOf(StuffDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'stuff';
    this.drawByDrag = false;
    this.highlightColor = 'rgba(255, 236, 61, 0.59)';
  }

  _createClass(StuffDrawHandler, [{
    key: 'createHighligher',
    value: function createHighligher(canvas, s, ele, evnt, cx, cy) {
      var highligher = ele.select('[sp-highligher]');
      if (highligher != null) {
        highligher.animate({ r: 1 }, 200, function () {
          highligher.remove();
        });
        return;
      }

      var r = 37.5;
      if (!(cx && cy)) {
        var box = ele.getBBox();
        var cx = box.width / 2;
        var cy = box.height / 2;
      }
      // Math.max(box.width, box.height);

      var c = ele.circle(cx, cy, 1);
      c.after(ele.select('[sp-main]'));

      c.attr({
        'sp-highligher': true,
        'stroke-width': 0,
        'fill': this.highlightColor });

      if (this.disableAnimation) {
        c.attr({ 'r': r });
      } else {
        c.animate({ r: r }, 200);
      }
      return c;
    }
  }, {
    key: 'createSVGElement',
    value: function createSVGElement(canvas, s, x, y, evnt, ele) {

      // ele.attr({opacity:0});
      var name = canvas.activeAssert;
      var parts = name.split('_');
      var kind = parts[0];
      var settings = _editorSetupJs.EditorSetup.getAssertSettings(name);
      var mele = null;
      var _defid = null;

      if (kind == 'player') {
        var _remName = parts.splice(2, 4).join('_');
        _defid = _editorSetupJs.EditorSetup.playerSVGUrl({ label: parts[1] }, _remName);
      } else if (kind == 'assert' || kind == 'post') {
        var _remName = parts.splice(1, 4).join('_');
        _defid = _editorSetupJs.EditorSetup.assertSVGUrl(_remName);
      }

      var _def = canvas.assertSVG.select(_defid);
      if (_def.attr('sp-width')) {
        ele.attr({ 'sp-width': _def.attr('sp-width'), 'sp-height': _def.attr('sp-height') });
      }

      // if(_def.attr('sp-width')){
      //   //Reposition to center of the mouse
      //   var [w, h] = [_def.attr('sp-width'), _def.attr('sp-height')];
      //   ele.translateXY(w/-2, h/-2);
      // }

      mele = ele.use(_def);

      if (settings.scaleRatio) {
        // var ebox = ele.getBBox();
        // var [w, h] = [ebox.w, ebox.h];
        // var w = settings.scaleRatio*w;
        // var h = settings.scaleRatio*h;
        mele.scaleWH(settings.scaleRatio);
      }

      return mele;
    }
  }, {
    key: 'createImageElement',
    value: function createImageElement(canvas, s, x, y, evnt, ele) {
      var settings = _editorSetupJs.EditorSetup.getAssertSettings(canvas.activeAssert);
      var imgUrl = _editorSetupJs.EditorSetup.getAssertImageUrl(canvas.activeAssert);

      var mele = ele.image(imgUrl, 0, 0);
      mele.attr({ opacity: 0 });

      mele.node.onload = function () {
        mele.attr({ opacity: 0 });
        if (settings.width) {
          mele.aspectResize(settings.width, settings.height);
        }

        var width = mele.attr('width');
        var height = mele.attr('height');

        //Reposition to middle in the position of mouse
        mele.attr({ x: '-=' + width / 2, y: '-=' + height / 2 });

        //Store the size for animation
        mele.attr({ 'sp-width': width, 'sp-height': height });

        mele.attr({ opacity: 1 });
      };

      return mele;
    }
  }, {
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {

      var name = canvas.activeAssert;
      var settings = _editorSetupJs.EditorSetup.getAssertSettings(name);
      var perspectiveScale = settings.perspectiveScale;
      if (settings.perspectiveFields && settings.perspectiveFields.indexOf(name) < 0) {
        perspectiveScale = false;
      }
      ele.attr({
        'sp-assert-name': name,
        'sp-assert-type': settings.type,
        'sp-assert-group': settings.group,
        'sp-perspective-scale': perspectiveScale
      });

      if (settings.type == 'svg') {
        return this.createSVGElement(canvas, s, x, y, evnt, ele);
      } else if (settings.type == 'img') {
        return this.createImageElement(canvas, s, x, y, evnt, ele);
      }
    }
  }, {
    key: 'attachEvents',
    value: function attachEvents(canvas, s, ele) {
      var _this8 = this;

      _get(Object.getPrototypeOf(StuffDrawHandler.prototype), 'attachEvents', this).call(this, canvas, s, ele);

      var name = canvas.activeAssert;
      var parts = name.split('_');
      var kind = parts[0];

      if (kind == 'player') {
        ele.smartClick(function (evnt) {
          if (canvas.activeCursor.key == 'highlight') {
            _this8.createHighligher(canvas, s, ele, evnt);
          }
        });
      }
    }
  }, {
    key: 'attachAttrs',
    value: function attachAttrs(canvas, s, ele, evnt) {
      _get(Object.getPrototypeOf(StuffDrawHandler.prototype), 'attachAttrs', this).call(this, canvas, s, ele, evnt);
      // this.attachSizeAttrs(canvas, s, ele, evnt);
    }
  }, {
    key: 'onClick',
    value: function onClick(canvas, s, evnt) {
      var srcElementOffset = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      var ele = this.drawElement(canvas, s, null, null, evnt);

      if (srcElementOffset && srcElementOffset.x != null) {
        ele.translateXY(-1 * srcElementOffset.x, -1 * srcElementOffset.y);
      } else if (ele.attr('sp-width')) {
        //Reposition to center of the mouse
        var w = ele.attr('sp-width');
        var h = ele.attr('sp-height');

        ele.translateXY(w / -2, h / -2);
      }

      ele.animate({ opacity: 1 }, 100);
    }
  }]);

  return StuffDrawHandler;
})(DrawHandler);

exports.StuffDrawHandler = StuffDrawHandler;

var ShapeDrawHandler = (function (_PenDrawHandler4) {
  _inherits(ShapeDrawHandler, _PenDrawHandler4);

  function ShapeDrawHandler(s) {
    _classCallCheck(this, ShapeDrawHandler);

    _get(Object.getPrototypeOf(ShapeDrawHandler.prototype), 'constructor', this).call(this, s);
    this.key = 'shape';
  }

  _createClass(ShapeDrawHandler, [{
    key: 'createMainElement',
    value: function createMainElement(canvas, s, x, y, evnt, ele) {
      var ele = ele.polygon(0, 0, 0, 0, 0, 0, 0, 0);
      ele.attr({ fill: 'rgba(0, 0, 0, .1)', 'stroke-width': 0 });
      return ele;
    }
  }, {
    key: 'onSelect',
    value: function onSelect(canvas, s, ele, evnt) {
      var _this9 = this;

      _get(Object.getPrototypeOf(ShapeDrawHandler.prototype), 'onSelect', this).call(this, canvas, s, ele, evnt);

      var mele = this.activeMainElement;
      if (ele.selectAll('[sp-dragger-tool]').length > 0) {
        return;
      }
      var points = mele.attr('points').map(function (v) {
        return parseInt(v);
      });

      var _loop = function () {
        var p1 = i * 2;
        var p2 = i * 2 + 1;
        px = points[p1];
        py = points[p2];

        _this9.createDraggerElement(canvas, s, ele, px, py, true, function (dx, dy, nx, ny, ev) {
          var newPoints = mele.attr('points');
          newPoints[p1] = points[p1] + dx;
          newPoints[p2] = points[p2] + dy;
          mele.attr('points', newPoints);
        }, function () {
          points = mele.attr('points').map(function (v) {
            return parseInt(v);
          });
        });
      };

      for (var i = 0; i < 4; i++) {
        var px, py;

        _loop();
      }
    }
  }, {
    key: 'onDrawMove',
    value: function onDrawMove(canvas, s, x, y, dx, dy, evnt) {
      this.activeMainElement.attr('points', '0,0 ' + x + ',0 ' + x + ',' + y + ' 0,' + y);
    }
  }, {
    key: 'onDrawEnd',
    value: function onDrawEnd(canvas, s, x, y, dx, dy) {
      this.onSelect(canvas, s, this.activeElement, new MouseEvent(this.activeElement));
      canvas.setActiveCursor(_editorSetupJs.EditorSetup.cursors.select);
    }
  }]);

  return ShapeDrawHandler;
})(PenDrawHandler);

exports.ShapeDrawHandler = ShapeDrawHandler;

function LoadPlayerAssert(s, name, color) {

  //Load the assert
  var _def = Snap.parse(_editorAssertsJs.Asserts[name]);
  _def = _def.select('g');
  _def.attr({ opacity: 0 });
  s.add(_def);

  //Create new color version
  var colors = _editorSetupJs.EditorSetup.asserts.playerDressColor[color];
  _def.selectAll('[sp-part=shirt]').attr({ fill: colors.shirt });
  _def.selectAll('[sp-part=shorts]').attr({ fill: colors.shorts });

  //Rename the def and attach required attrs
  var _id = _def.attr('id') + '_' + color;
  _def = s.select('#' + _def.attr('id'));
  _def.attr({ id: _id });
  _def.toDefs();
  _def.attr({ opacity: 1 });
}

function LoadAllPlayerAssert(s) {
  _editorSetupJs.EditorSetup.asserts.players.forEach(function (p, i) {
    _editorSetupJs.EditorSetup.playerColors.forEach(function (color, j) {
      LoadPlayerAssert(s, 'sp_svg_player_' + p, color.label);
    });
  });
}

function LoadAssert(s, key) {
  //Load the assert
  var _def = Snap.parse(_editorAssertsJs.Asserts[key]);
  _def = _def.select('g');
  _def.attr({ opacity: 0 });
  s.add(_def);

  _def.toDefs();
  _def.attr({ opacity: 1 });
}

function LoadExtraAssert(s) {
  LoadAssert(s, 'sp_svg_assert_trash_icon');
}

function CanvasCloneToTeamp(drill, editor, s, assert, temp) {

  var p = temp.parent();

  // REMOVE FROM DOM
  temp.remove();
  temp.node.innerHTML = '';

  // ADD TO DOM
  p.append(temp);

  // if(editor.assertSVG.defs){
  //   temp.append(Snap.parse(editor.assertSVG.defs.outerHTML));
  // }

  editor.assertSVG.selectAll('marker').forEach(function (ele, i) {
    var m = Snap.parse(ele.outerSVG());
    m.node.firstChild.id = m.node.firstChild.id + '_temp';
    temp.append(m);

    var _el = temp.selectAll('marker')[temp.selectAll('marker').length - 1];
    _el.toDefs();
  });

  s.selectAll('[sp-cloneable]').forEach(function (ele, i) {

    var _txt = ele.outerSVG();
    //BUG: Something is messing in chrome browser which blocks the canvas render.
    // Removing the quote solves it.
    _txt = _txt.replace(/(marker-(start|end):[^\)]*\);)/g, '');

    var el = Snap.parse(_txt);
    temp.append(el);
    var _el = temp.selectAll('[sp-cloneable]')[temp.selectAll('[sp-cloneable]').length - 1];

    var markerId = _el.attr('sp-marker');

    if (markerId) {
      var attr = 'markerEnd';
      if (_el.attr('sp-marker-position') == 'start') {
        attr = 'markerStart';
      }

      var _mele = _el.select('[sp-main]');
      _mele.attr(_defineProperty({}, attr, temp.select(markerId + '_temp')));
    }
  });

  temp.selectAll('use').forEach(function (ele, i) {

    var href = ele.attr('xlink:href');

    if (!href) {
      href = ele.attr('href');
    }

    if (!href) {
      return;
    }

    var org = assert.select(href);

    if (!org) {
      console.log('Element missing for', href);
      return;
    }

    var _o = temp.g();
    _o.append(Snap.parse(org.innerSVG()));
    if (ele.node.getAttribute('transform')) {
      _o.node.setAttribute('transform', ele.node.getAttribute('transform'));
    }
    ele.before(_o);
    ele.remove();
  });
}

function CanvasChangeToBlack(drill, editor, s, assert, temp) {
  temp.selectAll('[sp-item-onlycolor="true"]').attr({ 'opacity': 0 });
  temp.selectAll('[sp-item-onlyblack="true"]').attr({ 'opacity': 1 });

  temp.selectAll('[sp-item-name="background"]').attr({
    'fill': '#FFFFFF',
    'stroke': 'black',
    'stroke-width': '2px'
  });

  var fields = temp.selectAll('[sp-item-name="stroke"]');
  if (fields) {
    for (var i = fields.length - 1; i >= 0; i--) {
      var f = fields[i];
      f.selectAll('[stroke="#FFFFFF"]').attr({
        'stroke': '#000000'
      });
    };
  }

  temp.selectAll('text').attr({ 'fill': '#000000' });
}

function CanvasToData(eleId, svgSize, svgXML) {
  var q = new Promise.Deferred();

  var tempCanvas = document.getElementById(eleId);

  var ctx = tempCanvas.getContext("2d");
  ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  tempCanvas.width = svgSize.width;
  tempCanvas.height = svgSize.height;
  canvg(tempCanvas, svgXML, {
    ignoreMouse: true, ignoreAnimation: true,
    renderCallback: function renderCallback() {
      q.resolve(tempCanvas.toDataURL("image/png"));
    }
  });

  return q;
}

function CreateCanvasElement(eleId) {
  var dontClear = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var q = new Promise.Deferred();

  var drill = _editorSetupJs.EditorSetup.activeDrill;
  var editor = _editorSetupJs.EditorSetup.activeEditor;

  var s = editor.s;
  var assert = editor.assertSVG;
  var temp = editor.tempSVG;

  s.selectAll('[sp-selector-box-close-button]').remove();
  s.selectAll('[sp-selector-box]').remove();
  s.selectAll('[sp-dragger-tool]').remove();

  CanvasCloneToTeamp(drill, editor, s, assert, temp);
  var svgText = s.innerSVG();

  // Firefox, Safari root NS issue fix
  svgText = svgText.replace('xlink=', 'xmlns:xlink=');
  // Safari xlink NS issue fix
  svgText = svgText.replace(/NS\d+:href/g, 'xlink:href');

  var svgSize = s.node.getBoundingClientRect();
  var imageData = null;
  var imageDataBlack = null;

  var innerQ = CanvasToData(eleId, svgSize, temp.outerSVG());
  if (dontClear) {
    var tempCanvas = document.getElementById(eleId);
    q.resolve({ canvas: tempCanvas, imageData: imageData, svgText: svgText, imageDataBlack: imageDataBlack });
  } else {
    innerQ.then(function (data) {
      imageData = data;
      CanvasChangeToBlack(drill, editor, s, assert, temp);
      return CanvasToData(eleId, svgSize, temp.outerSVG());
    }).then(function (data) {
      imageDataBlack = data;
      var tempCanvas = document.getElementById(eleId);
      q.resolve({ canvas: tempCanvas, imageData: imageData, svgText: svgText, imageDataBlack: imageDataBlack });
      temp.clear();

      var ctx = tempCanvas.getContext("2d");
      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    });
  }

  return q;
}

var CreateCanvasElement;
exports.CreateCanvasElement = CreateCanvasElement;
var LoadPlayerAssert;
exports.LoadPlayerAssert = LoadPlayerAssert;
var LoadAllPlayerAssert;
exports.LoadAllPlayerAssert = LoadAllPlayerAssert;
var LoadExtraAssert;
exports.LoadExtraAssert = LoadExtraAssert;

},{"./../editor/asserts.js":7,"./../editor/setup.js":11,"./../editor/utils.js":13}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _setupJs = require('./setup.js');

var cursorMapper = {
  'line': _setupJs.EditorSetup.cursors.line,
  'dribble': _setupJs.EditorSetup.cursors.dotline,
  'ballpath': _setupJs.EditorSetup.cursors.dashline
};

var playersMapping = {

  'blackman3': 'player_black_to_left',
  'referee3': 'player_black_push_left',
  'blackman13': 'player_black_to_right',
  'blackman2': 'player_black_catch_left',
  'blackman5': 'player_black_walk_right',
  'referee1': 'player_black_face_back',
  'referee5': 'player_black_back_right',
  'blackman12': 'player_black_catch_right',
  'blackman4': 'player_black_walk_left',
  'referee4': 'player_black_push_right',
  'blackman20': 'player_black_back_left',
  'blackman1': 'player_black_fly_left',
  'referee2': 'player_black_face',
  'blackman7': 'player_black_run_left',
  'blackman11': 'player_black_fly_right',

  'redman1': 'player_red_to_left',
  'redman9': 'player_red_push_left',
  'redman5': 'player_red_to_right',
  'redlightblueBlock_L': 'player_red_catch_left',
  'redman2': 'player_red_walk_right',
  'redman10': 'player_red_face_back',
  'redman6': 'player_red_back_right',
  'redlightblueBlock_R': 'player_red_catch_right',
  'redman3': 'player_red_walk_left',
  'redman8': 'player_red_push_right',
  'redman7': 'player_red_back_left',
  'RedLightBlueDive_L': 'player_red_fly_left',
  'redman4': 'player_red_face',
  'redman7a': 'player_red_run_left',
  'RedLightBlueDive_R': 'player_red_fly_right',

  'yellowman3': 'player_yellow_to_left',
  'yellowman9': 'player_yellow_push_left',
  'yellowman5': 'player_yellow_to_right',
  'YellowlightblueBlock_L': 'player_yellow_catch_left',
  'yellowman2': 'player_yellow_walk_right',
  'yellowman10': 'player_yellow_face_back',
  'yellowman6': 'player_yellow_back_right',
  'YellowlightblueBlock_R': 'player_yellow_catch_right',
  'yellowman1': 'player_yellow_walk_left',
  'yellowman8': 'player_yellow_push_right',
  'yellowman7': 'player_yellow_back_left',
  'YellowLightBlueDive_L': 'player_yellow_fly_left',
  'yellowman4': 'player_yellow_face',
  'yellowman7a': 'player_yellow_run_left',
  'YellowLightBlueDive_R': 'player_yellow_fly_right',

  'greengoalie1': 'player_green_to_left',
  'greengoalie3': 'player_green_push_left',
  'greengoalie2': 'player_green_to_right',
  'greenman2': 'player_green_catch_left',
  'greenman5': 'player_green_walk_right',
  'greengoalie6': 'player_green_face_back',
  'greenman10': 'player_green_back_right',
  'greenman12': 'player_green_catch_right',
  'greenman4': 'player_green_walk_left',
  'greengoalie4': 'player_green_push_right',
  'greenman20': 'player_green_back_left',
  'greenman1': 'player_green_fly_left',
  'greengoalie5': 'player_green_face',
  'greenman7': 'player_green_run_left',
  'greenman11': 'player_green_fly_right',

  'whitegoalie1': 'player_white_to_left',
  'whitegoalie3': 'player_white_push_left',
  'whitegoalie2': 'player_white_to_right',
  'whiteman2': 'player_white_catch_left',
  'whiteman5': 'player_white_walk_right',
  'whitegoalie6': 'player_white_face_back',
  'whiteman10': 'player_white_back_right',
  'whiteman12': 'player_white_catch_right',
  'whiteman4': 'player_white_walk_left',
  'whitegoalie4': 'player_white_push_right',
  'whiteman20': 'player_white_back_left',
  'whiteman1': 'player_white_fly_left',
  'whitegoalie5': 'player_white_face',
  'whiteman7': 'player_white_run_left',
  'whiteman11': 'player_white_fly_right'
};

var colors = {
  "16777215": { code: "#fff", label: "white" },
  "65280": { code: "#22ee11", label: "green" },
  "16711680": { code: "#ee2211", label: "red" },
  "0": { code: "#000", label: "black" }
};

var posts = {
  'goal3dl2': 'post_side_right',
  'goal3dr2': 'post_side_left',
  'topgoal3': 'post_top_top',
  'topgoal4': 'post_top_bottom',
  'topgoal2': 'post_top_left',
  'topgoal1': 'post_top_right',
  'goakfront': 'post_face',
  'goalback': 'post_back'
};

var asserts = {

  'flagtall': 'FlagYellow',
  'mcTallFlagOrange': 'FlagRed',
  'flagshort': 'FlagSmallYellow',
  'mcFlagShortOrange': 'FlagSmallRed',
  'ladderH': 'LadderWide',
  'vertladder': 'LadderHigh',
  'mcLadderLeft': 'LadderLeft',
  'mcLadderRight': 'LadderRight',
  'mcHurdleOrange1': 'HookRedUp',
  'mcHurdleOrange2': 'HookRedLeft',
  'mcHurdleOrange3': 'HookRedRight',
  'mc_PoleBlue': 'StickBlue',
  'mc_PoleOrange': 'StickRed',
  'mc_PoleLime': 'StickGreen',
  'mc_PoleRed': 'StickRed2',
  'mc_PoleYellow': 'StickYellow',
  'soccerball': 'Ball',
  'mcBallBag': 'BallBag',
  'hurdle3': 'HookYellowLeft',
  'hurdle1': 'HookYellowUp',
  'hurdle2': 'HookYellowRight',
  'mcHurdleConeBlueS': 'CrossOrangeUp',
  'mcHurdleConeBlueL': 'CrossOrangeRight',
  'mcHurdleConeBlueR': 'CrossOrangeLeft',
  'mcHurdleConeYellowR': 'CrossYellowRight',
  'mcHurdleConeYellowL': 'CrossYellowLeft',
  'mcHurdleConeYellowS': 'CrossYellowUp',
  'manikin2': 'doll_left',
  'manikin3': 'doll_face',
  'manikin1': 'doll_right',
  'mcConeLowGreen': 'ConeGreeen',
  'mcConeTopGreen': 'DiskGreeen',
  'mcConeLowLime': 'ConeGreeenLight',
  'mcConeTopLime': 'DiskGreeenLight',
  'mcConeLowRed': 'ConeRed',
  'mcConeTopRed': 'DiskRed',
  'mcConeLowYellow': 'ConeYellow',
  'mcConeTopYellow': 'DiskYellow',
  'mcHurdleConeOrangeS': 'CrossBlueUp',
  'mcHurdleConeOrangeL': 'CrossBlueLeft',
  'mcHurdleConeOrangeR': 'CrossBlueRight',
  'cone': 'CapOrange',
  'mcConeBlue': 'CapBlue',
  'mcConeGreen': 'CapGreen',
  'mcConePurple': 'CapVoilet',
  'mcConeRed': 'CapRed',
  'mcConeYellow': 'CapYellow'
};

var labels = {
  'zero': '0',
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',

  'letA': 'A',
  'LetB': 'B',
  'letC': 'C',
  'letD': 'D',
  'letE': 'E',
  'letF': 'F',
  'letG': 'G',
  'letH': 'H',
  'letI': 'I',
  'letJ': 'J',
  'letK': 'K',
  'letL': 'L',
  'letM': 'M',
  'letN': 'N',
  'letO': 'O',
  'letP': 'P',
  'letQ': 'Q',
  'letR': 'R',
  'letS': 'S',
  'letT': 'T',
  'letU': 'U',
  'letV': 'V',
  'letW': 'W',
  'letX': 'X',
  'letY': 'Y',
  'letZ': 'Z',
  'draggableTextbox': true
};

var ClientLabels = ['one', 'two', 'five', 'three', 'letA', 'LetB', 'letY'];
var ClientAsserts = ['mcConeYellow', 'mcConeLowRed', 'goakfront', 'mcConeTopRed', 'topgoal4', 'topgoal3'];

var fieldMapping = {
  '1': 'birds_eyeview',
  '2': 'half_short_bleachers',
  '3': 'half_long_bleachers',
  '4': 'plain',
  '5': 'single_box_grid',
  '6': 'quad_box_grid',
  '7': 'cricle'
};

function importDatas(editor) {
  var ld = '<drill id="1439462775217" label="3v3 with Designated Zone Defender"><fieldData><highestID>34</highestID><backgroundFrame>5</backgroundFrame><messageString><setup>3%20teams%20of%203%20players%20on%2025%20yd%20long%2C%2030%20yd%20wide%20field%2E%20%205%20yd%20zone%20at%20each%20end%20of%20field%2E%20%202%20teams%20on%2C%201%20team%20off%2E%20%20Supply%20of%20balls%20with%20coach%2E%20%20Game%20re%2Dstarted%20each%20time%20with%20ball%20into%20defender%20in%20zone%2E</setup><instructions>Teams%20play%20for%20time%20or%20goal%20scored%2C%20then%20new%20team%20on%2E%20%20Defender%20plays%20un%2Dopposed%20in%20zone%2Dno%20other%20players%20allowed%20in%20zone%2E%20%20Red%20defender%20CANNOT%20defend%20shot%20from%20behind%20line%20from%20Green%20attacker%20%28vice%20versa%29</instructions><coach>Progression%3A%20Red%20defender%20can%20defend%20shot%20from%20behind%20line%20from%20Green%20attacker%20%28vice%20versa%29</coach></messageString><allPlayers><player text="" highlighter="false" width="44.6" height="28.85" xscale="100" yscale="100" y="396.4" x="355.4" uniqueID="0" typeID="topgoal4" /><player text="" highlighter="false" width="44.6" height="28.85" xscale="100" yscale="100" y="395.4" x="626.4" uniqueID="1" typeID="topgoal4" /><player text="" highlighter="false" width="44.75" height="26.95" xscale="100" yscale="100" y="63.05" x="381.7" uniqueID="2" typeID="topgoal3" /><player text="" highlighter="false" width="44.75" height="26.95" xscale="100" yscale="100" y="65.05" x="589.7" uniqueID="3" typeID="topgoal3" /><player SSy4="50.3" SSx4="-3" SSy3="51.3" SSx3="343.2" SSy2="-1" SSx2="333.9" SSy1="0" SSx1="0" text="" highlighter="false" width="357.65" height="63.2" xscale="100" yscale="100" y="89.75" x="342.1" uniqueID="4" typeID="shadedSquare" /><player SSy4="80.3" SSx4="0" SSy3="80.3" SSx3="403.2" SSy2="25" SSx2="393.9" SSy1="27" SSx1="5" text="" highlighter="false" width="414.65" height="66.2" xscale="100" yscale="100" y="308.75" x="311.1" uniqueID="6" typeID="shadedSquare" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="331.35" x="488.1" uniqueID="7" typeID="greenman10" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="237.35" x="385.1" uniqueID="13" typeID="greenman10" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="226.1" x="595.75" uniqueID="14" typeID="greenman20" /><player text="" highlighter="false" width="25.4" height="33.35" xscale="100" yscale="100" y="98.75" x="533.95" uniqueID="15" typeID="redman1" /><player text="" highlighter="false" width="27.7" height="33.25" xscale="100" yscale="100" y="184.35" x="622.85" uniqueID="19" typeID="redman3" /><player text="" highlighter="false" width="28.6" height="32.25" xscale="100" yscale="100" y="195.05" x="395.1" uniqueID="20" typeID="redman5" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="118.95" x="521.15" uniqueID="21" typeID="soccerball" /><player text="" highlighter="true" width="29.6" height="35.8" xscale="100" yscale="100" y="163.7" x="688.05" uniqueID="22" typeID="referee3" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="194.95" x="692.15" uniqueID="23" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="194.95" x="707.15" uniqueID="24" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="204.95" x="698.15" uniqueID="25" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="200.95" x="720.15" uniqueID="26" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="209.95" x="710.15" uniqueID="27" typeID="soccerball" /><player text="" highlighter="false" width="31.6" height="35.95" xscale="100" yscale="100" y="172.55" x="283.3" uniqueID="28" typeID="yellowman8" /><player text="" highlighter="false" width="31.6" height="35.95" xscale="100" yscale="100" y="195.55" x="286.3" uniqueID="29" typeID="yellowman8" /><player text="" highlighter="false" width="31.6" height="35.95" xscale="100" yscale="100" y="193.55" x="270.3" uniqueID="30" typeID="yellowman8" /></allPlayers><allLines><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="65280" uniqueID="10" typeID="line"><locs><loc y="404" x="768" /><loc y="220" x="746" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="16711680" uniqueID="12" typeID="line"><locs><loc y="189" x="762" /><loc y="342" x="781" /></locs></line><line y="-81" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="16777215" uniqueID="16" typeID="dribble"><locs><loc y="228" x="377" /><loc y="229" x="722" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="16777215" uniqueID="18" typeID="dribble"><locs><loc y="410" x="357" /><loc y="409" x="743" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="0" uniqueID="33" typeID="ballpath"><locs><loc y="224" x="549" /><loc y="277" x="475" /></locs></line></allLines></fieldData></drill>';
  // var ld = '<drill id="1447249687294" label="Erik Imler 1"><fieldData><highestID>42</highestID><backgroundFrame>5</backgroundFrame><messageString><setup>15X15%20yard%20grid%2E%20Split%20your%20group%20into%20four%20teams%2E%20Each%20team%20starts%20in%20the%20corners%20of%20the%20playing%20area%20and%20all%20the%20balls%20are%20placed%20in%20the%20middle%20as%20shown%2E</setup><instructions>On%20%22go%22%20first%20player%20in%20each%20group%20must%20sprint%20to%20the%20middle%20of%20the%20grid%2C%20grab%20a%20ball%20with%20his%2Fher%20hands%20and%20return%20to%20their%20teams%20corner%2E%20Next%20player%20runs%20and%20grabs%20a%20ball%20from%20the%20middle%20or%20from%20any%20other%20corner%2E%20Players%20must%20return%20the%20ball%20to%20their%20own%20corner%20and%20players%20cannot%20guard%20the%20balls%2E%20Play%20for%2090%20seconds%2C%20the%20team%20that%20finishes%20with%20the%20most%20balls%20in%20their%20corner%20wins%20the%20game%2E</instructions><coach>Vision%20and%20communication%2E%20Progression%3A%20must%20use%20feet%20only%2C%20must%20use%20non%20dominant%20foot%20only%2E</coach></messageString><allPlayers><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="81.3" x="334.15" uniqueID="0" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="383.3" x="301.15" uniqueID="1" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="384.3" x="705.15" uniqueID="2" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="80.3" x="671.15" uniqueID="3" typeID="mcConeYellow" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="48.15" x="297.55" uniqueID="4" typeID="whitegoalie2" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="80.15" x="295.55" uniqueID="5" typeID="whitegoalie2" /><player text="" highlighter="false" width="28.2" height="35.35" xscale="100" yscale="100" y="54.5" x="337.75" uniqueID="6" typeID="whiteman5" /><player text="" highlighter="false" width="36.9" height="36.65" xscale="100" yscale="100" y="365.05" x="263" uniqueID="7" typeID="redman6" /><player text="" highlighter="false" width="36.9" height="36.65" xscale="100" yscale="100" y="394.05" x="258" uniqueID="9" typeID="redman6" /><player text="" highlighter="false" width="36.9" height="36.65" xscale="100" yscale="100" y="387.05" x="283" uniqueID="10" typeID="redman6" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="386.1" x="674.75" uniqueID="11" typeID="greenman20" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="385.1" x="698.75" uniqueID="12" typeID="greenman20" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="363.1" x="714.75" uniqueID="13" typeID="greenman20" /><player text="" highlighter="false" width="25.4" height="32.35" xscale="100" yscale="100" y="79.25" x="688.95" uniqueID="14" typeID="yellowman1" /><player text="" highlighter="false" width="25.4" height="32.35" xscale="100" yscale="100" y="45.25" x="675.95" uniqueID="15" typeID="yellowman1" /><player text="" highlighter="false" width="25.4" height="32.35" xscale="100" yscale="100" y="51.25" x="658.95" uniqueID="16" typeID="yellowman1" /><player text="" highlighter="false" width="10.05" height="8.6" xscale="100" yscale="100" y="199.05" x="468.35" uniqueID="17" typeID="mcConeLowRed" /><player text="" highlighter="false" width="10.05" height="8.6" xscale="100" yscale="100" y="270.05" x="468.35" uniqueID="18" typeID="mcConeLowRed" /><player text="" highlighter="false" width="10.05" height="8.6" xscale="100" yscale="100" y="271.05" x="557.35" uniqueID="19" typeID="mcConeLowRed" /><player text="" highlighter="false" width="10.05" height="8.6" xscale="100" yscale="100" y="200.05" x="554.35" uniqueID="20" typeID="mcConeLowRed" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="233.95" x="485.15" uniqueID="21" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="216.95" x="490.15" uniqueID="22" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="248.95" x="507.15" uniqueID="23" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="227.95" x="509.15" uniqueID="24" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="251.95" x="485.15" uniqueID="25" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="262.95" x="500.15" uniqueID="26" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="260.95" x="522.15" uniqueID="27" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="210.95" x="474.15" uniqueID="28" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="251.95" x="541.15" uniqueID="29" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="237.95" x="525.15" uniqueID="30" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="232.95" x="541.15" uniqueID="31" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="202.95" x="499.15" uniqueID="32" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="212.95" x="541.15" uniqueID="33" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="216.95" x="520.15" uniqueID="34" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="201.95" x="523.15" uniqueID="35" typeID="soccerball" /><player text="" highlighter="false" width="29.95" height="21.65" xscale="100" yscale="100" y="211.55" x="276.05" uniqueID="36" typeID="one" /><player text="" highlighter="false" width="30.3" height="23" xscale="100" yscale="100" y="210.6" x="285.95" uniqueID="37" typeID="five" /><player text="" highlighter="false" width="28.9" height="22.75" xscale="100" yscale="100" y="211.05" x="302.25" uniqueID="38" typeID="letY" /><player text="" highlighter="false" width="29.95" height="21.65" xscale="100" yscale="100" y="53.55" x="497.05" uniqueID="39" typeID="one" /><player text="" highlighter="false" width="30.3" height="23" xscale="100" yscale="100" y="52.6" x="506.95" uniqueID="40" typeID="five" /><player text="" highlighter="false" width="28.9" height="22.75" xscale="100" yscale="100" y="52.05" x="521.25" uniqueID="41" typeID="letY" /></allPlayers><allLines /></fieldData></drill>';
  // var ld = '<drill id="1439461573148" label="Lay Off and Shoot 1"><fieldData><highestID>45</highestID><backgroundFrame>5</backgroundFrame><messageString><setup>Split%20group%20evenly%20at%20each%20cone%2E%20%20Supply%20of%20balls%20at%20line%20A%2E</setup><instructions>Red%20player%20A%20passes%20ball%20to%20Red%20player%20B%2E%20%20Red%20B%20lays%20ball%20back%20over%20shooting%20line%20for%20Red%20player%20A%20to%20run%20on%20to%20and%20shoot%2E%20%20%20Repeat%20other%20side%20with%20yellow%20players%2E</instructions><coach>Player%20B%20must%20retrieve%20shot%20and%20move%20to%20line%20A%20with%20ball%2E%20%20Player%20A%20moves%20to%20line%20B%2E%20Rotate%20GK%20every%20round%2E%20%20Make%20it%20a%20competition%20between%20teams%2E%20%20Progression%3A%20competition%20between%20shooters%20and%20GK%2Dwho%20can%20make%20more%20saves%20vs%2E%20who%20can%20score%20more%20goals%3F%0D</coach></messageString><allPlayers><player text="" highlighter="false" width="76.25" height="39.65" xscale="100" yscale="100" y="52.25" x="472.05" uniqueID="0" typeID="goakfront" /><player text="" highlighter="false" width="9.6" height="18.75" xscale="100" yscale="100" y="388.5" x="613.4" uniqueID="1" typeID="mcConeTopRed" /><player text="" highlighter="false" width="9.6" height="18.75" xscale="100" yscale="100" y="389.5" x="402.4" uniqueID="2" typeID="mcConeTopRed" /><player text="" highlighter="false" width="9.6" height="18.75" xscale="100" yscale="100" y="83.5" x="413.4" uniqueID="3" typeID="mcConeTopRed" /><player text="" highlighter="false" width="9.6" height="18.75" xscale="100" yscale="100" y="84.5" x="598.4" uniqueID="4" typeID="mcConeTopRed" /><player text="" highlighter="false" width="35.75" height="36.65" xscale="100" yscale="100" y="350.05" x="375.6" uniqueID="5" typeID="yellowman6" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="69.8" x="391.45" uniqueID="6" typeID="yellowman5" /><player text="" highlighter="false" width="28.8" height="33.45" xscale="100" yscale="100" y="79.45" x="503.1" uniqueID="7" typeID="whitegoalie5" /><player text="" highlighter="false" width="39.5" height="36.6" xscale="100" yscale="100" y="382.3" x="347.3" uniqueID="8" typeID="yellowman10" /><player text="" highlighter="false" width="39.5" height="36.6" xscale="100" yscale="100" y="396.3" x="357.3" uniqueID="9" typeID="yellowman10" /><player text="" highlighter="false" width="28.8" height="33.25" xscale="100" yscale="100" y="48.55" x="384.85" uniqueID="10" typeID="yellowman4" /><player text="" highlighter="false" width="28.8" height="33.25" xscale="100" yscale="100" y="53.55" x="601.75" uniqueID="12" typeID="redman4" /><player text="" highlighter="false" width="32.9" height="36.1" xscale="100" yscale="100" y="194.05" x="541.65" uniqueID="14" typeID="redman7" /><player text="" highlighter="false" width="36.1" height="36.25" xscale="100" yscale="100" y="379.5" x="617.7" uniqueID="15" typeID="redman10" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="359.95" x="407.15" uniqueID="18" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="405.95" x="407.15" uniqueID="19" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="396.95" x="418.15" uniqueID="20" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="409.95" x="420.15" uniqueID="21" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="365.95" x="639.15" uniqueID="22" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="395.95" x="593.15" uniqueID="23" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="402.95" x="601.15" uniqueID="24" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="403.95" x="617.15" uniqueID="25" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="414.95" x="610.15" uniqueID="26" typeID="soccerball" /><player text="" highlighter="false" width="25.4" height="33.35" xscale="100" yscale="100" y="102.75" x="609.95" uniqueID="29" typeID="redman1" /><player text="" highlighter="false" width="29.95" height="21.65" xscale="100" yscale="100" y="233.55" x="640.05" uniqueID="33" typeID="one" /><player text="" highlighter="false" width="30.2" height="21.4" xscale="100" yscale="100" y="155.8" x="597.5" uniqueID="34" typeID="two" /><player text="" highlighter="false" width="31.3" height="22.9" xscale="100" yscale="100" y="133" x="535.4" uniqueID="36" typeID="three" /><player text="" highlighter="false" width="30.6" height="21.65" xscale="100" yscale="100" y="404.55" x="666" uniqueID="37" typeID="letA" /><player text="" highlighter="false" width="29.7" height="22.75" xscale="100" yscale="100" y="63.6" x="645.95" uniqueID="38" typeID="LetB" /><player text="" highlighter="false" width="30.6" height="21.65" xscale="100" yscale="100" y="402.55" x="332" uniqueID="39" typeID="letA" /><player text="" highlighter="false" width="29.7" height="22.75" xscale="100" yscale="100" y="64.6" x="356.95" uniqueID="40" typeID="LetB" /><player SSy4="99.3" SSx4="-14" SSy3="99.3" SSx3="345.2" SSy2="-1" SSx2="334.9" SSy1="0" SSx1="0" text="" highlighter="false" width="370.65" height="111.2" xscale="100" yscale="100" y="85.75" x="337.1" uniqueID="41" typeID="shadedSquare" /><player text="" highlighter="false" width="30.2" height="21.4" xscale="100" yscale="100" y="175.8" x="706.5" uniqueID="42" typeID="two" /><player text="" highlighter="false" width="30.3" height="23" xscale="100" yscale="100" y="174.6" x="715.95" uniqueID="43" typeID="five" /><player text="" highlighter="false" width="28.9" height="22.75" xscale="100" yscale="100" y="175.05" x="732.25" uniqueID="44" typeID="letY" /></allPlayers><allLines><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="16777215" uniqueID="17" typeID="dribble"><locs><loc y="263" x="372" /><loc y="263" x="725" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="0" uniqueID="28" typeID="ballpath"><locs><loc y="424" x="681" /><loc y="213" x="669" /></locs></line><line y="-69" x="-25" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="65280" uniqueID="30" typeID="line"><locs><loc y="164" x="663" /><loc y="182" x="665" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="0" uniqueID="31" typeID="ballpath"><locs><loc y="213" x="651" /><loc y="271" x="615" /></locs></line><line y="-69" x="-53" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="65280" uniqueID="32" typeID="line"><locs><loc y="422" x="666" /><loc y="308" x="627" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="0" uniqueID="35" typeID="ballpath"><locs><loc y="266" x="595" /><loc y="186" x="537" /></locs></line></allLines></fieldData></drill>';
  // var ld = '<drill id="1439403533668" label="Rondo"><fieldData><highestID>106</highestID><backgroundFrame>4</backgroundFrame><messageString><setup>4V1%20and%208V1%20possession%2E%20Plenty%20of%20balls%20on%20perimeter%2E</setup><instructions>Progression%3A%20limit%20touches%0DProgression%3A%20add%20another%20defender</instructions><coach>10%20passes%2Ddefender%20stays%20in%20middle%0DNutmegs%2Ddefender%20stays%20in%20middle</coach></messageString><allPlayers><player SSy4="143.3" SSx4="3" SSy3="144.3" SSx3="162.2" SSy2="0" SSx2="160.9" SSy1="0" SSx1="0" text="" highlighter="false" width="173.65" height="155.2" xscale="100" yscale="100" y="58.75" x="302.1" uniqueID="4" typeID="shadedSquare" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="52.3" x="300.15" uniqueID="5" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="195.3" x="303.15" uniqueID="6" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="195.3" x="461.15" uniqueID="7" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="51.3" x="460.15" uniqueID="8" typeID="mcConeYellow" /><player SSy4="138.3" SSx4="1" SSy3="141.3" SSx3="156.2" SSy2="0" SSx2="157.9" SSy1="0" SSx1="0" text="" highlighter="false" width="169.35" height="152.2" xscale="100" yscale="100" y="63.75" x="526.1" uniqueID="9" typeID="shadedSquare" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="199.3" x="521.15" uniqueID="10" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="199.3" x="676.15" uniqueID="11" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="52.3" x="519.15" uniqueID="12" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="52.3" x="675.15" uniqueID="13" typeID="mcConeYellow" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="33.15" x="355.55" uniqueID="14" typeID="greengoalie2" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="179.35" x="365.1" uniqueID="15" typeID="greenman10" /><player text="" highlighter="false" width="25.35" height="32.15" xscale="100" yscale="100" y="104.1" x="454.65" uniqueID="16" typeID="greengoalie1" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="108.1" x="286.55" uniqueID="17" typeID="greengoalie2" /><player text="" highlighter="false" width="36.9" height="36.65" xscale="100" yscale="100" y="97.05" x="358" uniqueID="18" typeID="redman6" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="55.95" x="379.15" uniqueID="19" typeID="soccerball" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="34.15" x="574.55" uniqueID="20" typeID="greengoalie2" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="180.35" x="573.1" uniqueID="21" typeID="greenman10" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="105.1" x="506.55" uniqueID="22" typeID="greengoalie2" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="98.1" x="664.75" uniqueID="23" typeID="greenman20" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="131.95" x="526.15" uniqueID="24" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="220.95" x="511.15" uniqueID="25" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="223.95" x="519.15" uniqueID="26" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="214.95" x="520.15" uniqueID="27" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="222.95" x="526.15" uniqueID="28" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="214.95" x="511.15" uniqueID="29" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="210.95" x="318.15" uniqueID="30" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="209.95" x="306.15" uniqueID="31" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="218.95" x="306.15" uniqueID="32" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="217.95" x="314.15" uniqueID="33" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="225.95" x="326.15" uniqueID="34" typeID="soccerball" /><player text="" highlighter="false" width="29.6" height="35.65" xscale="100" yscale="100" y="102.8" x="573.6" uniqueID="35" typeID="redman9" /><player SSy4="158.3" SSx4="2" SSy3="158.3" SSx3="230.2" SSy2="2" SSx2="229.9" SSy1="0" SSx1="0" text="" highlighter="false" width="241.65" height="169.2" xscale="100" yscale="100" y="256.75" x="388.1" uniqueID="38" typeID="shadedSquare" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="251.3" x="384.15" uniqueID="39" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="407.3" x="390.15" uniqueID="40" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="251.3" x="613.15" uniqueID="41" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="409.3" x="616.15" uniqueID="42" typeID="mcConeYellow" /><player text="" highlighter="false" width="30.6" height="21.65" xscale="100" yscale="100" y="412.55" x="332" uniqueID="43" typeID="letA" /><player text="" highlighter="false" width="29.7" height="22.75" xscale="100" yscale="100" y="200.6" x="280.95" uniqueID="44" typeID="LetB" /><player text="" highlighter="false" width="29.7" height="22.75" xscale="100" yscale="100" y="207.6" x="697.9" uniqueID="45" typeID="LetB" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="236.15" x="424.55" uniqueID="46" typeID="greengoalie2" /><player text="" highlighter="false" width="25.35" height="32.15" xscale="100" yscale="100" y="233.15" x="540.65" uniqueID="47" typeID="greengoalie1" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="385.35" x="425.1" uniqueID="48" typeID="greenman10" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="381.1" x="534.75" uniqueID="49" typeID="greenman20" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="284.15" x="371.55" uniqueID="50" typeID="greengoalie2" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="342.35" x="366.1" uniqueID="51" typeID="greenman10" /><player text="" highlighter="false" width="32.9" height="36.75" xscale="100" yscale="100" y="276.25" x="603.75" uniqueID="52" typeID="greengoalie3" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="344.1" x="596.75" uniqueID="53" typeID="greenman20" /><player text="" highlighter="false" width="28.6" height="32.25" xscale="100" yscale="100" y="345.05" x="493.1" uniqueID="54" typeID="redman5" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="399.95" x="536.15" uniqueID="55" typeID="soccerball" /></allPlayers><allLines /></fieldData></drill>';
  // var ld = '<drill id="1453460193425" label="Lines and text"><fieldData><highestID>12</highestID><backgroundFrame>1</backgroundFrame><messageString><setup>Type%20Setup%20Here%2E%2E%2E</setup><instructions>Type%20Instructions%20Here%2E%2E%2E</instructions><coach>Type%20Coaching%20Points%20Here%2E%2E%2E</coach></messageString><allPlayers><player text="" highlighter="false" width="29.95" height="21.65" xscale="100" yscale="100" y="226.55" x="430.05" uniqueID="5" typeID="one" /><player text="" highlighter="false" width="30.2" height="21.4" xscale="100" yscale="100" y="129.8" x="439.5" uniqueID="6" typeID="two" /><player text="" highlighter="false" width="31.3" height="22.9" xscale="100" yscale="100" y="158" x="692.4" uniqueID="7" typeID="three" /><player text="" highlighter="false" width="30.3" height="21.8" xscale="100" yscale="100" y="203.45" x="368.75" uniqueID="8" typeID="four" /><player text="" highlighter="false" width="30.3" height="23" xscale="100" yscale="100" y="343.6" x="572.95" uniqueID="9" typeID="five" /><player text="Text box of data then new Line" highlighter="false" width="144.35" height="96.3" xscale="100" yscale="100" y="81.45" x="524.85" uniqueID="11" typeID="draggableTextbox" /></allPlayers><allLines><line y="-72" x="-37" thickness="2" gDrawStart="undefined" gDoubleArrowHead="false" arrowHeads="false" color="0" uniqueID="0" typeID="pen"><locs><loc y="258" x="528" /><loc y="262" x="517" /><loc y="267" x="506" /><loc y="281" x="492" /><loc y="291" x="478" /><loc y="304" x="468" /><loc y="318" x="464" /><loc y="328" x="462" /><loc y="340" x="461" /><loc y="352" x="461" /><loc y="376" x="462" /><loc y="390" x="474" /><loc y="405" x="507" /><loc y="408" x="518" /><loc y="410" x="531" /><loc y="413" x="545" /><loc y="415" x="555" /><loc y="414" x="569" /><loc y="413" x="581" /><loc y="408" x="594" /><loc y="403" x="604" /><loc y="395" x="614" /><loc y="381" x="625" /><loc y="366" x="629" /><loc y="355" x="630" /><loc y="337" x="632" /><loc y="310" x="633" /><loc y="292" x="633" /><loc y="278" x="624" /><loc y="268" x="617" /><loc y="261" x="604" /><loc y="260" x="592" /><loc y="260" x="580" /><loc y="260" x="570" /><loc y="257" x="558" /><loc y="255" x="548" /><loc y="255" x="536" /><loc y="259" x="526" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="65280" uniqueID="1" typeID="line"><locs><loc y="226" x="432" /><loc y="226" x="665" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="65280" uniqueID="2" typeID="curve"><locs><loc y="225" x="666" /><loc y="460" x="773" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="0" uniqueID="3" typeID="ballpath"><locs><loc y="226" x="431" /><loc y="461" x="430" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="16711680" uniqueID="4" typeID="dribble"><locs><loc y="440" x="428" /><loc y="440" x="778" /></locs></line></allLines></fieldData></drill>';

  return importDrill(editor, ld);
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return rgb && rgb.length === 4 ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

function processLineElements(editor, line) {
  var arrowHeads = $(line).attr('arrowHeads');
  var thickness = $(line).attr('thickness');

  var color = colors[$(line).attr('color')];
  if (!color) {
    color = colors["0"];
  }
  if (parseInt(thickness) > 3) {
    editor.activeDrawThickness = { 'width': 4 };
  } else {
    editor.activeDrawThickness = { 'width': 2 };
  }

  var pt = $($($(line).children()[0]).children()[0]);
  var x1 = parseFloat(pt.attr('x')) - 261;
  var y1 = parseFloat(pt.attr('y')) - 93;

  var pt = $($($(line).children()[0]).children()[1]);
  var x2 = parseFloat(pt.attr('x')) - 261 - x1;
  var y2 = parseFloat(pt.attr('y')) - 93 - y1;

  var points = [[x2, y2]];
  if ($(line).attr('typeID') == 'line') {
    editor.setActiveCursor(_setupJs.EditorSetup.cursors.line);
  } else if ($(line).attr('typeID') == 'dribble') {
    editor.setActiveCursor(_setupJs.EditorSetup.cursors.dotline);
  } else if ($(line).attr('typeID') == 'ballpath') {
    editor.setActiveCursor(_setupJs.EditorSetup.cursors.dashline);
  } else if ($(line).attr('typeID') == 'curve') {
    editor.setActiveCursor(_setupJs.EditorSetup.cursors.curve);
  } else if ($(line).attr('typeID') == 'pen') {
    //Not Tested
    var childrens = $($(line).children()[0]).children();
    for (var i = 2; i < childrens.length; i++) {
      var pt = childrens[i];
      var x = parseFloat($(pt).attr('x')) - 261 - x1;
      var y = parseFloat($(pt).attr('y')) - 93 - y1;
      points.push([x, y]);
    };
    editor.setActiveCursor(_setupJs.EditorSetup.cursors.pen);
  } else {
    console.log("Line Missing");
  }

  if (arrowHeads == 'true') {
    editor.activeArrowHead = 'head';
  } else {
    editor.activeArrowHead = 'none';
  }

  editor.activeDrawColor = color;
  editor.activeCursor.handler.draw(editor, editor.s, x1, y1, points);
}

function processPlayerElement(editor, player) {

  if ($(player).attr('typeID') == 'shadedSquare') {
    var x = parseFloat($(player).attr('x')) - 224;
    var y = parseFloat($(player).attr('y')) - 22 + 10;
    var x1 = parseFloat($(player).attr('SSx1'));
    var y1 = parseFloat($(player).attr('SSy1'));
    var x2 = parseFloat($(player).attr('SSx2'));
    var y2 = parseFloat($(player).attr('SSy2'));
    var x3 = parseFloat($(player).attr('SSx3'));
    var y3 = parseFloat($(player).attr('SSy3'));
    var x4 = parseFloat($(player).attr('SSx4'));
    var y4 = parseFloat($(player).attr('SSy4'));
    editor.setActiveCursor(_setupJs.EditorSetup.cursors.shape);
    var ele = editor.activeCursor.handler.draw(editor, editor.s, x, y, [[x3, y3]]);
    editor.activeCursor.handler.activeMainElement.attr('points', x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y3 + ' ' + x4 + ',' + y4);
  } else if (labels[$(player).attr('typeID')]) {
    var x = parseFloat($(player).attr('x')) - 224 + 5;
    var y = parseFloat($(player).attr('y'));
    if ($(player).attr('typeID') == 'draggableTextbox') {
      var letter = $(player).attr('text');
      editor.chooseLabelHandler('letter_Text Box', letter);
    } else {
      var letter = labels[$(player).attr('typeID')];
      editor.chooseLabelHandler('letter_' + letter, letter);
    }
    editor.activeCursor.handler.draw(editor, editor.s, x, y);
  } else if (posts[$(player).attr('typeID')]) {
    var x = parseFloat($(player).attr('x')) - 224;
    var y = parseFloat($(player).attr('y')) - 22;
    var cursorKey = posts[$(player).attr('typeID')];

    if (cursorKey == 'post_face' || cursorKey == 'post_back') {
      y -= 5;
    }
    editor.chooseAssertHandler('post_' + cursorKey);
    editor.activeCursor.handler.draw(editor, editor.s, x, y);
  } else if (asserts[$(player).attr('typeID')]) {
    var width = parseFloat($(player).attr('width'));
    var height = parseFloat($(player).attr('height'));
    var x = parseFloat($(player).attr('x')) - 224;
    var y = parseFloat($(player).attr('y')) - 22;
    if ($(player).attr('typeID') == 'soccerball') {
      y += 5;
    }

    var cursorKey = asserts[$(player).attr('typeID')];
    editor.chooseAssertHandler('assert_' + cursorKey);
    editor.activeCursor.handler.draw(editor, editor.s, x, y);
  } else {
    var x = parseFloat($(player).attr('x')) - 224 + 12 + 10;
    var y = parseFloat($(player).attr('y')) - 22 + 17 + 10;

    var x = parseFloat($(player).attr('x')) - 224 + 12 - 2;
    var y = parseFloat($(player).attr('y')) - 22 + 17 - 8;

    var x = parseFloat($(player).attr('x')) - 224 + 20 - 5;
    var y = parseFloat($(player).attr('y')) - 22 + 20 - 5;

    // y = y - (y*(10/450));
    y = y + y * (12 / 450);

    var cursorKey = playersMapping[$(player).attr('typeID')];
    if (!cursorKey) {
      console.log("Player Missing", $(player).attr('typeID'));
    }
    editor.chooseAssertHandler(cursorKey);
    editor.onClick({ clientX: x, clientY: y });

    if ($(player).attr('highlighter') && $(player).attr('highlighter') == "true") {
      editor.activeCursor.handler.disableAnimation = true;
      editor.activeCursor.handler.createHighligher(editor, editor.s, editor.activeCursor.handler.activeElement, 30, 35);
      editor.activeCursor.handler.disableAnimation = false;
    }
  }
}

function importDrill(editor, drillData) {

  var elements = [];

  var drill = {};

  var ld = $(drillData);
  drill.name = ld.attr('label');

  if (ld.find('setup').length > 0) {
    drill.setupText = decodeURIComponent(ld.find('setup').html());
  }
  if (ld.find('instructions').length > 0) {
    drill.instructText = decodeURIComponent(ld.find('instructions').html());
  }
  if (ld.find('coach').length > 0) {
    drill.coachText = decodeURIComponent(ld.find('coach').html());
  }
  var backgroundFrame = ld.find('backgroundFrame').html();
  if (!fieldMapping[backgroundFrame]) {
    console.log("Field Miss Matching");
  }

  editor.activeField = editor.fields[fieldMapping[backgroundFrame] || 'birds_eyeview'];
  // editor.updateField();
  editor.clear();

  var players = ld.find('player');
  for (var ij = players.length - 1; ij >= 0; ij--) {
    var player = players[ij];
    var uniqueID = 0;
    if ($(player).attr('uniqueID') != 'undefined') {
      var uniqueID = parseInt($(player).attr('uniqueID'));
    }

    if ($(player).attr('typeID') != 'undefined') {
      elements.push({ "type": "player", "uniqueID": uniqueID, "ele": player });
    }
  };

  var linesData = ld.find('line');
  for (var jk = linesData.length - 1; jk >= 0; jk--) {
    var line = linesData[jk];
    var uniqueID = 0;
    if ($(line).attr('uniqueID') != 'undefined') {
      var uniqueID = parseInt($(line).attr('uniqueID'));
    }
    if ($(line).attr('typeID') != 'undefined') {
      elements.push({ "type": "line", "uniqueID": uniqueID, "ele": line });
    }
  };

  elements.sort(function (a, b) {
    return b.uniqueID - a.uniqueID;
  });

  for (var i = elements.length - 1; i >= 0; i--) {
    var item = elements[i];
    if (item.type == 'player') {
      processPlayerElement(editor, item.ele);
      // item.eleObj = editor.activeCursor.handler.activeElement;
    } else if (item.type == 'line') {
        processLineElements(editor, item.ele);
      }
  };

  return drill;
}

function importSession(sessionData) {
  var sessionObj = $(sessionData);

  var session = {};
  session.name = sessionObj.attr('label');
  session.drills = [];
  var drills = sessionObj.find('drill');
  for (var i = 0; i < drills.length; i++) {
    var drill = drills[i];
    session.drills.push($(drill).attr('filename'));
  }

  return session;
}

var importDatas;
exports.importDatas = importDatas;
var importDrill;
exports.importDrill = importDrill;
var importSession;
exports.importSession = importSession;

},{"./setup.js":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _drawJs = require('./draw.js');

var Draw = _interopRequireWildcard(_drawJs);

var DrillField = (function () {
  function DrillField(key, name) {
    var perspectiveScale = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var width = arguments.length <= 3 || arguments[3] === undefined ? 585 : arguments[3];
    var height = arguments.length <= 4 || arguments[4] === undefined ? 455 : arguments[4];

    _classCallCheck(this, DrillField);

    this.key = key;
    this.name = name;
    this.imgUrl = '/imgs/graphics/fields/field_' + this.key + '.jpg';
    this.perspectiveScale = perspectiveScale;
    this.width = width;
    this.height = height;
  }

  _createClass(DrillField, [{
    key: 'url',
    value: function url() {
      return EditorSetup.assertSVGUrl('field_' + this.key);
    }
  }]);

  return DrillField;
})();

var Assert = function Assert(type, group) {
  var scaleRatio = arguments.length <= 2 || arguments[2] === undefined ? .2838 : arguments[2];
  var width = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
  var height = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
  var perspectiveScale = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
  var perspectiveFields = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

  _classCallCheck(this, Assert);

  this.type = type;
  this.group = group;
  this.width = width;
  this.height = height;
  this.perspectiveScale = perspectiveScale;
  this.scaleRatio = scaleRatio;
  this.perspectiveFields = perspectiveFields;
};

var DrawCursor = function DrawCursor(key, name, handlerCls) {
  var order = arguments.length <= 3 || arguments[3] === undefined ? 99 : arguments[3];
  var defaultColorIndex = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
  var defaultArrowHeadIndex = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
  var hasArrowHead = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];

  _classCallCheck(this, DrawCursor);

  this.key = key;
  this.name = name;
  this.handler = new handlerCls();
  this.order = order;
  this.defaultColorIndex = defaultColorIndex;
  this.hasArrowHead = hasArrowHead;
  this.defaultArrowHeadIndex = defaultArrowHeadIndex;
};

var EquipIcon = function EquipIcon(key, x, y, width, height) {
  var scaleX = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];
  var scaleY = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];
  var perspectiveScale = arguments.length <= 7 || arguments[7] === undefined ? false : arguments[7];

  _classCallCheck(this, EquipIcon);

  this.key = key;
  this.left = x + 'px';
  this.top = y + 'px';
  this.width = width + 'px';
  this.height = height + 'px';
  this.scaleX = scaleX || 0.3;
  this.scaleY = scaleY || 0.3;
  this.perspectiveScale = perspectiveScale;

  this.style = { left: this.left, top: this.top, width: this.width, height: this.height };
  this.html = '<div class="hack-holder"></div><svg><use xlink:href="#spsvg_' + this.key + '" transform="matrix(' + this.scaleX + ',0,0,' + this.scaleY + ',0,0)"/></svg>';
};

var EditorSetup = {

  fields: {
    birds_eyeview: new DrillField('birds_eyeview', 'Birds Eye View'),
    cricle: new DrillField('cricle', 'Cricle'),
    half_long_bleachers: new DrillField('half_long_bleachers', 'Half Long Bleachers', true),
    half_short_bleachers: new DrillField('half_short_bleachers', 'Half Short Bleachers', true),
    quad_box_grid: new DrillField('quad_box_grid', 'Quad Box Grid'),
    single_box_grid: new DrillField('single_box_grid', 'Single Box Grid'),
    plain: new DrillField('plain', 'Field Plain'),
    full_long_bleachers: new DrillField('full_long_bleachers', 'Full Long Bleachers', true),
    birds_eyeview_stright: new DrillField('birds_eyeview_stright', 'Birds Eyeview Stright', false, 455, 585)
  },

  cursors: {

    select: new DrawCursor('select', 'Select & Drag', Draw.SelectDrawHandler, 0),

    pen: new DrawCursor('pen', 'Pen', Draw.PenDrawHandler, 1, 3, 0, true),
    line: new DrawCursor('line', 'Player Path', Draw.LineDrawHandler, 2, 1, 0, true),
    curve: new DrawCursor('curve', 'Player Path', Draw.CurveDrawHandler, 3, 1, 0, true),
    dashline: new DrawCursor('dashline', 'Ball Path', Draw.DashedLineDrawHandler, 4, 3, 0, true),
    dotline: new DrawCursor('dotline', 'Dribble', Draw.DottedLineDrawHandler, 5, 2, 0, true),

    highlight: new DrawCursor('highlight', 'Highlight', Draw.HighlightDrawHandler, 6),
    assert: new DrawCursor('assert', 'Assert', Draw.AssertDrawHandler),
    stuff: new DrawCursor('assert', 'Assert', Draw.StuffDrawHandler),
    label: new DrawCursor('label', 'Label', Draw.LabelDrawHandler),
    triangle: new DrawCursor('triangle', 'Triangle', Draw.TriangleDrawHandler),
    rect: new DrawCursor('rect', 'Rectangle', Draw.RectDrawHandler),
    text: new DrawCursor('text', 'Text', Draw.LabelDrawHandler),
    circle: new DrawCursor('circle', 'Circle', Draw.CircleDrawHandler),
    shape: new DrawCursor('shape', 'Shape', Draw.ShapeDrawHandler)

  },

  colors: [{ code: "#fff", label: "white" }, { code: "#22ee11", label: "green" }, { code: "#ee2211", label: "red" }, { code: "#000", label: "black" }],

  playerColors: [{ code: "#000", label: "black" }, { code: "#FFEB3B", label: "yellow" }, { code: "#22ee11", label: "green" }, { code: "#ee2211", label: "red" }, { code: "#fff", label: "white" }],

  thickness: [{ key: 'thin', width: 2 }, { key: 'thick', width: 4 }],

  arrowHeads: [{ key: 'none' }, { key: 'head' }, { key: 'tail' }, { key: 'both' }],

  asserts: {
    players: ['to_left', 'push_left', 'to_right', 'catch_left', 'walk_right', 'face_back', 'back_right', 'catch_right', 'walk_left', 'push_right', 'back_left', 'fly_left', 'face', 'run_left', 'fly_right'],

    playerDressColor: {
      black: { shirt: '#000000', shorts: '#CCCCCC' },
      yellow: { shirt: '#FFF753', shorts: '#332DE7' },
      green: { shirt: '#6EE73E', shorts: '#CCCCCC' },
      red: { shirt: '#EB283C', shorts: '#CCCCFF' },
      white: { shirt: '#FFFFFF', shorts: '#6EE73E' }
    },

    goal: ['doll_face', 'doll_left', 'doll_right', 'post_side_left', 'post_side_right', 'post_top_top', 'post_top_bottom', 'post_top_left', 'post_top_right', 'post_face', 'post_back'],

    postGroups: [['side', ['left', 'right']], ['top', ['bottom', 'top', 'left', 'right']], ['normal', ['face', 'back']]],

    letters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Text Box'],

    equips: [new EquipIcon('FlagYellow', 0, 0, 31, 35, .3, .3), new EquipIcon('FlagRed', 22, 0, 31, 35, .3, .3), new EquipIcon('FlagSmallYellow', 7, 42, 25, 21, .3, .3), new EquipIcon('FlagSmallRed', 29, 44, 23, 21, .3, .3), new EquipIcon('LadderWide', 60, 10, 73, 22, .3, .3), new EquipIcon('LadderHigh', 55, 44, 22, 47, .3, .3), new EquipIcon('LadderLeft', 78, 46, 24, 30, .2, .2), new EquipIcon('LadderRight', 105, 45, 38, 44, .2, .2), new EquipIcon('HookRedUp', 140, 0, 24, 9, .2, .2), new EquipIcon('HookRedLeft', 140, 14, 24, 20, .2, .2), new EquipIcon('HookRedRight', 140, 38, 24, 20, .2, .2), new EquipIcon('StickBlue', 0, 100, 26, 45, .3, .3), new EquipIcon('StickRed', 26, 100, 26, 45, .3, .3), new EquipIcon('StickGreen', 52, 100, 26, 45, .3, .3), new EquipIcon('StickRed2', 79, 100, 26, 45, .3, .3), new EquipIcon('StickYellow', 105, 100, 26, 45, .3, .3), new EquipIcon('Ball', 170, 0, 17, 12, .3, .3), new EquipIcon('BallBag', 0, 157, 50, 36, .3, .3), new EquipIcon('HookYellowLeft', 172, 18, 19, 24, .3, .3), new EquipIcon('HookYellowUp', 167, 49, 34, 11, .3, .3), new EquipIcon('HookYellowRight', 172, 63, 19, 24, .3, .3), new EquipIcon('CrossOrangeUp', 144, 95, 53, 15, .3, .3), new EquipIcon('CrossOrangeRight', 144, 120, 53, 40, .3, .3), new EquipIcon('CrossOrangeLeft', 144, 162, 53, 40, .3, .3), new EquipIcon('CrossYellowRight', 156, 200, 43, 40, .3, .3), new EquipIcon('CrossYellowLeft', 110, 200, 40, 40, .3, .3), new EquipIcon('CrossYellowUp', 85, 165, 53, 16, .3, .3), new EquipIcon('doll_left', 0, 203, 39, 46, .25, .25), new EquipIcon('doll_face', 33, 203, 42, 46, .25, .25), new EquipIcon('doll_right', 70, 203, 39, 46, .25, .25), new EquipIcon('ConeGreeen', 205, 0, 11, 11, .25, .25), new EquipIcon('DiskGreeen', 205, 20, 11, 11, .25, .25), new EquipIcon('ConeGreeenLight', 205, 40, 11, 11, .25, .25), new EquipIcon('DiskGreeenLight', 205, 60, 11, 11, .25, .25), new EquipIcon('ConeRed', 205, 80, 11, 11, .25, .25), new EquipIcon('DiskRed', 205, 100, 11, 11, .25, .25), new EquipIcon('ConeYellow', 205, 120, 11, 11, .25, .25), new EquipIcon('DiskYellow', 205, 140, 11, 11, .25, .25), new EquipIcon('CrossBlueUp', 200, 165, 44, 11, .25, .25), new EquipIcon('CrossBlueLeft', 205, 215, 43, 40, .25, .25), new EquipIcon('CrossBlueRight', 205, 180, 43, 40, .25, .25), new EquipIcon('CapOrange', 223, 0, 19, 18, .25, .25), new EquipIcon('CapBlue', 223, 23, 19, 18, .25, .25), new EquipIcon('CapGreen', 223, 47, 19, 18, .25, .25), new EquipIcon('CapVoilet', 223, 70, 19, 18, .25, .25), new EquipIcon('CapRed', 223, 95, 24, 18, .25, .25), new EquipIcon('CapYellow', 223, 120, 19, 18, .25, .25)],

    goals: [new EquipIcon('post_top_left_mid', 35, 15, 47, 48, 1, 1), new EquipIcon('post_top_top', 96, 0, 46, 28, 1, 1), new EquipIcon('post_top_right_mid', 157, 15, 49, 47, 1, 1), new EquipIcon('post_top_left', 31, 72, 28, 47, 1, 1), new EquipIcon('post_top_right', 181, 72, 29, 48, 1, 1), new EquipIcon('post_bottom_left_mid', 35, 125, 47, 49, 1, 1), new EquipIcon('post_bottom_right_mid', 157, 125, 47, 47, 1, 1), new EquipIcon('post_top_bottom', 96, 160, 47, 28, 1, 1), new EquipIcon('post_side_right', 23, 210, 39, 80, 1, 1), new EquipIcon('post_side_left', 69, 210, 36, 87, 1, 1), new EquipIcon('post_face', 120, 210, 102, 45, 1, 1), new EquipIcon('post_back', 120, 264, 102, 54, 1, 1)],

    settings: {
      player: new Assert('svg', 'player', null, null, null, true),
      post: new Assert('svg', 'post', null, null, null, true),
      letter: new Assert('label', 'letter', null),
      assert: new Assert('svg', 'assert', .2838, null, null, true, ['assert_doll_left', 'assert_doll_face', 'assert_doll_right', 'assert_LadderWide', 'assert_LadderHigh', 'assert_LadderLeft', 'assert_LadderRight', 'assert_BallBag', 'assert_FlagYellow', 'assert_FlagRed'])
    }
  },

  playerImageUrl: function playerImageUrl(color, player) {
    // return `/imgs/graphics/players/${color.label}_${player}.png`;
    return this.getAssertImageUrl('player_' + color.label + '_' + player);
  },

  playerSVGUrl: function playerSVGUrl(color, player) {
    return '#sp_svg_player_' + player + '_' + color.label;
  },

  getAssertImageUrl: function getAssertImageUrl(name) {
    return '/imgs/graphics/stuff/' + name + '.png';
  },

  assertSVGUrl: function assertSVGUrl(name) {
    return '#spsvg_' + name;
  },

  cursorSVGUrl: function cursorSVGUrl(name) {
    return '#spsvg_icon_' + name;
  },

  getAssertSettings: function getAssertSettings(name) {
    if (this.asserts.settings[name]) {
      return this.asserts.settings[name];
    }

    var parts = name.split('_');
    var kind = parts[0];
    return this.asserts.settings[kind];
  },

  activeEditor: null,
  activeDrill: null

};

exports.EditorSetup = EditorSetup;
EditorSetup.fieldsOrder = [EditorSetup.fields.birds_eyeview, EditorSetup.fields.cricle, EditorSetup.fields.half_long_bleachers, EditorSetup.fields.half_short_bleachers, EditorSetup.fields.quad_box_grid, EditorSetup.fields.single_box_grid, EditorSetup.fields.plain, EditorSetup.fields.full_long_bleachers, EditorSetup.fields.birds_eyeview_stright];

EditorSetup.cursorsOrder = {
  right: [EditorSetup.cursors.select, EditorSetup.cursors.pen, EditorSetup.cursors.line, EditorSetup.cursors.curve, EditorSetup.cursors.dashline, EditorSetup.cursors.dotline, EditorSetup.cursors.highlight, EditorSetup.cursors.rect, EditorSetup.cursors.triangle, EditorSetup.cursors.circle, EditorSetup.cursors.shape],

  left: [
    // EditorSetup.cursors.text,

    // EditorSetup.cursors.rect,
    // EditorSetup.cursors.triangle,
    // EditorSetup.cursors.circle,
    // EditorSetup.cursors.shape,
  ]
};

},{"./draw.js":9}],12:[function(require,module,exports){
'use strict';

Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
  Element.prototype.possiblePoints = function () {
    var points = {};

    if (this.attr('x1')) {
      points.x1 = parseInt(this.attr('x1'));
      points.y1 = parseInt(this.attr('y1'));
    }

    if (this.attr('x2')) {
      points.x2 = parseInt(this.attr('x2'));
      points.y2 = parseInt(this.attr('y2'));
    }

    if (this.attr('cx')) {
      points.cx = parseInt(this.attr('cx'));
      points.cy = parseInt(this.attr('cy'));
    }

    if (this.attr('x')) {
      points.x = parseInt(this.attr('x'));
      points.y = parseInt(this.attr('y'));
    }

    return points;
  };

  Element.prototype.addPossiblePoints = function (dx, dy, fromOrign) {
    var origin = fromOrign || this.possiblePoints();

    var good = false;
    var _attr = {};

    if (origin.x) {
      _attr.x = origin.x + dx;
      _attr.y = origin.y + dy;
      good = true;
    }

    if (origin.cx) {
      _attr.cx = origin.cx + dx;
      _attr.cy = origin.cy + dy;
      good = true;
    }

    if (origin.x1) {
      _attr.x1 = origin.x1 + dx;
      _attr.y1 = origin.y1 + dy;
      good = true;
    }

    if (origin.x2) {
      _attr.x2 = origin.x2 + dx;
      _attr.y2 = origin.y2 + dy;
      good = true;
    }

    this.attr(_attr);
    return good;
  };

  Element.prototype.realdrag = function () {
    var _this = this;

    var origin = this.possiblePoints();
    this._dragInProgress = false;

    this.drag(function (dx, dy, nx, ny, ev) {
      _this.addPossiblePoints(dx, dy, origin);
    }, function (dx, dy) {
      _this._dragInProgress = true;
      origin = _this.possiblePoints();
    }, function () {
      _this._dragInProgress = false;
    });
  };

  Element.prototype.movePossible = function (direction, step, translate) {
    var origin = this.possiblePoints();
    var x = -1 * step;
    var y = 0;

    if (direction == 'up') {
      ;
      x = 0;
      y = -1 * step;
    }if (direction == 'right') {
      ;
      x = step;
      y = 0;
    }if (direction == 'down') {
      ;

      x = 0;
      y = step;
    }var g = this.addPossiblePoints(x, y);
    if (!g && translate == true) {
      this.translateXY(x, y);
    }
  };

  Element.prototype.translateXY = function (x, y) {
    var mat = this.translateMatrixXY(x, y);
    this.transform(mat);
  };

  Element.prototype.translateMatrixXY = function (x, y) {
    var mat = this.matrix || new Snap.Matrix();
    return mat.translate(x, y);
  };

  Element.prototype.scaleWH = function (w, h, cx, cy) {
    var mat = this.scaleMatrixWH(w, h, cx, cy);
    this.transform(mat);
  };

  Element.prototype.fixedScaleWH = function (w, h, cx, cy) {
    var mat = this.fixedScaleMatrixWH(w, h, cx, cy);
    this.transform(mat);
  };

  Element.prototype.scaleMatrixWH = function (w, h, cx, cy) {
    var mat = this.matrix || new Snap.Matrix();
    return mat.scale(w, h, cx, cy);
  };

  Element.prototype.fixedScaleMatrixWH = function (w, h, expandMode) {
    var mat = this.matrix || new Snap.Matrix();

    mat.a = w;
    mat.d = h;

    if (expandMode) {}

    return mat;
  };

  Element.prototype.aspectResize = function (maxWidth, maxHeight) {
    var width = this.attr('width');
    var height = this.attr('height');

    var ratio = 1;

    if (width > height) {
      ratio = maxWidth / width;
    } else {
      ratio = maxHeight / height;
    }

    if (ratio < 1) {
      this.attr({ width: width * ratio, height: height * ratio });
    }
  };

  Element.prototype.smartClick = function (callback) {
    var _this2 = this;

    if (Modernizr.touchevents) {
      console.log('Will use touch for clicks');
      var lastTouch = { x: null, y: null };

      this.touchstart(function (evnt) {
        lastTouch.x = evnt.pageX;
        lastTouch.y = evnt.pageY;
      });

      this.touchend(function (evnt) {
        var x = evnt.changedTouches[0].pageX;
        var y = evnt.changedTouches[0].pageY;
        if (x == lastTouch.x && y == lastTouch.y) {
          if (!evnt.clientX) {
            evnt.clientX = evnt.changedTouches[0].clientX;
            evnt.clientY = evnt.changedTouches[0].clientY;
          }
          callback.call(_this2, evnt);
        }
      });
    } else {
      this.click(function (evnt) {
        callback.call(_this2, evnt);
      });
    }
  };
});

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
function fixEventObject(e, forTarget) {
    // http://www.jacklmoore.com/notes/mouse-position/
    // Due to a bug in snapsvg, current target is missing https://github.com/adobe-webplatform/Snap.svg/issues/416

    e = e || window.event;

    var target = forTarget || e.target || e.srcElement,
        style = target.currentStyle || window.getComputedStyle(target, null),
        borderLeftWidth = parseInt(style['borderLeftWidth'], 10),
        borderTopWidth = parseInt(style['borderTopWidth'], 10),
        rect = target.getBoundingClientRect(),
        offsetX = (e.clientX || e.pageX) - borderLeftWidth - rect.left,
        offsetY = (e.clientY || e.pageX) - borderTopWidth - rect.top;

    e._sp_offsetX = offsetX;
    e._sp_offsetY = offsetY;
}

var fixEventObject;
exports.fixEventObject = fixEventObject;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var models = function models(config) {
  var User = (function () {
    function User() {
      var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var name = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var email = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var local = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
      var logoUrl = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

      _classCallCheck(this, User);

      this.id = id;
      this.name = name;
      this.email = email;
      this.local = 'en-US'; //local || config.defaultLocal;
      this.logoUrl = logoUrl;
      this.isGuest = id != null ? false : true;
      this.isDemo = id != null && id == 52401 ? true : false;
      this._authenticated = false;
    }

    _createClass(User, [{
      key: 'clean',
      value: function clean() {
        this._authenticated = false;
        this.id = null;
        this.name = null;
        this.email = null;
        this.local = 'en-US';
        this.isGuest = true;
        this.logoUrl = null;
        this.isDemo = null;
      }
    }, {
      key: 'update',
      value: function update(_ref) {
        var id = _ref.id;
        var name = _ref.name;
        var email = _ref.email;
        var local = _ref.local;
        var logoUrl = _ref.logoUrl;

        this.id = id;
        this.name = name;
        this.email = email;
        this.local = local;
        this.logoUrl = logoUrl;
        this.isDemo = id != null && id == 52401 ? true : false;
        this.isGuest = id != null ? false : true;
      }
    }, {
      key: 'isLoggedIn',
      value: function isLoggedIn() {
        return this.id && !this.isGuest;
      }
    }], [{
      key: 'createGuest',
      value: function createGuest() {
        return new User();
      }
    }]);

    return User;
  })();

  var ActiveUser = {
    user: User.createGuest(),
    validatedInServer: false,

    isLoggedIn: function isLoggedIn() {
      return this.user.isLoggedIn();
    },

    checkLoginStatus: function checkLoginStatus() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (_this.validatedInServer) {
          if (_this.user.isLoggedIn()) {
            resolve(_this.user);
          } else {
            reject(_this.user);
          }
        } else {
          config.dataProvider.me().then(function (data) {

            var res = data.data;
            if (res.ok) {
              _this.validatedInServer = true;
              _this.setActiveUser(res.user);
              resolve(_this.user);
            } else {
              _this.validatedInServer = true;
              _this.user.clean();
              reject(res);
            }
          }, reject);
        }
      });
    },

    setActiveUser: function setActiveUser(userObject) {
      this.user.clean();
      this.user.update(userObject);
      return this.user;
    },

    login: function login(email, password) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        config.dataProvider.login(email, password).then(function (data) {

          var res = data.data;
          if (res.ok) {
            _this2.validatedInServer = false;
            _this2.checkLoginStatus().then(resolve, reject);
          } else {
            reject(res);
          }
        }, reject);
      });
    },

    logout: function logout() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        config.dataProvider.logout().then(function (data) {

          var res = data.data;
          if (res.ok) {
            _this3.validatedInServer = false;
            _this3.user.clean();
            resolve();
          } else {
            reject(res);
          }
        }, reject);
      });
    }

  };

  return {
    User: User,
    ActiveUser: ActiveUser
  };
};

exports.models = models;
// models.$inject = ['config']

},{}],15:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("babel-regenerator-runtime");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"babel-regenerator-runtime":16,"core-js/shim":203}],16:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return invoke(method, arg);
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : new Promise(function (resolve) {
          resolve(callInvokeWithMethodAndArg());
        });
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          context._sent = arg;

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":204}],17:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],18:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./$.wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./$.hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./$.hide":46,"./$.wks":98}],19:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":53}],20:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , $$    = arguments
    , end   = $$.length > 2 ? $$[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./$.to-index":91,"./$.to-length":94,"./$.to-object":95}],21:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');
module.exports = [].fill || function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , $$     = arguments
    , $$len  = $$.length
    , index  = toIndex($$len > 1 ? $$[1] : undefined, length)
    , end    = $$len > 2 ? $$[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./$.to-index":91,"./$.to-length":94,"./$.to-object":95}],22:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length')
  , toIndex   = require('./$.to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$.to-index":91,"./$.to-iobject":93,"./$.to-length":94}],23:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./$.ctx')
  , IObject  = require('./$.iobject')
  , toObject = require('./$.to-object')
  , toLength = require('./$.to-length')
  , asc      = require('./$.array-species-create');
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? asc($this, length) : IS_FILTER ? asc($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$.array-species-create":24,"./$.ctx":32,"./$.iobject":49,"./$.to-length":94,"./$.to-object":95}],24:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var isObject = require('./$.is-object')
  , isArray  = require('./$.is-array')
  , SPECIES  = require('./$.wks')('species');
module.exports = function(original, length){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return new (C === undefined ? Array : C)(length);
};
},{"./$.is-array":51,"./$.is-object":53,"./$.wks":98}],25:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":26,"./$.wks":98}],26:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],27:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , redefineAll  = require('./$.redefine-all')
  , ctx          = require('./$.ctx')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , $iterDefine  = require('./$.iter-define')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , setSpecies   = require('./$.set-species')
  , DESCRIPTORS  = require('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./$":61,"./$.ctx":32,"./$.defined":33,"./$.descriptors":34,"./$.for-of":42,"./$.has":45,"./$.hide":46,"./$.is-object":53,"./$.iter-define":57,"./$.iter-step":59,"./$.redefine-all":75,"./$.set-species":80,"./$.strict-new":84,"./$.uid":97}],28:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":25,"./$.for-of":42}],29:[function(require,module,exports){
'use strict';
var hide              = require('./$.hide')
  , redefineAll       = require('./$.redefine-all')
  , anObject          = require('./$.an-object')
  , isObject          = require('./$.is-object')
  , strictNew         = require('./$.strict-new')
  , forOf             = require('./$.for-of')
  , createArrayMethod = require('./$.array-methods')
  , $has              = require('./$.has')
  , WEAK              = require('./$.uid')('weak')
  , isExtensible      = Object.isExtensible || isObject
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for frozen keys
var frozenStore = function(that){
  return that._l || (that._l = new FrozenStore);
};
var FrozenStore = function(){
  this.a = [];
};
var findFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
FrozenStore.prototype = {
  get: function(key){
    var entry = findFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findFrozen(this, key);
  },
  set: function(key, value){
    var entry = findFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = id++;      // collection id
      that._l = undefined; // leak store for frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this._i) && delete key[WEAK][this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(anObject(key))){
      frozenStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that._i] = value;
    } return that;
  },
  frozenStore: frozenStore,
  WEAK: WEAK
};
},{"./$.an-object":19,"./$.array-methods":23,"./$.for-of":42,"./$.has":45,"./$.hide":46,"./$.is-object":53,"./$.redefine-all":75,"./$.strict-new":84,"./$.uid":97}],30:[function(require,module,exports){
'use strict';
var global         = require('./$.global')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , redefineAll    = require('./$.redefine-all')
  , forOf          = require('./$.for-of')
  , strictNew      = require('./$.strict-new')
  , isObject       = require('./$.is-object')
  , fails          = require('./$.fails')
  , $iterDetect    = require('./$.iter-detect')
  , setToStringTag = require('./$.set-to-string-tag');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO;
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        strictNew(target, C, NAME);
        var that = new Base;
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    IS_WEAK || instance.forEach(function(val, key){
      BUGGY_ZERO = 1 / key === -Infinity;
    });
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$.export":37,"./$.fails":39,"./$.for-of":42,"./$.global":44,"./$.is-object":53,"./$.iter-detect":58,"./$.redefine":76,"./$.redefine-all":75,"./$.set-to-string-tag":81,"./$.strict-new":84}],31:[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],32:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":17}],33:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],34:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":39}],35:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":44,"./$.is-object":53}],36:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":61}],37:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , hide      = require('./$.hide')
  , redefine  = require('./$.redefine')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)redefine(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":31,"./$.ctx":32,"./$.global":44,"./$.hide":46,"./$.redefine":76}],38:[function(require,module,exports){
var MATCH = require('./$.wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./$.wks":98}],39:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],40:[function(require,module,exports){
'use strict';
var hide     = require('./$.hide')
  , redefine = require('./$.redefine')
  , fails    = require('./$.fails')
  , defined  = require('./$.defined')
  , wks      = require('./$.wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , original = ''[KEY];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, exec(defined, SYMBOL, original));
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return original.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return original.call(string, this); }
    );
  }
};
},{"./$.defined":33,"./$.fails":39,"./$.hide":46,"./$.redefine":76,"./$.wks":98}],41:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./$.an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./$.an-object":19}],42:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":19,"./$.ctx":32,"./$.is-array-iter":50,"./$.iter-call":55,"./$.to-length":94,"./core.get-iterator-method":99}],43:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":61,"./$.to-iobject":93}],44:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],45:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],46:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":61,"./$.descriptors":34,"./$.property-desc":74}],47:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":44}],48:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],49:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":26}],50:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./$.iterators')
  , ITERATOR   = require('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":60,"./$.wks":98}],51:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":26}],52:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./$.is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./$.is-object":53}],53:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],54:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./$.is-object')
  , cof      = require('./$.cof')
  , MATCH    = require('./$.wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./$.cof":26,"./$.is-object":53,"./$.wks":98}],55:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":19}],56:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , descriptor     = require('./$.property-desc')
  , setToStringTag = require('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":61,"./$.hide":46,"./$.property-desc":74,"./$.set-to-string-tag":81,"./$.wks":98}],57:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./$.library')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , hide           = require('./$.hide')
  , has            = require('./$.has')
  , Iterators      = require('./$.iterators')
  , $iterCreate    = require('./$.iter-create')
  , setToStringTag = require('./$.set-to-string-tag')
  , getProto       = require('./$').getProto
  , ITERATOR       = require('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":61,"./$.export":37,"./$.has":45,"./$.hide":46,"./$.iter-create":56,"./$.iterators":60,"./$.library":63,"./$.redefine":76,"./$.set-to-string-tag":81,"./$.wks":98}],58:[function(require,module,exports){
var ITERATOR     = require('./$.wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":98}],59:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],60:[function(require,module,exports){
module.exports = {};
},{}],61:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],62:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":61,"./$.to-iobject":93}],63:[function(require,module,exports){
module.exports = false;
},{}],64:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
module.exports = Math.expm1 || function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
};
},{}],65:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],66:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],67:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":26,"./$.global":44,"./$.task":90}],68:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = require('./$')
  , toObject = require('./$.to-object')
  , IObject  = require('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":61,"./$.fails":39,"./$.iobject":49,"./$.to-object":95}],69:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./$.export')
  , core    = require('./$.core')
  , fails   = require('./$.fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":31,"./$.export":37,"./$.fails":39}],70:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject')
  , isEnum    = $.isEnum;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./$":61,"./$.to-iobject":93}],71:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var $        = require('./$')
  , anObject = require('./$.an-object')
  , Reflect  = require('./$.global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = $.getNames(anObject(it))
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./$":61,"./$.an-object":19,"./$.global":44}],72:[function(require,module,exports){
'use strict';
var path      = require('./$.path')
  , invoke    = require('./$.invoke')
  , aFunction = require('./$.a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that  = this
      , $$    = arguments
      , $$len = $$.length
      , j = 0, k = 0, args;
    if(!holder && !$$len)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = $$[k++];
    while($$len > k)args.push($$[k++]);
    return invoke(fn, args, that);
  };
};
},{"./$.a-function":17,"./$.invoke":48,"./$.path":73}],73:[function(require,module,exports){
module.exports = require('./$.global');
},{"./$.global":44}],74:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],75:[function(require,module,exports){
var redefine = require('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":76}],76:[function(require,module,exports){
// add fake Function#toString
// for correct work wrapped methods / constructors with methods like LoDash isNative
var global    = require('./$.global')
  , hide      = require('./$.hide')
  , SRC       = require('./$.uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./$.core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  if(typeof val == 'function'){
    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    val.hasOwnProperty('name') || hide(val, 'name', key);
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./$.core":31,"./$.global":44,"./$.hide":46,"./$.uid":97}],77:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],78:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],79:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":61,"./$.an-object":19,"./$.ctx":32,"./$.is-object":53}],80:[function(require,module,exports){
'use strict';
var global      = require('./$.global')
  , $           = require('./$')
  , DESCRIPTORS = require('./$.descriptors')
  , SPECIES     = require('./$.wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":61,"./$.descriptors":34,"./$.global":44,"./$.wks":98}],81:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":61,"./$.has":45,"./$.wks":98}],82:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":44}],83:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":17,"./$.an-object":19,"./$.wks":98}],84:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],85:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":33,"./$.to-integer":92}],86:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./$.is-regexp')
  , defined  = require('./$.defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./$.defined":33,"./$.is-regexp":54}],87:[function(require,module,exports){
// https://github.com/ljharb/proposal-string-pad-left-right
var toLength = require('./$.to-length')
  , repeat   = require('./$.string-repeat')
  , defined  = require('./$.defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength)return S;
  if(fillStr == '')fillStr = ' ';
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};
},{"./$.defined":33,"./$.string-repeat":88,"./$.to-length":94}],88:[function(require,module,exports){
'use strict';
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./$.defined":33,"./$.to-integer":92}],89:[function(require,module,exports){
var $export = require('./$.export')
  , defined = require('./$.defined')
  , fails   = require('./$.fails')
  , spaces  = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec){
  var exp  = {};
  exp[KEY] = exec(trim);
  $export($export.P + $export.F * fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  }), 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./$.defined":33,"./$.export":37,"./$.fails":39}],90:[function(require,module,exports){
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":26,"./$.ctx":32,"./$.dom-create":35,"./$.global":44,"./$.html":47,"./$.invoke":48}],91:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./$.to-integer":92}],92:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],93:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":33,"./$.iobject":49}],94:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":92}],95:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":33}],96:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./$.is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./$.is-object":53}],97:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],98:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":44,"./$.shared":82,"./$.uid":97}],99:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":25,"./$.core":31,"./$.iterators":60,"./$.wks":98}],100:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , $export           = require('./$.export')
  , DESCRIPTORS       = require('./$.descriptors')
  , createDesc        = require('./$.property-desc')
  , html              = require('./$.html')
  , cel               = require('./$.dom-create')
  , has               = require('./$.has')
  , cof               = require('./$.cof')
  , invoke            = require('./$.invoke')
  , fails             = require('./$.fails')
  , anObject          = require('./$.an-object')
  , aFunction         = require('./$.a-function')
  , isObject          = require('./$.is-object')
  , toObject          = require('./$.to-object')
  , toIObject         = require('./$.to-iobject')
  , toInteger         = require('./$.to-integer')
  , toIndex           = require('./$.to-index')
  , toLength          = require('./$.to-length')
  , IObject           = require('./$.iobject')
  , IE_PROTO          = require('./$.uid')('__proto__')
  , createArrayMethod = require('./$.array-methods')
  , arrayIndexOf      = require('./$.array-includes')(false)
  , ObjectProto       = Object.prototype
  , ArrayProto        = Array.prototype
  , arraySlice        = ArrayProto.slice
  , arrayJoin         = ArrayProto.join
  , defineProperty    = $.setDesc
  , getOwnDescriptor  = $.getDesc
  , defineProperties  = $.setDescs
  , factories         = {}
  , IE8_DOM_DEFINE;

if(!DESCRIPTORS){
  IE8_DOM_DEFINE = !fails(function(){
    return defineProperty(cel('div'), 'a', {get: function(){ return 7; }}).a != 7;
  });
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)anObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    anObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$export($export.S + $export.F * !DESCRIPTORS, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
var createGetKeys = function(names, length){
  return function(object){
    var O      = toIObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };
};
var Empty = function(){};
$export($export.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = toObject(O);
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(typeof O.constructor == 'function' && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = anObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false)
});

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }
  return factories[len](F, args);
};

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$export($export.P, 'Function', {
  bind: function bind(that /*, args... */){
    var fn       = aFunction(this)
      , partArgs = arraySlice.call(arguments, 1);
    var bound = function(/* args... */){
      var args = partArgs.concat(arraySlice.call(arguments));
      return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
    };
    if(isObject(fn.prototype))bound.prototype = fn.prototype;
    return bound;
  }
});

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * fails(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
$export($export.P + $export.F * (IObject != Object), 'Array', {
  join: function join(separator){
    return arrayJoin.call(IObject(this), separator === undefined ? ',' : separator);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$export($export.S, 'Array', {isArray: require('./$.is-array')});

var createArrayReduce = function(isRight){
  return function(callbackfn, memo){
    aFunction(callbackfn);
    var O      = IObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      if(isRight ? index < 0 : length <= index){
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
};

var methodize = function($fn){
  return function(arg1/*, arg2 = undefined */){
    return $fn(this, arg1, arguments[1]);
  };
};

$export($export.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || methodize(createArrayMethod(0)),
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: methodize(createArrayMethod(1)),
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: methodize(createArrayMethod(2)),
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: methodize(createArrayMethod(3)),
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: methodize(createArrayMethod(4)),
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: methodize(arrayIndexOf),
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 20.3.3.1 / 15.9.4.4 Date.now()
$export($export.S, 'Date', {now: function(){ return +new Date; }});

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(this))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./$":61,"./$.a-function":17,"./$.an-object":19,"./$.array-includes":22,"./$.array-methods":23,"./$.cof":26,"./$.descriptors":34,"./$.dom-create":35,"./$.export":37,"./$.fails":39,"./$.has":45,"./$.html":47,"./$.invoke":48,"./$.iobject":49,"./$.is-array":51,"./$.is-object":53,"./$.property-desc":74,"./$.to-index":91,"./$.to-integer":92,"./$.to-iobject":93,"./$.to-length":94,"./$.to-object":95,"./$.uid":97}],101:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./$.export');

$export($export.P, 'Array', {copyWithin: require('./$.array-copy-within')});

require('./$.add-to-unscopables')('copyWithin');
},{"./$.add-to-unscopables":18,"./$.array-copy-within":20,"./$.export":37}],102:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./$.export');

$export($export.P, 'Array', {fill: require('./$.array-fill')});

require('./$.add-to-unscopables')('fill');
},{"./$.add-to-unscopables":18,"./$.array-fill":21,"./$.export":37}],103:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./$.export')
  , $find   = require('./$.array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./$.add-to-unscopables')(KEY);
},{"./$.add-to-unscopables":18,"./$.array-methods":23,"./$.export":37}],104:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./$.export')
  , $find   = require('./$.array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./$.add-to-unscopables')(KEY);
},{"./$.add-to-unscopables":18,"./$.array-methods":23,"./$.export":37}],105:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $export     = require('./$.export')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":32,"./$.export":37,"./$.is-array-iter":50,"./$.iter-call":55,"./$.iter-detect":58,"./$.to-length":94,"./$.to-object":95,"./core.get-iterator-method":99}],106:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./$.add-to-unscopables')
  , step             = require('./$.iter-step')
  , Iterators        = require('./$.iterators')
  , toIObject        = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":18,"./$.iter-define":57,"./$.iter-step":59,"./$.iterators":60,"./$.to-iobject":93}],107:[function(require,module,exports){
'use strict';
var $export = require('./$.export');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./$.fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , $$     = arguments
      , $$len  = $$.length
      , result = new (typeof this == 'function' ? this : Array)($$len);
    while($$len > index)result[index] = $$[index++];
    result.length = $$len;
    return result;
  }
});
},{"./$.export":37,"./$.fails":39}],108:[function(require,module,exports){
require('./$.set-species')('Array');
},{"./$.set-species":80}],109:[function(require,module,exports){
'use strict';
var $             = require('./$')
  , isObject      = require('./$.is-object')
  , HAS_INSTANCE  = require('./$.wks')('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"./$":61,"./$.is-object":53,"./$.wks":98}],110:[function(require,module,exports){
var setDesc    = require('./$').setDesc
  , createDesc = require('./$.property-desc')
  , has        = require('./$.has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';
// 19.2.4.2 name
NAME in FProto || require('./$.descriptors') && setDesc(FProto, NAME, {
  configurable: true,
  get: function(){
    var match = ('' + this).match(nameRE)
      , name  = match ? match[1] : '';
    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));
    return name;
  }
});
},{"./$":61,"./$.descriptors":34,"./$.has":45,"./$.property-desc":74}],111:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":30,"./$.collection-strong":27}],112:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./$.export')
  , log1p   = require('./$.math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

// V8 bug https://code.google.com/p/v8/issues/detail?id=3509
$export($export.S + $export.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./$.export":37,"./$.math-log1p":65}],113:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./$.export');

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

$export($export.S, 'Math', {asinh: asinh});
},{"./$.export":37}],114:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./$.export":37}],115:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./$.export')
  , sign    = require('./$.math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./$.export":37,"./$.math-sign":66}],116:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./$.export":37}],117:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./$.export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./$.export":37}],118:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./$.export');

$export($export.S, 'Math', {expm1: require('./$.math-expm1')});
},{"./$.export":37,"./$.math-expm1":64}],119:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./$.export')
  , sign      = require('./$.math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./$.export":37,"./$.math-sign":66}],120:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./$.export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum   = 0
      , i     = 0
      , $$    = arguments
      , $$len = $$.length
      , larg  = 0
      , arg, div;
    while(i < $$len){
      arg = abs($$[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./$.export":37}],121:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./$.export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./$.fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./$.export":37,"./$.fails":39}],122:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./$.export":37}],123:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./$.export');

$export($export.S, 'Math', {log1p: require('./$.math-log1p')});
},{"./$.export":37,"./$.math-log1p":65}],124:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./$.export":37}],125:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./$.export');

$export($export.S, 'Math', {sign: require('./$.math-sign')});
},{"./$.export":37,"./$.math-sign":66}],126:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./$.export')
  , expm1   = require('./$.math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./$.fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./$.export":37,"./$.fails":39,"./$.math-expm1":64}],127:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./$.export')
  , expm1   = require('./$.math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./$.export":37,"./$.math-expm1":64}],128:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./$.export":37}],129:[function(require,module,exports){
'use strict';
var $           = require('./$')
  , global      = require('./$.global')
  , has         = require('./$.has')
  , cof         = require('./$.cof')
  , toPrimitive = require('./$.to-primitive')
  , fails       = require('./$.fails')
  , $trim       = require('./$.string-trim').trim
  , NUMBER      = 'Number'
  , $Number     = global[NUMBER]
  , Base        = $Number
  , proto       = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF  = cof($.create(proto)) == NUMBER
  , TRIM        = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call(require('./$.descriptors') ? $.getNames(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), function(key){
    if(has(Base, key) && !has($Number, key)){
      $.setDesc($Number, key, $.getDesc(Base, key));
    }
  });
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./$.redefine')(global, NUMBER, $Number);
}
},{"./$":61,"./$.cof":26,"./$.descriptors":34,"./$.fails":39,"./$.global":44,"./$.has":45,"./$.redefine":76,"./$.string-trim":89,"./$.to-primitive":96}],130:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./$.export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./$.export":37}],131:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./$.export')
  , _isFinite = require('./$.global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./$.export":37,"./$.global":44}],132:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./$.export');

$export($export.S, 'Number', {isInteger: require('./$.is-integer')});
},{"./$.export":37,"./$.is-integer":52}],133:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./$.export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./$.export":37}],134:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./$.export')
  , isInteger = require('./$.is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./$.export":37,"./$.is-integer":52}],135:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./$.export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./$.export":37}],136:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./$.export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./$.export":37}],137:[function(require,module,exports){
// 20.1.2.12 Number.parseFloat(string)
var $export = require('./$.export');

$export($export.S, 'Number', {parseFloat: parseFloat});
},{"./$.export":37}],138:[function(require,module,exports){
// 20.1.2.13 Number.parseInt(string, radix)
var $export = require('./$.export');

$export($export.S, 'Number', {parseInt: parseInt});
},{"./$.export":37}],139:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./$.export');

$export($export.S + $export.F, 'Object', {assign: require('./$.object-assign')});
},{"./$.export":37,"./$.object-assign":68}],140:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(it) : it;
  };
});
},{"./$.is-object":53,"./$.object-sap":69}],141:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":69,"./$.to-iobject":93}],142:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./$.object-sap')('getOwnPropertyNames', function(){
  return require('./$.get-names').get;
});
},{"./$.get-names":43,"./$.object-sap":69}],143:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('getPrototypeOf', function($getPrototypeOf){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./$.object-sap":69,"./$.to-object":95}],144:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./$.is-object":53,"./$.object-sap":69}],145:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./$.is-object":53,"./$.object-sap":69}],146:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./$.is-object":53,"./$.object-sap":69}],147:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./$.export');
$export($export.S, 'Object', {is: require('./$.same-value')});
},{"./$.export":37,"./$.same-value":78}],148:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":69,"./$.to-object":95}],149:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;
  };
});
},{"./$.is-object":53,"./$.object-sap":69}],150:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(it) : it;
  };
});
},{"./$.is-object":53,"./$.object-sap":69}],151:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./$.export');
$export($export.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.export":37,"./$.set-proto":79}],152:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./$.classof')
  , test    = {};
test[require('./$.wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./$.redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./$.classof":25,"./$.redefine":76,"./$.wks":98}],153:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $export    = require('./$.export')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same-value')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.redefine-all')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
require('./$.set-to-string-tag')(P, PROMISE);
require('./$.set-species')(PROMISE);
Wrapper = require('./$.core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./$":61,"./$.a-function":17,"./$.an-object":19,"./$.classof":25,"./$.core":31,"./$.ctx":32,"./$.descriptors":34,"./$.export":37,"./$.for-of":42,"./$.global":44,"./$.is-object":53,"./$.iter-detect":58,"./$.library":63,"./$.microtask":67,"./$.redefine-all":75,"./$.same-value":78,"./$.set-proto":79,"./$.set-species":80,"./$.set-to-string-tag":81,"./$.species-constructor":83,"./$.strict-new":84,"./$.wks":98}],154:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./$.export')
  , _apply  = Function.apply;

$export($export.S, 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  }
});
},{"./$.export":37}],155:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $         = require('./$')
  , $export   = require('./$.export')
  , aFunction = require('./$.a-function')
  , anObject  = require('./$.an-object')
  , isObject  = require('./$.is-object')
  , bind      = Function.bind || require('./$.core').Function.prototype.bind;

// MS Edge supports only 2 arguments
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
$export($export.S + $export.F * require('./$.fails')(function(){
  function F(){}
  return !(Reflect.construct(function(){}, [], F) instanceof F);
}), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      if(args != undefined)switch(anObject(args).length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./$":61,"./$.a-function":17,"./$.an-object":19,"./$.core":31,"./$.export":37,"./$.fails":39,"./$.is-object":53}],156:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var $        = require('./$')
  , $export  = require('./$.export')
  , anObject = require('./$.an-object');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./$.fails')(function(){
  Reflect.defineProperty($.setDesc({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$":61,"./$.an-object":19,"./$.export":37,"./$.fails":39}],157:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./$.export')
  , getDesc  = require('./$').getDesc
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = getDesc(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./$":61,"./$.an-object":19,"./$.export":37}],158:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = require('./$.export')
  , anObject = require('./$.an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./$.iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./$.an-object":19,"./$.export":37,"./$.iter-create":56}],159:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var $        = require('./$')
  , $export  = require('./$.export')
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(anObject(target), propertyKey);
  }
});
},{"./$":61,"./$.an-object":19,"./$.export":37}],160:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./$.export')
  , getProto = require('./$').getProto
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./$":61,"./$.an-object":19,"./$.export":37}],161:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var $        = require('./$')
  , has      = require('./$.has')
  , $export  = require('./$.export')
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = $.getDesc(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = $.getProto(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./$":61,"./$.an-object":19,"./$.export":37,"./$.has":45,"./$.is-object":53}],162:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./$.export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./$.export":37}],163:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./$.export')
  , anObject      = require('./$.an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./$.an-object":19,"./$.export":37}],164:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./$.export');

$export($export.S, 'Reflect', {ownKeys: require('./$.own-keys')});
},{"./$.export":37,"./$.own-keys":71}],165:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./$.export')
  , anObject           = require('./$.an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.an-object":19,"./$.export":37}],166:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./$.export')
  , setProto = require('./$.set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.export":37,"./$.set-proto":79}],167:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var $          = require('./$')
  , has        = require('./$.has')
  , $export    = require('./$.export')
  , createDesc = require('./$.property-desc')
  , anObject   = require('./$.an-object')
  , isObject   = require('./$.is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = $.getDesc(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = $.getProto(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = $.getDesc(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    $.setDesc(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./$":61,"./$.an-object":19,"./$.export":37,"./$.has":45,"./$.is-object":53,"./$.property-desc":74}],168:[function(require,module,exports){
var $        = require('./$')
  , global   = require('./$.global')
  , isRegExp = require('./$.is-regexp')
  , $flags   = require('./$.flags')
  , $RegExp  = global.RegExp
  , Base     = $RegExp
  , proto    = $RegExp.prototype
  , re1      = /a/g
  , re2      = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW = new $RegExp(re1) !== re1;

if(require('./$.descriptors') && (!CORRECT_NEW || require('./$.fails')(function(){
  re2[require('./$.wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !(this instanceof $RegExp) && piRE && p.constructor === $RegExp && fiU ? p
      : CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f);
  };
  $.each.call($.getNames(Base), function(key){
    key in $RegExp || $.setDesc($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  });
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./$.redefine')(global, 'RegExp', $RegExp);
}

require('./$.set-species')('RegExp');
},{"./$":61,"./$.descriptors":34,"./$.fails":39,"./$.flags":41,"./$.global":44,"./$.is-regexp":54,"./$.redefine":76,"./$.set-species":80,"./$.wks":98}],169:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
var $ = require('./$');
if(require('./$.descriptors') && /./g.flags != 'g')$.setDesc(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./$.flags')
});
},{"./$":61,"./$.descriptors":34,"./$.flags":41}],170:[function(require,module,exports){
// @@match logic
require('./$.fix-re-wks')('match', 1, function(defined, MATCH){
  // 21.1.3.11 String.prototype.match(regexp)
  return function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  };
});
},{"./$.fix-re-wks":40}],171:[function(require,module,exports){
// @@replace logic
require('./$.fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  };
});
},{"./$.fix-re-wks":40}],172:[function(require,module,exports){
// @@search logic
require('./$.fix-re-wks')('search', 1, function(defined, SEARCH){
  // 21.1.3.15 String.prototype.search(regexp)
  return function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  };
});
},{"./$.fix-re-wks":40}],173:[function(require,module,exports){
// @@split logic
require('./$.fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  // 21.1.3.17 String.prototype.split(separator, limit)
  return function split(separator, limit){
    'use strict';
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined
      ? fn.call(separator, O, limit)
      : $split.call(String(O), separator, limit);
  };
});
},{"./$.fix-re-wks":40}],174:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":30,"./$.collection-strong":27}],175:[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $at     = require('./$.string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.export":37,"./$.string-at":85}],176:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./$.export')
  , toLength  = require('./$.to-length')
  , context   = require('./$.string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./$.fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , $$   = arguments
      , endPosition = $$.length > 1 ? $$[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./$.export":37,"./$.fails-is-regexp":38,"./$.string-context":86,"./$.to-length":94}],177:[function(require,module,exports){
var $export        = require('./$.export')
  , toIndex        = require('./$.to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res   = []
      , $$    = arguments
      , $$len = $$.length
      , i     = 0
      , code;
    while($$len > i){
      code = +$$[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$.export":37,"./$.to-index":91}],178:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./$.export')
  , context  = require('./$.string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./$.fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./$.export":37,"./$.fails-is-regexp":38,"./$.string-context":86}],179:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":57,"./$.string-at":85}],180:[function(require,module,exports){
var $export   = require('./$.export')
  , toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl   = toIObject(callSite.raw)
      , len   = toLength(tpl.length)
      , $$    = arguments
      , $$len = $$.length
      , res   = []
      , i     = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < $$len)res.push(String($$[i]));
    } return res.join('');
  }
});
},{"./$.export":37,"./$.to-iobject":93,"./$.to-length":94}],181:[function(require,module,exports){
var $export = require('./$.export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.export":37,"./$.string-repeat":88}],182:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./$.export')
  , toLength    = require('./$.to-length')
  , context     = require('./$.string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./$.fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , $$     = arguments
      , index  = toLength(Math.min($$.length > 1 ? $$[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./$.export":37,"./$.fails-is-regexp":38,"./$.string-context":86,"./$.to-length":94}],183:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./$.string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./$.string-trim":89}],184:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , DESCRIPTORS    = require('./$.descriptors')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setToStringTag = require('./$.set-to-string-tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./$.library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":61,"./$.an-object":19,"./$.descriptors":34,"./$.enum-keys":36,"./$.export":37,"./$.fails":39,"./$.get-names":43,"./$.global":44,"./$.has":45,"./$.is-array":51,"./$.keyof":62,"./$.library":63,"./$.property-desc":74,"./$.redefine":76,"./$.set-to-string-tag":81,"./$.shared":82,"./$.to-iobject":93,"./$.uid":97,"./$.wks":98}],185:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , redefine     = require('./$.redefine')
  , weak         = require('./$.collection-weak')
  , isObject     = require('./$.is-object')
  , has          = require('./$.has')
  , frozenStore  = weak.frozenStore
  , WEAK         = weak.WEAK
  , isExtensible = Object.isExtensible || isObject
  , tmp          = {};

// 23.3 WeakMap Objects
var $WeakMap = require('./$.collection')('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return frozenStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this._i];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = frozenStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./$":61,"./$.collection":30,"./$.collection-weak":29,"./$.has":45,"./$.is-object":53,"./$.redefine":76}],186:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":30,"./$.collection-weak":29}],187:[function(require,module,exports){
'use strict';
var $export   = require('./$.export')
  , $includes = require('./$.array-includes')(true);

$export($export.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./$.add-to-unscopables')('includes');
},{"./$.add-to-unscopables":18,"./$.array-includes":22,"./$.export":37}],188:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":28,"./$.export":37}],189:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $export  = require('./$.export')
  , $entries = require('./$.object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./$.export":37,"./$.object-to-array":70}],190:[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $          = require('./$')
  , $export    = require('./$.export')
  , ownKeys    = require('./$.own-keys')
  , toIObject  = require('./$.to-iobject')
  , createDesc = require('./$.property-desc');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , setDesc = $.setDesc
      , getDesc = $.getDesc
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key, D;
    while(keys.length > i){
      D = getDesc(O, key = keys[i++]);
      if(key in result)setDesc(result, key, createDesc(0, D));
      else result[key] = D;
    } return result;
  }
});
},{"./$":61,"./$.export":37,"./$.own-keys":71,"./$.property-desc":74,"./$.to-iobject":93}],191:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $export = require('./$.export')
  , $values = require('./$.object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./$.export":37,"./$.object-to-array":70}],192:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./$.export')
  , $re     = require('./$.replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./$.export":37,"./$.replacer":77}],193:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":28,"./$.export":37}],194:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./$.export')
  , $at     = require('./$.string-at')(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.export":37,"./$.string-at":85}],195:[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $pad    = require('./$.string-pad');

$export($export.P, 'String', {
  padLeft: function padLeft(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./$.export":37,"./$.string-pad":87}],196:[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $pad    = require('./$.string-pad');

$export($export.P, 'String', {
  padRight: function padRight(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./$.export":37,"./$.string-pad":87}],197:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
});
},{"./$.string-trim":89}],198:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
});
},{"./$.string-trim":89}],199:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $export = require('./$.export')
  , $ctx    = require('./$.ctx')
  , $Array  = require('./$.core').Array || Array
  , statics = {};
var setStatics = function(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = $ctx(Function.call, [][key], length);
  });
};
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill');
$export($export.S, 'Array', statics);
},{"./$":61,"./$.core":31,"./$.ctx":32,"./$.export":37}],200:[function(require,module,exports){
require('./es6.array.iterator');
var global      = require('./$.global')
  , hide        = require('./$.hide')
  , Iterators   = require('./$.iterators')
  , ITERATOR    = require('./$.wks')('iterator')
  , NL          = global.NodeList
  , HTC         = global.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype
  , ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
if(NLProto && !NLProto[ITERATOR])hide(NLProto, ITERATOR, ArrayValues);
if(HTCProto && !HTCProto[ITERATOR])hide(HTCProto, ITERATOR, ArrayValues);
},{"./$.global":44,"./$.hide":46,"./$.iterators":60,"./$.wks":98,"./es6.array.iterator":106}],201:[function(require,module,exports){
var $export = require('./$.export')
  , $task   = require('./$.task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.export":37,"./$.task":90}],202:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./$.global')
  , $export    = require('./$.export')
  , invoke     = require('./$.invoke')
  , partial    = require('./$.partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./$.export":37,"./$.global":44,"./$.invoke":48,"./$.partial":72}],203:[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.number.constructor');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.iterator');
require('./modules/es6.array.species');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-left');
require('./modules/es7.string.pad-right');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$.core');
},{"./modules/$.core":31,"./modules/es5":100,"./modules/es6.array.copy-within":101,"./modules/es6.array.fill":102,"./modules/es6.array.find":104,"./modules/es6.array.find-index":103,"./modules/es6.array.from":105,"./modules/es6.array.iterator":106,"./modules/es6.array.of":107,"./modules/es6.array.species":108,"./modules/es6.function.has-instance":109,"./modules/es6.function.name":110,"./modules/es6.map":111,"./modules/es6.math.acosh":112,"./modules/es6.math.asinh":113,"./modules/es6.math.atanh":114,"./modules/es6.math.cbrt":115,"./modules/es6.math.clz32":116,"./modules/es6.math.cosh":117,"./modules/es6.math.expm1":118,"./modules/es6.math.fround":119,"./modules/es6.math.hypot":120,"./modules/es6.math.imul":121,"./modules/es6.math.log10":122,"./modules/es6.math.log1p":123,"./modules/es6.math.log2":124,"./modules/es6.math.sign":125,"./modules/es6.math.sinh":126,"./modules/es6.math.tanh":127,"./modules/es6.math.trunc":128,"./modules/es6.number.constructor":129,"./modules/es6.number.epsilon":130,"./modules/es6.number.is-finite":131,"./modules/es6.number.is-integer":132,"./modules/es6.number.is-nan":133,"./modules/es6.number.is-safe-integer":134,"./modules/es6.number.max-safe-integer":135,"./modules/es6.number.min-safe-integer":136,"./modules/es6.number.parse-float":137,"./modules/es6.number.parse-int":138,"./modules/es6.object.assign":139,"./modules/es6.object.freeze":140,"./modules/es6.object.get-own-property-descriptor":141,"./modules/es6.object.get-own-property-names":142,"./modules/es6.object.get-prototype-of":143,"./modules/es6.object.is":147,"./modules/es6.object.is-extensible":144,"./modules/es6.object.is-frozen":145,"./modules/es6.object.is-sealed":146,"./modules/es6.object.keys":148,"./modules/es6.object.prevent-extensions":149,"./modules/es6.object.seal":150,"./modules/es6.object.set-prototype-of":151,"./modules/es6.object.to-string":152,"./modules/es6.promise":153,"./modules/es6.reflect.apply":154,"./modules/es6.reflect.construct":155,"./modules/es6.reflect.define-property":156,"./modules/es6.reflect.delete-property":157,"./modules/es6.reflect.enumerate":158,"./modules/es6.reflect.get":161,"./modules/es6.reflect.get-own-property-descriptor":159,"./modules/es6.reflect.get-prototype-of":160,"./modules/es6.reflect.has":162,"./modules/es6.reflect.is-extensible":163,"./modules/es6.reflect.own-keys":164,"./modules/es6.reflect.prevent-extensions":165,"./modules/es6.reflect.set":167,"./modules/es6.reflect.set-prototype-of":166,"./modules/es6.regexp.constructor":168,"./modules/es6.regexp.flags":169,"./modules/es6.regexp.match":170,"./modules/es6.regexp.replace":171,"./modules/es6.regexp.search":172,"./modules/es6.regexp.split":173,"./modules/es6.set":174,"./modules/es6.string.code-point-at":175,"./modules/es6.string.ends-with":176,"./modules/es6.string.from-code-point":177,"./modules/es6.string.includes":178,"./modules/es6.string.iterator":179,"./modules/es6.string.raw":180,"./modules/es6.string.repeat":181,"./modules/es6.string.starts-with":182,"./modules/es6.string.trim":183,"./modules/es6.symbol":184,"./modules/es6.weak-map":185,"./modules/es6.weak-set":186,"./modules/es7.array.includes":187,"./modules/es7.map.to-json":188,"./modules/es7.object.entries":189,"./modules/es7.object.get-own-property-descriptors":190,"./modules/es7.object.values":191,"./modules/es7.regexp.escape":192,"./modules/es7.set.to-json":193,"./modules/es7.string.at":194,"./modules/es7.string.pad-left":195,"./modules/es7.string.pad-right":196,"./modules/es7.string.trim-left":197,"./modules/es7.string.trim-right":198,"./modules/js.array.statics":199,"./modules/web.dom.iterable":200,"./modules/web.immediate":201,"./modules/web.timers":202}],204:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])


//# sourceMappingURL=all.js.map
