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

(function (undef){ "use strict"; var global = this,  _ = global._  ,
asterix = global.ZotohLabs.Asterix,
sh = asterix.Shell,
echt= global.ZotohLabs.echt,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XLive = cc.Sprite.extend({
  ctor: function(x, y, options) {
    this.options= options || {};
    this._super();
    this.initWithSpriteFrameName(this.options.frames[0]);
    this.setPosition(x,y);
  }
});

asterix.XHUDLives = global.ZotohLabs.klass.extends({

  curLives: 0,

  reduceLives: function(howmany) {
    this.curLives = Math.max( 0, this.curLives - howmany);
    for (var n=0; n < howmany; n++) {
      this.layer.removeItem(this.icons.pop());
    }
  },

  getLives: function() {
    return this.curLives;
  },

  isDead: function() {
    return this.curLives <= 0;
  },

  reset:function() {
    var me=this;
    _.each(this.icons, function(z) {
      me.layer.removeItem(z);
    });
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
    x= this.topLeft.x + this.lifeSizez.width/2;
    v;
    for (n = 0; n < this.curLives; ++n) {
      v= new asterix.XLive(x,y,this.options);
      this.layer.addItem(v);
      this.icons.push(v);
      if (this.options.direction > 0) {
        x += this.lifeSize.width + gap;
      } else {
        x -= this.lifeSize.width - gap;
      }
    }
  },

  create: function() {
    this.lifeSize = new asterix.XLive(0,0,this.options).getContentSize();
    this.drawLives();
  },

  ctor: function(layer, x, y, options) {
    this.options = options || {};
    this.layer= layer;
    this.topLeft= cc.p(x,y);
    this.reset();
    if ( !echt(this.options.direction)) {
      this.options.direction = 1;
    }
  }

});



}).call(this);


