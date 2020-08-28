fInitGame(oDisplayArea, fNewGame);  // start everything


// module tree
const nsGame = {
  cUnit: {},
  cUnitBrave: {},
  cUnitMonster: {},
  cFloor: {},
  nsConstructors: {
    cUnitOpaqueConstructor: {}, // 使わない、試験用
    cUnitBraveConstructor: {},
    cUnitMonsterConstructor: {},
    cFloorConstructor: {}
  },
  moduleFunctions: {
    fMove: {},
    fPlace: {}
  },
  moduleUtilities: {
    fRunGame: {},
    fNewGame: {}
  }
}



/* unitオブジェクトの共通クラス */
nsGame.cUnit = function(id) {
//  let _current_position,
//  let _next_position;
  const _id = id || 0,
        _type = 'u';

  this.position;
  this.next_position;

  Object.defineProperties(this, {
    'type': {
      get: function() {
        console.log(`getter type ${_type}`);
        return _type;
      },
      enumerable: true,
      configurable: true
    },
    'id': {
      get: function() {
        console.log(`getter id ${_id}`);
        return _id;
      },
      enumerable: true,
      configurable: true
    }
  });

  this.mMove = (move_direction, cFloor = {size, container}) => {
    let ret = fMove(this.position, move_direction, cFloor);
    console.log(`ret: ${ret}`);
    this.next_position = ret === -1 ? this.position : ret;
    console.log(`this.next_position: ${this.next_position}`);
    return ret;
  }

  this.mPlace = (cFloor = {size, container}) => {
    let ret = fPlace(cFloor);
    this.position = ret;
    console.log(`this.position: ${this.position}`);
    return ret;
  }

  this.mTurnEnd = () => {
    this.position = this.next_position;
//    _current_position = _next_position;
  }
}

nsGame.moduleFunctions.fMove = function(position, move_direction, cFloor = {size, container}) {
  const positionArr = (position, floor_size) => {
    let y = Math.floor(position / floor_size),
        x = position - y * floor_size;
    return [x, y];
  }
  let next_position,
      move_distance,
      floor_size = cFloor.size,
      floor_container = cFloor.container;

  if(move_direction === 'left') {
    move_distance = -1;
  } else if (move_direction === 'right') {
    move_distance = 1;
  } else if (move_direction === 'up') {
    move_distance = -floor_size;
  } else if (move_direction === 'down') {
    move_distance = floor_size;
  } else {
    return -1; // do nothing
  }

  next_position = position + move_distance;

  // この条件で呼ばれるのはバグ
  if(position < 0) {
    throw(new Error("unit disappeared"));
  }

  // unitの移動先、unitの移動方法が正常なら
  if(next_position >= 0 && next_position < floor_size * floor_size) {
    if((move_direction === 'left' && positionArr(position, floor_size)[0] === 0)
      || (move_direction === 'right' && positionArr(position, floor_size)[0] === floor_size - 1)) {
    } else {
      if(floor_container[next_position] !== 'D') {
        return next_position;
      }
    }
  }

  return -1;
}
var fMove = nsGame.moduleFunctions.fMove;

nsGame.moduleFunctions.fPlace = function(cFloor = {size, container}) {
  let random;

  do {
    random = Math.floor(Math.random() * (cFloor.size * cFloor.size));
  } while (cFloor.container[random] !== 'f');

  return random;
}
var fPlace = nsGame.moduleFunctions.fPlace;





/*
  brave オブジェクト


 */
nsGame.cUnitBrave = function(id, id_per_type) {
  nsGame.cUnit.call(this, id);

  const _id_per_type = id_per_type || 0,
        _type = 'b';

  Object.defineProperties(this, {
    'type': {
      get: function() {
        console.log(`getter type ${_type}`);
        return _type;
      },
      enumerable: true,
      configurable: true
    },
    'id_per_type': {
      get: function() {
        console.log(`getter id ${_id_per_type}`);
        return _id_per_type;
      },
      enumerable: true,
      configurable: true
    }
  });

  this.mGetDirectionByKey = (key_code) => {
    let ret = fGetDirectionByKey(key_code);
    return ret;
  }

  this.mGetDirectionByClick = (clickLocation, cFloor = {size}) => {
    let ret = fGetDirectionByClick(clickLocation, cFloor = {size});
    return ret;
  }
}

