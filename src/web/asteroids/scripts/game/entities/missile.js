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
asterix = global.ZotohLabs.Asterix,
ast = asterix.Asteroids,
ccsx= asterix.COCOs2DX,
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
    this.setRotation(options.angle);
    this.setPosition(x,y);
  }

});

ast.EntityMissile = asterix.XEntity.extends({

  ctor: function(x, y, options) {
    var rc= asterix.fns.calcXY(options.angle, 150);
    this._super(x, y, options);
    this.vel.x = rc[0];
    this.vel.y = rc[1];
    this.options.frames= ['laserGreen.png'];
  },

  update: function(dt) {
    this.move(dt);
  },

  create: function() {
    return this.sprite = new Missile(this.startPos.x, this.startPos.y, this.options);
  },

  check: function(other) {
  }

});





}).call(this);



