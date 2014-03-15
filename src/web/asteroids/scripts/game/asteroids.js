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
var sh= asterix.Shell;
var ao= asterix.Asteroids;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
sh.xcfg.game.proto = asterix.XGame.extend({

  name: 'asteroids',
  score: 0,

  preStart: function() {
    this.genRocks();
    this.player= this.spawnEntity(ao.EntityPlayer, 400, 350, {});
  },

  onStart: function() {

  },

  genRocks: function() {
    var w = ao.EntityAsteroid1.prototype.size.x;
    var h = ao.EntityAsteroid1.prototype.size.y;
    var csts= sh.xcfg.csts;
    var srh= ig.system.height;
    var srw= ig.system.width;
    var B= {left: 0, top: 0,
            right: srw - 1, bottom: srh -1 };
    var cfg= sh.xcfg.stages[ Number(sh.currentStage).toString() ];
    var n, r;
    this.rocks= [];
    while (this.rocks.length < cfg.BOULDERS) {
      r= {};
      r.left = Math.floor( Math.random() * srw);
      r.top = Math.floor( Math.random() * srh);
      r.bottom = r.top + h;
      r.right = r.left + w;
      if (!this.maybeOverlap(r) && !asterix.fns.outOfBound(r,B)) {
        var deg = Math.floor(Math.random() * 360);
        var a= this.spawnEntity(ao.EntityAsteroid1, r.left, r.top, {angle: deg});
        this.rocks.push(a);
      }
    }

  },

  maybeOverlap: function (a) {
    return _.some(this.rocks, function(z) {
      var r={};
      r.top= Math.floor(z.pos.y);
      r.left= Math.floor(z.pos.x);
      r.bottom = r.top + z.size.y;
      r.right= r.left + z.size.x;
      return asterix.fns.isIntersect(r,a);
    });
  },


  onPlayerKilled: function() {
    this.reduceLife(1);
  },

  onPlayerFire: function() {
  },

  onAlienKilled: function() {},

  onAlienHit: function(a) {
    //this.engine.updateScore(a.score);
  },

  onAlienMarch: function() {
  },

  init: function() {
    this.parent();
    this.start();
  }

});




}).call(this);


