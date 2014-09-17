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

(function(undef) { "use strict"; var global=this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
png = asterix.Pong,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityHuman = png.EntityPaddle.xtends({

  isRobot: function() { return false; },

  keypressed: function(dt) {
    this.onKeyPressed(dt);
  },

  onKeyPressed: function(dt) {
    var hw2 = ccsx.halfHW(this.sprite),
    pos = this.sprite.getPosition(),
    x= undef,
    y= undef,
    world= sh.main.getEnclosureRect(),
    keys= sh.main.keys,
    ty, delta= dt * this.speed;

    if (keys[ this.kcodes[0] ]) {
      if (ccsx.isPortrait()) {
        x = pos.x + delta;
      } else {
        y = pos.y + delta;
      }
    }

    if (keys[ this.kcodes[1] ] ) {
      if (ccsx.isPortrait()) {
        x = pos.x - delta;
      } else {
        y = pos.y - delta;
      }
    }

    if (sjs.echt(x)) {
      this.updatePosition(x, pos.y);
      this.clamp();
    }
    if (sjs.echt(y)) {
      this.updatePosition(pos.x, y);
      this.clamp();
    }

  }

});


png.NetPlayer = png.EntityHuman.xtends({

  setWEBSock: function(wss) {
    this.wss=wss;
  },

  setDir: function(dir) {
    this.dir=dir;
  },


  simulateMove: function(dt) {
    var hw2 = ccsx.halfHW(this.sprite),
    pos = this.sprite.getPosition(),
    x= undef,
    y= undef,
    world= sh.main.getEnclosureRect(),
    keys= sh.main.keys,
    ty, delta= dt * this.speed;

    if (this.dir > 0) {
      if (ccsx.isPortrait()) {
        x = pos.x + delta;
      } else {
        y = pos.y + delta;
      }
    }
    else
    if (this.dir < 0) {
      if (ccsx.isPortrait()) {
        x = pos.x - delta;
      } else {
        y = pos.y - delta;
      }
    }

    if (sjs.echt(x)) {
      this.updatePosition(x, pos.y);
      this.clamp();
    }
    if (sjs.echt(y)) {
      this.updatePosition(pos.x, y);
      this.clamp();
    }

  },

  keypressed: function(dt) {
    if (this.wss) {
      this.onKeyPressed(dt);
    } else {
      this.simulateMove(dt);
    }
  },

  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.wss=null;
    this.dir=0;
  }

});

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

