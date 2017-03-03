'use strict';
var timeInfo = function(goalFPS) {
  var oldTime, paused = true,
    iterCount = 0,
    totalFPS = 0;
  return {
    getInfo: function() {

      if (paused === true) {
        paused = false;
        oldTime = +new Date();
        return {
          elapsed: 0,
          coeff: 0,
          FPS: 0,
          averageFPS: 0
        };
      }

      var newTime = +new Date();
      var elapsed = newTime - oldTime;
      oldTime = newTime;
      var FPS = 1000 / elapsed;
      iterCount++;
      totalFPS += FPS;
      return {
        elapsed: elapsed,
        coeff: goalFPS / FPS,
        FPS: FPS,
        averageFPS: totalFPS / iterCount
      };
    },
    pause: function() {
      paused = true;
    }
  };
};



var DHTMLSprite = function(params) {
  var width = params.width,
    height = params.height,
    imagesWidth = params.imagesWidth,
    $element = params.$drawTarget.append('<div/>').find(':last'),
    elemStyle = $element[0].style,
    mathFloor = Math.floor;
  $element.css({
    position: 'absolute',
    width: width,
    height: height,
    backgroundImage: 'url(' + params.images + ')'
  });
  var that = {
    draw: function(x, y) {
      elemStyle.left = x + 'px';
      elemStyle.top = y + 'px';
    },
    changeImage: function(index) {
      index *= width;
      var vOffset = -mathFloor(index / imagesWidth) * height;
      var hOffset = -index % imagesWidth;
      elemStyle.backgroundPosition = hOffset + 'px ' + vOffset + 'px';
    },
    show: function() {
      elemStyle.display = 'block';
    },
    hide: function() {
      elemStyle.display = 'none';
    },
    destroy: function() {
      $element.remove();
    }
  };
  return that;
};
var bouncySprite = function(params) {
  var x = params.x,
    y = params.y,
    xDir = params.xDir,
    yDir = params.yDir,
    maxX = params.maxX,
    maxY = params.maxY,
    animIndex = 0,
    that = DHTMLSprite(params);
  that.moveAndDraw = function(tCoeff) {

    x += xDir * tCoeff;
    y += yDir * tCoeff;
    animIndex += xDir > 0 ? 1 * tCoeff : -1 * tCoeff;
    var animIndex2 = (animIndex % 5) >> 0;
    animIndex2 += animIndex2 < 0 ? 5 : 0;

    if ((xDir < 0 && x < 0) || (xDir > 0 && x >= maxX)) {
      xDir = -xDir;
    }
    if ((yDir < 0 && y < 0) || (yDir > 0 && y >= maxY)) {
      yDir = -yDir;
    }
    that.changeImage(animIndex2);
    that.draw(x, y);
  };
  return that;
};
var bouncyBoss = function(numBouncy, $drawTarget) {
  var bouncys = [],
    timer = timeInfo(40);


  for (var i = 0; i < numBouncy; i++) {
    bouncys.push(bouncySprite({
      images: 'images/cogs.png',
      imagesWidth: 256,
      width: 64,
      height: 64,
      $drawTarget: $drawTarget,
      x: Math.random() * ($drawTarget.width() - 64),
      y: Math.random() * ($drawTarget.height() - 64),
      xDir: Math.random() * 4 - 2,
      yDir: Math.random() * 4 - 2,
      maxX: $drawTarget.width() - 64,
      maxY: $drawTarget.height() - 64
    }));
  }
  var moveAll = function() {
    var timeData = timer.getInfo();
    var len = bouncys.length;
    for (var i = 0; i < len; i++) {
      bouncys[i].moveAndDraw(timeData.coeff);
    }
    $('#info1').text('FPS: ' + Math.floor(timeData.FPS));
    $('#info2').text('Average FPS: ' + Math.floor(timeData.averageFPS));
    $('#info3').text('Time Coefficient: ' + timeData.coeff.toFixed(2));
    setTimeout(moveAll, 10);
  }
  moveAll();
};
$(document).ready(function() {
  bouncyBoss(100, $('#draw-target'));
});