nsGame.cUnitBrave.prototype = Object.create(nsGame.cUnit.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: nsGame.cUnitBrave,
    writable: true
  }
});

nsGame.moduleFunctions.fGetDirectionByKey = function(key_code) {
  let move_direction;

  if(key_code === 37) {  // move left
    move_direction = 'left';
  } else if(key_code === 38) { // move up
    move_direction = 'up';
  } else if(key_code === 39) { // move right
    move_direction = 'right';
  } else if(key_code === 40) { // move down
    move_direction = 'down';
  } else { // nothing happens
    move_direction -1; // あまりよくない終わり方
  }

  return move_direction;
}
var fGetDirectionByKey = nsGame.moduleFunctions.fGetDirectionByKey;


nsGame.moduleFunctions.fGetDirectionByClick = (clickLocation, cFloor = {size}) => {
  let floor_size = cFloor.size;
      move_distance = clcickLocation - floor_size,
      move_direction;

  if(move_distance === -1) { // click left
    move_direction = 'left';
  } else if(move_distance === -floor_size) {// click up
    move_direction = 'up';
  } else if(move_distance === 1) { // click right
    move_direction = 'right';
  } else if(move_distance === floor_size) { // click down
    move_direction = 'down';
  } else { // nothing happens
    move_direction = -1;
  }

  return move_direction;
}
var fGetDirectionByClick = nsGame.moduleFunctions.fGetDirectionByClick;





/*
   monster オブジェクト


  */
nsGame.cUnitMonster = function(id, id_per_type) {
  nsGame.cUnit.call(this, id);

  const _id_per_type = id_per_type || 0,
        _type = 'm';

  Object.defineProperties(this, {
    'type': {
      get: function() {
        console.log(`getter type ${_type}`);
        return _type;
      },
      enumerable: true,
      configurable: true
    },
    'id_per_type': {
      get: function() {
        console.log(`getter id ${_id_per_type}`);
        return _id_per_type;
      },
      enumerable: true,
      configurable: true
    }
  });

  this.mGetDirection = (stay_ratio, cFloor = {size}) => {
    let ret = fGetDirection(this.position, stay_ratio, cFloor);
    console.log(`mGetDirection ret var: ${ret}`);
    return ret;
  }
}

nsGame.cUnitMonster.prototype = Object.create(nsGame.cUnit.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: nsGame.cUnitMonster,
    writable: true
  }
});

nsGame.moduleFunctions.fGetDirection = function(position, stay_ratio, cFloor = {size, container}) {
  let floor_size = cFloor.size,
      floor_container = cFloor.container,
      move_direction,
      random;

  // 移動先が存在しているかどうか
  if((position - 1 >= 0 && floor_container[position - 1] === 'f')
     || (position - floor_size >= 0 && floor_container[position - floor_size] === 'f')
     || (position + 1 < floor_size * floor_size && floor_container[position + 1] === 'f')
     || (position + floor_size < floor_size * floor_size && floor_container[position + floor_size] === 'f')
  ) {
  } else {
    move_direction = -1;
    return move_direction;
  }

  if(Math.random() < stay_ratio) {
    move_direction = 0;
    return move_direction;
  }

  random = Math.random();
  if(random < 0.25) { // left
    move_direction = 'left';
  } else if(0.25 < random && random < 0.5) { // up
    move_direction = 'up';
  } else if(0.5 < random && random < 0.75) { //right
    move_direction = 'right';
  } else { // down
    move_direction = 'down';
  }

  return move_direction;
}
var fGetDirection = nsGame.moduleFunctions.fGetDirection;


/*
   コンストラクタ―

 */
nsGame.nsConstructors.cOpaqueUnitConstructor = (function() {
  let _number_of_unit = 0;

  return function() {
    this.mCreateInstance = (callback, id_per_type) => {
      return new callback(_number_of_unit++, id_per_type);
  // return callback.call(null, _number_of_unit++, id_per_type);
  // これでやりたいことができるんじゃないか？
  // TODO
    }

    Object.defineProperty(this, 'total_units', {
      get: function() {
        console.log(`getter total_units ${_number_of_unit}`);
        return _number_of_unit;
      },
      enumerable: true,
      configurable: true
    });
  }
})();
const cUnitOpaqueConstructor = new nsGame.nsConstructors.cOpaqueUnitConstructor();

