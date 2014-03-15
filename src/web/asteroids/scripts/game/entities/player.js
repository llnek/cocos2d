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

(function(undef) { "use strict"; var global = this; _ = global._ ;

var asterix = global.ZotohLabs.Asterix;
var sh = asterix.Shell;
var ao = asterix.Asteroids;
var loggr = global.ZotohLabs.logger;
var echt = global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.Asteroids.EntityPlayer = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/asteroids/game/player_ship.png', 24,15),
  collides: ig.Entity.COLLIDES.PASSIVE,
  checkAgainst: ig.Entity.TYPE.B,
  type: ig.Entity.TYPE.A,
  size: { x: 24, y: 15 },

  update: function() {
    this.maybeMoveShip();
    this.maybeWrapOOB();
    this.parent();
  },

  maybeMoveShip: function() {
    if (ig.input.state('right')) { this.onRight(); }
    if (ig.input.state('left')) { this.onLeft(); }
    //if (ig.input.state('down')) { this.onDown(); }
    if (ig.input.state('up')) {
      this.onUp();
    } else {
      this.onDown();
    }
    if (ig.input.state('shoot')) { this.onFire(); }
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
      //this.player.idle();
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
    this.currentAnim.angle = this.radian();
    //console.log("angle ========== " + this.angle);
  },

  thrust: function() {
    var rc= asterix.fns.calcXY(this.angle, this.thrustValue);

    this.accel.y = rc[1];
    this.accel.x = rc[0];

    this.currentAnim.angle = this.radian();
    this.currentAnim = this.anims.thrust;
  },

  idle: function() {
    this.accel.x = 0;
    this.accel.y = 0;
    this.currentAnim = this.anims.show;
    this.currentAnim.angle = this.radian();
  },

  fire: function() {
    // we want to find the ship's nose to fire the missile
    var rc= asterix.fns.calcXY(this.angle, this.size.x/2);
    var mw= ao.EntityMissile.prototype.size.y/2;
    var c= this.getCenter();
    var me=this;
    var y = c.y + rc[1];
    var x= c.x + rc[0];
    // adjust a bit to allow for the missile's width/height
    ig.game.spawnEntity(ao.EntityMissile, x-mw,y-mw, {angle: me.angle});
  },

  radian: function(deg) {
    return asterix.fns.degToRad(deg || this.angle);
  },

  check: function(other) {
    this.kill();
  },

  init: function(x,y,settings) {
    this.addAnim('thrust', 1, [0]);
    this.addAnim('show', 1, [1]);
    this.angle=0;
    this.thrustValue=30;//250;
    this.maxVel.y= 300;
    this.maxVel.x= 300;
    this.vel.x=0;
    this.vel.y=0;
    this.parent(x,y,settings);
  }

});




}).call(this);





