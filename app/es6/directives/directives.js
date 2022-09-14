import * as Utils from '../editor/utils.js'

export class SpTabs {
  constructor(){
    this.restrict = 'EA';
    this.transclude = true;
    this.replace = true;
    this.template = `
      <div class="tabs">
        <ul class="tab-head">
          <li ng-repeat="pane in panes" ng-click="select(pane)" ng-class="{active:pane.selected}">
            {{pane.title}}
          </li>
        </ul>
        <div class="tab-content" ng-transclude></div>
      </div>
    `;
  }

  controller($scope, $element){
    var panes = $scope.panes = [];

    $scope.select = function(pane) {
      angular.forEach(panes, function(pane) {
        pane.selected = false;
      });
      pane.selected = true;
    }

    this.addPane = function(pane) {
      if (panes.length == 0 || pane.selected) $scope.select(pane);
      panes.push(pane);
    }

  }
}

export class SpTabPane {
  constructor(){
    this.restrict = 'EA';
    this.transclude = true;
    this.replace = true;
    this.require = '^sp-tabs';
    this.scope = {
      title: '@',
      selected: '@',
      id: '@'
    }
    this.template = `
      <div class="tab-pane" ng-class="{active: selected}" ng-transclude>
      </div>
    `;
  }

  link(scope, element, attrs, spTabsController){
    if(!scope.id){
      scope.id = scope.title;
    }
    spTabsController.addPane(scope);
  }
}

export class SpSessions {
  constructor(config){
    this.restrict = 'EA';
    this.scope = {
      sessions: '=',
      activeSessionKey: '=?bind',
      activeSort: '=?bind',
      mode: '@',
      onSessionSelected: '&',
      drillKey:'='
    }
    this.templateUrl = config.templateBasePath + 'directives/sessions.html'
  }

  controller($scope, $state, $rootScope, config, ngDialog, gettextCatalog){
    $scope.isDemo = $rootScope.user.isDemo;
    $scope.actions = [
      {text:gettextCatalog.getString('Edit'), value:'edit'},
      {text:gettextCatalog.getString('Delete'), value:'delete'},
    ];

    $scope.activeSort = {
      name: 'name',
      rev: true
    };

    $scope.loadingAction = false;
    $scope.onItemClick = ($event, session) =>{
      if($scope.mode != 'chooser'){
        return;
      }

      $scope.activeSessionKey = session.key;
      var q = $scope.onSessionSelected({
        session:session
      });

      if(q.then){
        $scope.loadingAction = true;
        q.then(()=>{$scope.loadingAction = false;})
      }
    }

    $scope.doAction = (selected, session, index) => {
      if(selected.value == 'edit'){
        $state.go('app.session', {sessionkey:session.key});
      }else if(selected.value == 'delete'){
        var deleteTitleText = gettextCatalog.getString('Are you sure you want to delete?');
        var cancelText = gettextCatalog.getString('Cancel');
        var deleteText = gettextCatalog.getString('Delete');

        ngDialog.open({
          template:`
              <br/>
              <p>${deleteTitleText}</p>
              <br/>
              <div class="ngdialog-buttons">
                  <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">${cancelText}</button>
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirmDelete(1)">${deleteText}</button>
              </div>`,
          plain: true,
          showClose: false,
          scope: $scope,
          controller: function($scope){
            $scope.confirmDelete = function(confirm){
              $scope.loadingAction = true;
              let delSesionKey = session.key;
              config.dataProvider.deleteSession(session).then(()=>{
                $scope.loadingAction = false;
                let i = 0;
                for(let key in $scope.sessions) {
                  if($scope.sessions[key].key == delSesionKey) {
                    // console.log(index, i, $scope.sessions[key].key+" == "+delSesionKey)
                    $scope.sessions.splice(i, 1);
                    break;                    
                  }
                  i++;
                }
              })
              $scope.closeThisDialog(0);
            }
          }
        });


      }
    }

    $scope.newSession = function(){
      var passValue = {};
      if($scope.drillKey){
        passValue.drillkey = $scope.drillKey;
      }
      $state.go('app.session', {sessionkey:'new', passValue});
    }

    $scope.selectedAction = {};
  }

}