nsGame.nsConstructors.cUnitBraveConstructor = (function() {
  let _number_of_unit = 0;

  return function() {
    this.mCreateInstance = () => {
      return cUnitOpaqueConstructor.mCreateInstance(nsGame.cUnitBrave, _number_of_unit++);
      // return new callback(_number_of_unit++);
    }

    Object.defineProperty(this, 'total_units', {
      get: function() {
        console.log(`getter total_units ${_number_of_unit}`);
        return _number_of_unit;
      },
      enumerable: true,
      configurable: true
    });
  }
})();
const cUnitBraveConstructor = new nsGame.nsConstructors.cUnitBraveConstructor();
// to create instance of brave , use cUnitBraveConstructor.mCreateInstance();

nsGame.nsConstructors.cUnitMonsterConstructor = (function() {
  let _number_of_unit = 0;

  return function() {
    this.mCreateInstance = () => {
      return cUnitOpaqueConstructor.mCreateInstance(nsGame.cUnitMonster, _number_of_unit++);
      // return new callback(_number_of_unit++);
    }

    Object.defineProperty(this, 'total_units', {
      get: function() {
        console.log(`getter total_units ${_number_of_unit}`);
        return _number_of_unit;
      },
      enumerable: true,
      configurable: true
    });
  }
})();
const cUnitMonsterConstructor = new nsGame.nsConstructors.cUnitMonsterConstructor();
// to create instance of brave , use cUnitMonsterConstructor.mCreateInstance();




nsGame.cFloor = function() {
  const _DEFAULT_SIZE = 5;
  let _depth = 1;

  this.size = _DEFAULT_SIZE;
  this.container = [];
  this.is_floor_update = false;

  Object.defineProperties(this, {
    'depth': {
      get: function() {
        console.log(`getter depth ${_depth}`);
        return _depth;
      },
      set: function(depth) {
        _depth = depth;
        this.size = _DEFAULT_SIZE + Math.floor(depth / 5);
        console.log(`this.size: ${this.size}`);
      },
      enumerable: true,
      configurable: true
    }
  });

  this.mCreateFloor = function() {
    let i;
    for(i = 0; i < this.size * this.size; i++) {
      this.container[i] = 'f';
    }
    this.is_floor_update = true;
  }

  this.mCurruptTile = function() {
    let ret;
    do{
      ret = fPlace(this);
    } while(this.container[ret] !== 'f');
    this.container[ret] = 'D';
    this.is_floor_update = true;

    return ret;
  }

  this.mUpdateFloorContaint = function(cUnit = {type, position, next_position}) {
    this.container[cUnit.position] = 'f';
    this.container[cUnit.next_position] = cUnit.type;
    this.is_floor_update = true;
  }

  this.mTurnEnd = function() { // 今のところ思い浮かばない
  }

  this.mClearFloorUpdateFlag = function() {
    this.is_floor_update = false;
  }
}
var cFloor = nsGame.cFloor;



nsGame.cDisplayArea = function() {
  this.btnNewGame = document.getElementById("createfloor");
  this.areaMessage = document.getElementById("message");
  this.areaFloor = document.getElementById("floor");
}
var oDisplayArea = new cDisplayArea();  // 場所がまずいかも～

// このつくりだと連打しても更新されなくなるなぁ（連打が必要とは思えないけれど）
nsGame.cKeyInput = function() {
  window.addEventListener('keyup', this.mKeyCode, false);
  this.keycode;
  this.is_key_input = false;

  this.mKeyCode = function(event) {
    this.keycode = event.keyCode;
    is_key_input = true;
  }

  this.mClearKeyInputFlag = function() {
    this.is_key_input = false;
  }
}




nsGame.moduleUtilities.fInitGame = function(cDisplayArea = {btnNewGame}, fNewGame) {
  // ボタンクリックでゲームが始まる
  cDisplayArea.btnNewGame.addEventListener("click", fNewGame);
}
var fInitGame = nsGame.moduleUtilities.fInitGame;

