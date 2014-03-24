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

(function(undef) { "use strict"; var global = this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var ccsx = asterix.COCOS2DX;
var ivs = asterix.Invaders;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

var Missile = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this.options= options || {};
    this._super();
    this.initWithSpriteFrameName(this.options.frames[0]);
    //this.setZOrder(this.options.zIndex);
    //this.setTag(this.options.tag);
    this.setPosition(x,y);
  }

});

asterix.Invaders.EntityMissile = asterix.XEntity.extends({

  rtti: function() { return 'EntityMissile'; },

  speed: 100,

  update: function(dt) {
    var csts= sh.xcfg.csts;
    var wz= ccsx.screen();
    if (this.sprite) {
      var pos = this.sprite.getPosition();
      var y = pos.y + dt * this.speed;
      this.sprite.setPosition(pos.x, y);
      if (ccsx.getTop(this.sprite) >= wz.height - csts.TILE) {
        this.kill();
      }
    }
  },

  kill: function() {
    sh.main.killMissile(this);
  },

  check: function(other) {
    other.takeHit(666, this);
    //ig.game.onAlienHit(other);
    this.kill();
  },

  create: function() {
    this.sprite = new Missile(this.options._startPos.x, this.options._startPos.y,this.options);
    return this.sprite;
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.maxVel.x = 200;
    this.maxVel.y = 200;
    this.vel.y = -80;
    this.options.frames= ['missile.png'];
  }


});





}).call(this);


