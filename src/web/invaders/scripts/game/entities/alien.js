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
var ivs= asterix.Invaders;
var sh= asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

var Alien = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this.options= options;
    this._super();
    this.initWithSpriteFrameName(this.options.frames[0]);
    //this.setZOrder(this.options.zIndex);
    //this.setTag(this.options.tag);
    this.setPosition(x,y);

    var frame0 = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.options.frames[0]);
    var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.options.frames[1]);
    var animFrames = [];
    animFrames.push(frame0);
    animFrames.push(frame1);
    var animation = cc.Animation.create(animFrames, this.options.frameTime);
    var animate = cc.Animate.create(animation);
    this.runAction(cc.RepeatForever.create(animate));
  }

});

asterix.Invaders.EntityAlien = asterix.XEntity.extends({

  bombCount: 0,

  loadBomb: function() {
    this.bombCount = 1;
  },

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
      if ( ! sh.main.reviveBomb(pos.x, pos.y - 4)) {
        sh.main.addBomb(pos.x, pos.y - 4);
      }
      this.bombCount = 0;
    }
  },

  check: function(other) {
    if (echt(other)) {
      other.receiveDamage(10, this);
    }
  },

  receiveDamage: function(num, from) {
    //ig.game.spawnEntity(iv.EntityExplode, this.pos.x, this.pos.y);
    //sh.pools['bombs'].add(this);
    //ig.game.onAlienKilled();
    this.sprite.setVisible(false);
    this.status= false;
  },

  create: function() {
    var pos= this.options._startPos;
    this.sprite = new Alien(pos.x, pos.y, this.options);
    return this.sprite;
  },

  friction: {},
  maxVel: {},

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.maxVel.x = 100;
    this.maxVel.y = 100;
    this.friction.x = 150;
    this.friction.y = 0;
    if (this.options.rank < 3) {
      this.options.frames = [ 'blue_bug_1.png', 'blue_bug_0.png' ];
      this.score=100;
    }
    else
    if (this.options.rank < 5) {
      this.options.frames = [ 'green_bug_1.png', 'green_bug_0.png' ];
      this.score= 50;
    }
    else {
      this.options.frames = [ 'purple_bug_0.png', 'purple_bug_1.png' ];
      this.score= 30;
    }
  }



});




}).call(this);


