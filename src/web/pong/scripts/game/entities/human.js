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

(function(undef) { "use strict"; var global=this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var ccsx = asterix.COCOS2DX;
var png = asterix.Pong;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
png.EntityHuman = png.EntityPaddle.extends({

  isRobot: function() { return false; },

  keypressed: function(dt) {
    var sz = this.sprite.getContentSize().height / 2;
    var pos = this.sprite.getPosition();
    var y= pos.y;
    var csts = sh.xcfg.csts;
    var wz = ccsx.screen();
    var keys= sh.main.keys;

    var y2 = wz.height - csts.TILE * 6;
    var y1 = csts.TILE;
    var ty, delta= dt * this.speed;

    if (keys[ this.kcodes[0] ]) {
        y += delta;
    }

    if (keys[ this.kcodes[1] ] ) {
        y -= delta;
    }

    if (y !== pos.y) {
      this.sprite.setPosition(pos.x, y);
      this.clamp();
    }

  }

});




}).call(this);


