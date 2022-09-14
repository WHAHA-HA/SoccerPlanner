import {EditorSetup} from './../editor/setup.js';
import {Asserts} from './../editor/asserts.js';
import * as Utils from './../editor/utils.js';

export class DrawHandler {
  constructor(s){
    this.activeElement = null;
    this.activeMainElement = null;
    this.dragInProgress = false;
    this.selected = false;
    this.drawByDrag = true;
    this.start = {x:0, y:0};
    this.disableSelectBox = false;
    this.disableAnimation = false;
    this.hasEndCircle = false;
    this.activeEndCirleElement = null;

  }

  onSetup(canvas, s){

  }

  onClick(canvas, s, evnt, srcElementOffset=null){

  }

  onDrag(canvas, s, evnt){

  }

  onDrawMove(canvas, s, x, y, dx, dy){}
  onDrawStart(canvas, s, x, y){}
  onDrawEnd(canvas, s, x, y){}

  onDragMove(canvas, s, ele, ox, oy, dx, dy, evnt){
    this.doPrespectiveScale(canvas, s, ele);
  }
  onDragStart(canvas, s, ele, x, y, evnt){}
  onDragEnd(canvas, s, ele, x, y, evnt){}

  doPrespectiveScale(canvas, s, ele, ox, oy, dx, dy, evnt){
    var isScale = (ele.attr('sp-perspective-scale') + '') == 'true';
    var box = s.getBBox();

    if(!box.width){
      box.width = 845;
    }
    if(!box.height){
      box.height = 449;
    }

    var [w, h] = [box.width, box.height];
    if(canvas.activeField.perspectiveScale && isScale){

      var ebox = ele.getBBox();
      var [x, y] = [ebox.x, ebox.y];
      if(ox){
        [x, y] = [ox, oy];
      }
      // var [x, y] = [ox, oy];
      // if(evnt){
      //   [x, y] = [evnt._sp_offsetX, evnt._sp_offsetY];
      // }
      //
      // console.log(ebox.x, x, ebox.y, y);

      var minSize = .6;
      var varientSizeRatio = .5;

      var [sx, sy] = [x/w, y/h];
      // sy = Math.min(1, minSize + (Math.max(0.1, sy) / 2) );
      sy = Math.min(1.3, (.8 + (varientSizeRatio*sy)))
      ele.fixedScaleWH(sy, sy);
    }
  }

  onSelect(canvas, s, ele, evnt){
    if(this.selected){
      return;
    }

    if(this.disableSelectBox){
      return;
    }

    this.activeElement = ele;
    this.activeMainElement = ele.select('[sp-main]');
    this.selected = true;

    var [x, y, w, h] = this.getSelectorBox(canvas, s, ele);
    var rect = ele.rect(x, y, w, h);
    rect.attr({'sp-selector-box': true});
    rect.attr({
      'stroke-dasharray': '4, 10',
      'fill':'transparent',
      'stroke-width':'2px',
      'stroke':'rgba(255, 255, 255, 0.42)'});

    var grp = ele.g();
    grp.translateXY((w + x), y);
    // if(this.key == "line" || this.key == "pen" || this.key == "curve" || this.key == "dashline" || this.key == "dotline" || this.key == "path"){
    //   grp.translateXY(0, 0);
    // }
    // else if(this.key == "triangle"){
    //   grp.translateXY((w/2), 0);
    // }
    // else{
    //   grp.translateXY(w, 0);
    // }

    grp.attr({'sp-selector-box-close-button': true})
    grp.attr({'opacity': 1, 'stroke-dasharray': '0px 0px'});


    var icon = canvas.assertSVG.select('#sp_svg_assert_trash_icon');
    grp.smartClick((evnt)=>{
      this.deleteActiveElement(canvas, s);
    });
    grp.use(icon);
  }

  onUnselect(canvas, s, ele, newEle, evnt){
    if(ele){
      ele.selectAll('[sp-selector-box-close-button]').remove();
      ele.selectAll('[sp-selector-box]').remove();
      ele.selectAll('[sp-dragger-tool]').remove();
    }
    this.selected = false;
  }

  onResizeStart(canvas, s, ele){
    this.hideSelector(canvas, s, ele);
    this.disableDrag(canvas, s, ele);
  }

  onResizeEnd(canvas, s, ele){
    this.repositionSelector(canvas, s, ele);
    this.showSelector(canvas, s, ele);
    this.enableDrag(canvas, s, ele);
  }

  getSelectorBox(canvas, s, ele){
    var box = ele.getBBox();
    var [x, y, w, h] = [null, null, null, null];
    ele.children().forEach((child)=>{

      if(child.attr('sp-selector-box') || child.attr('sp-dragger-tool')){
        return
      }

      var _cbox = child.getBBox();

      if(x == null){
        [x, y, w, h] = [_cbox.x, _cbox.y, _cbox.width, _cbox.height];
      }

      x = Math.min(x, _cbox.x);
      y = Math.min(y, _cbox.y);
      w = Math.max(w, _cbox.width);
      h = Math.max(h, _cbox.height);
    });

    if(w==0){
      w = box.width;
    }

    if(h==0){
      h = box.height;
    }

    return [x, y, w, h];
  }

