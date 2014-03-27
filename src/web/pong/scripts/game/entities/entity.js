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

(function(undef){ "use strict"; var global= this, _ = global._ ,
asterix= global.ZotohLabs.Asterix,
ccsx = asterix.COCOS2DX,
sh= asterix.Shell,
png= asterix.Pong,
loggr = global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityXXX = asterix.XEntity.extends({

  create: function() {
    this.sprite = cc.Sprite.create(sh.xcfg.getImagePath(this.resid));
    this.sprite.setPosition(this.startPos);
    return this.sprite;
  }

});


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityPaddle = png.EntityXXX.extends({

  speed: 200,
  kcodes: [],

  clamp: function() {
    var pos= this.sprite.getPosition(),
    csts = sh.xcfg.csts,
    y= pos.y,
    wz = ccsx.screen(),
    y2 = wz.height - csts.TILE * 6,
    y1 = csts.TILE,
    h = ccsx.getHeight(this.sprite) / 2,
    b= ccsx.getBottom(this.sprite),
    t= ccsx.getTop(this.sprite);

    if (t > y2) {
      y = y2 - h;
    }

    if (b < y1) {
      y = y1 + h;
    }

    if (y !== pos.y) {
      this.sprite.setPosition(pos.x, y);
    }

  },

  ctor: function(x,y,options) {
    this._super(x,y,options);
    switch (this.options.color) {
    case 'X':
      this.resid = 'gamelevel1.images.paddle1';
      this.kcodes = [cc.KEY.up, cc.KEY.down];
      break;
    case 'O':
      this.resid = 'gamelevel1.images.paddle2';
      this.kcodes = [cc.KEY.w, cc.KEY.s];
      break;
    }
  }

});

Object.defineProperty(png.EntityPaddle.prototype, "color", {
  get: function() {
    return this.options.color;
  }
});

}).call(this);


