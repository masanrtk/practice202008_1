



function unitClass() {
  let _position,
      _type;
  get position {
    return this._position;
  }
  get type {
    return this._type;
  }
//  this.randomPlace = (function() {});
  this.move = (function(move_direction) {});
}

unitClass.prototype.randomPlace = (floorClass) => {
  let random;

  do {
    random = Math.floor(Math.random() * (floorClass.size * floorClass.size));
  } while (floorClass.container[random] !== 'f');

  this._position = random;
}


function unitBrave(...args) {
  unitClass.apply(this, args);

//  const _type = 'b';
}

unitBrave.prototype = Object.create(unitClass.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: unitClass,
    writable: true
  }
});

unitBrave.prototype._type = 'b';


function unitMonster(...args) {
  unitClass.apply(this, args);

  const _type = 'm';
}

unitBrave.prototype = Object.create(unitClass.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: unitClass,
    writable: true
  }
});
