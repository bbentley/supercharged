(($ => {
  $.fn.bouncyPlugin = function(option) {
    const DHTMLSprite = params => {
      const width = params.width;
      const height = params.height;
      const imagesWidth = params.imagesWidth;
      const $element = params.$drawTarget.append('<div/>').find(':last');
      const elemStyle = $element[0].style;
      const mathFloor = Math.floor;
      $element.css({
        position: 'absolute',
        width,
        height,
        backgroundImage: `url(${params.images})`
      });
      const that = {
        draw(x, y) {
          elemStyle.left = `${x}px`;
          elemStyle.top = `${y}px`;
        },
        changeImage(index) {
          index *= width;
          const vOffset = -mathFloor(index / imagesWidth) * height;
          const hOffset = -index % imagesWidth;
          elemStyle.backgroundPosition = `${hOffset}px ${vOffset}px`;
        },
        show() {
          elemStyle.display = 'block';
        },
        hide() {
          elemStyle.display = 'none';
        },
        destroy() {
          $element.remove();
        }
      };
      return that;
    };
    const bouncySprite = params => {
      let x = params.x;
      let y = params.y;
      let xDir = params.xDir;
      let yDir = params.yDir;
      const maxX = params.maxX;
      const maxY = params.maxY;
      let animIndex = 0;
      const that = DHTMLSprite(params);
      that.moveAndDraw = () => {
        x += xDir;
        y += yDir;
        animIndex += xDir > 0 ? 1 : -1;
        animIndex %= 5;
        animIndex += animIndex < 0 ? 5 : 0;
        if ((xDir < 0 && x < 0) || (xDir > 0 && x >= maxX)) {
          xDir = -xDir;
        }
        if ((yDir < 0 && y < 0) || (yDir > 0 && y >= maxY)) {
          yDir = -yDir;
        }
        that.changeImage(animIndex);
        that.draw(x, y);
      };
      return that;
    };
    const bouncyBoss = (numBouncy, $drawTarget) => {
      const bouncys = [];
      for (let i = 0; i < numBouncy; i++) {
        bouncys.push(bouncySprite({
          images: 'images/cogs.png',
          imagesWidth: 256,
          width: 64,
          height: 64,
          $drawTarget,
          x: Math.random() * ($drawTarget.width() - 64),
          y: Math.random() * ($drawTarget.height() - 64),
          xDir: Math.random() * 4 - 2,
          yDir: Math.random() * 4 - 2,
          maxX: $drawTarget.width() - 64,
          maxY: $drawTarget.height() - 64
        }));
      }
      const moveAll = () => {
        const len = bouncys.length;
        for (let i = 0; i < len; i++) {
          bouncys[i].moveAndDraw();
        }
        $drawTarget.css('display', 'block');
        setTimeout(moveAll, 10);
      };
      //												setInterval(moveAll,20);
      moveAll();
    };
    option = $.extend({}, $.fn.bouncyPlugin.defaults, option);
    return this.each(function() {
      const $drawTarget = $(this);
      $drawTarget.css('background-color', option.bgColor);
      bouncyBoss(option.numBouncy, $drawTarget);
    });
  };
  $.fn.bouncyPlugin.defaults = {
    bgColor: '#f00',
    numBouncy: 10
  };
}))(jQuery);



$(document).ready(() => {
  $('.draw-target').bouncyPlugin({
    numBouncy: 20,
    bgColor: '#8ff'
  });
});