nsGame.moduleUtilities.fNewGame = function(cFloor = {depth, mCreateFloor}, cDisplayArea = {areaMessage}) {
  cFloor.depth = 1;
  cDisplayArea.areaMessage.innerHTML = `ようこそ果てしなき迷宮へ<br>ここは第${depth}階だ<br>これまで第${max_depth}まで到達しているぞ`;

// TODO

// is_game_runningがこの構造で必要かどうかわからない、要調査検討
//  is_game_running = 1;
  cFloor.mCreateFloor();

  placeObject('G');
  placeObject('m');
  placeObject('b');
  hasFloorUpdate();
//  depictFloorAndObject();
  runGame();
}
var fNewGame = nsGame.moduleUtilities.fNewGame;



nsGame.moduleUtilities.fRunGame = function() {

}
var fRunGame = nsGame.moduleUtilities.fRunGame;

nsGame.moduleUtilities.fDepict = function(object = {xxx, xxx}) {

}

/*  TODO 以降参考資料
//////////// ゲームの基本的な流れ
fProgressTune() {
  // ユニットの移動
  for(全部のユニット){
    current_position = instanceUnit.position;
    next_position = instanceUnit.mMove;
  }
  // バトル解決
  for(全部のユニット){
    result = brave vs next_position
  }
  // フロア更新かゲームオーバーか
  if(result not loose){
    for(全部のユニット){}
      cFloor.mUpdateFloorContaint(cUnit)
    }
  } else(loose) {
    gameOver;
  }

  while(全部のユニット){
    instanceUnit.TurnEnd
  }
}



const create_floor_btn = document.getElementById("createfloor");
const message_area = document.getElementById("message");
const floor_area = document.getElementById("floor");

let floor_size,
    last_floor_size,
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
  last_floor_size = floor_size;
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
    removeClickEventHandler();
    depictFloorAndObject();
    addClickEventHandler();
    clearFloorUpdate();
  }
  setTimeout(runGame, 333);
}


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



function depictFloorAndObject() {
  let tr, td;
  let x, y;
  let tile_id;

  let floor_table = document.createElement('table');
  floor_table.id = "floor_table";
  floor_table.border = "0";

  tile_id = 0;
  for(y = 0; y < floor_size; y++) {
    tr = floor_table.insertRow(-1);
    for(x = 0; x < floor_size; x++) {
      td = tr.insertCell(-1);
      td.id = `tile${tile_id}`;
      tile_id++;
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

function nextFloor() {
  depth++;
  last_floor_size = floor_size; //とりあえず
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




function addClickEventHandler() {
  let id;

  for(id = 0; id < floor_size * floor_size; id++) {
    document.getElementById(`tile${id}`).addEventListener('click', clickEventHandler(id));
  }
}

function removeClickEventHandler() { // 毎回HTMLからElementを入手するのはいけない気がsる。自分で作成しているのだからその情報を活用したい
  let id;

  if(document.getElementById('floor_table') === null) {
    return; // とりあえず、強制終了
  }
  for(id = 0; id < last_floor_size * last_floor_size; id++) {
    document.getElementById(`tile${id}`).removeEventListener('click', clickEventHandler(id));
  }
}


function clickEventHandler(id) {
  return (function(event) {
    let brave_position = getCurrentPosition('b'),
        move_direction = id - brave_position;

    if(move_direction === -1 // click left
      || move_direction === -floor_size // click up
      || move_direction === 1 // click right
      || move_direction === floor_size) { // click down
      //
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
  })
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




let of = new nsGame.cFloor();
of.depth = 1;
of.mCreateFloor();
of.mCurruptFloor();
console.log(of);

of.depth += 1;
of.mCreateFloor();
of.mCurruptFloor();
console.log(of);

























console.log("nsGame.cUnitMonster");
console.log(Object.getPrototypeOf(nsGame.cUnitMonster));
console.log("nsGame.cUnitMonster");
console.log(Reflect.ownKeys(nsGame.cUnitMonster));

console.log("cUnitMonsterConstructor");
console.log(Object.getPrototypeOf(cUnitMonsterConstructor.mCreateInstance));
console.log("cUnitMonsterConstructor");
console.log(Reflect.ownKeys(cUnitMonsterConstructor.mCreateInstance));


console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)
console.log(`Monster total_units: ${cUnitMonsterConstructor.total_units}`);
let om = new nsGame.cUnitMonster(300);
console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)
console.log(`Monster total_units: ${cUnitMonsterConstructor.total_units}`);
console.log(`Unit id om: ${om.id}`);
console.log(`Monster id om: ${om.id_per_type}`);
let om2 = cUnitMonsterConstructor.mCreateInstance();
console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)
console.log(`Monster total_units: ${cUnitMonsterConstructor.total_units}`);
console.log(`Unit id om2: ${om2.id}`);
console.log(`Monster id om2: ${om2.id_per_type}`);
let om3 = cUnitMonsterConstructor.mCreateInstance();
console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)
console.log(`Monster total_units: ${cUnitMonsterConstructor.total_units}`);
console.log(`Unit type om3: ${om3.type}`);
console.log(`Unit id om3: ${om3.id}`);
console.log(`Monster id om3: ${om3.id_per_type}`);


console.log("om");
console.log(Object.getPrototypeOf(om));
console.log("om");
console.log(Reflect.ownKeys(om));

console.log("om2");
console.log(Object.getPrototypeOf(om2));
console.log("om2");
console.log(Reflect.ownKeys(om2));

const omFloor = {
  size: 4,
  container: ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'D', 'f', 'f'],
  somethingelse: 0
}

console.log(`om.position:`);
om.mPlace(omFloor);
let om_direction = om.mGetDirection(0.1, omFloor);
om.mMove(om_direction, omFloor);
console.log(`om.position: ${om.position}`);

console.log(`om.position:`);
console.log(`om2.position:`);
om2.mPlace(omFloor);
let om2_direction = om2.mGetDirection(1, omFloor);
om2.mMove(om2_direction, omFloor);
console.log(`om.position: ${om.position}`);
console.log(`om2.position: ${om2.position}`);

console.log(`om.position:`);
console.log(`om2.position:`);
console.log(`om3.position:`);
om3.mPlace(omFloor);
let om3_direction = om3.mGetDirection(0.1, omFloor);
om3.mMove(om3_direction, omFloor);
console.log(`om.position: ${om.position}`);
console.log(`om2.position: ${om2.position}`);
console.log(`om3.position: ${om3.position}`);

console.log(`om.id = ${om.id}`);
console.log(`om2.id = ${om2.id}`);
console.log(`om3.id = ${om3.id}`);


console.log(om2 === om3);












/*











// ************************************************************
console.log("nsGame.cUnit");
console.log(Object.getPrototypeOf(nsGame.cUnit));
console.log("nsGame.cUnit");
console.log(Reflect.ownKeys(nsGame.cUnit));

console.log("cUnitOpaqueConstructor");
console.log(Object.getPrototypeOf(cUnitOpaqueConstructor));
console.log("cUnitOpaqueConstructor");
console.log(Reflect.ownKeys(cUnitOpaqueConstructor));


console.log(`nsGame.cUnit.type: ${nsGame.cUnit.type}`);

let o = new nsGame.cUnit(100);

console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)
let o2 = cUnitOpaqueConstructor.mCreateInstance(nsGame.cUnit);
console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)
let o3 = cUnitOpaqueConstructor.mCreateInstance(nsGame.cUnit);
console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)

console.log("o");
console.log(Object.getPrototypeOf(o));
console.log("o");
console.log(Reflect.ownKeys(o));

console.log("o2");
console.log(Object.getPrototypeOf(o2));
console.log("o2");
console.log(Reflect.ownKeys(o2));

const oFloor = {
  size: 2,
  container: ['f', 'f', 'f', 'f'],
  somethingelse: 0
}

o.mPlace(oFloor);
o.mMove("right", oFloor);
console.log(`o.position: ${o.position}`);

o2.mPlace(oFloor);
o2.mMove("right", oFloor);
console.log(`o.position: ${o.position}`);
console.log(`o2.position: ${o2.position}`);

o3.mPlace(oFloor);
o3.mMove("right", oFloor);
console.log(`o.position: ${o.position}`);
console.log(`o2.position: ${o2.position}`);
console.log(`o3.position: ${o3.position}`);

console.log(`o.id = ${o.id}`);
console.log(`o2.id = ${o2.id}`);
console.log(`o3.id = ${o3.id}`);


console.log(o2 === o3);
// ************************************************************







console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)
console.log(`Brave total_units: ${cUnitBraveConstructor.total_units}`);
let ob = new nsGame.cUnitBrave(200);
console.log(`total_units: ${cUnitOpaueConstructor.total_units}`)
console.log(`Brave total_units: ${cUnitBraveConstructor.total_units}`);
console.log(`Unit id ob: ${ob.id}`);
console.log(`Brave id ob: ${ob.id_per_type}`);
let ob2 = cUnitBraveConstructor.mCreateInstance();
console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)
console.log(`Brave total_units: ${cUnitBraveConstructor.total_units}`);
console.log(`Unit id ob2: ${ob2.id}`);
console.log(`Brave id ob2: ${ob2.id_per_type}`);
let ob3 = cUnitBraveConstructor.mCreateInstance();
console.log(`total_units: ${cUnitOpaqueConstructor.total_units}`)
console.log(`Brave total_units: ${cUnitBraveConstructor.total_units}`);
console.log(`Unit id ob3: ${ob3.id}`);
console.log(`Brave id ob3: ${ob3.id_per_type}`);



console.log("ob");
console.log(Object.getPrototypeOf(ob));
console.log("ob");
console.log(Reflect.ownKeys(ob));

console.log("ob2");
console.log(Object.getPrototypeOf(ob2));
console.log("ob2");
console.log(Reflect.ownKeys(ob2));

const obFloor = {
  size: 4,
  container: ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'D', 'f', 'f'],
  somethingelse: 0
}

ob.mPlace(obFloor);
ob.mMove("left", obFloor);
console.log(`ob.position: ${ob.position}`);


ob2.mPlace(obFloor);
ob2.mMove("right", obFloor);
console.log(`ob.position: ${ob.position}`);
console.log(`ob2.position: ${ob2.position}`);

ob3.mPlace(obFloor);
ob3.mMove("up", obFloor);
console.log(`ob.position: ${ob.position}`);
console.log(`ob2.position: ${ob2.position}`);
console.log(`ob3.position: ${ob3.position}`);

console.log(`ob.id = ${ob.id}`);
console.log(`ob2.id = ${ob2.id}`);
console.log(`ob3.id = ${ob3.id}`);


console.log(ob2 === ob3);







































/*
nsGame.cUnit = {
  mMove: function(){
  console.log(move_direction);
  console.log(that);

  },
  mPlace: function(){}
}

console.log("nsGame.cUnit");
console.log(Object.getPrototypeOf(nsGame.cUnit));
console.log("nsGame.cUnit");
console.log(Reflect.ownKeys(nsGame.cUnit));
*/

