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

(function (undef) { "use strict"; var global= this, _ = global._  ,
asterix= global.ZotohLabs.Asterix,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks,
sh= asterix.Shell,
echt= global.ZotohLabs.echt,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Block = cc.Sprite.extend({
  blink: function() {
    this.initWithSpriteFrameName(this.options.frames[1]);
  },
  show: function() {
    this.initWithSpriteFrameName(this.options.frames[0]);
  },
  ctor: function(x,y,options) {
    this.options = options;
    this._super();
    this.show();
    this.setAnchorPoint(ccsx.AnchorTopLeft);
    this.setPosition(x,y);
  }
});

asterix.Bricks.EntityBlock= asterix.XEntity.extends({

  blink: function() {
    if (this.sprite) {
      this.sprite.blink();
    }
  },

  create: function() {
    return this.sprite = new Block(this.startPos.x, this.startPos.y, this.options);
  },

  ctor: function(x,y,options) {
    this._super(x,y,options);
    this.options.frames= [ options.frame,'0.png']
  }


});


}).call(this);


