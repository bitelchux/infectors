'use strict';

var Capsule = function(x, y, type, map) {
  Phaser.Sprite.call(this, game, x, y, 'capsules', 0);

  this.map = map;
  this.variant = type;
  this.moving = false;
  if (type === colorVariant.RED) {
    this.frame = 0;
  } else if (type === colorVariant.BLUE) {
    this.frame = 1;
  } else if (type === colorVariant.GREEN) {
    this.frame = 2;
  }
  groups.capsules.add(this);
};

Capsule.prototype = Object.create(Phaser.Sprite.prototype);
Capsule.prototype.constructor = Capsule;

//Capsule.prototype.update = function() {
//};

Capsule.prototype.move = function(direction) {
  var newX = this.x;
  var newY = this.y;
  switch(direction) {
    case 'up':
      newY -= tileSize;
      break;
    case 'down':
      newY += tileSize;
      break;
    case 'left':
      newX -= tileSize;
      break;
    case 'right':
      newX += tileSize;
  }
  if (this.isMovable(newX, newY)) {
    this.moving = true;
    var tween = game.add.tween(this);
    tween.to({
      x: newX,
      y: newY
    }, 100, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(function(){
      this.moving = false;
      this.animations.stop();
    }, this);
  }
  return this.moving;
};

Capsule.prototype.isMovable= function(x, y) {
  var isWall = this.map.hasTile(x / 32, y / 32, 'Walls');
  var isCapsule = this.findCapsule(x, y);
  var virus = this.findVirus(x, y);
  var isVirus = (virus && virus.variant !== this.variant) ? true : false;
  if (virus)
    console.log('virus', virus.variant, this.variant);
  return (!isWall && !isCapsule && !isVirus);
};

Capsule.prototype.findCapsule = function(x, y) {
  var rtn = null;
  groups.capsules.forEachAlive(function(cap) {
    if (cap.x === x && cap.y === y) rtn = cap;
  });
  return rtn;
};

Capsule.prototype.findVirus = function(x, y) {
  var rtn = null;
  groups.viruses.forEachAlive(function(v) {
    if (v.x === x && v.y === y) rtn = v;
  });
  return rtn;
};