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

(function(undef) { "use strict"; var global=this, _ = global._ ,
asterix = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
png = asterix.Pong,
sh = asterix.Shell,
echt= global.ZotohLab.echt,
loggr= global.ZotohLab.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityHuman = png.EntityPaddle.extends({

  isRobot: function() { return false; },

  keypressed: function(dt) {
    var sz = this.sprite.getContentSize().height / 2,
    pos = this.sprite.getPosition(),
    y= pos.y,
    csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    keys= sh.main.keys,
    y2 = wz.height - csts.TILE * 6,
    y1 = csts.TILE,
    ty, delta= dt * this.speed;

    if (keys[ this.kcodes[0] ]) {
        y += delta;
    }

    if (keys[ this.kcodes[1] ] ) {
        y -= delta;
    }

    if (y !== pos.y) {
      this.updatePosition(pos.x, y);
      this.clamp();
    }

  }

});




}).call(this);


