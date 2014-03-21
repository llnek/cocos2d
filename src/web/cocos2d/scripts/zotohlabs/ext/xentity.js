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

(function(undef){ "use strict"; var global= this; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var ccsx = asterix.COCOS2DX;
var sh= asterix.Shell;
var loggr = global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XEntity = global.ZotohLabs.klass.extends({

  update: function(dt) {
    if (sys.platform === 'browser') {
      this.keypressed(dt);
    }
  },

  keypressed: function(dt) {},

  sprite: null,

  kill: function() {
    var s= this.sprite;
    this.sprite=null;
    return s;
  },

  create: function() {
    return this.sprite;
  },

  ctor: function(x,y,options) {
    this.options= options || {};
    this.options._startPos = cc.p(x,y);
  }

});

Object.defineProperty(asterix.XEntity.prototype, "height", {
  get: function() {
    return this.sprite ? this.sprite.getContentSize().height : undef;
  }
});
Object.defineProperty(asterix.XEntity.prototype, "width", {
  get: function() {
    return this.sprite ? this.sprite.getContentSize().width : undef;
  }
});

}).call(this);


