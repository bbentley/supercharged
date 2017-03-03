'use strict';
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
  var _this = {
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
  return _this;
};
$(document).ready(function() {
  var params = {
    images: 'images/cogs.png',
    imagesWidth: 256,
    width: 64,
    height: 64,
    $drawTarget: $('#draw-target')
  };
  var sprite1 = DHTMLSprite(params),
    sprite2 = DHTMLSprite(params);
  sprite2.changeImage(5);
  sprite1.draw(64, 64);
  sprite2.draw(352, 192);
});
