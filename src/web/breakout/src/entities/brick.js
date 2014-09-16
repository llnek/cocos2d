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

(function(undef) { "use strict"; var global = this, _ = global._  ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
bko= asterix.BreakOut,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Candy = cc.Sprite.extend({

  ctor: function(x,y,options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    this.setPosition(x,y);
  }

});


bko.EntityBrick = asterix.XEntity.xtends({

  create: function() {
    return this.sprite = new Candy(this.startPos.x, this.startPos.y, this.options);
  },

  injured: function(num, from) {
    var pos = this.sprite.getPosition();
    this.sprite.setVisible(false);
    this.status=false;
    sh.fireEvent('/game/objects/bricks/killed', {
      x: pos.x, y: pos.y
    });
    sh.fireEvent('/game/objects/players/earnscore', {
      value: this.value
    });
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.status=true;
    this.value= 10;
    this.fixed=true;
    this.options.frames= [ options.color + '.png' ];
  }


});




}).call(this);


//////////////////////////////////////////////////////////////////////////////
//EOF