  hideSelector(canvas, s, ele){
    if(! ele.select('[sp-selector-box]')){
      return;
    }
    ele.select('[sp-selector-box]').attr({opacity:0});
    ele.select('[sp-selector-box-close-button]').attr({opacity:0});
  }
  showSelector(canvas, s, ele){
    if(! ele.select('[sp-selector-box]')){
      return;
    }
    ele.select('[sp-selector-box]').attr({opacity:1});
    ele.select('[sp-selector-box-close-button]').attr({opacity:1});
  }

  repositionSelector(canvas, s, ele){
    if(! ele.select('[sp-selector-box]')){
      return;
    }

    var [x, y, width, height] = this.getSelectorBox(canvas, s, ele);
    var selector = ele.select('[sp-selector-box]');
    selector.attr({x, y, width, height});

    var trashIcon = ele.select('[sp-selector-box-close-button]');
    trashIcon.translateXY(-(trashIcon.matrix.e), -(trashIcon.matrix.f));
    trashIcon.translateXY((width + x), y);

  }

  deleteActiveElement(canvas, s, ele=null){
    var el = ele || this.activeElement;
    el.remove();
  }

  draw(canvas, s, x, y, points){
    if(this.drawByDrag){
      var ele = this.onDrawStart(canvas, s, x, y, null);
      for(let xy of points){
        this.onDrawMove(canvas, s, xy[0], xy[1]);
      }
      this.createAndDragEnd(canvas, s, x, y, null);

      return ele;
    }else{
      var ele = this.drawElement(canvas, s, x, y, null);
      return ele;
    }
  }

  moveActiveElement(canvas, s, direction, faster=false, ele=null, evnt=null){
    var el = ele || this.activeElement;
    var step = (faster)?10:5;
    el.movePossible(direction, step, true);
    this.doPrespectiveScale(canvas, s, el);
  }

  onCursorInactive(newCursor){

  }

  onCursorActive(newCursor){

  }

  drawDefault(canvas, s, evnt){
    console.log('draw default');
  }

  enableDrag(canvas, s, ele){
    ele.drag();

    ele.drag((x, y, dx, dy, evnt)=>{
      Utils.fixEventObject(evnt, s.node);
      this.onDragMove(canvas, s, ele, x, y, dx, dy, evnt);
    }, (x, y, evnt)=>{
      Utils.fixEventObject(evnt, s.node);
      this.onDragStart(canvas, s, ele, x, y, evnt);
    }, (evnt)=>{
      Utils.fixEventObject(evnt, s.node);
      this.onDragEnd(canvas, s, ele, null, null, evnt);
    })

  }

  disableDrag(canvas, s, ele){
    ele.undrag();
  }

  selectElement(canvas, s, ele){
    EditorSetup.cursors.select.handler.selectElement(canvas, s, ele);
  }

  attachAttrs(canvas, s, ele, evnt){
    var [x, y] = [0, 0];
    if(evnt){
      [x, y] = [evnt._sp_offsetX, evnt._sp_offsetY];
    }
    this.start = {x, y};

    ele.attr({'sp-selectable':true, 'sp-handler': this.key, 'sp-cloneable': true});
    this.attachEvents(canvas, s, ele);
    this.attachMainEleAttrs(canvas, s, ele, this.activeMainElement, evnt);
  }

  attachEvents(canvas, s, ele){
    ele.smartClick((evnt)=>{
      canvas.elementSelected = true;
      EditorSetup.cursors.select.handler.onElementSelected(canvas, s, evnt, ele);
    });
  }

  attachMainEleAttrs(canvas, s, ele, mele, evnt){
    mele.attr({'sp-main':true});

    if(canvas.hasArrowHead && canvas.activeArrowHead && canvas.activeArrowHead != 'none'){
      if(canvas.activeArrowHead == 'head'){
        var markerId = '#sp_markerend_' + canvas.activeDrawColor.label;
        mele.attr({markerEnd: canvas.assertSVG.select(markerId)});
        ele.attr({'sp-marker': markerId});
        ele.attr({'sp-marker-position': 'end'});
      }
      else{
        var markerId = '#sp_markerstart_' + canvas.activeDrawColor.label;
        mele.attr({markerStart: canvas.assertSVG.select(markerId)});
        ele.attr({'sp-marker': markerId});
        ele.attr({'sp-marker-position': 'start'});
      }
    }
  }

  attachStrokeAttrs(canvas, s, ele, evnt){
    ele.attr({
      strokeWidth: canvas.activeDrawThickness.width,
      stroke: canvas.activeDrawColor.code,
      strokeLinecap: "round",
      fill: "transparent",
      'sp-stroke-width': canvas.activeDrawThickness.width
    });



  }

  attachStrokeEvents(canvas, s, ele){
    ele.hover(()=>{
      if(canvas.activeCursor.key == 'select'){
        var w = parseInt(ele.attr('sp-stroke-width'));
        if(w == 0){
          w = 1;
        }
        ele.animate({"strokeWidth": w * 2}, 100);
      }
    }, ()=>{
      var w = parseInt(ele.attr('sp-stroke-width'));
      ele.animate({"strokeWidth": w}, 100);
    });
  }

  attachSizeAttrs(canvas, s, ele, evnt){
    var r = 1.1;

    ele.hover(()=>{
      if(canvas.activeCursor.key == 'select'){
        var mat = ele.fixedScaleMatrixWH(r, r, true);
        ele.animate({transform:mat}, 200);
      }
    }, ()=>{
      if(canvas.activeCursor.key == 'select'){
        var mat = ele.fixedScaleMatrixWH(1, 1, true);
        ele.animate({transform:mat}, 200);
      }
    });
  }

