


const nsGame = {
  cUnit: {},
  cUnitBrave: {},
  cUnitMonster: {},
  cFloor: {},
  nsConstructors: {
    cUnitConstructor: {}, // 使わない、試験用
    cUnitBraveConstructor: {},
    cUnitMonsterConstructor: {},
    cFloorConstructor: {}
  },
  moduleFunctions: {}
}

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

nsGame.cUnit = function(id) {
  let _current_position,
      _next_position;
  const _id = id,
        _type = 'u',
        that = this;

  this.self = this;

  Object.defineProperty(this, 'position', { // current と next 両方を外に見せないといけない
    get: function() {
      console.log(`getter position ${_current_position}`);
      return _current_position;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(this, 'type', {
    get: function() {
      console.log(`getter type ${_type}`);
      return _type;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(this, 'id', {
    get: function() {
      console.log(`getter id ${_id}`);
      return _id;
    },
    enumerable: true,
    configurable: true
  });

  this.mMove = (move_direction, cFloor = {size, container}) => {
    let ret = fMove(_current_position, move_direction, cFloor);
    console.log(`ret: ${ret}`);
    _next_position = ret === -1 ? _current_position : ret;
//    _next_position = ret;
    console.log(`_next_position: ${_next_position}`);
  }

  this.mPlace = (cFloor = {size, container}) => {
    _current_position = fPlace(cFloor);
    console.log(`_current_position: ${_current_position}`);
  }
};

nsGame.moduleFunctions.fMove = function(position, move_direction, cFloor = {size, container}) {
  const positionArr = (position, floor_size) => {
    let y = Math.floor(position / floor_size),
        x = position - y * floor_size;
    return [x, y];
  }
  let next_position,
      move_distance,
      floor_size = cFloor.size;

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
      if(cFloor.container[next_position] !== 'D') {
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

nsGame.nsConstructors.cUnitConstructor = (function() {
  let _number_of_unit = 0;

  return function() {
    return new nsGame.cUnit(_number_of_unit++);
  }
})();

const cUnitConstructor = nsGame.nsConstructors.cUnitConstructor;
// const cUnit = nsGame.cUnit;


console.log("nsGame.cUnit");
console.log(Object.getPrototypeOf(nsGame.cUnit));
console.log("nsGame.cUnit");
console.log(Reflect.ownKeys(nsGame.cUnit));

console.log("cUnitConstructor");
console.log(Object.getPrototypeOf(cUnitConstructor));
console.log("cUnitConstructor");
console.log(Reflect.ownKeys(cUnitConstructor));


let o = new nsGame.cUnit(100);
let o2 = cUnitConstructor();
let o3 = cUnitConstructor();

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



nsGame.cUnitBrave = function(...args) {
  nsGame.cUnit.apply(this, args);

  const _type = 'b';
}

nsGame.cUnitBrave.prototype = Object.create(nsGame.cUnit.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: nsGame.cUnitBrave,
    writable: true
  }
});


nsGame.nsConstructors.cUnitBraveConstructor = (function() {
  let _number_of_unit = 0;

  return function() {
    return new nsGame.cUnitBrave(_number_of_unit++);
  }
})();

const cUnitBraveConstructor = nsGame.nsConstructors.cUnitBraveConstructor;
// const cUnit = nsGame.cUnit;
// const cUnitBrave = nsGame.cUnitBrave;



let ob = new nsGame.cUnitBrave(200);
let ob2 = cUnitBraveConstructor();
let ob3 = cUnitBraveConstructor();

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


nsGame.cUnitMonster = function(...args) {
  nsGame.cUnit.apply(this, args);

  const _type = 'm';
}

nsGame.cUnitMonster.prototype = Object.create(nsGame.cUnit.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: nsGame.cUnitMonster,
    writable: true
  }
});
