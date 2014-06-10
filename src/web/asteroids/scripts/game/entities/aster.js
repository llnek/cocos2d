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
sh = global.ZotohLab.Asterix,
ast = asterix.Asteroids,
ccsx= asterix.COCOS2DX,
SkaroJS= global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

ast.EntityAster = asterix.XEntity.xtends({

  initVel: function(v) {
    this.vel.y= SkaroJS.randomSign() * v;
    this.vel.x= SkaroJS.randomSign() * v;
  },

  update: function(dt) {
    //if (this.bounce > 0) { this.traceEnclosure(dt); }
    this.wrapEnclosure();
    this.maybeRotate(dt);
    this.move(dt);
  },

  maybeRotate: function(dt) {
    this.sprite.setRotation( this.angle);
    this.angle += 0.05;
    if (this.angle > 360) { this.angle -= 360; }
  },

  injured: function(num,from) {
    if (from instanceof ast.EntityMissile) {
      sh.fireEvent('/game/objects/players/earnscore', { score: this.value } );
    }
    this.sprite.setVisible(false);
    this.status=false;
  },


  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.wrappable=true;
    this.bounce=1;
    this.angle = SkaroJS.rand(360);
  }


});




}).call(this);