  createGroupElement(canvas, s, ox, oy, evnt){
    var [x, y] = [ox, oy];
    if(evnt){
      [x, y] = [evnt._sp_offsetX, evnt._sp_offsetY];
    }

    if(x == undefined || x == null){
      console.log('X can not be null');
    }

    var ele = s.g();
    ele.translateXY(x, y);

    return ele;
  }

  createMainElement(canvas, s, x, y, evnt, ele){
    return null;
  }

  createEndCircleElement(canvas, s, x, y, evnt, ele){
    var ecele = ele.circle(0, 0, 10);
    ecele.attr({opacity: 0});
    return ecele;
  }

  createElement(canvas, s, x, y, evnt){
    var ele = this.createGroupElement(canvas, s, x, y, evnt);
    var mele = this.createMainElement(canvas, s, x, y, evnt, ele);
    this.activeMainElement = mele;
    if(this.hasEndCircle){
      var ecele = this.createEndCircleElement(canvas, s, x, y, evnt, ele);
      this.activeEndCirleElement = ecele;
    }
    return ele;
  }

  loadElement(canvas, s, ele){
    var el = s.add(ele);
    var aname = ele.attr('sp-assert-name');

    this.activeElement = ele;
    if(aname){
      canvas.activeAssert = aname;
    }

    this.attachEvents(canvas, s, ele);
  }

  drawElement(canvas, s, x, y, evnt){
    var ele = this.createElement(canvas, s, x, y, evnt);
    this.attachAttrs(canvas, s, ele, evnt);
    this.activeElement = ele;
    this.doPrespectiveScale(canvas, s, ele);
    return ele;
  }

  createAndDrag(canvas, s, x, y, evnt){
    var ele = this.drawElement(canvas, s, x, y, evnt);
    // ele.attr({opacity: 0.5});
    return ele;
  }

  createAndDragEnd(canvas, s, x, y, evnt){
    this.activeElement.attr({opacity: 1});
    this.activeElement = null;
  }

  createDraggerElement(canvas, s, ele, x, y, enableDrag=false,
    onMove=null, onStart=null, onEnd=null){

    var radius = 4;
    var holder = ele.circle(x, y, radius);

    holder.attr({
      fill: "#1D61A5",
      stroke: "#fff",
      strokeWidth: 1,
      'stroke-dasharray': '0',
    });

    holder.attr('sp-dragger-tool', true);

    if(enableDrag){
      holder.drag();

      holder.drag((dx, dy, nx, ny, ev)=>{
        if(onMove){
          onMove(dx, dy, nx, ny, ev);
        }
      }, (ox, oy, ev)=>{
        if(onStart){
          onStart(ox, oy, ev);
        }
        this.onResizeStart(canvas, s, ele);
      }, (ox, oy, ev)=>{
        if(onStart){
          onStart(ox, oy, ev);
        }
        this.onResizeEnd(canvas, s, ele);
      });

    }

    return holder;
  }

  createResizer(s, ele, end){
    // var bbox = ele.getBBox();

    var [x, y] = [ele.attr('x2'), ele.attr('y2')];
    if(end == 'start'){
      [x, y] = [ele.attr('x1'), ele.attr('y1')];
    }

    var radius = 10;

    var holder = s.circle(x, y, radius).attr({fill:"blue"});
    holder.attr({
      fill: "#addedd",
      stroke: "#beeeef",
      strokeWidth: 4
    });
    holder.realdrag();
    holder.attr('sp-dragger-tool', true);

    holder.drag((dx, dy, nx, ny, ev)=>{
      var _bbox = holder.getBBox();
      if(end == 'end'){
        ele.attr({x2:_bbox.x2-radius, y2:_bbox.y2-radius});
      }else if(end == 'start'){
        ele.attr({x1:_bbox.x+radius, y1:_bbox.y+radius});
      }
    }, (dx, dy)=>{
      this.dragInProgress = true;
    }, ()=>{
      this.dragInProgress = false;
    })

    return holder;
  }

}

export class SelectDrawHandler extends DrawHandler {
  constructor(s){
    super(s);
    this.activeHandler = null;
  }

  onClick(canvas, s, evnt){
    if(!canvas.elementSelected && this.activeHandler){
      EditorSetup.cursors[this.activeHandler].handler.onUnselect(
        canvas, s, this.activeElement, null, evnt);
      this.activeElement = null;
      this.activeHandler = null;
    }
    canvas.elementSelected = false;
    //this.handleSelection(canvas, s, evnt);
  }

  onCursorInactive(canvas, s, cursor){
    s.selectAll('[sp-handler]').forEach((el, i)=>{
      var _handler = EditorSetup.cursors[el.attr('sp-handler')].handler;
      _handler.disableDrag(canvas, s, el);
      _handler.onUnselect(canvas, s, this.activeElement, null, null);
    });
  }

  onCursorActive(canvas, s, cursor){
    s.selectAll('[sp-handler]').forEach((el, i)=>{
      EditorSetup.cursors[el.attr('sp-handler')].handler.enableDrag(canvas, s, el);
    });
  }

