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
asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
ivs = asterix.BreakOut,
SkaroJS= global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Boom = cc.Sprite.extend({

  ctor: function(entity,x,y,options) {
    this.entity=entity;
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);

    var sfc = cc.spriteFrameCache,
    frs = [ sfc.getSpriteFrame(options.frames[0]), sfc.getSpriteFrame(options.frames[1]),
            sfc.getSpriteFrame(options.frames[2]), sfc.getSpriteFrame(options.frames[3]) ],
    animation = cc.Animation.create(frs, options.frameTime);

    this.runAction( cc.Sequence.create(cc.Animate.create(animation),
      cc.CallFunc.create(function() {
        this.entity.dispose();
      }, this)
    ));
  }

});

asterix.BreakOut.EntityExplode = asterix.XEntity.xtends({

  update: function(dt) {
  },

  create: function() {
    return this.sprite = new Boom(this, this.startPos.x, this.startPos.y, this.options);
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.options.frameTime= 0.1;
    this.options.frames= ['boom_0.png','boom_1.png','boom_2.png','boom_3.png'];
  }

});







}).call(this);


