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
var asterix= global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var bo= asterix.BreakOut;
var echt= global.ZotohLabs.echt;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.BreakOut.EntityPlayer = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/breakout/game/paddle.png', 48, 15),
  collides: ig.Entity.COLLIDES.FIXED,
  size: { x: 48, y: 15 },
  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.NONE,

  update: function() {
    if (ig.input.state('right')) {
      this.onRight();
    }
    if (ig.input.state('left')) {
      this.onLeft();
    }
    this.parent();
  },

  onRight: function() {
    var px = (this.pos.x + this.size.x) - ig.game.screen.x;
    if (px < ig.system.width) {
      this.vel.x = 150;
    }
  },

  onLeft: function() {
    var px = this.pos.x - ig.game.screen.x;
    if (px > 0) {
      this.vel.x = -150;
    }
  },

  init: function(x, y, options) {
    this.parent(x, y, options);
    this.addAnim('show', 1, [0]);
    this.maxVel.x = 200;
    this.maxVel.y = 200;
    this.maxVelx = 100;
    this.friction.x = 150;
    this.friction.y = 0;
  }

});




}).call(this);