  onElementSelected(canvas, s, evnt, ele){
    if(canvas.activeCursor.key != 'select'){
      return;
    }

    if(this.activeElement && this.activeElement.id == ele.id){
      return;
    }

    if(this.activeElement){
      // console.log('Removing', ele);
      EditorSetup.cursors[this.activeHandler].handler.onUnselect(
        canvas, s, this.activeElement, ele, evnt);
      this.activeElement = null;
      this.activeHandler = null;
    }

    var handler = ele.attr('sp-handler');
    if(EditorSetup.cursors[handler]){
      this.activeElement = ele;
      this.activeHandler = handler;
      EditorSetup.cursors[handler].handler.onSelect(canvas, s, ele, evnt);
    }

  }

  selectElement(canvas, s, ele){
    this.onElementSelected(canvas, s, null, ele);
  }

  deleteActiveElement(canvas, s){
    if(this.activeElement){
      var _hand = EditorSetup.cursors[this.activeHandler].handler;
      _hand.onUnselect(canvas, s, this.activeElement);
      _hand.deleteActiveElement(canvas, s, this.activeElement);
    }
  }
}

export class PenDrawHandler extends DrawHandler {
  constructor(s){
    super(s);
    this.key = 'pen';
    this.hasEndCircle = true;
  }

  createMainElement(canvas, s, x, y, evnt, ele){
    return ele.path(`M 0 0`);
  }

  attachAttrs(canvas, s, ele, evnt){
    super.attachAttrs(canvas, s, ele, evnt);
    this.attachAdditionalAttrs(canvas, s, ele, evnt);
  }

  attachAdditionalAttrs(canvas, s, ele, evnt){
    this.attachStrokeAttrs(canvas, s, ele, evnt);
  }

  attachEvents(canvas, s, ele){
    super.attachEvents(canvas, s, ele);
    this.attachStrokeEvents(canvas, s, ele);
  }


  onDrawStart(canvas, s, x, y, evnt){
    this.createAndDrag(canvas, s, x, y, evnt);
  }

  onDrawMove(canvas, s, x, y, dx, dy, evnt){
    var pdata = this.activeMainElement.attr('d');
    var p = pdata + `L ${x} ${y}`;
    this.activeMainElement.attr('d', p);
  }

  onDrawEnd(canvas, s, x, y, evnt){
    this.createAndDragEnd(canvas, s, x, y, evnt);
  }

}

export class CurveDrawHandler extends PenDrawHandler {
  constructor(s){
    super(s);
    this.key = 'curve';
  }

  onDrawMove(canvas, s, x, y, dx, dy, evnt){

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
    var p = `M 0 0 q ${px} ${py} ${x} ${y}`;
    this.activeMainElement.attr('d', p);
  }
}

export class LineDrawHandler extends PenDrawHandler {
  constructor(s){
    super(s);
    this.key = 'line';
    this.enablePointsDragger = true;
  }

  createMainElement(canvas, s, x, y, evnt, ele){
    var lele = ele.line(0,0,0,0);
    return lele;
  }

  onDrawMove(canvas, s, x, y, dx, dy, evnt){
    this.activeMainElement.attr({x2:x, y2:y});
    if(this.hasEndCircle){
      if(canvas.activeArrowHead == 'head'){
        this.activeEndCirleElement.attr({cx:x, cy:y});
      }
    }
  }

  onSelect(canvas, s, ele, evnt){
    super.onSelect(canvas, s, ele, evnt);
    if(! this.enablePointsDragger){
      return
    }

    var mele = this.activeMainElement;

    var [sx, sy] = [parseInt(mele.attr('x1')), parseInt(mele.attr('y1'))];
    var [ex, ey] = [parseInt(mele.attr('x2')), parseInt(mele.attr('y2'))];

    this.createDraggerElement(canvas, s, ele, sx, sy, true,
      (dx, dy, nx, ny, ev)=>{
        mele.attr({x1:dx+sx, y1:dy+sy});
      }, ()=>{
        [sx, sy] = [parseInt(mele.attr('x1')), parseInt(mele.attr('y1'))];
      }
    );

    this.createDraggerElement(canvas, s, ele, ex, ey, true,
      (dx, dy, nx, ny, ev)=>{
        mele.attr({x2:dx+ex, y2:dy+ey});
      }, ()=>{
        [ex, ey] = [parseInt(mele.attr('x2')), parseInt(mele.attr('y2'))];
      }
    );
  }


}

export class DashedLineDrawHandler extends LineDrawHandler {
  constructor(s){
    super(s);
    this.key = 'dashline';
  }

  attachAttrs(canvas, s, line, evnt){
    super.attachAttrs(canvas, s, line, evnt);
    line.attr('stroke-dasharray', '15, 10');
  }
}

export class DottedLineDrawHandler extends LineDrawHandler {
  constructor(s){
    super(s);
    this.key = 'dotline';
  }

  attachAttrs(canvas, s, line, evnt){
    super.attachAttrs(canvas, s, line, evnt);
    line.attr('stroke-dasharray', '2, 10');
  }
}

export class TriangleDrawHandler extends PenDrawHandler {
  constructor(s){
    super(s);
    this.key = 'triangle';
  }

  createMainElement(canvas, s, x, y, evnt, ele){
    return ele.polygon(0,0, 0,0, 0,0);
  }

  attachAdditionalAttrs(canvas, s, ele, evnt){

    this.attachStrokeAttrs(canvas, s, ele, evnt);

    ele.attr({
      strokeWidth:0,
      'sp-stroke-width': 0
    });

    this.activeMainElement.attr({
      fill:canvas.activeDrawColor.code,
      fillOpacity:0.2});
  }

