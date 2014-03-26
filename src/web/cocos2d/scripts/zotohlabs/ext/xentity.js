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

(function(undef){ "use strict"; var global= this,  _ = global._ ,
asterix= global.ZotohLabs.Asterix,
klass= global.ZotohLabs.klass,
ccsx = asterix.COCOS2DX,
sh= asterix.Shell,
loggr = global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XEntity = klass.extends({

  update: function(dt) {
    if (sys.platform === 'browser') {
      this.keypressed(dt);
    }
  },

  keypressed: function(dt) {
  },

  injured: function(damage,from) {
  },

  reviveSprite: function() {
    if (this.sprite) {
      this.sprite.setPosition(this.startPos.x, this.startPos.y);
      this.sprite.setVisible(true);
    }
  },

  revive: function(x,y,options) {
    if (_.isObject(options)) {
      this.options = klass.merge(this.options, options);
    }
    this.startPos = cc.p(x,y);
    this.reviveSprite();
  },

  hibernate: function() {
    if (this.sprite) {
      this.sprite.setVisible(false);
      this.sprite.setPosition(0,0);
    }
  },

  startPos: cc.p(0,0),
  health: 0,
  speed: 0,
  value: 0,
  sprite: null,

  rtti: function() {
    return 'no-rtti-defined';
  },

  friction: { x: 0, y: 0 },
  maxVel: { x: 0, y: 0 },
  vel: { x: 0, y: 0 },

  dispose: function() {
    if (this.sprite) {
      this.sprite.getParent().removeChild(this.sprite,true);
      this.sprite=null;
    }
  },

  create: function() {
    throw new Error("missing implementation.");
    //return this.sprite;
  },

  ctor: function(x,y,options) {
    this.options= options || {};
    this.startPos = cc.p(x,y);
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



asterix.XEntityPool = klass.extends({

  checkEntity: function(ent) {
    if (ent instanceof this.entType) {
      return true;
    }
    throw new Error("Cannot add type : " + ent.rtti() + " into pool.  Wrong type.");
  },

  drain: function() {
    this.curSize = 0;
    this.pool = [];
  },

  get: function() {
    var rc= null;
    if (this.curSize > 0) {
      rc = this.pool.pop();
      --this.curSize;
      loggr.debug('getting object "' + rc.rtti() + '" from pool: oid = ' + rc.OID);
    }
    return rc;
  },

  add: function(ent) {
    if (this.checkEntity(ent) && this.curSize < this.maxSize) {
      loggr.debug('putting object "' + ent.rtti() + '" into pool: oid = ' + ent.OID);
      this.pool.push(ent);
      ent.hibernate();
      ++this.curSize;
      return true;
    } else {
      return false;
    }
  },

  maxSize: 1000,
  curSize: 0,

  pool: [],

  ctor: function(options) {
    this.options = options || {};
    this.maxSize = this.options.maxSize || 1000;
    this.entType = this.options.entityProto;
  }

});


}).call(this);

