function fixEventObject(e, forTarget){
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

export var fixEventObject;