  onDrawMove(canvas, s, x, y, dx, dy, evnt){
    this.activeMainElement.attr('points', `0,0 ${x},${y} ${-1*x},${y}`);
  }

}

export class RectDrawHandler extends LineDrawHandler {
  constructor(s){
    super(s);
    this.key = 'rect';
    this.enablePointsDragger = false;
  }

  createMainElement(canvas, s, x, y, evnt, ele){
    return ele.rect(0,0,0,0);
  }

  onDrawMove(canvas, s, x, y, dx, dy, evnt){
    var [width, height] = [Math.abs(x), Math.abs(y)];
    this.activeMainElement.attr({width, height});
  }

}

export class CircleDrawHandler extends LineDrawHandler {
  constructor(s){
    super(s);
    this.key = 'circle';
    this.enablePointsDragger = false
  }

  createMainElement(canvas, s, x, y, evnt, ele){
    return ele.circle(0, 0, 0);
  }

  onDrawMove(canvas, s, x, y, dx, dy, evnt){
    var r = Math.abs(x);
    this.activeMainElement.attr({r});
  }

}

export class HighlightDrawHandler extends DrawHandler {
  constructor(s){
    super(s);
    this.key = 'highlight';
  }
}

export class AssertDrawHandler extends DrawHandler{
  constructor(s){
    super(s);
    this.key = 'assert';
  }

  createMainElement(canvas, s, x, y, evnt, ele){
  }

  onClick(canvas, s, evnt, srcElementOffset=null){
    var settings = EditorSetup.getAssertSettings(canvas.activeAssert);
    var imgUrl = EditorSetup.getAssertImageUrl(canvas.activeAssert);
    var assertData = null;
    var [x, y] = [evnt._sp_offsetX, evnt._sp_offsetY];


    var ele = s.image(imgUrl, x, y);
    ele.attr({opacity:0});
    ele.attr({'sp-assert-type': settings.type, 'sp-assert-group': settings.group,  'sp-assert-data': assertData});

    ele.hover(()=>{
      if(canvas.activeCursor.key == 'select'){
        var r = 1.2;
        var [width, height] = [ele.attr('_cwidth'), ele.attr('_cheight')];
        ele.animate({width:width*r, height:height*r}, 200);
      }
    }, ()=>{
      if(canvas.activeCursor.key == 'select'){
        var [width, height] = [ele.attr('_cwidth'), ele.attr('_cheight')];
        ele.animate({width, height}, 200);
      }
    });

    ele.node.onload = () => {
      ele.attr({opacity:0});
      if(settings.width){
        ele.aspectResize(settings.width, settings.height);
      }

      var [width, height] = [ele.attr('width'), ele.attr('height')];
      var [_rx, _ry] = [width/2, height/2];
      if(srcElementOffset && srcElementOffset.x != null){
        [_rx, _ry] = [srcElementOffset.x, srcElementOffset.y];
      }

      //Reposition to middle in the position of mouse
      ele.attr({x:`-=${_rx}`, y:`-=${_ry}`});

      //Store the size for animation
      ele.attr({_cwidth:width, _cheight:height});

      ele.attr({width:"*=.5", height:"*=.5"});
      ele.animate({width:"*=2", height:"*=2", opacity:1}, 200);
    }

    this.attachImageAttr(canvas, s, ele);
  }

  attachAttrs(canvas, s, ele, evnt){
    super.attachAttrs(ele, s, ele, evnt);
  }

  enableDrag(canvas, s, ele){
    ele.realdrag();
  }
}

export class LabelDrawHandler extends DrawHandler{
  constructor(s){
    super(s);
    this.key = 'label';
    this.drawByDrag = false;
    this.disableSelectBox = false;
    this.inEditMode = false;

    this.minWidth = 180;
    this.minHeight = 80;
    this.lineHeight = 1.3;
    this.newLineChar = ';NEW_LINE_CH;'
  }

  onUnselect(canvas, s, ele, newEle, evnt){
    super.onUnselect(canvas, s, ele, newEle, evnt);
    // this.onBlur();
  }

  editModeOn(canvas, evnt, ele, tele){
    this.inEditMode = true;

    this.hideSelector(canvas, canvas.s, ele);

    var [w, h] = [tele.attr('sp-width'), tele.attr('sp-height')];
    tele.attr({opacity:0});

    var pos = $(evnt.currentTarget).offset();
    pos.width = w+'px';
    pos.height = h+'px';

    $('body').append('<div id="svgTextEditorHolder" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index:900"><textarea type="text" id="svgTextEditor" style="z-index:1000;padding:0;background:rgba(255, 255, 255, 0.35);border: 1px solid #fff;" /></textarea></div>');

    var text = tele.attr('text');
    if(text.join){
      text = text.join(' ');
    }

    var _txtEle = $('#svgTextEditor');
    _txtEle.val(text);
    _txtEle.css(pos);
    _txtEle.focus();

    //// To move the cursor to end
    _txtEle.val('');
    _txtEle.val(text);

    $("#svgTextEditorHolder" ).click((function() {
      this.updateText(canvas, evnt, ele, tele);
      this.editModeOff(canvas, ele);
    }).bind(this));

  }

  editModeOff(canvas, ele){
    var el = ele || this.activeElement;
    var mele = el.select('[sp-main]');
    $('#svgTextEditorHolder').remove();
    mele.attr({opacity:1});
    this.inEditMode = false;

    this.repositionSelector(canvas, canvas.s, ele);
    this.showSelector(canvas, canvas.s, ele);
  }