/*  *********************************************一つの完成形
nsGame.cUnit = (function() {
  let __number_of_unit = 0,
      __that = this;

  return function() {
    let _position = 100,
        _type = 'f';

    __number_of_unit++;
    this.that = __that;
    this.self = this;

    Object.defineProperty(this, 'position', {
      get: function() {
        return _position;
      },
      set: function(position) {
        _position = position;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(this, 'type', {
      get: function() {
        return _type;
      },
      set: function(type) {
        _type = type;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(this, 'numberOfUnit', {
      get: function() {
        return __unmber_of_unit;
      },
      enumerable: true,
      configurable: true
    });


  }
})();

nsGame.cUnit.prototype.mMove = function(move_direction) {
  console.log(move_direction);
  console.log(this.that);
  console.log(this.position);
  console.log(this.type);
}

console.log("nsGame.cUnit");
console.log(Object.getPrototypeOf(nsGame.cUnit));
console.log("nsGame.cUnit");
console.log(Reflect.ownKeys(nsGame.cUnit));


let o = new nsGame.cUnit();

console.log("o");
console.log(Object.getPrototypeOf(o));
console.log("o");
console.log(Reflect.ownKeys(o));


o.mMove(1);
  ****************************************************************/

/*
function fPlace(cFloor = {size, container}) {
  let random;

  do {
    random = Math.floor(Math.random() * (cFloor.size * cFloor.size));
  } while (cFloor.container[random] !== 'f');

  console.log(`random: ${random}`);
  return random;
}
*/



/*
const test = {
  test: {
    test1: {
      x: 1,
      y: 2
    },
    test2: {
      x: 3,
      y: 4
    }
  }
}

console.log(test.test.test1.x);
console.log(test.test.test1.y);
console.log(test.test.test2.x);
console.log(test.test.test2.y);

test.test.test1 = function() {
  this.z = 5;
}

const obj_test = new test.test.test1();

console.log(test.test.test1.z);
console.log(obj_test.x);
console.log(obj_test.y);
console.log(obj_test.z);

*/
