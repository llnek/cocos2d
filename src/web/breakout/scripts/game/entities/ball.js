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
asterix=global.ZotohLabs.Asterix,
ccsx= asterix.COCOS2DX,
bko= asterix.BreakOut,
sh= asterix.Shell,
echt= global.ZotohLabs.echt,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Ball = cc.Sprite.extend({
  ctor: function(x,y,options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);
  }
});


bko.EntityBall = asterix.XEntity.extends({

  speed: 180,

  update: function(dt) {
    var sz= this.sprite.getContentSize().height / 2,
    sw= this.sprite.getContentSize().width / 2,
    pos = this.sprite.getPosition(),
    csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    y = pos.y + dt * this.vel.y,
    x = pos.x + dt * this.vel.x,
    b_y1= csts.TILE,
    b_y2 = wz.height - csts.TILE,
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

    this.lastPos = this.sprite.getPosition();
    this.sprite.setPosition(x, y);
  },

  create: function() {
    this.vel.y = 200 * asterix.fns.randomSign();
    this.vel.x = 200 * asterix.fns.randomSign();
    return this.sprite= new Ball(this.startPos.x, this.startPos.y, this.options);
  },

  check: function(other) {
    if (other instanceof bko.EntityBrick) {
      this.onBrick(other);
    }
    other.injured(0,this);
  },

  onBrick: function(brick) {
    var kz= brick.sprite.getContentSize(),
    bz = this.sprite.getContentSize(),
    ks= brick.sprite,
    bs= this.sprite,
    ka = { L: ccsx.getLeft(ks), T: ccsx.getTop(ks),
           R: ccsx.getRight(ks), B: ccsx.getBottom(ks) },
    ba = { L : ccsx.getLeft(bs), T: ccsx.getTop(bs),
           R: ccsx.getRight(bs), B: ccsx.getBottom(bs) };

    // ball coming down from top?
    if (ba.T > ka.T &&  ka.T > ba.B) {
      this.vel.y = - this.vel.y;
    }
    else
    // ball coming from bottom?
    if (ba.T > ka.B &&  ka.B > ba.B) {
      this.vel.y = - this.vel.y;
    }
    else
    // ball coming from left?
    if (ka.L > ba.L && ba.R > ka.L) {
      this.vel.x = - this.vel.x;
    }
    else
    // ball coming from right?
    if (ka.R > ba.L && ba.R > ka.R) {
      this.vel.x = - this.vel.x;
    }
    else {
      loggr.error("Failed to determine the collision of ball and brick.");
    }
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.options.frames= ['ball.png'];
  }

});




}).call(this);



