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

(function(undef) { "use strict"; var global= this, _ = global._ ,
asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
png= asterix.Pong,
SkaroJS= global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityRobot = png.EntityPaddle.xtends({

  isRobot: function() { return true; },

  update: function(dt) {
    var bp= this.ball.sprite.getPosition(),
    pos = this.sprite.getPosition(),
    y= pos.y;

    if (bp.y > pos.y) {
      if (this.ball.vel.y > 0) {
        y += dt * this.speed;
      } else {
        //y -= dt * this.speed;
      }
    }
    else {
      if (this.ball.vel.y > 0) {
        //y += dt * this.speed;
      } else {
        y -= dt * this.speed;
      }
    }
    if (y !== pos.y) {
      this.updatePosition(pos.x, y);
      this.clamp();
    }
  },

  bindBall: function(ball) {
    this.ball= ball;
  }

});




}).call(this);


