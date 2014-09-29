// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef){ "use strict"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
sh= asterix,
ivs= sh.Invaders,
utils=ivs.SystemUtils;


//////////////////////////////////////////////////////////////////////////////
//

ivs.GameSupervisor = Ash.System.extend({

  constructor: function(options) {
    this.factory= options.factory;
    this.state= options;
    this.inited=false;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
  },

  initAlienSize: function() {
    var s= new cc.Sprite();
    s.initWithSpriteFrameName( 'green_bug_0.png');
    return this.state.alienSize= s.getContentSize();

  },

  initShipSize: function() {
    var s= new cc.Sprite();
    s.initWithSpriteFrameName( 'ship_0.png');
    return this.state.shipSize= s.getContentSize();
  },

  spawnAliens: function() {
    this.factory.createAliens(sh.main,this.state);
  },

  update: function (dt) {
    if (! this.inited) {
      this.onceOnly();
      this.spawnAliens();
      this.inited=true;
    } else {
      this.process();
    }
  },

  onceOnly: function() {
    var csts=sh.xcfg.csts;
    sh.pools[csts.P_MS] = new asterix.XEntityPool({ entityProto: ivs.Missile });
    sh.pools[csts.P_BS] = new asterix.XEntityPool({ entityProto: ivs.Bomb });
    sh.pools[csts.P_ES] = new asterix.XEntityPool({ entityProto: ivs.Explosion });
    sh.pools[csts.P_LMS] = {};
    sh.pools[csts.P_LBS] = {};
    this.initAlienSize();
    this.initShipSize();
    utils.createMissiles(sh.main,this.state,50);
    utils.createBombs(sh.main,this.state,50);
    utils.createExplosions(sh.main,this.state,50);
    this.factory.createShip(sh.main,this.state);
  },

  process: function() {
  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




