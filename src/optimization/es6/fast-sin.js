$(document).ready(() => {
  ((() => {
    const fastSin = steps => {
      const table = [];
      let ang = 0;
      const angStep = (Math.PI * 2) / steps;
      do {
        table.push(Math.sin(ang));
        ang += angStep;
      } while (ang < Math.PI * 2);
      return table;
    };
    const sinTable = fastSin(4096);
    const $drawTarget = $('#draw-target');
    let divs = '';
    let i;
    let $bars;
    let x = 0;
    const drawGraph = (ang, freq, height) => {
      const height2 = height * 2;
      for (let i = 0; i < 480; i++) {
        $bars[i].style.top =
          `${160 - height + sinTable[(ang + (i * freq)) & 4095] * height}px`;
        $bars[i].style.height = `${height2}px`;
      }
    };
    for (i = 0; i < 480; i++) {
      divs += `<div style="position:absolute; width:1px; height:40px; background-color:#0d0; top:0px; left: ${i}px;"></div>`;
    }
    $drawTarget.append(divs);
    $bars = $drawTarget.children();
    setInterval(() => {
      drawGraph(x * 50, 32 - (sinTable[(x * 20) & 4095] * 16), 50 - (sinTable[(x * 10) & 4095] * 20));
      x++;
    }, 20);
  }))();

});
