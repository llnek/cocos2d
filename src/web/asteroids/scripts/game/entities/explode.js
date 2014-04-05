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
ast = asterix.Asteroids,
sh = asterix.Shell,
echt= global.ZotohLabs.echt,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Boom = cc.Sprite.extend({

  ctor: function(entity,x,y,options) {
    this.entity=entity;
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);

    this.runAction( cc.ScaleTo.create(options.frameTime, options.frameScale),
      cc.CallFunc.create(function() {
        this.entity.dispose();
      }, this)
    );
  }

});

asterix.Asteroids.EntityExplode = asterix.XEntity.extends({

  update: function(dt) {
  },

  create: function() {
    return this.sprite = new Boom(this, this.startPos.x, this.startPos.y, this.options);
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.options.frameScale= 5;
    this.options.frameTime= 0.5;
    this.options.frames= [ options.png ];
  }

});







}).call(this);


