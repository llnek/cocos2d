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

(function(undef) { "use strict"; var global = this, _ = global._  ;

var asterix=global.ZotohLab.Asterix,
sh=global.ZotohLab.Asterix,
ccsx= asterix.COCOS2DX,
bko= asterix.BreakOut,
sjs= global.SkaroJS;


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


bko.EntityBall = asterix.XEntity.xtends({

  update: function(dt) {
    var b=false;
    if (this.bounce > 0) { b= this.traceEnclosure(dt); }
    if (!b) { this.move(dt); }
  },

  create: function() {
    this.vel.y = 200 * sjs.randomSign();
    this.vel.x = 200 * sjs.randomSign();
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
      sjs.loggr.error("Failed to determine the collision of ball and brick.");
    }
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.bounce=1;
    this.options.frames= ['ball.png'];
  }

});




}).call(this);


//////////////////////////////////////////////////////////////////////////////
//EOF

