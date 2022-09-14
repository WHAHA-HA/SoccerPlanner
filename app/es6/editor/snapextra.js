Snap.plugin((Snap, Element, Paper, global, Fragment)=>{
  Element.prototype.possiblePoints = function(){
    var points = {};

    if(this.attr('x1')){
      points.x1 = parseInt(this.attr('x1'));
      points.y1 = parseInt(this.attr('y1'));
    }

    if(this.attr('x2')){
      points.x2 = parseInt(this.attr('x2'));
      points.y2 = parseInt(this.attr('y2'));
    }

    if(this.attr('cx')){
      points.cx = parseInt(this.attr('cx'));
      points.cy = parseInt(this.attr('cy'));
    }

    if(this.attr('x')){
      points.x = parseInt(this.attr('x'));
      points.y = parseInt(this.attr('y'));
    }

    return points;
  }

  Element.prototype.addPossiblePoints = function(dx, dy, fromOrign){
    var origin = fromOrign || this.possiblePoints();

    var good = false;
    var _attr = {};

    if(origin.x){
      _attr.x = origin.x + dx;
      _attr.y = origin.y + dy;
      good = true;
    }

    if(origin.cx){
      _attr.cx = origin.cx + dx;
      _attr.cy = origin.cy + dy;
      good = true;
    }

    if(origin.x1){
      _attr.x1 = origin.x1 + dx;
      _attr.y1 = origin.y1 + dy;
      good = true;
    }

    if(origin.x2){
      _attr.x2 = origin.x2 + dx;
      _attr.y2 = origin.y2 + dy;
      good = true;
    }

    this.attr(_attr);
    return good;
  }


  Element.prototype.realdrag = function(){
    var origin = this.possiblePoints();
    this._dragInProgress = false;

    this.drag((dx, dy, nx, ny, ev)=>{
      this.addPossiblePoints(dx, dy, origin);
    }, (dx, dy)=>{
      this._dragInProgress = true;
      origin = this.possiblePoints();
    }, ()=>{
      this._dragInProgress = false;
    });

  }

  Element.prototype.movePossible = function(direction, step, translate){
    var origin = this.possiblePoints();
    var [x, y] = [-1*step, 0];
    if(direction == 'up') [x, y] = [0, -1*step];
    if(direction == 'right') [x, y] = [step, 0];
    if(direction == 'down') [x, y] = [0, step];

    var g = this.addPossiblePoints(x, y);
    if((!g) && translate == true){
      this.translateXY(x, y);
    }
  }

  Element.prototype.translateXY = function(x, y){
    var mat = this.translateMatrixXY(x, y);
    this.transform(mat);
  }

  Element.prototype.translateMatrixXY = function(x, y){
    var mat = this.matrix || new Snap.Matrix();
    return mat.translate(x, y);
  }

  Element.prototype.scaleWH = function(w, h, cx, cy){
    var mat = this.scaleMatrixWH(w, h, cx, cy)
    this.transform(mat);
  }

  Element.prototype.fixedScaleWH = function(w, h, cx, cy){
    var mat = this.fixedScaleMatrixWH(w, h, cx, cy)
    this.transform(mat);
  }

  Element.prototype.scaleMatrixWH = function(w, h, cx, cy){
    var mat = this.matrix || new Snap.Matrix();
    return mat.scale(w, h, cx, cy);
  }

  Element.prototype.fixedScaleMatrixWH = function(w, h, expandMode){
    var mat = this.matrix || new Snap.Matrix();

    mat.a = w;
    mat.d = h;

    if(expandMode){
    }

    return mat;
  }

  Element.prototype.aspectResize = function(maxWidth, maxHeight){
    var [width, height] = [this.attr('width'), this.attr('height')];
    var ratio = 1;

    if(width > height){
      ratio = maxWidth/width;
    }else{
      ratio = maxHeight/height;
    }

    if(ratio < 1){
      this.attr({width: width*ratio, height: height*ratio});
    }
  }

  Element.prototype.smartClick = function(callback){
    if(Modernizr.touchevents){
      console.log('Will use touch for clicks');
      var	lastTouch = {x: null,y: null};

      this.touchstart((evnt)=>{
        lastTouch.x = evnt.pageX;
        lastTouch.y = evnt.pageY;
      });

      this.touchend((evnt)=>{
        var x = evnt.changedTouches[0].pageX;
        var y = evnt.changedTouches[0].pageY;
        if ( x == lastTouch.x && y == lastTouch.y){
          if(!evnt.clientX){
            evnt.clientX = evnt.changedTouches[0].clientX;
            evnt.clientY = evnt.changedTouches[0].clientY;
          }
          callback.call(this, evnt);
        }
      });

    }else{
      this.click((evnt)=>{
        callback.call(this, evnt);
      });
    }
  }
});
