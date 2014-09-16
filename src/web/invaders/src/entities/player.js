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
ivs = asterix.Invaders,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Ship = cc.Sprite.extend({

  coolDown: function() {
    this.setSpriteFrame(this.frame0);
    this.ammoCount= 0;
  },

  loadAmmo: function() {
    this.setSpriteFrame(this.frame1);
    this.ammoCount= 1;
  },

  hasAmmo: function() {
    return this.ammoCount > 0;
  },

  ammoCount: 0,

  ctor: function(x,y,options) {
    this.options= options;
    this.frame0 = ccsx.getSpriteFrame(options.frames[0]);
    this.frame1 = ccsx.getSpriteFrame(options.frames[1]);
    this._super();
    this.loadAmmo();
    this.setPosition(x,y);
  }

});


asterix.Invaders.EntityPlayer = asterix.XEntity.xtends({

  create: function() {
    return this.sprite = new Ship(this.startPos.x, this.startPos.y, this.options);
  },

  update: function(dt) {
    if (this.sprite) {
      if (ccsx.timerDone(this.coolAmmo)) {
        this.sprite.loadAmmo();
      }
      this._super(dt);
    }
  },

  keypressed: function(dt) {
    if (sh.main.keyboard[cc.KEY.right]) {
      this.onRight(dt);
    }
    if (sh.main.keyboard[cc.KEY.left]) {
      this.onLeft(dt);
    }
    if (sh.main.keyboard[cc.KEY.space] && this.sprite.hasAmmo()) {
      this.doFire();
    }
  },

  doFire: function() {
    var pos = this.sprite.getPosition();
    sh.fireEvent('/game/objects/players/shoot', {
      x: pos.x , y: pos.y + 4
    });
    this.sprite.coolDown();
    this.coolAmmo = ccsx.createTimer(this.sprite, this.options.coolDown);
  },

  onRight: function(dt) {
    this.vel.x = 150;
    this.move(dt);
    this.clamp();
  },

  onLeft: function(dt) {
    this.vel.x = -150;
    this.move(dt);
    this.clamp();
  },

  clamp: function() {
    var sz= this.sprite.getContentSize(),
    pos= this.sprite.getPosition(),
    csts = sh.xcfg.csts,
    wz = ccsx.screen();

    if (ccsx.getRight(this.sprite) > wz.width - csts.TILE) {
      this.sprite.setPosition(wz.width - csts.TILE - sz.width * 0.5, pos.y);
    }
    if (ccsx.getLeft(this.sprite) < csts.TILE) {
      this.sprite.setPosition( csts.TILE + sz.width * 0.5, pos.y);
    }
  },

  check: function(other) {
    other.injured(0,this);
    this.injured(0,other);
  },

  injured: function(num, from) {
    this.dispose();
    sh.fireEvent('/game/objects/players/killed');
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.vel.x = 150;
    this.options.frames= [ 'ship_0.png', 'ship_1.png' ];
  }


});




}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

