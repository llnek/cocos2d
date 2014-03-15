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
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;


asterix.Invaders.EntityBomb = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/invaders/game/bomb.png', 6, 12),
  OOB: (sh.xcfg.csts.GRID_H - 2) * sh.xcfg.csts.TILE,
  collides: ig.Entity.COLLIDES.PASSIVE,
  checkAgainst: ig.Entity.TYPE.A,
  type: ig.Entity.TYPE.NONE,
  size: { x: 6, y: 12 },

  update: function() {
    if ((this.pos.y + this.size.y) > this.OOB) {
      this.kill();
    }
    else {
      this.parent();
    }
  },

  check: function(other) {
    if (echt(other)) {
      other.receiveDamage(10, this);
    }
    ig.game.spawnEntity(iv.EntityExplode, this.pos.x, this.pos.y);
    this.kill();
    ig.game.onPlayerKilled();
  },

  init: function(x, y, options) {
    this.parent(x, y, options);
    this.maxVel.x = 200;
    this.maxVel.y = 200;
    this.vel.y = 50;
    this.addAnim('show', 0.2, [0]);
  }



});











}).call(this);


