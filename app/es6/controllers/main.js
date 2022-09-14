import {EditorSetup} from './../editor/setup.js';
import {LoadExtraAssert, LoadAllPlayerAssert, CreateCanvasElement} from './../editor/draw.js';
import {importDrill, importSession} from './../editor/import_data.js';

export class AppController{
  constructor($scope, $rootScope, $state, config, models, gettextCatalog){
    var parser = new UAParser();

    var getBrowserInfo = parser.getResult();
    $rootScope.BrowserInfo = {};
    $rootScope.BrowserInfo.name = getBrowserInfo.browser.name;
    $rootScope.showBrowserWarning = false;


   if(getBrowserInfo.browser.major) {
     $rootScope.BrowserInfo.version = parseInt(getBrowserInfo.browser.major);
     switch($rootScope.BrowserInfo.name) {
      case 'Chrome' : {
                        if($rootScope.BrowserInfo.version >= 43) {
                          $rootScope.showBrowserWarning = false;
                        }
                        else {
                          $rootScope.showBrowserWarning = true;
                        }
                        break;
                      }
      case 'Firefox' : {
                        if($rootScope.BrowserInfo.version >= 39) {
                          $rootScope.showBrowserWarning = false;
                        }
                        else {
                          $rootScope.showBrowserWarning = true;
                        }
                        break;
                      }
      case 'IE' : {
                    if($rootScope.BrowserInfo.version >= 11) {
                      $rootScope.showBrowserWarning = false;
                    }
                    else {
                      $rootScope.showBrowserWarning = true;
                    }
                    break;
                  }
      case 'MSIE' : {
                    if($rootScope.BrowserInfo.version >= 11) {
                      $rootScope.showBrowserWarning = false;
                    }
                    else {
                      $rootScope.showBrowserWarning = true;
                    }
                    break;
                  }
      case 'Safari': {
                    if($rootScope.BrowserInfo.version >= 8) {
                      $rootScope.showBrowserWarning = false;
                    }
                    else {
                      $rootScope.showBrowserWarning = true;
                    }
                    break;
                  }
      case 'Mobile Safari': {
                    if($rootScope.BrowserInfo.version >= 8) {
                      $rootScope.showBrowserWarning = false;
                    }
                    else {
                      $rootScope.showBrowserWarning = true;
                    }
                    break;
                  }

      case 'Edge' : {
                    $rootScope.showBrowserWarning = true;
                    break;
                  }
     }
   }

   else {
      $rootScope.showBrowserWarning = false;
   }


    this.local = null;
    $rootScope.rview.mainMenu = 'main';
    $rootScope.rview.displayTitle = '';
    $rootScope.rview.largeLogo = true;

    $rootScope.$watch('user', (old, updated) => {
      $rootScope.setLocal(updated.local);
    });

    $scope.doLogout = this.doLogout.bind(this, $scope, $state, models)
  }

  doLogout($scope, $state, models){
    models.ActiveUser.logout().then(()=>{
      $state.go('app.home', {}, { reload: true });
      // window.location.reload();
    });
  }
}

export class LibraryController{
  constructor($scope, $rootScope, config){

    $rootScope.rview.menuItem = 'library';
      $scope.view = this.view = {ready: false, sessions:[], drills:[]};
      config.dataProvider.sessions().then((data)=>{
        if(data.data.ok){
        this.view.sessions = data.data.sessions;
        this.view.drills = data.data.drills;
        this.view.ready = true;
        this.activeSort = {
              name: 'name',
              rev: true
        } ;
      }else{
        console.log('Error fetching session', data);
      }
    }, (err)=>{
          console.log('Error fetching session', err)
        });
  }
}


