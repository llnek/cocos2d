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

(function(undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
ast = asterix.Asteroids,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Astro2 = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);
  }

});


ast.EntityAsteroid2 = ast.EntityAster.xtends({

  create: function() {
    return this.sprite = new Astro2(this.startPos.x, this.startPos.y, this.options);
  },

  explode: function() {
    var cfg = sh.xcfg.levels.gamelevel1.fixtures,
    n, csts= sh.xcfg.csts,
    pos= this.sprite.getPosition();
    for (n=0; n < cfg.STONES; ++n) {
      sh.fireEvent('/game/objects/stones/create', {
        x: pos.x, y: pos.y
      });
    }
  },

  check: function(other) {
  },

  injured: function(num,from) {
    this._super(num,from);
    this.explode();
  },

  ctor: function(x,y,options) {
    this._super(x,y, options);
    this.initVel(50);
    this.value=50;
    this.options.frames= ['rock_med.png'];
  }

});




}).call(this);



