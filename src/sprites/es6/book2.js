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
  const _this = {
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
  return _this;
};
$(document).ready(() => {
  const params = {
    images: 'images/cogs.png',
    imagesWidth: 256,
    width: 64,
    height: 64,
    $drawTarget: $('#draw-target')
  };
  const sprite1 = DHTMLSprite(params);
  const sprite2 = DHTMLSprite(params);
  sprite2.changeImage(5);
  sprite1.draw(64, 64);
  sprite2.draw(352, 192);
});
