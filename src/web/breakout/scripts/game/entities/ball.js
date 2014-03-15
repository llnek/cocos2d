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

(function(undef) { "use strict"; var global = this ; var _ = global._ ;
var asterix=global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var bo= asterix.BreakOut;
var echt= global.ZotohLabs.echt;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.BreakOut.EntityBall = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/breakout/game/ball.png', 18, 18),
  collides: ig.Entity.COLLIDES.ACTIVE,
  size: { x: 18, y: 18 },
  bounciness: 1,
  speed: 180,
  type: ig.Entity.TYPE.B,

  update: function() {
    this.parent();
    if (echt(this.paddle)) {
      if (this.pos.y > this.paddle.pos.y) {
        this.paddle.kill();
        this.paddle= null;
      }
    }
  },

  collideWith: function(other, axis) {
    switch (axis) {
    case 'y':
      if (other.isPaddle === true) {
        this.vel.x = this.findRightBounce(other);
      }
    }
  },

  findRightBounce: function(paddle) {
    var magnitude = (this.distanceTo(paddle) - this.size.y / 2 - paddle.size.y / 2);
    // using ratio allows us to account for if the paddle changes sizes with powerups
    var ratio = magnitude / (paddle.size.x / 2) * 2.5;
    if (this.pos.x + this.size.x / 2 < paddle.pos.x + paddle.size.x / 2) {
      // send the ball to the left if hit on the left side of the paddle, and vice versa
      ratio = -ratio;
    }
    return this.speed * ratio;
  },

  init: function(x, y, options) {
    this.parent(x, y, options);
    this.addAnim('show', 1, [0]);
    this.maxVel.y = 300;
    this.vel.y = 100 * asterix.fns.randomSign();
    this.vel.x = 100 * asterix.fns.randomSign();
  }


});




}).call(this);



