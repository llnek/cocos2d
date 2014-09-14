// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

(function(undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
ast = asterix.Asteroids,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Ship = cc.Sprite.extend({

  onThrust: function(deg) {
    this.setSpriteFrame(this.frame1);
    this.setRotation(deg);
  },

  onIdle: function(deg) {
    this.setSpriteFrame(this.frame0);
    this.setRotation(deg);
  },

  ctor: function(x,y,options) {
    this.options= options;
    this.frame0 = ccsx.getSpriteFrame(options.frames[0]);
    this.frame1 = ccsx.getSpriteFrame(options.frames[1]);
    this._super();
    this.onIdle(0);
    this.setPosition(x,y);
  }

});

ast.EntityPlayer = asterix.XEntity.xtends({

  initKeyOps: function() {
    this.throttleWait=300;
    this.ops={};
    this.ops.onRight = _.throttle(this.onRight.bind(this), this.throttleWait,{ trailing:false});
    this.ops.onLeft= _.throttle(this.onLeft.bind(this), this.throttleWait, {trailing:false});
    this.ops.onDown = _.throttle(this.onDown.bind(this), this.throttleWait, {trailing:false});
    this.ops.onUp = _.throttle(this.onUp.bind(this), this.throttleWait, {trailing:false});
    this.ops.onFire = _.throttle(this.onFire.bind(this), this.throttleWait, {trailing:false});
  },

  update: function(dt) {
    this._super(dt);
    this.vel.y = this.vel.y + dt * this.accel.y;
    this.vel.x = this.vel.x + dt * this.accel.x;
    if (this.vel.y > this.maxVel.y) {
      this.vel.y = this.maxVel.y;
    } else if (this.vel.y < -this.maxVel.y) {
      this.vel.y = -this.maxVel.y;
    }
    if (this.vel.x > this.maxVel.x) {
      this.vel.x = this.maxVel.x;
    } else if (this.vel.x < -this.maxVel.x) {
      this.vel.x = -this.maxVel.x;
    }
    this.wrapEnclosure();
    this.move(dt);
  },

  keypressed: function() {
    if (sh.main.keyboard[cc.KEY.right]) { this.onRight(); }
    if (sh.main.keyboard[cc.KEY.left]) { this.onLeft(); }
    if (sh.main.keyboard[cc.KEY.down]) { this.onDown(); }
    if (sh.main.keyboard[cc.KEY.up]) {
      this.onUp();
    } else {
      this.onDown();
    }
    if (sh.main.keyboard[cc.KEY.space]) { this.onFire(); }
  },

  onRight: function() {
    // anti-clockwise
    this.rotate(3);
  },

  onLeft: function() {
    // clockwise
    this.rotate(-3)
  },

  onDown: function() {
    this.idle();
  },

  onUp: function() {
    this.thrust();
  },

  onFire: function() {
    this.fire();
  },

  rotate: function(deg) {
    this.angle += deg;
    if (this.angle >= 360) {
      this.angle = this.angle - 360;
    }
    if (this.angle < 0) {
      this.angle = 360 + this.angle;
    }
    this.sprite.setRotation(this.degrees());
  },

  thrust: function() {
    var rc= sh.calcXY(this.angle, this.thrustValue);
    this.accel.y = rc[1];
    this.accel.x = rc[0];
    this.sprite.onThrust(this.degrees());
  },

  idle: function() {
    this.accel.x = 0;
    this.accel.y = 0;
    this.sprite.onIdle(this.degrees());
  },

  initMissileSize: function() {
    var dummy = new ast.EntityMissile(0,0,{}),
    s= dummy.create();
    this.missileSize=s.getContentSize();
  },

  fire: function() {
    if (! ccsx.timerDone(this.coolDown)) { return; }
    // we want to find the ship's nose to fire the missile
    var rc= sh.calcXY(this.angle, this.sprite.getContentSize().height/2),
    pos = this.sprite.getPosition();
    sh.fireEvent('/game/objects/players/shoot', { x: pos.x + rc[0] , y: pos.y + rc[1] , angle: this.angle });
    this.coolDown= ccsx.createTimer(this.sprite, 0.8);
  },

  create: function() {
    this.sprite = new Ship(this.startPos.x, this.startPos.y, this.options);
    this.coolDown= ccsx.createTimer(this.sprite, 0.8);
    return this.sprite;
  },

  degrees: function(deg) {
    return deg || this.angle;
  },

  injured: function(num,from) {
    this.dispose();
    sh.fireEvent('/game/objects/players/killed');
  },

  check: function(other) {
    if (other instanceof ast.EntityAster) {
    }
    else
    if (other instanceof ast.EntityUfo) {
      other.injured();
    }
    else
    if (other instanceof ast.EntityLaser) {
      other.injured();
    }
    this.injured();
  },


  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.initMissileSize();
    this.initKeyOps();
    this.wrappable=true;
    this.angle=0;
    this.thrustValue=30;//250;
    this.maxVel.y= 180; //300;
    this.maxVel.x= 180; //300;
    this.options.frames= ['rship_0.png', 'rship_1.png'];
  }

});




}).call(this);





