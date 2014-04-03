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
GID_SEED = 0,
loggr = global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XEntity = klass.extends({

  wrapEnclosure: function() {
    var pos = this.sprite.getPosition(),
    sz = this.sprite.getContentSize(),
    B= sh.main.getEnclosureRect(),
    hh = sz.height / 2,
    hw = sz.width / 2 ,
    x = pos.x,
    y = pos.y,
    bx= ccsx.bbox2(this.sprite);
    if (bx.bottom >= B.top) {
      y = 0 - hh;
    }
    else
    if (bx.top <= B.bottom) {
      y = B.top + hh;
    }
    else
    if (bx.right <= B.left) {
      x = B.right + hw;
    }
    else
    if (bx.left >= B.right) {
      x = B.left - hw;
    }

    if (x !== pos.x || y !== pos.y) {
      this.updatePosition(x,y);
    }
  },

  update: function(dt) {
    if (sys.platform === 'browser') {
      this.keypressed(dt);
    }
  },

  updatePosition: function(x,y) {
    var box = sh.main.getEnclosureRect(),
    sz = this.sprite.getContentSize(),
    hh= sz.height/2,
    hw= sz.width/2,
    pos, x, y, b2;

    this.lastPos= this.sprite.getPosition();
    this.sprite.setPosition(x,y);

    if (this.wrappable) { return; }

    pos = this.sprite.getPosition();
    b2= ccsx.bbox2(this.sprite);
    x= pos.x;
    y= pos.y;

    if (b2.right > box.right) {
      x= box.right - hw;
    }
    else
    if (b2.left < box.left) {
      x = box.left + hw;
    }
    else
    if (b2.top > box.top) {
      y = box.top - hh;
    }
    else
    if (b2.bottom < box.bottom) {
      y = box.bottom + hh;
    }

    if (pos.x !== x || pos.y !== y) {
      this.sprite.setPosition(x,y);
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

  traceEnclosure: function(dt) {
    var sz= this.sprite.getContentSize().height / 2,
    sw= this.sprite.getContentSize().width / 2,
    pos = this.sprite.getPosition(),
    csts = sh.xcfg.csts,
    hit=false,
    wz = ccsx.screen(),
    y = pos.y + dt * this.vel.y,
    x = pos.x + dt * this.vel.x,
    bbox = sh.main.getEnclosureRect();

    if (this.fixed) { return false; }

    // hitting top wall ?
    if (y + sz > bbox.top) {
      this.vel.y = - this.vel.y
      y = bbox.top - sz;
      hit=true;
    }

    // hitting bottom wall ?
    if (y - sz < bbox.bottom) {
      this.vel.y = - this.vel.y
      y = bbox.bottom + sz;
      hit=true;
    }

    if (x + sw > bbox.right) {
      this.vel.x = - this.vel.x;
      x = bbox.right - sw;
      hit=true;
    }

    if (x - sw < bbox.left) {
      this.vel.x = - this.vel.x;
      x = bbox.left + sw;
      hit=true;
    }

    //this.lastPos = this.sprite.getPosition();
    // no need to update the last pos
    if (hit) {
      this.sprite.setPosition(x, y);
    }

    return hit;
  },

  move: function(dt) {
    var pos = this.sprite.getPosition(),
    y = pos.y + dt * this.vel.y,
    x = pos.x + dt * this.vel.x;
    this.updatePosition(x, y);
  },

  rtti: function() {
    return 'no-rtti-defined';
  },

  crap: function(other) {
    var kz= other.sprite.getContentSize(),
    bz = this.sprite.getContentSize(),
    ks= other.sprite,
    bs= this.sprite,
    ka = { L: ccsx.getLeft(ks), T: ccsx.getTop(ks),
           R: ccsx.getRight(ks), B: ccsx.getBottom(ks) },
    ba = { L : ccsx.getLeft(bs), T: ccsx.getTop(bs),
           R: ccsx.getRight(bs), B: ccsx.getBottom(bs) };

    // coming down from top?
    if (ba.T > ka.T &&  ka.T > ba.B) {
      if (!other.fixed) { other.vel.y = - other.vel.y; }
      if (!this.fixed) { this.vel.y = - this.vel.y; }
    }
    else
    // coming from bottom?
    if (ba.T > ka.B &&  ka.B > ba.B) {
      if (!other.fixed) { other.vel.y = - other.vel.y; }
      if (!this.fixed) { this.vel.y = - this.vel.y; }
    }
    else
    // coming from left?
    if (ka.L > ba.L && ba.R > ka.L) {
      if (!other.fixed) { other.vel.x = - other.vel.x; }
      if (!this.fixed) { this.vel.x = - this.vel.x; }
    }
    else
    // coming from right?
    if (ka.R > ba.L && ba.R > ka.R) {
      if (!other.fixed) { other.vel.x = - other.vel.x; }
      if (!this.fixed) { this.vel.x = - this.vel.x; }
    }
    else {
      loggr.error("Failed to determine the collision of these 2 objects.");
    }
  },

  dispose: function() {
    if (this.sprite) {
      this.sprite.getParent().removeChild(this.sprite,true);
      this.sprite=null;
    }
  },

  create: function() {
    throw new Error("missing implementation.");
  },

  ctor: function(x,y,options) {
    this.options= options || {};
    this.startPos = cc.p(x,y);
    this.lastPos= cc.p(x,y);
    this.wrappable=false;
    this.fixed=false;
    this.health= 0;
    this.speed= 0;
    this.bounce=0;
    this.value= 0;
    this.sprite= null;
    this.friction= { x: 0, y: 0 };
    this.accel= { x: 0, y: 0 };
    this.maxVel= { x: 0, y: 0 };
    this.vel= { x: 0, y: 0 };
    this.guid = ++GID_SEED;
    this.status=true;
  }

});

Object.defineProperty(asterix.XEntity.prototype, "gid", {
  get: function() {
    return this.guid;
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