export class SpDrills {
  constructor(config){
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
    }
    this.templateUrl = config.templateBasePath + 'directives/drills.html'
  }

  controller($scope, $state, $rootScope,config, gettextCatalog, ngDialog){

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
    $scope.actions = [
      {text:gettextCatalog.getString('Print'), value:'view'},
      {text:gettextCatalog.getString('Editor'), value:'edit'},
      {text:gettextCatalog.getString('Share'), value:'share'},
      {text:gettextCatalog.getString('Copy'), value:'copy'},
      {text:gettextCatalog.getString('Add to Session'), value:'tosession'},
      {text:gettextCatalog.getString('Delete'), value:'delete'},
    ];
    $scope.loadingAction = false;

    $scope.addDrills = ()=>{
      $scope.post.started = true;
      var q = $scope.onDrillsAdd();

      if(q.then){
        $scope.post.started = false;
        $scope.loadingAction = true;
        q.then(()=>{$scope.loadingAction = false;})
      }
    }

    $scope.onSelect = (drill)=>{
      if($scope.mode == 'chooser'){
        return;
      }
      $state.go('app.drilleditor', {drillkey:drill.key});
    }

    $scope.onItemClick = ($event, drill) =>{
      if($scope.mode != 'chooser'){
        return;
      }

      if(drill.selected){
        drill.selected = false;
        $scope.activeDrillKey = null;
        $scope.addedDrills.splice($scope.addedDrills.indexOf(drill.key), 1);
      }
      else{
        drill.selected = true;
        $scope.activeDrillKey = drill.key;
        $scope.addedDrills.push(drill.key)
      }
    }

    $scope.doAction = (selected, drill, index) => {
      if(selected.value == 'edit'){
        $state.go('app.drilleditor', {drillkey:drill.key});
      }else if(selected.value == 'delete'){
        var deleteTitleText = gettextCatalog.getString('Are you sure you want to delete?');
        var cancelText = gettextCatalog.getString('Cancel');
        var deleteText = gettextCatalog.getString('Delete');

        ngDialog.open({
          template:`
              <br/>
              <p>${deleteTitleText}</p>
              <br/>
              <div class="ngdialog-buttons">
                  <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">${cancelText}</button>
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirmDelete(1)">${deleteText}</button>
              </div>`,
          plain: true,
          showClose: false,
          scope: $scope,
          controller: function($scope){
            $scope.confirmDelete = function(confirm){
              $scope.loadingAction = true;
              let delDrillKey = drill.key;
              config.dataProvider.deleteDrill(drill.sessionkey, drill).then(()=>{
                $scope.loadingAction = false;
                // $scope.drills.splice(index, 1);
                let i = 0;
                for(let key in $scope.drills) {
                  if($scope.drills[key].key == delDrillKey) {
                    // console.log(index, i, $scope.sessions[key].key+" == "+delSesionKey)
                    $scope.drills.splice(i, 1);
                    break;                    
                  }
                  i++;
                }
              })
              $scope.closeThisDialog(0);
            }
          }
        });

      }else if (selected.value == 'tosession') {
        $state.go('app.chooser', {sessionkey:drill.sessionkey, drillkey:drill.key,
        mode:'session',
        callback:'home'});
      }else if (selected.value == 'share') {
        ngDialog.open({
          template: config.templateBasePath + 'share.html',
          showClose: true,
          controller($scope, $window) {
            $scope.showSessionShare = false;
            $scope.shareUrl = $state.href('app.drillshare',
            {drillkey:drill.key, sharekey:drill.shareToken},
            {absolute:true});
          }
        })
      }else if(selected.value == 'view'){
        $state.go('app.drillprint', {'drillkey': drill.key});
      }
      else if(selected.value == 'copy'){
        config.dataProvider.copyDrill(drill.key).then((data)=>{
          if(data.data.ok){
            $scope.drills.push(data.data.drill);
          }
        }, (err)=>{
            //console.log('Error in copying drill', err)
        });

      }
    }

    $scope.selectedAction = {};

    $scope.newDrill = function(){
      var passValue = {};
      if($scope.sessionKey){
        passValue.sessionkey = $scope.sessionKey;
      }
      $state.go('app.drilleditor', {drillkey:'new', passValue});
    }

    $scope.editdrill = function(drill, indx) {
      $scope.editMode = true;
      $scope.activeDrillKey = drill.drillkey;
      $scope.activeDrillIndex = drill.orderIndex;
      $scope.activeIndex = indx;
    }

    $scope.updateDrill = (drill)=>{
      $scope.post.started = true;
      var postData = {
        key: drill.key,
        name: drill.name,
        setupText: drill.setupText,
        instructText: drill.instructText,
        coachText: drill.coachText,
        pitch: drill.pitch,
        duration: drill.duration,
      };

      config.dataProvider.saveDrill(postData).then((data)=>{
        $scope.editMode = false;
        $scope.post.started = false;
      }, (err)=>{
      });
    }

  }
}