  updateText(canvas, evnt, ele, tele){
    var _txtEle = $('#svgTextEditor');
    var text = _txtEle.val();
    text = text.replace(/[\n\r]/g, ' ' + this.newLineChar + ' ');
    var [w, h] = [_txtEle.width(), _txtEle.height()];

    tele.attr({text:null});
    var words = text.split(/\s+/).reverse(),
        word,
        line = [],
        texts = [],
        tempEle = canvas.s.text(0, 0, '');

    while (word = words.pop()) {
      line.push(word);
      tempEle.attr({text:line.join(" ")});
      if (word == this.newLineChar ||  tempEle.getBBox().width > w) {

        line.pop();
        var nline = line.join(" ");

        if(word == this.newLineChar){
          nline = nline + '\n';
          line = [];
        }else{
          line = [word];
        }

        texts.push(nline);

      }
    }

    if(line){
      texts.push(line.join(" "));
    }

    tempEle.remove();
    tele.attr({text: texts});
    tele.selectAll("tspan").forEach((tspan, i)=>{
      tspan.attr({dy:0, dx:0, x:0, y:(this.lineHeight*i) + "em"});
    });

    var _bbox = tele.getBBox();
    tele.attr({'sp-width':Math.max(this.minWidth, w), 'sp-height': Math.max(this.minHeight, _bbox.height)});
  }

  enableEditableMode(canvas, ele, tele){
    ele.smartClick((ievnt)=>{
      if(canvas.activeCursor.key == EditorSetup.cursors.label.key){
        ievnt.preventDefault();
        this.editModeOn(canvas, ievnt, ele, tele);
      }
    });

    ele.dblclick((ievnt)=>{
      this.editModeOn(canvas, ievnt, ele, tele);
    });
  }

  createMainElement(canvas, s, x, y, evnt, ele){
    var settings = EditorSetup.getAssertSettings(canvas.activeAssert);
    var text = canvas.activeAssertData.text;
    ele.attr({'sp-assert-type': settings.type, 'sp-assert-data': text});

    var tele = ele.text(0, 0, text);
    tele.attr({'sp-main':true, 'sp-width': this.minWidth, 'sp-height': this.minHeight});

    return tele;
  }

  attachEvents(canvas, s, ele){
    super.attachEvents(canvas, s, ele);

    var tele = ele.select('[sp-main]');
    var text = tele.attr('text');

    if(text.length > 1){
      this.enableEditableMode(canvas, ele, tele);
    }
  }

  onClick(canvas, s, evnt){
    if(this.inEditMode){
      return null;
    }

    this.drawElement(canvas, s, null, null, evnt);
  }

}

export class StuffDrawHandler extends DrawHandler{
  constructor(s){
    super(s);
    this.key = 'stuff';
    this.drawByDrag = false;
    this.highlightColor = 'rgba(255, 236, 61, 0.59)';

  }

  createHighligher(canvas, s, ele, evnt, cx, cy){
    var highligher = ele.select('[sp-highligher]');
    if(highligher != null){
      highligher.animate({r:1}, 200, function(){
        highligher.remove();
      });
      return;
    }

    var r = 37.5;
    if(!(cx && cy)){
      var box = ele.getBBox();
      var [cx, cy] = [box.width/2, box.height/2];
    }
    // Math.max(box.width, box.height);

    var c = ele.circle(cx, cy, 1);
    c.after(ele.select('[sp-main]'));

    c.attr({
      'sp-highligher':true,
      'stroke-width':0,
      'fill': this.highlightColor});

    if(this.disableAnimation){
      c.attr({'r': r});
    }
    else{
      c.animate({r}, 200);
    }
    return c;
  }

  createSVGElement(canvas, s, x, y, evnt, ele){

    // ele.attr({opacity:0});
    var name = canvas.activeAssert;
    var parts = name.split('_');
    var kind = parts[0];
    var settings = EditorSetup.getAssertSettings(name);
    var mele =null;
    var _defid = null;

    if(kind == 'player'){
      var _remName = parts.splice(2,4).join('_');
      _defid = EditorSetup.playerSVGUrl({label:parts[1]}, _remName);
    }else if(kind == 'assert' || kind == 'post'){
      var _remName = parts.splice(1,4).join('_');
      _defid = EditorSetup.assertSVGUrl(_remName);
    }

    var _def = canvas.assertSVG.select(_defid);
    if(_def.attr('sp-width')){
      ele.attr({'sp-width': _def.attr('sp-width'), 'sp-height': _def.attr('sp-height')});
    }

    // if(_def.attr('sp-width')){
    //   //Reposition to center of the mouse
    //   var [w, h] = [_def.attr('sp-width'), _def.attr('sp-height')];
    //   ele.translateXY(w/-2, h/-2);
    // }




    mele = ele.use(_def);

    if(settings.scaleRatio){
      // var ebox = ele.getBBox();
      // var [w, h] = [ebox.w, ebox.h];
      // var w = settings.scaleRatio*w;
      // var h = settings.scaleRatio*h;
      mele.scaleWH(settings.scaleRatio);
    }

    return mele;
  }

