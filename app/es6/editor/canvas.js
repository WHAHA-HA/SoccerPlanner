import './snapextra.js';
import * as Utils from './utils.js'
import {EditorSetup} from './setup.js';
// import {importDatas} from './import_data.js';
import {LoadExtraAssert, LoadAllPlayerAssert, CreateCanvasElement} from './../editor/draw.js';


export class EditorCanvas {
  constructor(version, domElement, editor){
    this.version = version;
    this.editor = editor || {};
    this.activeCursor = EditorSetup.cursors.select;
    this.hasArrowHead = true;
    this.elementSelected = false;
    this.fields = EditorSetup.fields;
    this.activeField = EditorSetup.fields[this.editor.field || 'birds_eyeview'];
    this.activeDrawColor =  EditorSetup.colors[EditorSetup.colors.length-1];
    this.activePlayerColor = EditorSetup.playerColors[0];
    this.activeAssert = null;
    this.activeAssertData = null;
    this.activeDrawThickness = EditorSetup.thickness[0];
    this.activeArrowHead = EditorSetup.arrowHeads[0]['key'];

    this.s = Snap(domElement);
    this.assertSVG = Snap('#svgIconAsserts');
    this.tempSVG = Snap('#spTempSVG');
    this._field = null;
  }

  parseAndLoad(svg){
    var q = new Promise.Deferred();

    this._field = this.tempSVG.select('[sp-field-bg]');
    if(!this._field){
      this._field = this.createField();
    }else{
      this.activeField = EditorSetup.fields[this._field.attr('sp-field-bg')];
      this._field = this.s.add(this._field);
    }

    this.tempSVG.selectAll('[sp-handler]').forEach((el, i)=>{
      var _handler = EditorSetup.cursors[el.attr('sp-handler')].handler;
      _handler.loadElement(this, this.s, el);
    });

    q.resolve();
    return q.promise;
  }

  clear(){
    // this.s.selectAll('[sp-cloneable]').remove();
    this.s.clear();
    this.createField();
  }

  setup(){
    var q = new Promise.Deferred();
    q.resolve();
    return q.promise;
  }

