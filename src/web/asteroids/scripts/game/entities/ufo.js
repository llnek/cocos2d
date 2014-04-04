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
asterix = global.ZotohLabs.Asterix,
echt = global.ZotohLabs.echt,
ast = asterix.Asteroids,
ccsx = asterix.COCOS2DX,
sh = asterix.Shell,
loggr = global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
var Ufo = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);
  }

});

ast.EntityUfo = asterix.XEntity.extends({

  update: function(dt) {
    var pp= this.options.player.sprite.getPosition(),
    x,y,
    mp= this.sprite.getPosition();
    if (pp.x > mp.x) {
      this.vel.x = this.speed;
    } else {
      this.vel.x = - this.speed;
    }
    if (pp.y > mp.y) {
      this.vel.y = this.speed;
    } else {
      this.vel.y = - this.speed;
    }
    this.move(dt);
  },

  create: function() {
    return this.sprite = new Ufo(this.startPos.x, this.startPos.y, this.options);
  },

  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.speed=20;
    this.options.frames= ['ufo.png'];
  }

});



}).call(this);