export class SessionController{
  constructor($scope, $rootScope, $stateParams, $state, ngDialog, config){

    $rootScope.rview.menuItem = 'session';
    $scope.view = this.view = {ready: false, readmode:false};
    $scope.input = this.input = {};
    $scope.data = this.data = {};
    let shareData = {currentOwner:$rootScope.user.id};

    $scope.view.printView = ($stateParams.printView)?true:false;
    this.data.pageOption = 3;
    $scope.data.pageSelect = [1,2,3,4];
    $scope.data.pushDrill = [];

    $scope.SelectedView = function() {
      $scope.pagination($scope.data.pageOption);
    }

    $scope.view.showBlack = '0';

    $scope.view.drillkey = null;
    if($stateParams.passValue){
      $scope.view.drillkey = $stateParams.passValue.drillkey || null;
    }

    this.session = null;
    this.shareData = shareData;

    $scope.post = this.post = {
      started: false,
      error: null
    };

    if($stateParams.sessionkey == 'new'){
      this.view.ready = true;
      this.view.createMode = true;
      this.view.sessionkey = null;
      this.view.heading = 'New Session';
      this.input.key = null;
    }else if($stateParams.passValue){
      this.view.justsaved = $stateParams.passValue.justsaved;
      this.session = $stateParams.passValue.session;
    }

    if(this.session){
      this.prepareData();
    }else{
      config.dataProvider.getSession($stateParams.sessionkey, $stateParams.sharekey).then((data)=>{
        if(data.data.ok){
          this.session = data.data.session;
          this.author = $rootScope.user;
          $scope.author = this.author;

          this.prepareData();
        }else{
          //console.log('Error fetching session', data);
        }
      }, (err)=>{
            //console.log('Error fetching session', err)
          });
    }

    $scope.copySession = () => {
      config.dataProvider.copySession($stateParams.sessionkey, $stateParams.sharekey).then((data)=>{
        $state.go('app.library');
      }, (err)=>{
        //console.log('Error in copying session', err)
      });
    }

    $scope.showShare = () =>{
      ngDialog.open({
        template: config.templateBasePath + 'share.html',
        showClose: true,
        controller($scope, $window) {
          $scope.showSessionShare = true;
          $scope.shareUrl = $state.href('app.sessionshare',
          {sessionkey:shareData.key, sharekey:shareData.shareToken},
          {absolute:true});
        }
      })
    }

    $scope.printSession = ()=>{
      if(this.view.shareMode){
        $state.go('app.sessionshareprint', {'sessionkey': $stateParams.sessionkey, 'sharekey': $stateParams.sharekey});
      }
      else{
        $state.go('app.sessionprint', {'sessionkey': $stateParams.sessionkey});
      }
    }


    $scope.doSave = function(){
      this.post.started = true;
      config.dataProvider.saveSession(this.input).then(

        (data) => {
          if(data.data.ok){
            var session = data.data.session;
            if($scope.view.session){
              var drills = $scope.view.session.drills;
              session.drills = drills;

            }

            if($scope.view.drillkey){
              config.dataProvider.attachDrill(session.key, $scope.view.drillkey).then(()=>{
                this.post.started = false;
                $state.go('app.session.edit', {sessionkey:session.key});
              }, (err)=>{
                this.post.error = err.data.error_msg;
                this.post.started = false;
              })
            }
            else{
              this.post.started = false;
              var passValue = {
                justsaved: true,
                session: session
              }
              $state.go('app.session.edit', {sessionkey:session.key, passValue});
            }

          }else{
            var err = data.data;
            this.post.error = err.error_msg;
            this.post.started = false;
          }

        },

        (err) => {
          this.post.error = err.data.error_msg;
          this.post.started = false;
        }
      )
    }

    $scope.pagination = function(data){
      var viewData = data;
      $scope.data.selectedView = [];
      for (var i = 0; i < $scope.view.session.drills.length; i+=viewData) {
        $scope.data.selectedView.push($scope.view.session.drills.slice(i,i+viewData));
      }
    }
  }

