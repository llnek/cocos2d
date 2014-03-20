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

(function(undef){ "use strict"; var global= this; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var ccsx = asterix.COCOS2DX;
var sh= asterix.Shell;
var png= asterix.Pong;
var loggr = global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityXXX = global.ZotohLabs.klass.extends({

  update: function(dt) {
    if (sys.platform === 'browser') {
      this.keypressed(dt);
    }
  },

  keypressed: function(dt) {},

  kill: function() {
    var s= this.sprite;
    this.sprite=null;
    return s;
  },

  create: function() {
    this.sprite = cc.Sprite.create(sh.xcfg.getImagePath(this.resid));
    this.sprite.setPosition(this.startPos);
    return this.sprite;
  },

  ctor: function(x,y,options) {
    this.startPos = cc.p(x,y);
  }

});

Object.defineProperty(png.EntityXXX.prototype, "height", {
  get: function() {
    return this.sprite ? this.sprite.getContentSize().height : undef;
  }
});
Object.defineProperty(png.EntityXXX.prototype, "width", {
  get: function() {
    return this.sprite ? this.sprite.getContentSize().width : undef;
  }
});
Object.defineProperty(png.EntityXXX.prototype, "color", {
  get: function() {
    return this.eColor;
  }
});

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityPaddle = png.EntityXXX.extends({

  speed: 200,
  kcodes: [],

  clamp: function() {
    var pos= this.sprite.getPosition();
    var csts = sh.xcfg.csts;
    var y= pos.y;
    var wz = ccsx.screen();
    var y2 = wz.height - csts.TILE * 6;
    var y1 = csts.TILE;

    var h = ccsx.getHeight(this.sprite) / 2;
    var b= ccsx.getBottom(this.sprite);
    var t= ccsx.getTop(this.sprite);

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
    this.parent(x,y,options);
    switch (options.color) {
    case 'X':
      this.resid = 'gamelevel1.images.paddle1';
      this.kcodes = [cc.KEY.up, cc.KEY.down];
      break;
    case 'O':
      this.resid = 'gamelevel1.images.paddle2';
      this.kcodes = [cc.KEY.w, cc.KEY.s];
      break;
    }
    this.eColor= options.color;
  }

});



}).call(this);


