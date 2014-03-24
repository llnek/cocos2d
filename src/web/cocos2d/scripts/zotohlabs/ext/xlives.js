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

(function (undef){ "use strict"; var global = this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.XLive = cc.Sprite.extend({
  ctor: function(x, y, options) {
    this.options= options || {};
    this._super();
    this.initWithSpriteFrameName(this.options.frames[0]);
    //this.setZOrder(this.options.zIndex);
    //this.setTag(this.options.tag);
    this.setPosition(x,y);
  }
});

asterix.XHUDLives = global.ZotohLabs.klass.extends({

  curLives: 0,

  reduceLives: function(howmany) {
    this.curLives = Math.max( 0, this.curLives - howmany);
    for (var n=0; n < howmany; n++) {
      sh.main.killHUDItem(this.icons.pop());
    }
  },

  getLives: function() {
    return this.curLives;
  },

  isDead: function() {
    return this.curLives <= 0;
  },

  reset:function() {
    this.curLives = this.options.totalLives;
    this.icons=[];
  },

  update: function() {
  },

  moveTo: function(newx, newy) {
    this.x= newx;
    this.y= newy;
  },

  getPos: function() {
    return [this.x, this.y];
  },

  create: function() {
    var ops = global.ZotohLabs.klass.merge({ tag: 0, zIndex: 0}, this.options);
    var n, gap = 2;
    var v= new asterix.XLive(0,0,ops);
    var z = v.getContentSize();
    var y= this.topLeft.y - z.height/2;
    var x= this.topLeft.x + z.width/2;

    for (n = 0; n < this.curLives; ++n) {
      v= new asterix.XLive(x,y,ops);
      sh.main.addHUDItem(v);
      this.icons.push(v);
      if (this.options.direction > 0) {
        x += z.width + gap;
      } else {
        x -= z.width - gap;
      }
    }
  },

  ctor: function(x, y, options) {
    this.options = options || {};
    this.topLeft= cc.p(x,y);
    this.reset();
    if ( !echt(this.options.direction)) {
      this.options.direction = 1;
    }
  }

});



}).call(this);


