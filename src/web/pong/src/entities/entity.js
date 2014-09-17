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

(function(undef){ "use strict"; var global= this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
png= asterix.Pong,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityXXX = asterix.XEntity.xtends({

  create: function() {
    this.sprite = new cc.Sprite(sh.getImagePath(this.resid));
    this.sprite.setPosition(this.startPos);
    return this.sprite;
  }

});


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityPaddle = png.EntityXXX.xtends({

  clamp: function() {
    var pos= this.sprite.getPosition(),
    world= sh.main.getEnclosureRect(),
    x= undef,
    y= undef,
    hw2= ccsx.halfHW(this.sprite),
    bb4= ccsx.bbox4(this.sprite);

    if (ccsx.isPortrait()) {
      if (bb4.right > world.right) {
        x = world.right - hw2[0];
      }
      if (bb4.left < world.left) {
        x = world.left + hw2[0];
      }
    } else {
      if (bb4.top > world.top) {
        y = world.top - hw2[1];
      }
      if (bb4.bottom < world.bottom) {
        y = world.bottom + hw2[1];
      }
    }

    if (sjs.echt(x)) {
      this.sprite.setPosition(x, pos.y);
    }

    if (sjs.echt(y)) {
      this.sprite.setPosition(pos.x, y);
    }
  },

  //ball hits paddle
  check: function(other) {
    var pos = other.sprite.getPosition(),
    bb4 = ccsx.bbox4(this.sprite),
    x= pos.x,
    y= pos.y,
    hw2= ccsx.halfHW(other.sprite);

    if (ccsx.isPortrait()) {
      other.vel.y = - other.vel.y;
    } else {
      other.vel.x = - other.vel.x;
    }

    // X is either bottom or left.
    if (this.options.color === 'X') {
      if (ccsx.isPortrait()) {
        y=bb4.top + hw2[1];
      } else {
        x=bb4.right + hw2[0];
      }
    } else {
      if (ccsx.isPortrait()) {
        y = bb4.bottom - hw2[1];
      } else {
        x = bb4.left - hw2[0];
      }
    }

    other.sprite.setPosition(x,y);
    sh.sfxPlay(this.snd);
  },

  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.speed= this.options.speed;
    this.kcodes= [];

    if (ccsx.isPortrait()) {

      if (this.options.color === 'X') {
        this.resid = 'gamelevel1.images.p.paddle1';
        this.kcodes = [cc.KEY.right, cc.KEY.left];
      } else {
        this.resid = 'gamelevel1.images.p.paddle2';
        this.kcodes = [cc.KEY.d, cc.KEY.a];
      }

    } else {

      if (this.options.color === 'X') {
        this.resid = 'gamelevel1.images.l.paddle1';
        this.kcodes = [cc.KEY.up, cc.KEY.down];
      } else {
        this.resid = 'gamelevel1.images.l.paddle2';
        this.kcodes = [cc.KEY.w, cc.KEY.s];
      }
    }

    if (this.options.color === 'X') {
      this.snd= 'x_hit';
    } else {
      this.snd= 'o_hit';
    }
  }

});

Object.defineProperty(png.EntityPaddle.prototype, "color", {
  get: function() { return this.options.color; }
});

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

