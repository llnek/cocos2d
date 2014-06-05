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

(function(undef) { "use strict"; var global = this, _ = global._  ,
asterix = global.ZotohLab.Asterix,
ast = asterix.Asteroids,
ccsx= asterix.COCOS2DX,
sh = asterix.Shell,
echt= global.ZotohLab.echt,
loggr= global.ZotohLab.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Missile = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setRotation(options.angle);
    this.setPosition(x,y);
  }

});

ast.EntityMissile = asterix.XEntity.extends({

  update: function(dt) {
    if (this.sprite) {
      var pos = this.sprite.getPosition(),
      csts= sh.xcfg.csts,
      wz= ccsx.screen();
      this.move(dt);
      if (ccsx.outOfBound(this)) {
        this.injured(-1);
      }
    }
  },

  reviveSprite: function() {
    if (this.sprite) {
      var rc= asterix.fns.calcXY(this.options.angle, this.speed);
      this.vel.x = rc[0];
      this.vel.y = rc[1];
      this.sprite.setPosition(this.startPos.x, this.startPos.y);
      this.sprite.setRotation(this.options.angle);
      this.sprite.setVisible(true);
    }
  },

  create: function() {
    return this.sprite = new Missile(this.startPos.x, this.startPos.y, this.options);
  },

  injured: function(num, from) {
    sh.fireEvent('/game/objects/missiles/killed', { entity: this } );
  },

  check: function(other) {
    other.injured(0, this);
    this.injured();
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.wrappable=true;
    this.speed= 150;
    var rc= asterix.fns.calcXY(options.angle, this.speed);
    this.vel.x = rc[0];
    this.vel.y = rc[1];
    this.options.frames= ['laserGreen.png'];
  }


});





}).call(this);



