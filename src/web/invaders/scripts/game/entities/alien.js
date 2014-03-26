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

(function(undef) { "use strict"; var global = this, _ = global._ ,
asterix = global.ZotohLabs.Asterix,
ccsx = asterix.COCOS2DX,
ivs= asterix.Invaders,
sh= asterix.Shell,
echt= global.ZotohLabs.echt,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Alien = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this._super();

    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);

    var ccc = cc.SpriteFrameCache.getInstance(),
    f0 = ccc.getSpriteFrame(options.frames[0]),
    f1 = ccc.getSpriteFrame(options.frames[1]),
    animFrames = [ f0, f1 ],
    animation = cc.Animation.create(animFrames, options.frameTime),
    animate = cc.Animate.create(animation);

    this.runAction(cc.RepeatForever.create(animate));
  }

});

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.Invaders.EntityAlien = asterix.XEntity.extends({

  loadBomb: function() { this.bombCount = 1; },

  bombCount: 0,

  shuffle: function(x) {
    var pos= this.sprite.getPosition();
    this.sprite.setPosition(pos.x + x, pos.y);
  },

  forward: function() {
    var pos= this.sprite.getPosition();
    this.sprite.setPosition(pos.x, pos.y - ccsx.getHeight(this.sprite) - sh.xcfg.csts.OFF_Y);
  },

  update: function(dt) {
    if (this.bombCount > 0) {
      var pos = this.sprite.getPosition();
      sh.fireEvent('/game/objects/aliens/dropbombs', { x: pos.x, y: pos.y - 4 });
      this.bombCount = 0;
    }
  },

  check: function(other) {
    throw new Error("not implemented.");
  },

  injured: function(num, from) {
    // only a missile can hhurt this guy!
    if (from instanceof ivs.EntityMissile) {
      var pos= this.sprite.getPosition();
      this.sprite.setVisible(false);
      this.status= false;
      sh.fireEvent('/game/objects/aliens/killed', {x: pos.x, y: pos.y});
      sh.fireEvent('/game/objects/players/earnscore', { score: this.value });
    }
  },

  create: function() {
    return this.sprite = new Alien(this.startPos.x, this.startPos.y, this.options);
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    /*
    this.maxVel.x = 100;
    this.maxVel.y = 100;
    this.friction.x = 150;
    this.friction.y = 0;
    */
    if (this.options.rank < 3) {
      this.options.frames = [ 'blue_bug_1.png', 'blue_bug_0.png' ];
      this.value=100;
    }
    else
    if (this.options.rank < 5) {
      this.options.frames = [ 'green_bug_1.png', 'green_bug_0.png' ];
      this.value= 50;
    }
    else {
      this.options.frames = [ 'purple_bug_0.png', 'purple_bug_1.png' ];
      this.value= 30;
    }
  }

});




}).call(this);

