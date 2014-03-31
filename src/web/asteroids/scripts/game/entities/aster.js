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
asterix = global.ZotohLabs.Asterix,
echt= global.ZotohLabs.echt,
ast = asterix.Asteroids,
ccsx= asterix.COCOS2DX,
sh = asterix.Shell,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

ast.EntityAster = asterix.XEntity.extends({

  initVel: function(v) {
    this.vel.y= asterix.fns.randomSign() * v;
    this.vel.x= asterix.fns.randomSign() * v;
  },

  update: function(dt) {
    //this.maybeRotate();
  },

  maybeRotate: function() {
    this.currentAnim.angle = asterix.fns.degToRad(this.angle);
    this.angle += 0.05;
    if (this.angle > 360) { this.angle -= 360; }
  },

  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.angle = asterix.fns.rand(360);
  }


});




}).call(this);



