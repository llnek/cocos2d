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
var iv= asterix.Invaders;
var sh= asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;


asterix.Invaders.EntityAlien = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/invaders/game/space_monsters.png', 24, 24),
  collides: ig.Entity.COLLIDES.PASSIVE,
  checkAgainst: ig.Entity.TYPE.A,
  type: ig.Entity.TYPE.B,
  size: { x: 24, y: 24 },
  bombCount: 0,

  loadBomb: function() {
    this.bombCount = 1;
  },

  shuffle: function(x) {
    this.pos.x += x;
  },

  forward: function() {
    this.pos.y += iv.EntityAlien.prototype.size.y + sh.xcfg.csts.OFF_Y;
  },

  update: function() {
    if (this.bombCount > 0) {
      ig.game.spawnEntity(iv.EntityBomb, this.pos.x + (this.size.x - iv.EntityBomb.prototype.size.x) / 2, this.pos.y + this.size.y);
      this.bombCount = 0;
    }
    this.parent();
  },

  check: function(other) {
    if (echt(other)) {
      other.receiveDamage(10, this);
    }
  },

  receiveDamage: function(num, from) {
    ig.game.spawnEntity(iv.EntityExplode, this.pos.x, this.pos.y);
    this.kill();
    ig.game.onAlienKilled();
  },

  init: function(x, y, options) {
    this.parent(x, y, options);
    this.maxVel.x = 100;
    this.maxVel.y = 100;
    this.friction.x = 150;
    this.friction.y = 0;
    this.score = this.rank < 3 ? 100 : this.rank < 5 ? 50 : 30;
    var fs = this.rank < 3 ? [4, 5] : this.rank < 5 ? [2,3] : [0, 1];
    this.addAnim('show', 1, fs);
  }



});





}).call(this);


