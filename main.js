const create_floor_btn = document.getElementById("createfloor");
const floor_area = document.getElementById("floor");

let floor_size = 5;

// createFloor();

create_floor_btn.addEventListener("click", createFloor);

function createFloor() {
  let i, j;
  let tr, td;

  let floor_table = document.createElement('table');
  floor_table.className = "floor_table";
  floor_table.border = "0";

  for(i = 0; i < floor_size; i++) {
    tr = floor_table.insertRow(-1);
    for(j = 0; j < floor_size; j++) {
      td = tr.insertCell(-1);
      td.innerHTML = "<img src = \"floor.png\">";
      td.className = `cell${i}${j}`;
    }
  }

  floor_area.innerHTML = "";
  floor_area.appendChild(floor_table);
  console.log(floor_area);
  
}






// キーボードの矢印キーで移動させる
const mover = document.querySelector('.mover');
// const test = document.getElementById('test');

// 目標位置
let positionX = 0;
let positionY = 0;

// 現在位置
let currentX = 0;
let currentY = 0;

const MOVE_UNIT = 64;

// window.addEventListener('keyup', keymove, false);

// tick();


function keymove(event) {
  let key_code = event.keyCode;
  if(key_code === 37) {
    positionX -= MOVE_UNIT;
  } else if (key_code === 38) {
    positionY -= MOVE_UNIT;
  } else if (key_code === 39) {
    positionX += MOVE_UNIT;
  } else if (key_code === 40) {
    positionY += MOVE_UNIT;
  }
}

function tick() {
  window.requestAnimationFrame(tick);

  currentX += (positionX - currentX) * 0.1;
  currentY += (positionY - currentY) * 0.1;

  mover.style.transform = `translate(${currentX}px, ${currentY}px)`;
};
