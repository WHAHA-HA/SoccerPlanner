/*

Help:
https://www.timroes.de/2015/07/29/using-ecmascript-6-es6-with-angularjs-1-x/
http://cameronjroe.com/writing/code/angular-movie-search/
http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html

*/
'use strict';

import 'babel-polyfill';
import './common.js';
import Config from './config.js';
import {providers} from './data.js';
import {models} from './models.js';
import {EditorDriective} from './editor/canvas.js';
import * as Driectives from './directives/directives.js';
import * as Main from './controllers/main.js';

angular.module('sp', [
  'ui.router',
  'gettext',
  'angularMoment',
  '720kb.datepicker',
  'ngDropdowns',
  'cfp.hotkeys',
  'ngFileUpload',
  'ngDialog',
  'dndLists',
  'angularValidator'
])

.constant('config', new Config())

.factory('providers', providers)
.factory('models', models)

.directive('spEditor', ()=>{return new EditorDriective()})
.directive('spTabs', ()=>{return new Driectives.SpTabs()})
.directive('spTabPane', ()=>{return new Driectives.SpTabPane()})

.directive('spDraggable', ()=>{return new Driectives.Draggable()})
.directive('spDroppable', ()=>{return new Driectives.Droppable()})

.directive('spSessions', (config)=>{return new Driectives.SpSessions(config)})
.directive('spDrills', (config)=>{return new Driectives.SpDrills(config)})
.directive('spSessionDrills', (config)=>{return new Driectives.SpSessionDrills(config)})

.filter('objOrderBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})

.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}])

.filter('range', function() {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<max; i++)
      input.push(i);
    return input;
  };
})

.filter('amUtc', function () {
  return function (value) {
    return moment.utc(value);
  };
})
.config(($stateProvider, $urlRouterProvider, config) => {

  var templateBasePath = config.templateBasePath;

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: templateBasePath + 'base.html',
      controller: Main.AppController,
      title: 'Home',
      resolve: {
        activeUserLoaded: function(models){
          return models.ActiveUser.checkLoginStatus()
          .then((user)=>{return user}, (res)=>{});
        }
      }
    })

    .state('app.login', {
      url: '/login/',
      loginRequired: false,
      params: {next:null},
      title: 'Login',
      views: {
        'content': {
          templateUrl: templateBasePath + 'login.html',
          controller: Main.LoginController
        }
      }
    })

    .state('app.home', {
      url: '/',
      loginRequired: true,
      title: 'Home',
      params: {drillkey:'new'},
      views: {
        'content': {
          templateUrl: templateBasePath + 'editor.html',
          controller: Main.DrillEditorController
        }
      }
    })

    .state('app.sample', {
      url: '/sample/',
      loginRequired: true,
      title: 'sample',
      views: {
        'content': {
          templateUrl: templateBasePath + 'sample.html',
        }
      }
    })

    .state('app.library', {
      url: '/library/',
      loginRequired: true,
      title: 'Library',
      views: {
        'content': {
          templateUrl: templateBasePath + 'home.html',
          controller: Main.LibraryController
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      loginRequired: true,
      title: 'Settings',
      params: {passValue:null},
      views: {
        'content': {
          templateUrl: templateBasePath + 'settings.html',
          controller: Main.SettingsController
        }
      }
    })

    .state('app.session', {
      url: '/session/{sessionkey}',
      loginRequired: true,
      title: 'Session',
      params: {passValue:null},
      views: {
        'content': {
          templateUrl: templateBasePath + 'session.html',
          controller: Main.SessionController
        }
      }
    })

    .state('app.sessionshare', {
      url: '/session/{sessionkey}/shareKey/{sharekey}',
      loginRequired: true,
      title: 'Shared Session',
      params: {passValue:null},
      views: {
        'content': {
          templateUrl: templateBasePath + 'session.html',
          controller: Main.SessionController
        }
      }
    })

    .state('app.sessionshareprint', {
      url: '/session/{sessionkey}/shareKey/{sharekey}/print',
      loginRequired: true,
      title: 'Shared Session Print',
      params: {passValue:null, printView:true},
      views: {
        'content': {
          templateUrl: templateBasePath + 'session.html',
          controller: Main.SessionController
        }
      }
    })

    .state('app.sessionprint', {
      url: '/session/{sessionkey}/print',
      loginRequired: true,
      title: 'Session Print',
      params: {passValue:null, printView:true},
      views: {
        'content': {
          templateUrl: templateBasePath + 'session.html',
          controller: Main.SessionController
        }
      }
    })

    .state('app.session.edit', {
      url: '/edit',
      loginRequired: true,
      title: 'Session Edit',
      params: {passValue:null},
      views: {
        'content': {
          templateUrl: templateBasePath + 'session.html',
          controller: Main.SessionController
        }
      }
    })

    .state('app.drillshare', {
      url: '/drill/{drillkey}/shareKey/{sharekey}',
      loginRequired: true,
      title: 'Shared Drill',
      params: {passValue:null},
      views: {
        'content': {
          templateUrl: templateBasePath + 'drill.html',
          controller: Main.DrillController
        }
      }
    })

    .state('app.drill', {
      url: '/drill/{drillkey}/',
      loginRequired: true,
      title: 'Drill',
      views: {
        'content': {
          templateUrl: templateBasePath + 'drill.html',
          controller: Main.DrillController
        }
      }
    })

    .state('app.drillprint', {
      url: '/drill/{drillkey}/print/',
      loginRequired: true,
      title: 'Drill Print',
      params: {passValue:null, printView:true},
      views: {
        'content': {
          templateUrl: templateBasePath + 'drill.html',
          controller: Main.DrillController
        }
      }
    })

    .state('app.drillshareprint', {
      url: '/drill/{drillkey}/shareKey/{sharekey}/print',
      loginRequired: true,
      title: 'Shared Drill Print',
      params: {passValue:null, printView:true},
      views: {
        'content': {
          templateUrl: templateBasePath + 'drill.html',
          controller: Main.DrillController
        }
      }
    })

    .state('app.drilleditor', {
      url: '/drill/{drillkey}/editor/',
      loginRequired: true,
      title: 'Drill Editor',
      params: {passValue:null},
      views: {
        'content': {
          templateUrl: templateBasePath + 'editor.html',
          controller: Main.DrillEditorController
        }
      }
    })

    .state('app.chooser', {
      url: '/chooser/{sessionkey}/{drillkey}/{mode}/{callback}/',
      loginRequired: true,
      title: 'Choose',
      views: {
        'content': {
          templateUrl: templateBasePath + 'chooser.html',
          controller: Main.ChooserController
        }
      }
    })

    .state('app.translations', {
      url: '/_translations/',
      loginRequired: true,
      title: 'Translations',
      views: {
        'content': {
          templateUrl: templateBasePath + 'translations.html',
          controller: Main.TranslationsController
        }
      }
    })

    .state('app.import', {
      url: '/import/',
      loginRequired: true,
      title: 'Import',
      views: {
        'content': {
          templateUrl: templateBasePath + 'import.html',
          controller: Main.ImportController
        }
      }
    })
    ;

  $urlRouterProvider.otherwise('/');
})