  createImageElement(canvas, s, x, y, evnt, ele){
    var settings = EditorSetup.getAssertSettings(canvas.activeAssert);
    var imgUrl = EditorSetup.getAssertImageUrl(canvas.activeAssert);

    var mele = ele.image(imgUrl, 0, 0);
    mele.attr({opacity:0});

    mele.node.onload = () => {
      mele.attr({opacity:0});
      if(settings.width){
        mele.aspectResize(settings.width, settings.height);
      }

      var [width, height] = [mele.attr('width'), mele.attr('height')];

      //Reposition to middle in the position of mouse
      mele.attr({x:`-=${width/2}`, y:`-=${height/2}`});

      //Store the size for animation
      mele.attr({'sp-width':width, 'sp-height':height});

      mele.attr({opacity:1});
    }

    return mele;
  }

  createMainElement(canvas, s, x, y, evnt, ele){

    var name = canvas.activeAssert;
    var settings = EditorSetup.getAssertSettings(name);
    var perspectiveScale = settings.perspectiveScale;
    if(settings.perspectiveFields && settings.perspectiveFields.indexOf(name) < 0){
      perspectiveScale = false;
    }
    ele.attr({
      'sp-assert-name': name,
      'sp-assert-type': settings.type,
      'sp-assert-group': settings.group,
      'sp-perspective-scale': perspectiveScale
    });

    if(settings.type == 'svg'){
      return this.createSVGElement(canvas, s, x, y, evnt, ele);
    }else if(settings.type == 'img'){
      return this.createImageElement(canvas, s, x, y, evnt, ele);
    }
  }

  attachEvents(canvas, s, ele){
    super.attachEvents(canvas, s, ele);

    var name = canvas.activeAssert;
    var parts = name.split('_');
    var kind = parts[0];

    if(kind == 'player'){
      ele.smartClick((evnt)=>{
        if(canvas.activeCursor.key == 'highlight'){
          this.createHighligher(canvas, s, ele, evnt);
        }
      });
    }
  }

  attachAttrs(canvas, s, ele, evnt){
    super.attachAttrs(canvas, s, ele, evnt);
    // this.attachSizeAttrs(canvas, s, ele, evnt);
  }

  onClick(canvas, s, evnt, srcElementOffset=null){
    var ele = this.drawElement(canvas, s, null, null, evnt);

    if(srcElementOffset && srcElementOffset.x != null){
      ele.translateXY(-1*srcElementOffset.x, -1*srcElementOffset.y);
    }else if(ele.attr('sp-width')){
      //Reposition to center of the mouse
      var [w, h] = [ele.attr('sp-width'), ele.attr('sp-height')];
      ele.translateXY(w/-2, h/-2);
    }

    ele.animate({opacity:1}, 100);
  }
}

export class ShapeDrawHandler extends PenDrawHandler {
  constructor(s){
    super(s);
    this.key = 'shape';
  }

  createMainElement(canvas, s, x, y, evnt, ele){
    var ele = ele.polygon(0,0, 0,0, 0,0, 0,0);
    ele.attr({fill:'rgba(0, 0, 0, .1)', 'stroke-width':0});
    return ele;
  }

  onSelect(canvas, s, ele, evnt){
    super.onSelect(canvas, s, ele, evnt);

    var mele = this.activeMainElement;
    if(ele.selectAll('[sp-dragger-tool]').length > 0){
      return;
    }
    var points = mele.attr('points').map(v=>parseInt(v));
    for(var i=0; i<4; i++){
      let p1 = i*2;
      let p2 = (i*2)+1;
      var [px, py] = [points[p1], points[p2]];

      this.createDraggerElement(canvas, s, ele, px, py, true,
        (dx, dy, nx, ny, ev)=>{
          var newPoints = mele.attr('points');
          newPoints[p1] = points[p1] + dx;
          newPoints[p2] = points[p2] + dy;
          mele.attr('points', newPoints);
        }, ()=>{
          points = mele.attr('points').map(v=>parseInt(v));
        }
      );
    }

  }

  onDrawMove(canvas, s, x, y, dx, dy, evnt){
    this.activeMainElement.attr('points', `0,0 ${x},0 ${x},${y} 0,${y}`);
  }

  onDrawEnd(canvas, s, x, y, dx, dy){
    this.onSelect(canvas, s, this.activeElement, new MouseEvent(this.activeElement))
    canvas.setActiveCursor(EditorSetup.cursors.select);
  }

}


function LoadPlayerAssert(s, name, color){

  //Load the assert
  var _def = Snap.parse(Asserts[name]);
  _def = _def.select('g');
  _def.attr({opacity:0});
  s.add(_def);

  //Create new color version
  var colors = EditorSetup.asserts.playerDressColor[color];
  _def.selectAll('[sp-part=shirt]').attr({fill:colors.shirt});
  _def.selectAll('[sp-part=shorts]').attr({fill:colors.shorts});

  //Rename the def and attach required attrs
  var _id = _def.attr('id') + '_' + color;
  _def = s.select('#' + _def.attr('id'));
  _def.attr({id:_id});
  _def.toDefs();
  _def.attr({opacity:1});
}

function LoadAllPlayerAssert(s){
  EditorSetup.asserts.players.forEach((p, i)=>{
    EditorSetup.playerColors.forEach((color, j)=>{
      LoadPlayerAssert(s, 'sp_svg_player_'+p, color.label);
    });
  });
}

function LoadAssert(s, key){
  //Load the assert
  var _def = Snap.parse(Asserts[key]);
  _def = _def.select('g');
  _def.attr({opacity:0});
  s.add(_def);

  _def.toDefs();
  _def.attr({opacity:1});
}

