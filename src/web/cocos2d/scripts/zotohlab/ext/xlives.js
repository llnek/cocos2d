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

(function (undef){ "use strict"; var global = this,  _ = global._  ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs = global.SkaroJS,
ccsx = asterix.COCOS2DX;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XLive = cc.Sprite.extend({
  ctor: function(x, y, options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    if ( sjs.echt(options.scale)) {
      this.setScale(options.scale);
    }
    this.setPosition(x,y);
  }
});

asterix.XHUDLives = sjs.Class.xtends({

  curLives: -1,

  reduce: function(howmany) {
    this.curLives = this.curLives - howmany;
    for (var n=0; n < howmany; ++n) {
      this.hud.removeItem(this.icons.pop());
    }
  },

  getLives: function() {
    return this.curLives;
  },

  isDead: function() {
    return this.curLives < 0;
  },

  reset:function() {
    _.each(this.icons, function(z) { this.hud.removeItem(z); }, this);
    this.curLives = this.options.totalLives;
    this.icons=[];
  },

  resurrect: function() {
    this.reset();
    this.drawLives();
  },

  drawLives: function() {
    var n, gap= 2,
    y= this.topLeft.y - this.lifeSize.height/2,
    x= this.topLeft.x + this.lifeSize.width/2,
    v;
    for (n = 0; n < this.curLives; ++n) {
      v= new asterix.XLive(x,y,this.options);
      this.hud.addItem(v);
      this.icons.push(v);
      if (this.options.direction > 0) {
        x += this.lifeSize.width + gap;
      } else {
        x -= this.lifeSize.width - gap;
      }
    }
  },

  create: function() {
    var dummy = new asterix.XLive(0,0,this.options);
    this.lifeSize = { width: ccsx.getScaledWidth(dummy), height: ccsx.getScaledHeight(dummy) } ;
    this.drawLives();
  },

  ctor: function(hud, x, y, options) {
    this.options = options || {};
    this.hud= hud;
    this.topLeft= cc.p(x,y);
    this.reset();
    if ( !sjs.echt(this.options.direction)) {
      this.options.direction = 1;
    }
  }

});



}).call(this);


