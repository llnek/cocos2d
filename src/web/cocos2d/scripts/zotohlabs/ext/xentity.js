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

  resurrectSprite: function() {
    if (this.sprite) {
      this.sprite.setPosition(this.options._startPos.x, this.options._startPos.y);
      this.sprite.setVisible(true);
    }
  },

  resurrect: function(x,y,options) {
    if (options) { this.options = options; }
    this.options._startPos = cc.p(x,y);
    this.resurrectSprite();
  },

  hibernate: function() {
    if (this.sprite) {
      this.sprite.setVisible(false);
      this.sprite.setPosition(0,0);
    }
  },

  sprite: null,

  friction: { x: 0, y: 0 },
  maxVel: { x: 0, y: 0 },
  vel: { x: 0, y: 0 },

  kill: function() {
    if (this.sprite) {
      sh.main.removeChild(this.sprite,true);
    }
    this.sprite=null;
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
Object.defineProperty(asterix.XEntity.prototype, "OID", {
  get: function() {
    return this.sprite ? this.sprite.getTag() : -1;
  }
});



asterix.XEntityPool = global.ZotohLabs.klass.extends({

  checkEntity: function(ent) {
    return this.entType ? ent instanceof this.entType : false;
  },

  drainPool: function() {
    this.pool = [];
  },

  get: function() {
    var rc= null;
    if (this.curSize > 0) {
      rc = this.pool.pop();
      --this.curSize;
      loggr.debug('getting object from pool: ' + rc.OID);
    }
    return rc;
  },

  add: function(ent) {
    if (this.checkEntity(ent) && this.curSize < this.maxSize) {
      loggr.debug('putting object into pool: ' + ent.OID);
      this.pool.push(ent);
      ent.sprite.setVisible(false);
      ent.sprite.setPosition(0,0);
      ++this.curSize;
    } else {
      return false;
    }
  },

  maxSize: 1000,
  curSize: 0,

  pool: [],

  ctor: function(options) {
    options = options || {};
    this.maxSize = options.maxSize || 1000;
    this.entType= options.entityProto;
  }

});


}).call(this);


