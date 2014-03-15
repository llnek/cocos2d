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

(function(undef) { "use strict"; var global = this; var _ = global._ ;

var asterix = global.ZotohLabs.Asterix;
var iv = asterix.Invaders;
var sh = asterix.Shell;
var loggr = global.ZotohLabs.logger;
var echt = global.ZotohLabs.echt;


asterix.Invaders.EntityPlayer = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/invaders/game/player.png', 36, 24),
  collides: ig.Entity.COLLIDES.PASSIVE,
  checkAgainst: ig.Entity.TYPE.NONE,
  type: ig.Entity.TYPE.A,
  size: { x: 36, y: 24 },
  ammoCount: 0,

  update: function() {
    if (ig.input.state('right')) {
      this.onRight();
    }
    if (ig.input.state('left')) {
      this.onLeft();
    }
    if (this.loadAmmo.delta() > 0) {
      this.currentAnim = this.anims.load;
      this.ammoCount = 1;
    }
    if (ig.input.pressed('shoot') && this.ammoCount > 0) {
      this.doFire();
    }
    this.parent();
  },

  doFire: function() {
    ig.game.spawnEntity(iv.EntityMissile, this.pos.x + (this.size.x - iv.EntityMissile.prototype.size.x) / 2, this.pos.y - 4);
    this.currentAnim = this.anims.show;
    this.ammoCount = 0;
    ig.game.onPlayerFire();
    this.loadAmmo.reset();
  },

  onRight: function() {
    var px = (this.pos.x + this.size.x) - ig.game.screen.x;
    if (px < ig.system.width) {
      this.vel.x = 60;
    }
  },

  onLeft: function() {
    var px = this.pos.x - ig.game.screen.x;
    if (px > 0) {
      this.vel.x = -60;
    }
  },

  init: function(x, y, options) {
    this.parent(x, y, options);
    this.maxVel.y = 200;
    this.maxVelx = 100;
    this.friction.x = 150;
    this.friction.y = 0;
    this.addAnim('show', 1, [0]);
    this.addAnim('load', 1, [1]);
    this.loadAmmo = new ig.Timer(1);
  }


});




}).call(this);