export class SpSessionDrills {
  constructor(config){
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
      showList:'=',
      onDrillSelected: '&',
      showBlack:"=",
    }
    this.templateUrl = config.templateBasePath + 'directives/sessiondrills.html'
  }

  controller($scope, $state, config, gettextCatalog, ngDialog){

    if($scope.isShareMode) {
      $scope.drillSelect = "drillprint";
    }
    else {
      $scope.drillSelect = "drilleditor";
    }


    $scope.ts = moment().unix();
    $scope.actions = [
      {text:gettextCatalog.getString('Print'), value:'view'},
      {text:gettextCatalog.getString('Edit'), value:'edit'},
      {text:gettextCatalog.getString('Share'), value:'share'},
      {text:gettextCatalog.getString('Copy'), value:'copy'},
      {text:gettextCatalog.getString('Remove from session'), value:'remove'},

    ];
    $scope.loadingAction = false;
    $scope.editMode = false;

    $scope.post = {
      started: false,
      error: null
    };

    $scope.onDrillMved = function(val, changedIdx) {
      if($scope.isShareMode){
        return;
      }
      for (var i = 0; i < val.length; i++) {
        // console.log(val[i].orderIndex, val.length, changedIdx);
        val[i].orderIndex = i + 1;
        // console.log(val[i].orderIndex, val);
        $scope.updateDrillOnChg(val[i]);
      };
    }



    $scope.onItemClick = ($event, drill) =>{
    }

    $scope.doAction = (selected, drill, index) => {
      $scope.activeDrillKey = drill.drillkey;
      if(selected.value == 'edit'){
        var passValue = {
          sessionkey: $scope.sessionKey
        }
        $state.go('app.drilleditor', {'drillkey' : drill.drill.key, passValue});
      }else if(selected.value == 'remove'){
        var deleteTitleText = gettextCatalog.getString('Are you sure you want to remove this drill from the session?');
        var cancelText = gettextCatalog.getString('Cancel');
        var deleteText = gettextCatalog.getString('Remove');

        ngDialog.open({
          template:`
              <br/>
              <p>${deleteTitleText}</p>
              <br/>
              <div class="ngdialog-buttons">
                  <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">${cancelText}</button>
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirmDelete(1)">${deleteText}</button>
              </div>`,
          plain: true,
          showClose: false,
          scope: $scope,
          controller: function($scope){
            $scope.confirmDelete = function(confirm){
              $scope.loadingAction = true;
              drill.key = drill.drillkey;
              config.dataProvider.deleteDrill(drill.sessionkey, drill).then(()=>{
                $scope.loadingAction = false;
                $scope.drills.splice(index, 1);
              })
              $scope.closeThisDialog(0);
            }
          }
        });

      }else if (selected.value == 'tosession') {
        $state.go('app.chooser', {sessionkey:drill.sessionkey, drillkey:drill.key,
        mode:'session',
        callback:'app.library'});
      }else if (selected.value == 'share') {
        ngDialog.open({
          template: config.templateBasePath + 'share.html',
          showClose: true,
          controller($scope, $window) {
            $scope.showSessionShare = false;
            $scope.shareUrl = $state.href('app.drillshare',
            {drillkey:drill.drill.key, sharekey:drill.drill.shareToken},
            {absolute:true});
          }
        })
      }else if (selected.value == 'view') {
        $state.go('app.drillprint', {'drillkey': drill.drill.key});
      }
      else if(selected.value == 'copy'){
        config.dataProvider.copyDrill(drill.drill.key).then((data)=>{
          if(data.data.ok){
            config.dataProvider.attachDrill(drill.sessionkey, data.data.drill.key).then(()=>{
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
                duration: drill.duration,
              }
              config.dataProvider.saveSessionDrill(drill.sessionkey, drillParams).then(()=>{
                $scope.post = false;
                var newSessionDrill = angular.copy(drill);
                newSessionDrill.drill = newDrill;
                $scope.drills.push(newSessionDrill);
                // console.log("Session Drill Saved");
              })

              resolve();
            }, ()=>{
              reject();
            })
          }
        }, (err)=>{
            //console.log('Error in copying drill', err)
        });

      }
    }

    $scope.newDrill = function(){
      var passValue = {
        sessionkey: $scope.sessionKey
      }
      $state.go('app.drilleditor', {drillkey:'new', passValue});
    }

    $scope.drillEdit = function (drill) {
      if(!$scope.isShareMode){
        var passValue = {
          sessionkey: $scope.sessionKey
        }
        $state.go('app.drilleditor', {'drillkey' : drill.drill.key, passValue});
      }
    }

    $scope.editsessiondrill = function(drill, indx) {
      $scope.editMode = true;
      $scope.activeDrillKey = drill.drillkey;
      $scope.activeDrillIndex = drill.orderIndex;
      $scope.activeIndex = indx;
    }

    $scope.updateDrillOnChg = function(drill) {
      var drillParams = {
        key: drill.drillkey,
        drillKey: drill.drillkey,
        name: drill.drill.name,
        setupText: drill.drill.setupText,
        coachText: drill.drill.coachText,
        instructText: drill.drill.instructText,

        orderIndex: drill.orderIndex,
        pitch: drill.pitch,
        duration: drill.duration,
      }
      config.dataProvider.saveSessionDrill(drill.sessionkey, drillParams).then(()=>{
        $scope.post = false;
        // console.log("Session Drill Saved");
      })
    }

    $scope.updateAlSessionDrills = function(){

      for (var i = 0; i < $scope.drills.length; i++) {
        var drill = $scope.drills[i];
        $scope.updateDrillOnChg(drill);
      };
    }

    $scope.updateSessiondrill = function(drill, indx) {
      $scope.post = true;

      $scope.editMode = false;
      $scope.activeDrillKey = drill.drillkey;
      $scope.activeDrillIndex = drill.orderIndex;
      $scope.activeIndex = null;
      var tmpDrills = $scope.drills;

      // console.log(indx, drillParams.orderIndex, drill, tmpDrills);
      var tmpDrillDate = tmpDrills[indx];
      tmpDrills.splice(indx, 1);
      tmpDrills.splice(drill.orderIndex-1, 0, tmpDrillDate);
      for (var i = 0; i < tmpDrills.length; i++) {
        tmpDrills[i].orderIndex = i + 1;
      };
      $scope.updateAlSessionDrills();
    }

    $scope.selectedAction = {};
  }
}


function Draggable() {
  return function(scope, element, attrs) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
      'dragstart',
      function(e) {
        Utils.fixEventObject(e, this);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('_sp_offsetX', e._sp_offsetX);
        e.dataTransfer.setData('_sp_offsetY', e._sp_offsetY);
        e.dataTransfer.setData('ref', attrs.spData);
        this.classList.add('drag');
        return false;
      },
      false
    );

    el.addEventListener(
      'dragend',
      function(e) {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  }
}

function Droppable() {
  return {
    scope: {
      drop: '&',
      bin: '='
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];

      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragenter',
        function(e) {
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function(e) {
          this.classList.remove('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'drop',
        function(e) {
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
          scope.$apply(function(scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {
              fn(ref, e,
                e.dataTransfer.getData('_sp_offsetX'),
                e.dataTransfer.getData('_sp_offsetY'));
            }
          });

          return false;
        },
        false
      );
    }
  }
}

export var Draggable;
export var Droppable;