.run( ($rootScope, $state, gettextCatalog, config, models,$stateParams,
    providers, amMoment, $location, $window, gettext) => {
  config.dataProvider = new providers.DataProvider(config.apiBasePath);


  // $rootScope.rview = {
  //   screenClasses:[],
  //   title: '',
  //   mainMenu: 'main',
  //   displayTitle: '',
  //   largeLogo: true,
  // }

  /** THESE are the additional text to be translated **/
  let additionalTranslations = [
    gettext('Select & Drag'),
    gettext('Pen'),
    gettext('Player Path'),
    gettext('Ball Path'),
    gettext('Dribble'),
    gettext('Highlight'),
    gettext('Triangle'),
    gettext('Rectangle'),
    gettext('Circle'),
    gettext('Shape'),
    gettext('Text Box')
  ]

  $rootScope.lastState = null;
  $rootScope.user = models.ActiveUser.user;
  $rootScope.local = null;

  $rootScope.setLocal = function(local){
    if($rootScope.local == local){
      return;
    }

    $rootScope.local = local;
    var [lang, country] = local.split('-');
    // gettextCatalog.setCurrentLanguage(lang);
    gettextCatalog.setCurrentLanguage(local);

    // if(lang != 'en'){
    //   gettextCatalog.loadRemote("/js/languages/" + lang + ".json");
    // }
    // gettextCatalog.debug = true;

    if(config.supportedDateLocal.indexOf(local) > -1){
      amMoment.changeLocale(local);
    }else if(config.supportedDateLocal.indexOf(lang) > -1){
      amMoment.changeLocale(lang);
    }else{
      //console.log('Unsupported Date Local', local);
      amMoment.changeLocale('en');
    }

    }

  $rootScope.$state = $state;
  $rootScope.showBackBtn = true;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
      // to be used for back button //won't work when page is reloaded.
      $rootScope.previousState_name = fromState.name;
      $rootScope.previousState_params = fromParams;
      $rootScope.currentState_name = $state.$current.self.name;
      // console.log($rootScope.currentState_name+" <-- "+$rootScope.previousState_name,$rootScope.previousState_params);
      if($rootScope.previousState_name == 'app.login') {
        $rootScope.showBackBtn = false;
      }
      else {
        $rootScope.showBackBtn = true;
      }

      if($window){
        $window.ga('send', 'pageview', { page: $location.path(), title: $rootScope.documentTitle });
      }

  });
  //back button function called from back button's ng-click="back()"
  $rootScope.back = function() {
      if($rootScope.previousState_name == 'app.login') {
        $state.go($rootScope.currentState_name);
      }
      else {
        $state.go($rootScope.previousState_name,$rootScope.previousState_params);
      }
  };

  $rootScope.$on('$stateChangeStart', (e, to, toParams, fromState, fromParams) => {

    $rootScope.rview = {
      screenClasses:[],
      title: '',
      mainMenu: 'main',
      displayTitle: '',
      largeLogo: true,
      isEdit: false,
    }

    $rootScope.documentTitle = '';
    $rootScope.lastState = fromState.name;

    var title = to.title;
    var className = 'screen-' + to.name.replace('app.', '');
    $rootScope.rview.screenClasses = [className];

    if(title){
      $rootScope.documentTitle = title + ' - ' + config.name;
      $rootScope.rview.title = title;
      title += ' | ' + config.name;
    }else{
      $rootScope.rview.title = '';
      title = config.name;
    }

    $rootScope.title = title;

    if(models.ActiveUser && models.ActiveUser.user){
      $rootScope.setLocal(models.ActiveUser.user.local);
    }

    if( (to.loginRequired !== true) || (to.isLoginPage === true) ){
      return;
    }

    if(! models.ActiveUser.isLoggedIn()){
      models.ActiveUser.checkLoginStatus().then(
        (user)=>{
          $rootScope.setLocal(user.local);
        },
        (err)=>{
          var nextPath = nextPath || to.name;
          var nextParams = nextParams || toParams;

          if(e){
            e.preventDefault();
          }
          $state.go('app.login', {next:{path:nextPath, params:nextParams}});
        }
      )
    }

  });

})

;