  prepareData(){
    this.input.name = this.session.name;
    this.input.description = this.session.description;
    this.input.date = this.session.date;
    this.input.team = this.session.team;
    this.input.duration = this.session.duration;
    this.input.key = this.session.key;

    if(this.input.date){
      var _m = moment(this.session.date).utc();
      this.input.date = (new Date(_m.year(), _m.month(), _m.date())) +'';
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
    if(!this.view.session.drills) {
      this.view.session.drills = [];
    }
    for (var i = 0; i < this.view.session.drills.length; i++) {
        this.view.session.drills[i].order = i+1;
      }
    for (var i = 0; i < this.view.session.drills.length; i+=this.data.pageOption) {
      this.data.selectedView.push(this.view.session.drills.slice(i,i+this.data.pageOption));
      // //console.log(this.data.selectedView);
    }
  }

}



export class LoginController{
  constructor($scope, $state, $stateParams, config, models, gettextCatalog){

    $scope.postUser = this.postUser = {};
    $scope.post = this.post = {
      started: false,
      error: null
    };

    $scope.next = this.next = $stateParams.next || {};
    $scope.doLogin = this.doLogin.bind(this, $state, $scope, models, gettextCatalog);

  }

  doLogin($state, $scope, models, gettextCatalog){

    this.post.started = true;
    this.post.error = null;
    var user = this.postUser;

    models.ActiveUser.login(user.email, user.password).then(

      (user) => {
        var path = this.next.path || 'app.home';
        var params = this.next.params || {};
        $state.go(
          this.next.path || 'app.home',
          this.next.params || {}, {reload: true});
        this.post.started = false;
        $scope.$digest();
      },

      (err) => {
        if(err.error == 'MEMBERSHIP_FAILED'){
          this.post.error = 'You need a Premium account to access the Session Planner. Upgrade to premium ( https://soccerspecific.com/plans/member-benefits/)';
        }else{
          this.post.error = 'Check your email and password';
        }
        this.post.started = false;
        $scope.$digest();
      }
    )
  }
}

export class DrillController{
  constructor($scope, $rootScope, $state, $stateParams, config){

    $scope.drill = {};
    $scope.ts = moment().unix();
    $scope.view = this.view = {ready: false};
    $scope.view.printView = ($stateParams.printView)?true:false;
    $scope.updating = false;
    if($scope.view.printView){
      $rootScope.rview.menuItem = 'drillprint';
    }
    else{
      $rootScope.rview.menuItem = 'drill';
    }

    $scope.view.showBlack = '0';

    let shareData = {currentOwner:$rootScope.user.id};
    this.shareData = shareData;

    $scope.showShare = () =>{
      
      ngDialog.open({
        template: config.templateBasePath + 'share.html',
        showClose: true,
        controller($scope, $window) {
          $scope.showSessionShare = false;
          $scope.shareUrl = $state.href('app.drillshare',
          {drillkey:shareData.key, sharekey:shareData.shareToken},
          {absolute:true});
        }
      })
    }

    $scope.printDrill = ()=>{
      if(this.view.shareMode){
        $state.go('app.drillshareprint', {'drillkey': $stateParams.drillkey, 'sharekey': $stateParams.sharekey});
      }
      else{
        $state.go('app.drillprint', {'drillkey': $stateParams.drillkey});
      }
    }

    $scope.updateDrill = ()=>{
      $scope.updating = true;
      var postData = {
        key: $scope.drill.key,
        name: $scope.drill.name,
        setupText: $scope.drill.setupText,
        instructText: $scope.drill.instructText,
        coachText: $scope.drill.coachText,
        pitch: $scope.drill.pitch,
        duration: $scope.drill.duration,
      };

      config.dataProvider.saveDrill(postData).then((data)=>{
        $scope.updating = false;
      }, (err)=>{
      });
    }



    $scope.copyDrill = () => {
      config.dataProvider.copyDrill($stateParams.drillkey, $stateParams.sharekey).then((data)=>{
        $state.go('app.library');
      }, (err)=>{
          //console.log('Error in copying drill', err)
        });
    }

    var sharekey = $stateParams.sharekey || null;

    config.dataProvider.getDrill($stateParams.sessionkey, $stateParams.drillkey, sharekey).then((data)=>{
      if(data.data.ok){
        $scope.drill = data.data.drill;
        $scope.author = $rootScope.user;
        this.view.ready = true;
        

        this.view.shareMode = $scope.drill.owner != this.shareData.currentOwner;
      }else{
        //console.log('Error fetching drill', data);
      }
    }, (err)=>{
      //console.log('Error fetching drill', err)
    });

  }
}

export class DrillEditorController{
  constructor($scope, $rootScope, $stateParams, $state, config, gettext, $window, $element, $document, gettextCatalog){
    $scope.WindowWidth = window.innerWidth;
    update_disp_changes($scope.WindowWidth);

    $(window).resize(function(){
      $scope.WindowWidth = window.innerWidth;
        $scope.$apply(function(){
          $scope.WindowWidth = window.innerWidth;
          update_disp_changes($scope.WindowWidth);
        });
    });


    function update_disp_changes(WindowWidth) {
      $scope.hideViewableScreen = false;
      $scope.ShowViewableScreen = true;

      if($scope.WindowWidth < 1024){
        $scope.ShowViewableScreen = false;
        $scope.hideViewableScreen = true;
      }
      else if ($scope.WindowWidth == 1024) {
        $scope.ChangeClase = true;
        $scope.ShowViewableScreen = true;
      }
      else {
        if ($scope.WindowWidth > 1024 && $scope.WindowWidth < 1226) {
          $scope.ChangeClase = true;
        }
        else {
          $scope.ChangeClase = false;
        }
        $scope.ShowViewableScreen = true;
      }
    }



    $scope.svgIconAssertsUrl = config.templateBasePath + 'assertsWork.svg';
    $rootScope.rview.mainMenu = 'drill';
    $rootScope.rview.largeLogo = false;
    $scope.editorSetup = EditorSetup;
    $rootScope.rview.isEdit = $scope.isEdit = ($stateParams.drillkey != 'new');

    this.drill = $scope.drill = {
      name: gettextCatalog.getString("Insert Name of Drill Here")
    };

    $rootScope.rview.editableTitleData = $scope.drill;

    this.view = $scope.view = {
      fieldboxOpenned: false,
      ready: false,
    }

    $scope.expanBox = function() {
      $scope.view.fieldboxOpenned=true;
    }


    $document.bind('click', function(event){
      if($scope.view.fieldboxOpenned){
        if(event.toElement.id != 'openFieldBox' && event.toElement.id != 'openedFieldBox' && event.toElement.id != 'openFieldIcon') {
          $scope.view.fieldboxOpenned=false;
          $scope.$apply();
        }
      }
    });

    $scope.view.sessionkey = null;
    if($stateParams.passValue){
      $scope.view.sessionkey = $stateParams.passValue.sessionkey || null;
    }

    $rootScope.keyDownOperations = ($event)=>{
      var $this = $(event.target);
      if(event.which === 13) // Enter key
      {
        $this.focusout();
      }
    }

    $scope.onAssertLoaded = ()=>{

      EditorSetup.activeDrill = this.drill;
      // $scope.view.OptionalFieldIdx =
      // $scope.view.ready = true;
      var _a = Snap('#svgIconAsserts')
      LoadAllPlayerAssert(_a);
      LoadExtraAssert(_a);
      _a.attr({width:0, height:0});

      if($stateParams.passValue && $stateParams.passValue.drill && $stateParams.passValue.drill.data){
        angular.extend($scope.drill, $stateParams.passValue.drill);
        $scope.view.ready = true;
      }else if($scope.isEdit){
        config.dataProvider.getDrill(null, $stateParams.drillkey, null).then((data)=>{
          if(data.data.ok){
            angular.extend($scope.drill, data.data.drill);
            $scope.view.ready = true;
          }else{
            //console.log('Error fetching session', data);
          }
        }, (err)=>{
          //console.log('Error fetching session', err)
        });
      }else{
        $scope.view.ready = true;
      }

    }
    $rootScope.clearDrill = () => {
      EditorSetup.activeEditor.clear();
    }

    $rootScope.keyDownOperations = ($event)=>{
      var $this = $(event.target);
      if(event.which === 13)
      {
        $this.blur();
      }
    }

    $rootScope.saveAsDrill = () => {
      $rootScope.saveDrill(false, true);
    }

    $rootScope.saveDrill = (goPrintPage, isSaveAs) => {
      $rootScope.rview.actionSaveStarted = true;

      CreateCanvasElement('convertCanvas').then((data)=>{
        var drill = this.drill;
        var {canvas, imageData, imageDataBlack, svgText} = data;

        if(isSaveAs){
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
          thumpDataBlack: imageDataBlack,
        };

        config.dataProvider.saveDrill(postData, this.view.sessionkey).then((data)=>{
          var _drill = data.data.drill;
          var drillkey = _drill.key;
          if(goPrintPage){
            if(this.view.shareMode){
              $state.go('app.drillshareprint', {'drillkey': drillkey, 'sharekey': $stateParams.sharekey});
            }
            else{
              $state.go('app.drillprint', {'drillkey': drillkey});
            }
          }
          else if(!$scope.isEdit || isSaveAs){
            $state.go('app.drilleditor', {drillkey:drillkey});
          }

          $rootScope.rview.actionSaveStarted = false;
        }, (err)=>{
          $rootScope.rview.actionSaveStarted = false;
          //console.log('Failed', err);
          alert('Error while saving')
        });

      });

    }

    $rootScope.printDrill = ()=>{
      $rootScope.saveDrill(true)
    }

  }

}


export class ChooserController{
  constructor($scope, $rootScope, $stateParams, $state, $q, config){

     $rootScope.rview.menuItem = 'choose';
    $scope.sessionkey = $stateParams.sessionkey;
    $scope.drillkey = $stateParams.drillkey;
    $scope.addedDrills = [];
    $scope.mode = $stateParams.mode;
    $scope.callback = $stateParams.callback;

    $scope.view = this.view = {ready: false, sessions:[], drills:[], addedDrills: $scope.addedDrills};

    $scope.onSessionSelected = function(session){
      return new Promise((resolve, reject) => {
        config.dataProvider.attachDrill(session.key, $scope.drillkey).then(()=>{
          $state.go('app.library');
          resolve();
        }, ()=>{
          reject();
        })
      });
    }

    $scope.onDrillsAdd = function(drills, index){
      drills = drills || $scope.addedDrills;
      index = index || 0;

      return new Promise((resolve, reject) => {
        if(index >= drills.length){
          $state.go('app.session', {sessionkey:$scope.sessionkey});
          resolve();
        }
        else{
          config.dataProvider.attachDrill($scope.sessionkey, drills[index]).then(()=>{
            return $scope.onDrillsAdd(drills, index+1);
          }, ()=>{
            reject();
          })
        }
      });
    }

    config.dataProvider.sessions().then((data)=>{
      if(data.data.ok){
        this.view.sessions = data.data.sessions;
        this.view.drills = data.data.drills;

        this.view.ready = true;

      }else{
        //console.log('Error fetching session', data);
      }
    }, (err)=>{
          //console.log('Error fetching session', err)
        });
  }
}

export class SettingsController{
  constructor($scope, $rootScope, Upload, config, $state){

    $rootScope.rview.menuItem = 'settings';
    $scope.view = this.view = {ready: true, user:$rootScope.user, loading:false, error:false};
    this.view.languages = config.suportedLocale;
    this.view.local = config.suportedLocale[0];
    if(this.view.user.local){
      this.view.languages.forEach((l, i)=>{
        if(l.key == this.view.user.local){
          this.view.local = config.suportedLocale[i];
        }
      });
    }

    $scope.showError = (err)=>{
      this.view.loading = false;
      this.view.error = true;
      //console.log(err);
    }

    $scope.saveProfile = ()=>{
      this.view.loading = true;
      Upload.upload({
        url: config.dataProvider.getUrl('/me'),
        data:{
          file: this.view.file,
          name: this.view.user.name,
          local: this.view.local.key
        }
      }).then((data)=>{
        if(data.data.ok){
          $rootScope.hideEverything = true;
          window.location.href = '/#/';
          window.location.reload();
        }else{
          $scope.showError(data.data.error);
        }
      }, (data)=>{
        $scope.showError(data.data.error);
      })
    }
  }
}


export class SessionPrintController{
  constructor($scope, $rootScope, $stateParams, config){
     $rootScope.rview.menuItem = 'sessionprint';
    $scope.sessionkey = $stateParams.sessionkey;

    $scope.view = this.view = {ready: false, session:[]};

    config.dataProvider.getSession($stateParams.sessionkey).then((data)=>{
      if(data.data.ok){
        $scope.session = data.data.session;
        this.view.ready = true;

      }else{
        //console.log('Error fetching session', data);
      }
    }, (err)=>{
          //console.log('Error fetching session', err)
        });

  }
}

export class DrillPrintController{
  constructor($scope, $rootScope, config){
     $rootScope.rview.menuItem = 'drillprint';
  }
}


export class TranslationsController{
  constructor($scope, $rootScope, $stateParams, $state, $q, config, ngDialog){

     $rootScope.rview.menuItem = 'translation';
    $scope.view = this.view = {
      ready: false, translations:[], items:[],
      suportedLocale: config.suportedLocale,
      mode: 'list',
      saving: false,
      insync: false,
      selectedLanguage: '',
      selectedLanguageName: '',
    };

    $scope.selectLanguage = function(lang, name) {

      this.view.mode = 'loading';
      this.view.selectedLanguage = lang;
      this.view.selectedLanguageName = name;

      if(this.view.translations.indexOf(lang) == -1){
        this.view.mode = 'create';
        return;
      }

      config.dataProvider.getTranslationsLang(lang).then((data)=>{
        if(data.data.ok){
          this.view.items = data.data.items;
          this.view.mode = 'translate';

          // this.view.items.forEach((item, i)=>{
          //   item.msgstr = ['x ' + item.msgid]
          // });

        }else{
          //console.log('Error fetching translation for language', data);
        }
      }, (err)=>{
        //console.log('Error fetching translation for language', err)
      });

    }

    $scope.createNewLanguage = function(lang){
      this.view.saving = true;

      config.dataProvider.createTranslationsLang(lang)
      .then((data)=>{
        if(!data.data.ok){
          //console.log('Error create translation for language', data);
          return;
        }

        this.view.translations.push(lang);
        return config.dataProvider.getTranslationsLang(lang);
      })
      .then((data)=>{
        if(data.data.ok){
          this.view.items = data.data.items;
          this.view.mode = 'translate';
          this.view.saving = false;
        }else{
          //console.log('Error fetching translation for language', data);
        }
      }, (err)=>{
            //console.log('Error create translation for language', err)
          });

    }

    $scope.saveTranslation = function(lang){
      this.view.saving = true;

      config.dataProvider.saveTranslationsLang(lang, this.view.items)
      .then((data)=>{
        if(!data.data.ok){
          //console.log('Error saving translation for language', data);
          return;
        }
        return config.dataProvider.getTranslationsLang(lang);
      })
      .then((data)=>{
        if(data.data.ok){
          this.view.items = data.data.items;
          this.view.mode = 'translate';
          this.view.saving = false;
          ngDialog.open({
          template: config.templateBasePath + 'message.html',
          showClose: true,
          controller($scope, $window) {
            $scope.message = "Translation Saved";
          }
        })
        }else{
          //console.log('Error fetching translation for language', data);
        }
      }, (err)=>{
        //console.log('Error saving translation for language', err)
      });
    }

    $scope.syncTranslation = function(lang){
      this.view.insync = true;

      config.dataProvider.syncTranslationsLang(lang)
      .then((data)=>{
        if(!data.data.ok){
          //console.log('Error saving translation for language', data);
          return;
        }

        this.view.items = data.data.items;
        this.view.mode = 'translate';
        this.view.insync = false;
      }, (err)=>{
          //console.log('Error saving translation for language', err)
        });
    }

    config.dataProvider.translations().then((data)=>{
      if(data.data.ok){
        this.view.items = data.data.items;
        this.view.translations = data.data.translations;

        this.view.ready = true;

      }else{
        //console.log('Error fetching translation information', data);
      }
    }, (err)=>{
          //console.log('Error fetching translation informations', err)
        });
  }
}

export class ImportController{
  constructor($scope, $rootScope, config, Upload){

    $scope.svgIconAssertsUrl = config.templateBasePath + 'assertsWork.svg';

    $rootScope.rview.menuItem = 'import';
    $scope.view = this.view = {'file': null};
    $scope.data = this.data = {};
    $scope.EditorSetup = EditorSetup;

    $scope.view.uploading = false;
    $scope.view.uploadingError = false;
    $scope.view.importing = false;
    this.drill = $scope.drill = {

    };

    this.session = $scope.session = {};

    this.data.fileDrills = {};

    $scope.$watch('view.file', (updated, old) => {
      if(updated || old){
        $scope.newFileSelected();
      }
    });

    $scope.newFileSelected = ()=> {

      $scope.view.uploadingError =false;
      $scope.view.uploading = false;
      $scope.view.importing = false;
      $scope.view.imported = false;

      $scope.data.importingDrillFiles = [];
      $scope.data.importingSessionFiles = [];
      $scope.importXml();
    }

    $scope.importXml = ()=>{
      $scope.view.uploading = true;
        Upload.upload({
          url: config.dataProvider.getUrl('/xmlupload'),
          data:{
            file: this.view.file,
          }
        }).then((data)=>{
          $scope.view.uploading = false;
          if(data.data.ok){
            this.data.sessions = data.data.sessions;
            this.data.drills = data.data.drills;
            $scope.processImportFiles();
          }else{
            $scope.view.uploadingError = true;
          }
        }, (data)=>{
          $scope.view.uploadingError = true;
        })
    }

    $scope.addSessionDrills = (session, pos)=>{
      var pos = pos || 0;
      if(!session.drills[pos]){
        $scope.onSeesionDrillsAdded(session);
        return;
      }
      var drillFileName = session.drills[pos];
      pos += 1;
      if(this.data.fileDrills && this.data.fileDrills[drillFileName]){
        var drillKey = this.data.fileDrills[drillFileName].key;
        config.dataProvider.attachDrill(session.session.key, drillKey, {orderIndex: pos}).then(()=>{
          session.addedDrills.push(drillKey);
          $scope.addSessionDrills(session, pos);
        }, ()=>{
          $scope.addSessionDrills(session, pos);
        })
      }
      else{
        $scope.addSessionDrills(session, pos);
      }
    }

    $scope.onSessionsImported = ()=>{
      for (var i = 0; i < $scope.data.importingSessionFiles.length; i++) {
        var sf = $scope.data.importingSessionFiles[i];
        $scope.addSessionDrills(sf);
      };
    }

    $scope.importSessionFromData = (pos)=>{
      var pos = pos || 0;
      if(!$scope.data.importingSessionFiles[pos]){
        $scope.onSessionsImported();
        return;
      }
      var currentCreatingSession = $scope.data.importingSessionFiles[pos];
      currentCreatingSession.processing = true;
      var data = $scope.data.sessions[currentCreatingSession.id];
      this.session = importSession(data);
      currentCreatingSession.drills = this.session.drills;
      pos += 1;
      config.dataProvider.saveSession(this.session).then(
        (data) => {
          currentCreatingSession.processing = false;
          currentCreatingSession.processed = true;
          currentCreatingSession.session = data.data.session;
          $scope.importSessionFromData(pos);
        },

        (err) => {
          currentCreatingSession.processing = false;
          currentCreatingSession.processed = false;
          currentCreatingSession.error = true;
          $scope.importSessionFromData(pos);
        }
      )
    }

    $scope.onDrillsImported = ()=>{
      $scope.importSessionFromData();
      if($scope.data.importingSessionFiles.length == 0){
        $scope.view.importing = false;
        $scope.view.imported = true;
      }
    }

    $scope.onSeesionDrillsAdded = (session)=>{
      session.drillsAdded = true;

      var imported = true;
      for (var i = $scope.data.importingSessionFiles.length - 1; i >= 0; i--) {
        var s = $scope.data.importingSessionFiles[i];
        if(!s.drillsAdded){
          imported = false;
        }
      };

      if(imported){
        $scope.view.importing = false;
        $scope.view.imported = true;
      }
    }

    $scope.importDrillFromData = (pos)=>{
      var pos = pos || 0;
      if(!$scope.data.importingDrillFiles[pos]){
        $scope.onDrillsImported();
        return;
      }
      var drillStatusInfo = $scope.data.importingDrillFiles[pos];
      drillStatusInfo.processing = true;
      var data = $scope.data.drills[drillStatusInfo.id];
      pos += 1;
      try {
        this.drill = importDrill($scope.EditorSetup.activeEditor, data);
      }
      catch(err) {
        drillStatusInfo.processing = false;
        drillStatusInfo.processed = false;
        drillStatusInfo.error = true;
        $scope.importDrillFromData(pos);
        return;
      }
      CreateCanvasElement('convertCanvas').then((data)=>{
          var drill = this.drill;
          var {canvas, imageData, imageDataBlack, svgText} = data;

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
            thumpDataBlack: imageDataBlack,
          };
          config.dataProvider.saveDrill(postData).then((data)=>{
            drillStatusInfo.processing = false;
            drillStatusInfo.processed = true;
            drillStatusInfo.drill = data.data.drill;
            this.data.fileDrills[drillStatusInfo.id] = data.data.drill;
            $scope.importDrillFromData(pos)
          }, (err)=>{
            drillStatusInfo.processing = false;
            drillStatusInfo.processed = false;
            drillStatusInfo.error = true;
            $scope.importDrillFromData(pos)
          });
      });
    }

    $scope.processImportFiles = ()=>{

      $scope.view.importing = true;


      for(var key in $scope.data.sessions){
        var session = {processing:false, processed:false, id:key, session:{}, error:false, drills:[], addedDrills:[]};
        $scope.data.importingSessionFiles.push(session);
      }

      for(var key in $scope.data.drills){
        var drill = {processing:false, processed:false, id:key, drill:{}, error:false};
        $scope.data.importingDrillFiles.push(drill);
      }

      // $scope.EditorSetup.activeEditor.updateField();
      $scope.EditorSetup.activeEditor.assertSVG = Snap('#svgIconAsserts');

      $scope.importDrillFromData();
    }

    $scope.onAssertLoaded = ()=>{

      EditorSetup.activeDrill = this.drill;
      // $scope.view.OptionalFieldIdx =
      // $scope.view.ready = true;
      var _a = Snap('#svgIconAsserts')
      LoadAllPlayerAssert(_a);
      LoadExtraAssert(_a);
      _a.attr({width:0, height:0});

    }

  }

}
