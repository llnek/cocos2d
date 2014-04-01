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
ccsx = asterix.COCOS2DX,
ivs = asterix.Invaders,
sh = asterix.Shell,
echt= global.ZotohLabs.echt,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Bomb = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);
  }

});

asterix.Invaders.EntityBomb = asterix.XEntity.extends({

  update: function(dt) {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen();
    if (this.sprite) {
      this.move(dt);
      if (ccsx.getBottom(this.sprite) <= csts.TILE) {
        this.injured(-1);
      }
    }
  },

  injured: function(num,from) {
    var points = from instanceof ivs.EntityMissile,
    pos = this.sprite.getPosition();
    sh.fireEvent('/game/objects/bombs/killed', { entity: this, x: pos.x, y: pos.y, explode: true });
    if (points) {
      sh.fireEvent('/game/objects/players/earnscore', { score: this.value });
    }
  },

  check: function(other) {
    throw new Error("not implemented.");
  },

  create: function() {
    return this.sprite = new Bomb(this.startPos.x, this.startPos.y, this.options);
  },

  rtti: function() { return 'EntityBomb'; },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.vel.y = -50;
    this.value=10;
    this.options.frames= ['bomb.png'];
  }



});









}).call(this);


