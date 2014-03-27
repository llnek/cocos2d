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
asterix= global.ZotohLabs.Asterix,
ccsx = asterix.COCOS2DX,
sh= asterix.Shell,
png= asterix.Pong,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityBall = png.EntityXXX.extends({

  vel: { x: 0, y: 0 },

  update: function(dt) {
    var sz= this.sprite.getContentSize().height / 2,
    sw= this.sprite.getContentSize().width / 2,
    pos = this.sprite.getPosition(),
    csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    y = pos.y + dt * this.vel.y,
    x = pos.x + dt * this.vel.x,
    b_y1= csts.TILE,
    b_y2 = wz.height - csts.TILE * 6,
    b_x1= csts.TILE,
    b_x2 = wz.width - csts.TILE;

    // hitting top wall ?
    if (y + sz > b_y2) {
      y = b_y2 - sz;
      this.vel.y = - this.vel.y
    }
    // hitting bottom wall ?
    if (y - sz < b_y1) {
      y = b_y1 + sz;
      this.vel.y = - this.vel.y
    }

    if (x + sw > b_x2) {
      x = b_x2 - sw;
      this.vel.x = - this.vel.x;
    }

    if (x - sw < b_x1) {
      x = b_x1 + sw;
      this.vel.x = - this.vel.x;
    }

    this.sprite.setPosition(x, y);
  },

  create: function() {
    this.vel.y = 200 * asterix.fns.randomSign();
    this.vel.x = 200 * asterix.fns.randomSign();
    return this._super();
  },

  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.resid= 'gamelevel1.images.ball';
  }

});




}).call(this);


