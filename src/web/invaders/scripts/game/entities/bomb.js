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

(function(undef) { "use strict"; var global = this; var _ = global._ ;

var asterix = global.ZotohLabs.Asterix;
var ccsx = asterix.COCOS2DX;
var ivs = asterix.Invaders;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

var Bomb = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this.options = options || {};
    this._super();
    this.initWithSpriteFrameName(this.options.frames[0]);
    this.setZOrder(this.options.zIndex);
    this.setTag(this.options.tag);
    this.setPosition(x,y);
  }
});

asterix.Invaders.EntityBomb = asterix.XEntity.extends({

  update: function(dt) {
    var csts = sh.xcfg.csts;
    var wz = ccsx.screen();
    if (this.sprite) {
      var pos = this.sprite.getPosition();
      var y = pos.y - dt * this.speed;
      this.sprite.setPosition(pos.x, y);
      if (ccsx.getBottom(this.sprite) <= csts.TILE) {
        this.kill();
      }
    }
  },

  kill: function() {
    delete sh.pools['live-bombs'][ this.options.tag];
    sh.pools['bombs'].add(this);
  },

  check: function(other) {
    var pos = other.sprite.getPosition();
    var aa= new ivs.EntityExplode(pos.x, pos.y, {
      zIndex: sh.main.lastZix,
      tag: ++sh.main.lastTag,
      frameTime: 0.1
    });
    other.kill();
    this.kill();
    //ig.game.onPlayerKilled();
    sh.main.addChild(aa.create(), aa.zIndex, aa.tag);
  },

  create: function() {
    var pos= this.options._startPos;
    this.sprite = new Bomb(pos.x,pos.y, this.options);
    return this.sprite;
  },

  speed: 50,

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.maxVel.x = 0;
    this.maxVel.y = 200;
    this.vel.y = 50;
    this.options.frames= ['bomb.png'];
  }



});









}).call(this);


