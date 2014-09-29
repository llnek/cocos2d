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
ivs.Explosion = Ash.Class.extend({

  constructor: function(sprite) {
    this.sprite = sprite;
    this.frameTime= 0.1;
    this.status=false;
    return this;
  },

  revive: function(x,y) {
    var frames = [ccsx.getSpriteFrame('boom_0.png'),
                  ccsx.getSpriteFrame('boom_1.png'),
                  ccsx.getSpriteFrame('boom_2.png'),
                  ccsx.getSpriteFrame('boom_3.png') ],
    anim= new cc.Animation(frames, this.frameTime);
    this.sprite.runAction(new cc.Sequence(new cc.Animate(anim),
      new cc.CallFunc(function() {
        sjs.loggr.debug('explosion done.!');
        sh.pools[sh.xcfg.csts.P_ES].add(this);
      }, this)
    ));
  },

  hibernate: function() {
    this.sprite.setPosition(0,0);
    this.sprite.setVisible(false);
    this.status=false;
  },

  rtti: function() {
    return "Explosion";
  },

  pid: function() { return this.sprite.getTag(); }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF



