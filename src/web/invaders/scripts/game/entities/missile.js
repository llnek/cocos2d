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

var Missile = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);
  }

});

asterix.Invaders.EntityMissile = asterix.XEntity.extends({

  rtti: function() { return 'EntityMissile'; },

  update: function(dt) {
    if (this.sprite) {
      var pos = this.sprite.getPosition(),
      csts= sh.xcfg.csts,
      wz= ccsx.screen();
      this.move(dt);
      if (ccsx.getTop(this.sprite) >= wz.height - csts.TILE) {
        this.injured(-1);
      }
    }
  },

  injured: function(num, from) {
    sh.fireEvent('/game/objects/missiles/killed', { entity: this } );
  },

  check: function(other) {
    other.injured(0, this);
    this.injured(0);
  },

  create: function() {
    return this.sprite = new Missile(this.startPos.x, this.startPos.y,this.options);
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.vel.y = 100;
    this.options.frames= ['missile.png'];
  }


});





}).call(this);


