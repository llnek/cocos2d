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
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.Asteroids.EntityMissile = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/asteroids/game/laser_green.png', 10,5),
  size: { x: 10, y: 5 },

  collides: ig.Entity.COLLIDES.PASSIVE,
  checkAgainst: ig.Entity.TYPE.B,
  type: ig.Entity.TYPE.A,

  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.maxVel.x = 200;
    this.maxVel.y = 200;
    this.addAnim('show', 1, [0]);
    var rc= asterix.fns.calcXY(this.angle, 100);
    this.vel.x = rc[0];
    this.vel.y = rc[1];
    this.currentAnim.angle = asterix.fns.degToRad(this.angle);
  },

  check: function(other) {
    other.kill();
    this.kill();
  },

  update: function() {
    this.parent();
  }


});





}).call(this);



