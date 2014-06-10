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

(function(undef) { "use strict"; var global = this, _ = global._ ,
asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
ccsx= asterix.COCOS2DX,
bko= asterix.BreakOut,
SkaroJS= global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Paddle = cc.Sprite.extend({
  ctor: function(x,y,options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);
  }
});

bko.EntityPlayer = asterix.XEntity.xtends({

  keypressed: function(dt) {
    if (sh.main.keyboard[cc.KEY.right]) {
      this.onRight(dt);
    }
    if (sh.main.keyboard[cc.KEY.left]) {
      this.onLeft(dt);
    }
  },

  create: function() {
    return this.sprite = new Paddle(this.startPos.x, this.startPos.y, this.options);
  },

  onRight: function(dt) {
    this.vel.x = 150;
    this.move(dt);
    this.clamp();
  },

  onLeft: function(dt) {
    this.vel.x = -150;
    this.move(dt);
    this.clamp();
  },

  clamp: function() {
    var sz= this.sprite.getContentSize(),
    pos= this.sprite.getPosition(),
    csts = sh.xcfg.csts,
    wz = ccsx.screen();

    if (ccsx.getRight(this.sprite) > wz.width - csts.TILE) {
      this.sprite.setPosition(wz.width - csts.TILE - sz.width/2, pos.y);
    }
    if (ccsx.getLeft(this.sprite) < csts.TILE) {
      this.sprite.setPosition( csts.TILE + sz.width/2, pos.y);
    }
  },


  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.vel.x = 150;
    this.options.frames= ['paddle.png'];
  }

});




}).call(this);



