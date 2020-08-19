// キーボードの矢印キーで移動させる
const mover = document.querySelector('.mover');
// const test = document.getElementById('test');

// 目標位置
let positionX = 0;
let positionY = 0;

// 現在位置
let currentX = 0;
let currentY = 0;

window.addEventListener('keyup', keymove, false);

tick();


function keymove(event) {
  let key_code = event.keyCode;
  if(key_code === 37) {
    positionX -= 32;
  } else if (key_code === 38) {
    positionY -= 32;
  } else if (key_code === 39) {
    positionX +=32;
  } else if (key_code === 40) {
    positionY += 32;
  }
}

function tick() {
  window.requestAnimationFrame(tick);

  currentX += (positionX - currentX) * 0.1;
  currentY += (positionY - currentY) * 0.1;

  mover.style.transform = `translate(${currentX}px, ${currentY}px)`;
};
