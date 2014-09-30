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
ivs= sh.Invaders;


//////////////////////////////////////////////////////////////////////////////
//
ivs.SystemUtils = {

  createMissiles: function(layer,options,count) {
    for (var n=0; n < count; ++n) {
      var b= new ivs.Missile(new cc.Sprite());
      b.sprite.initWithSpriteFrameName('missile.png');
      layer.addItem(b.sprite);
      sh.pools[sh.xcfg.csts.P_MS].add(b);
    }
  },

  createExplosions: function(layer,options,count) {
    for (var n=0; n < count; ++n) {
      var b= new ivs.Explosion(new cc.Sprite());
      b.sprite.initWithSpriteFrameName('boom_0.png');
      layer.addItem(b.sprite);
      sh.pools[sh.xcfg.csts.P_ES].add(b);
    }
  },

  createBombs: function(layer,options,count) {
    for (var n=0; n < count; ++n) {
      var b= new ivs.Bomb(new cc.Sprite(), 10);
      b.sprite.initWithSpriteFrameName('bomb.png');
      layer.addItem(b.sprite);
      sh.pools[sh.xcfg.csts.P_BS].add(b);
    }
  },

  killBomb: function(bb,explode) {
    sh.fireEvent('/game/objects/players/earnscore', {score: bb.value});
    var pos= bb.sprite.getPosition(),
    tag= bb.sprite.getTag(),
    csts= sh.xcfg.csts,
    x= pos.x,
    y= pos.y,
    p = sh.pools[csts.P_LBS];

    delete p[tag];
    sh.pools[csts.P_BS].add(bb);

    if (explode) {
    }
  },

  killMissile: function(mm,explode) {
    var pos= mm.sprite.getPosition(),
    tag= mm.sprite.getTag(),
    csts= sh.xcfg.csts,
    x= pos.x,
    y= pos.y,
    p = sh.pools[csts.P_LMS];

    delete p[tag];
    sh.pools[csts.P_MS].add(mm);

    if (explode) {
    }
  },

  killShip: function(ship, explode) {
    sh.fireEvent('/game/objects/players/killed');
    sh.sfxPlay('xxx-explode');
  },

  killAlien: function(alien,explode) {
    sh.fireEvent('/game/objects/players/earnscore', {score: alien.value});
    alien.sprite.setVisible(false);
    alien.sprite.setPosition(0,0);
    alien.status=false;
    sh.sfxPlay('xxx-explode');
  }



};


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




