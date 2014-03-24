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

var Boom = cc.Sprite.extend({

  ctor: function(entity,x,y,options) {
    this.options = options || {};
    this.entity=entity;
    this._super();
    this.initWithSpriteFrameName(this.options.frames[0]);
    //this.setZOrder(this.options.zIndex);
    //this.setTag(this.options.tag);
    this.setPosition(x,y);

    var frame0 = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.options.frames[0]);
    var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.options.frames[1]);
    var frame2 = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.options.frames[2]);
    var frame3 = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.options.frames[3]);
    var animFrames = [];
    animFrames.push(frame0);
    animFrames.push(frame1);
    animFrames.push(frame2);
    animFrames.push(frame3);
    var animation = cc.Animation.create(animFrames, this.options.frameTime);
    //this.runAction( cc.Sequence.create(cc.Animate.create(animation)));
    this.runAction( cc.Sequence.create(cc.Animate.create(animation),
      cc.CallFunc.create(function() {
        this.entity.kill();
      }, this)
    ));
  }

});

asterix.Invaders.EntityExplode = asterix.XEntity.extends({

  update: function(dt) {
  },

  kill: function() {
    sh.main.killExplosion(this);
  },

  create: function() {
    var pos = this.options._startPos;
    this.sprite = new Boom(this,pos.x, pos.y, this.options);
    return this.sprite;
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.options.frames= ['boom_0.png','boom_1.png','boom_2.png','boom_3.png'];
  }

});







}).call(this);


