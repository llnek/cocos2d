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
var asterix = global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var bo= asterix.BreakOut;
var echt= global.ZotohLabs.echt;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
sh.xcfg.game.proto= asterix.XGame.extend({

    name: 'breakout',
    score: 0,

    update: function() {
      this.parent();
    },

    preStart: function() {
      var csts= sh.xcfg.csts;
      var p = this.spawnEntity(bo.EntityPlayer,
        (ig.system.width - bo.EntityPlayer.prototype.size.x )/2,
        (csts.GRID_H -1) * csts.TILE -
        bo.EntityPlayer.prototype.size.y - csts.PADDLE_OFF -
        bo.EntityBall.prototype.size.y,
        {});
      this.genBricks();
      this.spawnEntity(bo.EntityBall, 100,100,{ paddle: p});
    },

    onStart: function() {
    },

    genBricks: function() {
      var csts = sh.xcfg.csts;
      var b, w, r, c;
      var x, y= csts.TILE + 10;
      var cs= csts.LEVELS["1"];
      this.bricks=[];
      for (r=0; r < csts.ROWS; ++r) {
        x= csts.TILE + csts.LEFT_OFF;
        for (c=0; c < csts.COLS; ++c) {
          b= this.spawnEntity(bo.EntityBrick, x, y, { color: cs[r] });
          b.status=true;
          this.bricks.push(b);
          x += bo.EntityBrick.prototype.size.x + 1;
        }
        y += bo.EntityBrick.prototype.size.y + 2;
      }
    },

    onPlayerKilled: function() {
      this.reduceLife(1);
    },

    onPlayerFire: function() {
    },

    onBrickHit: function(a) {
      this.updateScore(a.score);
    },

    updateScore: function(n) {
      this.score += n;
    },

    init: function() {
      this.parent();
      this.start();
    }

});




}).call(this);


