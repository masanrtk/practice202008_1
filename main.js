const create_floor_btn = document.getElementById("createfloor");
const message_area = document.getElementById("message");
const floor_area = document.getElementById("floor");

let floor_size,
    default_floor_size = 5;
let floor_containts = []; // リファクタリング時はfloorObjectのプロパティ
let depth = 1,
    max_depth = 1;

let is_game_running = 0; // geme実行中かどうか、名前よくないな

let stayCurrentRatio = 0.3; // 同じ場所に居続ける確率（固定値でよいか？）


let change; // これも名前悪い

// let direction;

// ボタンクリックでゲームが始まる
create_floor_btn.addEventListener("click", newGame);

function newGame() {
// stopOldGame();
// removeEventListener();
  depth = 1;
  floor_size = default_floor_size;
  message_area.innerHTML = `ようこそ果てしなき迷宮へ<br>ここは第${depth}階だ<br>これまで第${max_depth}まで到達しているぞ`;

  is_game_running = 1;
  createNewFloor();
  placeObject('G');
  placeObject('m');
  placeObject('b');
  hasFloorUpdate();
//  depictFloorAndObject();
  window.addEventListener('keyup', keyInput, false);
  runGame();
}

function runGame() {
  if(isFloorUpdate()) {
    depictFloorAndObject();
    clearFloorUpdate();
  }
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
        td.innerHTML = "<img src = \"Gate.png\">";
      } else if (floor_containts[y * floor_size + x] === 'b') {
        td.innerHTML = "<img src = \"brave.png\">";
      } else if (floor_containts[y * floor_size + x] === 'm') {
        td.innerHTML = "<img src = \"monster.png\">";
      } else if (floor_containts[y * floor_size + x] === 'D') {
        td.innerHTML = "<img src = \"Damaged.png\">";  // DamagedのD
      } else if (floor_containts[y * floor_size + x] === 'g') {
        td.innerHTML = "g";  // graveyardのg
      } else {
        // err
      }
    }
  }

  floor_area.innerHTML = "";  // これ問題ないかな？

  floor_area.appendChild(floor_table);
  console.log(floor_area);
}


function placeObject(type) {
  let position,  // position[0]:x軸、position[1]:y軸
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


function hasFloorUpdate() {
  change = true;
}

function clearFloorUpdate() {
  change = false;
}

function isFloorUpdate() {
  return change;
}

// イベントリスナーのcallback関数だけれど、braveMoveとあまりにも
// 密結合すぎる
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
    return; // あまりよくない終わり方
  }

  if(is_game_running === 1) {
    updateTurn(move_direction);
    hasFloorUpdate();
  } else { // nothitng done
    console.log("do nothing");
    return;
  }
//  braveMove(move_direction);

}

// ターンがキーボードの入力で進んでいくことになっている
// 拡張性を考えると、braveの移動とそれ以外の判定は別にしたいところ
// とするのであれば、判定部は別だし
function updateTurn(move_direction) {
  let brave_position = braveMove(move_direction),
      monster_position = monsterMove(), // モンスターの数が増えたら問題
      gate_position = getCurrentPosition('G');

  if(brave_position >= 0) {
    if(brave_position === gate_position) {
      clearCurrentFloor();
      nextFloor();
    } else if(brave_position === monster_position) {　// モンスターの数が増えたら問題
      gameOver(monster_position);
    } else {
      updateNextTurn(brave_position, monster_position);
    }
  }

}


function clearCurrentFloor() {
// congraturation!
// alert("clearCurrentFloor");
}

function nextFloor() {
  depth++;
  floor_size = default_floor_size + Math.floor(depth / 5);

  if(max_depth < depth) {
    max_depth = depth;
  }
  message_area.innerHTML = `ここは第${depth}階だ<br>これまで第${max_depth}まで到達しているぞ`;

  createNewFloor();
  placeObject('G');
  placeObject('m');
  placeObject('b');
}


