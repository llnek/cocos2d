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
asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
png= asterix.Pong,
SkaroJS= global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.EntityBall = png.EntityXXX.xtends({

  update: function(dt) {
    var b=false;
    if (this.bounce > 0) { b= this.traceEnclosure(dt); }
    if (!b) { this.move(dt); }
  },

  create: function() {
    this.vel.y = 200 * SkaroJS.randomSign();
    this.vel.x = 200 * SkaroJS.randomSign();
    return this._super();
  },

  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.bounce=1;
    this.resid= 'gamelevel1.images.ball';
  }

});


png.NetBall = png.EntityBall.xtends({

  update: function(dt) {
    var b=false;
    if (this.bounce > 0) { b= this.traceEnclosure(dt); }
    if (!b) { this.move(dt); }
  },

  create: function() {
    this.vel.y = 200 * SkaroJS.randomSign();
    this.vel.x = 200 * SkaroJS.randomSign();
    return this._super();
  },

  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.bounce=1;
    this.resid= 'gamelevel1.images.ball';
  }

});


}).call(this);