function LoadExtraAssert(s){
  LoadAssert(s, 'sp_svg_assert_trash_icon');
}


function CanvasCloneToTeamp(drill, editor, s, assert, temp){

  var p = temp.parent();

  // REMOVE FROM DOM
  temp.remove();
  temp.node.innerHTML = '';

  // ADD TO DOM
  p.append(temp);

  // if(editor.assertSVG.defs){
  //   temp.append(Snap.parse(editor.assertSVG.defs.outerHTML));
  // }

  editor.assertSVG.selectAll('marker').forEach((ele, i)=>{
    var m = Snap.parse(ele.outerSVG());
    m.node.firstChild.id = m.node.firstChild.id + '_temp';
    temp.append(m);

    var _el = temp.selectAll('marker')[temp.selectAll('marker').length-1];
    _el.toDefs();
  })

  s.selectAll('[sp-cloneable]').forEach((ele, i)=>{

    var _txt = ele.outerSVG();
    //BUG: Something is messing in chrome browser which blocks the canvas render.
    // Removing the quote solves it.
    _txt = _txt.replace(/(marker-(start|end):[^\)]*\);)/g, '');

    var el = Snap.parse(_txt);
    temp.append(el);
    var _el = temp.selectAll('[sp-cloneable]')[temp.selectAll('[sp-cloneable]').length-1];

    var markerId = _el.attr('sp-marker');

    if(markerId){
      var attr = 'markerEnd';
      if(_el.attr('sp-marker-position') == 'start'){
        attr = 'markerStart'
      }

      var _mele = _el.select('[sp-main]');
      _mele.attr({[attr]:  temp.select(markerId+'_temp')});
    }

  })

  temp.selectAll('use').forEach((ele, i)=>{

    var href = ele.attr('xlink:href');

    if(!href){
      href = ele.attr('href');
    }

    if(!href){
      return;
    }

    var org = assert.select(href);


    if(!org){
      console.log('Element missing for', href);
      return;
    }


    var _o = temp.g();
    _o.append(Snap.parse(org.innerSVG()));
    if(ele.node.getAttribute('transform')){
      _o.node.setAttribute('transform', ele.node.getAttribute('transform'));
    }
    ele.before(_o);
    ele.remove();
  });
}

function CanvasChangeToBlack(drill, editor, s, assert, temp){
  temp.selectAll('[sp-item-onlycolor="true"]').attr({'opacity':0});
  temp.selectAll('[sp-item-onlyblack="true"]').attr({'opacity':1});

  temp.selectAll('[sp-item-name="background"]').attr({
    'fill': '#FFFFFF',
    'stroke':'black',
    'stroke-width': '2px'
  });

  var fields = temp.selectAll('[sp-item-name="stroke"]')
  if(fields){
    for (var i = fields.length - 1; i >= 0; i--) {
      var f = fields[i];
      f.selectAll('[stroke="#FFFFFF"]').attr({
        'stroke': '#000000'
      });
    };
  }

  temp.selectAll('text').attr({'fill': '#000000'});
}

function CanvasToData(eleId, svgSize, svgXML){
  var q = new Promise.Deferred();

  var tempCanvas = document.getElementById(eleId);

  var ctx = tempCanvas.getContext("2d");
  ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  tempCanvas.width = svgSize.width;
  tempCanvas.height = svgSize.height;
  canvg(tempCanvas, svgXML, {
    ignoreMouse: true, ignoreAnimation: true,
    renderCallback: ()=>{
      q.resolve(tempCanvas.toDataURL( "image/png" ));
    }
  });

  return q;
}


function CreateCanvasElement(eleId, dontClear=false){
  var q = new Promise.Deferred();

  var drill = EditorSetup.activeDrill;
  var editor = EditorSetup.activeEditor;

  var s = editor.s;
  var assert = editor.assertSVG;
  var temp = editor.tempSVG;

  s.selectAll('[sp-selector-box-close-button]').remove();
  s.selectAll('[sp-selector-box]').remove();
  s.selectAll('[sp-dragger-tool]').remove();

  CanvasCloneToTeamp(drill, editor, s, assert, temp);
  var svgText = s.innerSVG();

  // Firefox, Safari root NS issue fix
  svgText = svgText.replace('xlink=', 'xmlns:xlink=')
  // Safari xlink NS issue fix
  svgText = svgText.replace(/NS\d+:href/g, 'xlink:href')

  var svgSize = s.node.getBoundingClientRect();
  var imageData = null;
  var imageDataBlack = null;

  var innerQ = CanvasToData(eleId, svgSize, temp.outerSVG());
  if(dontClear){
    var tempCanvas = document.getElementById(eleId);
    q.resolve({canvas:tempCanvas, imageData, svgText, imageDataBlack});
  }else{
    innerQ.then((data)=>{
      imageData = data;
      CanvasChangeToBlack(drill, editor, s, assert, temp);
      return CanvasToData(eleId, svgSize, temp.outerSVG());
    })
    .then((data)=>{
      imageDataBlack = data;
      var tempCanvas = document.getElementById(eleId);
      q.resolve({canvas:tempCanvas, imageData, svgText, imageDataBlack});
      temp.clear();

      var ctx = tempCanvas.getContext("2d");
      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    });
  }


  return q;
}

export var CreateCanvasElement;
export var LoadPlayerAssert;
export var LoadAllPlayerAssert;
export var LoadExtraAssert;