// gameOverとupdateNextTrunとclearCurrentFloorは共通化できそう
function gameOver(next_monster_position) {
// disappointed!!!
  let current_brave_position = getCurrentPosition('b'),
      current_monster_position = getCurrentPosition('m');

  floor_containts[current_brave_position] = 'f';
  floor_containts[current_monster_position] = 'f';
  floor_containts[next_monster_position] = 'g';

  is_game_running = 0;
  alert("gameOver");
}


function updateNextTurn(next_brave_position, next_monster_position) {
  let current_brave_position = getCurrentPosition('b'),
      current_monster_position = getCurrentPosition('m');

  floor_containts[current_brave_position] = 'f';
  floor_containts[current_monster_position] = 'f';
  // 順序性がある。floorで上書きしないように
  floor_containts[next_brave_position] = 'b';
  floor_containts[next_monster_position] = 'm';

  floorCurruption();

}


function floorCurruption() {
  placeObject('D');
}


// braveの移動先を返す
function braveMove(move_direction) {
  let brave_position = getCurrentPosition('b'),
      next_position = brave_position + move_direction;

  if(brave_position < 0) {
    throw(new Error("brave disappeared"));
  }

  // braveの移動先、braveの移動方法が正常なら
  if(next_position >= 0 && next_position < floor_size * floor_size) {
    if((move_direction === -1 && positionArr(brave_position)[0] === 0)
      || (move_direction === 1 && positionArr(brave_position)[0] === floor_size - 1)) {
    } else {
      if(floor_containts[next_position] !== 'D') {
        return next_position;
      } else {
        return -1;
      }
    }
  }
}




// monsterの動きは、
// 1. 同じ場所委に居座る
// 2. randomに動き回る
// 3. braveを追いかける（未実装）
function monsterMove() {
  let monster_position = getCurrentPosition('m'),
      move_direction,
      next_position,
      random;

  // monsterの移動先が存在しているかどうか
  if((monster_position - 1 >= 0 && floor_containts[monster_position - 1] === 'f')
     || (monster_position - floor_size >= 0 && floor_containts[monster_position - floor_size] === 'f')
     || (monster_position + 1 < floor_size * floor_size && floor_containts[monster_position + 1] === 'f')
     || (monster_position + floor_size < floor_size * floor_size && floor_containts[monster_position + floor_size] === 'f')
   ) {
   } else {
     return monster_position;
   }

  if(Math.random() < stayCurrentRatio) {
     return monster_position;
  }

  do{
    random = Math.random();
    if(random < 0.25) { // left
      move_direction = -1;
    } else if(0.25 < random && random < 0.5) { // up
      move_direction = -floor_size;
    } else if(0.5 < random && random < 0.75) { //right
      move_direction = 1;
    } else { // down
      move_direction = floor_size;
    }
    next_position = monster_position + move_direction;
    // monsterの移動先が正常なら
    if(next_position >= 0 && next_position < floor_size * floor_size) {
      if((move_direction === -1 && positionArr(monster_position)[0] === 0)
        || (move_direction === 1 && positionArr(monster_position)[0] === floor_size - 1)) {
      } else {
        if(floor_containts[next_position] === 'f') {
          return next_position;
        }
      }
    }
  } while(1);
}

/*
function bravePosition() { // ｘとｙの値は、brave オブジェクトのプロパティにできる
  let i;
  for(i = 0; i < floor_size * floor_size; i++) {
    if(floor_containts[i] === 'b') {
      console.log(i);
      return i;
    }
  }
}
*/

// 頭悪いよね。場所ぐらいプロパティで記憶しておけばいいのに
// いなければ -1 を返す
function getCurrentPosition(type) { // ｘとｙの値は、type オブジェクトのプロパティにできる
  let i;
  for(i = 0; i < floor_size * floor_size; i++) {
    if(floor_containts[i] === type) {
      console.log(`${type}: ${i}`);
      return i;
    }
  }

  return -1; // 見つからなかった

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