  draw(svg=null){
    var q = new Promise.Deferred();

    this.parseAndLoad(svg).then(()=>{
      this.s.smartClick((evnt)=>{
        this.onClick(evnt);
      });

      this.s.drag((x, y, dx, dy, evnt)=>{
        Utils.fixEventObject(evnt, this.s.node);
        this.activeCursor.handler.onDrawMove(this, this.s, x, y, dx, dy, evnt);
      }, (x, y, evnt)=>{
        Utils.fixEventObject(evnt, this.s.node);
        this.activeCursor.handler.onDrawStart(this, this.s, x, y, evnt);
      }, (evnt)=>{
        Utils.fixEventObject(evnt, this.s.node);
        this.activeCursor.handler.onDrawEnd(this, this.s, null, null, evnt);
      })


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

  resizeEditor(){
    if(! this.activeField){
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

  createField(){
    var field = this.s.g();
    field.attr({'sp-field-bg': this.activeField.key, 'sp-cloneable':true});

    var _def = this.assertSVG.select(this.activeField.url());
    var bg = field.use(_def);
    bg.attr({'sp-field-bg-use':true});

    this.resizeEditor();
    return field;
  }

  updateField(){
    if(this._field == null){
      return;
    }

    this.s.select('[sp-field-bg]').attr({'sp-field-bg': this.activeField.key});
    var bg = this.s.select('[sp-field-bg-use]');
    var _pname = 'xlink:href';
    if(!bg.attr(_pname)){
      _pname = 'href';
    }
    var attrs = {};
    attrs[_pname] = this.activeField.url();
    bg.attr(attrs);

    this.resizeEditor();
  }

  onClick(evnt, srcElementOffset=null){
    Utils.fixEventObject(evnt, this.s.node);
    this.activeCursor.handler.onClick(this, this.s, evnt, srcElementOffset);
  }

  setActiveCursor(cursor){

    if(cursor.key != this.activeCursor.key){
      this.activeAssert = null;
      this.activeAssertData = null;

      if(this.activeCursor){
        EditorSetup.cursors[this.activeCursor.key].handler.onCursorInactive(this, this.s, cursor);
      }

      this.activeCursor = cursor;
      EditorSetup.cursors[this.activeCursor.key].handler.onCursorActive(this, this.s, cursor);

      if(cursor.defaultColorIndex != null){
        this.activeDrawColor = EditorSetup.colors[cursor.defaultColorIndex]
      }

      this.hasArrowHead = false;
      this.activeArrowHead = EditorSetup.arrowHeads[cursor.defaultArrowHeadIndex]['code'];
      if(cursor.hasArrowHead){
        this.hasArrowHead = true;
      }
    }
  }

  drawForCursor(cursorKey, evnt){
    Utils.fixEventObject(evnt);
    this.setActiveCursor(EditorSetup.cursors[cursorKey]);
    this.activeCursor.handler.drawDefault(this, this.s, evnt);
  }


  chooseAssertHandler(assert){
    // this.activeCursor = EditorSetup.cursors.assert;
    this.setActiveCursor(EditorSetup.cursors.stuff);
    this.activeAssert = assert;
  }

  chooseLabelHandler(id, text){
    this.setActiveCursor(EditorSetup.cursors.label);
    this.activeAssert = id;
    this.activeAssertData = {text};
  }

  chooseLabelHandlerById(idText){
    var [id, text] = idText.split('_');
    this.chooseLabelHandler(id, text);
  }

  deleteActiveElement(){
    if(this.activeCursor && this.activeCursor.handler){
      this.activeCursor.handler.deleteActiveElement(this, this.s);
    }
  }

  moveActiveElement(direction, faster=false, evnt){
    if(this.activeCursor && this.activeCursor.handler){
      this.activeCursor.handler.moveActiveElement(this, this.s, direction, faster);
    }
  }
}



export class EditorDriective {
  constructor(){
    this.restrict = 'EA'
    // this.scope = {
    //   'spDrill': '=',
    // }
  }

  link(scope, element, attr){
  }

  controller($scope, $rootScope, $element, $document, config, $timeout, hotkeys){
    var editor = new EditorCanvas(config.editorVersion, $element[0]);
    EditorSetup.activeEditor = editor;

    $scope.editorSetup = EditorSetup;
    $scope.editor = editor;
    $scope.OptionalFieldIdx = null;

    $scope.selectCursor = function($event, key){
      editor.setActiveCursor(EditorSetup.cursors[key]);
      if(editor.activeCursor.key == "curve" || editor.activeCursor.key == "line" || editor.activeCursor.key == "dashline" || editor.activeCursor.key == "dotline") {
        editor.activeArrowHead = 'head'
      }
      else {
        editor.activeArrowHead = 'none' 
      }

      // editor.activeCursor = EditorSetup.cursors[key];
    }

    $scope.$watch('editor.activeField', ()=>{
      if(!editor.activeField){
        return;
      }

      editor.updateField();
      var activeKey = editor.activeField.key;
      var inArray=false;
      var opFldIdx = null;
      for(var i=0;i<EditorSetup.fieldsOrder.length;i++){
          // console.log(EditorSetup.fieldsOrder[i].key+" == "+activeKey);
          if(EditorSetup.fieldsOrder[i].key == activeKey){
              inArray=true;
              opFldIdx = i + 1 ;
              if (opFldIdx >= EditorSetup.fieldsOrder.length) {
                opFldIdx = 0;
              }
              else {
                opFldIdx = opFldIdx;
              }
          }
      }
      $scope.OptionalFieldIdx = opFldIdx;
    });

    $scope.onAssertDrop = function(name, evnt, srcOffsetX, srcOffsetY) {
      var [assertName, handler] = name.split(',');
      editor[handler](assertName, evnt);
      editor.onClick(evnt, {x:srcOffsetX+1, y:srcOffsetY});
      editor.setActiveCursor(EditorSetup.cursors.select);
    }


    hotkeys.add({
      combo: ['del', 'd'],
      description: 'Delete the selected object',
      callback: function(e) {
        editor.deleteActiveElement();
      }
    });


    hotkeys.add({
      combo: 'shift+s',
      description: 'Save the Drill',
      callback: function(e) {
        $rootScope.saveDrill();
      }
    });


    hotkeys.add({
      combo: 'shift+i',
      callback: function(e) {
        //THIS IS FOR DEBUGGING PURPOSE. TO SEE WHATS IN TEMP SVG AND CANVAS

        $document.find('#tempDrawHolder').addClass('debug')

        CreateCanvasElement('convertCanvas', true).then((data)=>{
          var {canvas, imageData, imageDataBlack, svgText} = data;
          // console.log('svgText', svgText);
        });
      }
    });


    var directions = ['up', 'down', 'right', 'left'];

    for(let d of directions){
      hotkeys.add({
        combo: d,
        description: `Move ${d} the selected object`,
        callback: function(e) {
          e.preventDefault();
          editor.moveActiveElement(d, false, e);
        }
      });

      hotkeys.add({
        combo: 'shift+'+d,
        description: `Move ${d} the selected object faster`,
        callback: function(e) {
          e.preventDefault();
          editor.moveActiveElement(d, true, e);
        }
      });
    }

    hotkeys.add({
      combo: 'alt+s',
      description: 'Activate Select and Drag tool',
      callback: function(e) {
        editor.setActiveCursor(EditorSetup.cursors.select);
      }
    });


    hotkeys.add({
      combo: 'alt+p',
      description: 'Activate pen tool',
      callback: function(e) {
        editor.setActiveCursor(EditorSetup.cursors.pen);
      }
    });


    editor.setup().then(()=>{
      return editor.draw();
    }).then(()=>{

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

      editor.setActiveCursor(EditorSetup.cursors.select);
      $scope.$digest();

    }, ()=>{
      console.log('Error drawing');
    });


  }
}
