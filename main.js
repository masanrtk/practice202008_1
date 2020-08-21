const create_floor_btn = document.getElementById("createfloor");
const floor_area = document.getElementById("floor");

let floor_size = 5;
var floor_containts = []; // リファクタリング時はfloorObjectのプロパティ
let brave_position_x, brave_position_y;  // リファクタリング時はbraveObjectのプロパティ

create_floor_btn.addEventListener("click", newGame);

function newGame() {
  createNewFloor();
  placeObject('G');
  placeObject('m');
  placeObject('b');
  depictFloorAndObject();
}

/*
 * リファクタリングのときにObjectにしたときにイベントのコールバックになる？
 * オブジェクトを引数にする？ floor_containts をどこからもってくるか。
 * リファクタリング：フロアプラン作成→出口の位置、冒険者の位置、モンスターの位置
 * 　　　　　　　　　それから、HTML作成で、分離すべきだな
 */
function createNewFloor() { // リファクタリング時はfloorObjectのメソッド
  let x, y;
  for(y = 0; y < floor_size; y++) {
    for(x = 0; x < floor_size; x++) {
      floor_containts[y * floor_size + x] = 'f';
    }
  }
}

function depictFloorAndObject() {
  let tr, td;
  let x, y;

  let floor_table = document.createElement('table');
  floor_table.className = "floor_table";
  floor_table.border = "0";

  for(y = 0; y < floor_size; y++) {
    tr = floor_table.insertRow(-1);
    for(x = 0; x < floor_size; x++) {
      td = tr.insertCell(-1);
      td.className = `cell${y}${x}`;
      if(floor_containts[y * floor_size + x] === 'f') {
        td.innerHTML = "<img src = \"floor.png\">";
      } else if (floor_containts[y * floor_size + x] === 'G') {
        td.innerHTML = "G";
      } else if (floor_containts[y * floor_size + x] === 'b') {
        td.innerHTML = "b";
      } else if (floor_containts[y * floor_size + x] === 'm') {
        td.innerHTML = "m";
      } else {
        // err
      }
    }
  }

  floor_area.innerHTML = "";
  floor_area.appendChild(floor_table);
  console.log(floor_area);
}


// get Positionと placeは共通化可能
function placeObject(type) {
  let x, y;
  let random;

  do {
    random = Math.floor(Math.random() * (floor_size * floor_size));
    y = Math.floor(random / floor_size);
    console.log(y);
    x = random - y * floor_size;
    console.log(x);
    console.log(floor_containts[y * floor_size + x]);
//  } while(0);
  } while (floor_containts[y * floor_size + x] !== 'f');

  floor_containts[y * floor_size + x] = type;

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
