const timeInfo = goalFPS => {
  let oldTime;
  let paused = true;
  let iterCount = 0;
  let totalFPS = 0;
  return {
    getInfo() {

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

      const newTime = +new Date();
      const elapsed = newTime - oldTime;
      oldTime = newTime;
      const FPS = 1000 / elapsed;
      iterCount++;
      totalFPS += FPS;
      return {
        elapsed,
        coeff: goalFPS / FPS,
        FPS,
        averageFPS: totalFPS / iterCount
      };
    },
    pause() {
      paused = true;
    }
  };
};



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
  that.moveAndDraw = tCoeff => {

    x += xDir * tCoeff;
    y += yDir * tCoeff;
    animIndex += xDir > 0 ? 1 * tCoeff : -1 * tCoeff;
    let animIndex2 = (animIndex % 5) >> 0;
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
const bouncyBoss = (numBouncy, $drawTarget) => {
  const bouncys = [];
  const timer = timeInfo(40);


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
    const timeData = timer.getInfo();
    const len = bouncys.length;
    for (let i = 0; i < len; i++) {
      bouncys[i].moveAndDraw(timeData.coeff);
    }
    $('#info1').text(`FPS: ${Math.floor(timeData.FPS)}`);
    $('#info2').text(`Average FPS: ${Math.floor(timeData.averageFPS)}`);
    $('#info3').text(`Time Coefficient: ${timeData.coeff.toFixed(2)}`);
    setTimeout(moveAll, 10);
  };
  moveAll();
};
$(document).ready(() => {
  bouncyBoss(100, $('#draw-target'));
});
