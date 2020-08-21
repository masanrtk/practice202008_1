const create_floor_btn = document.getElementById("createfloor");
const floor_area = document.getElementById("floor");

let floor_size = 5;
let floor_containts = []; // リファクタリング時はfloorObjectのプロパティ

let direction;


create_floor_btn.addEventListener("click", newGame);


function newGame() {
// stopOldGame();
// removeEventListener();
  createNewFloor();
  placeObject('G');
  placeObject('m');
  placeObject('b');
  depictFloorAndObject();
  window.addEventListener('keyup', keyInput, false);
  runGame();
}

function runGame() {
  depictFloorAndObject();
  setTimeout(runGame, 333);  // CPUを３～５％も消費している　くそ
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

  floor_area.innerHTML = "";  // これ問題ないかな？

  floor_area.appendChild(floor_table);
  console.log(floor_area);
}


// get Positionと placeは共通化可能
/*
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
*/
function placeObject(type) {
  let position,
      random;

  do {
    random = Math.floor(Math.random() * (floor_size * floor_size));
    position = positionArr(random);
    console.log(position);
  } while (floor_containts[position[1] * floor_size + position[0]] !== 'f');

  floor_containts[position[1] * floor_size + position[0]] = type;
}

function positionArr(position) {
  let y = Math.floor(position / floor_size),
      x = position - y * floor_size;
  return [x, y];
}


function keyInput(event) {
  let key_code = event.keyCode,
      move_direction;

  if(key_code === 37) {  // move left
    move_direction = -1;
  } else if(key_code === 38) { // move up
    move_direction = -floor_size;
  } else if(key_code === 39) { // move right
    move_direction = 1;
  } else if(key_code === 40) { // move down
    move_direction = floor_size;
  } else { // nothing happens
  }

  braveMove(move_direction);

}

// これが肝なんだけど、今だとbraveの動きに連動してすべてが決定するつくりになるなぁ
// 拡張性を考えると、braveの移動とそれ以外の判定は別にしたいところ
// とするのであれば、判定部は別だしで、next_positionだけを返す関数にすべきか
function braveMove(move_direction) {
  let brave_position = bravePosition(),
      next_position = brave_position + move_direction;

  // braveの移動先、braveの移動方法が正常なら
  if(next_position >= 0 && next_position < floor_size * floor_size) {
    if((move_direction === -1 && positionArr(brave_position)[0] === 0)
      || (move_direction === 1 && positionArr(brave_position)[0] === floor_size - 1)) {
    } else {
        if(floor_containts[next_position] === 'f') {
/* ここを改良する必要がある */
          floor_containts[brave_position] = 'f';
          floor_containts[next_position] = 'b';
        } else if(floor_containts[next_position] === 'G') {
          // floor clear
        } else if(floor_containts[next_position] === 'm') {
          // Gameover
        }
      }
  }
}


function bravePosition() { // ｘとｙの値は、brave オブジェクトのプロパティにできる
  let i;
  for(i = 0; i < floor_size * floor_size; i++) {
    if(floor_containts[i] === 'b') {
      console.log(i);
      return i;
    }
  }
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
