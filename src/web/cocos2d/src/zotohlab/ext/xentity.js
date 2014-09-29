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

(function(undef){ "use strict"; var global= this,  _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx = asterix.COCOS2DX,
GID_SEED = 0;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XEntity = sjs.Class.xtends({

  //entity will wrap around the other side of the bounding enclosure,
  //like in asteriods.
  wrapEnclosure: function() {
    var B = sh.main.getEnclosureRect(), //see if this works ? 9/13/14
    sz = this.sprite.getContentSize(),
    pos = this.sprite.getPosition(),
    wz = ccsx.screen(),
    /*
    B = { left: 0,
          bottom: 0,
          right: wz.width-1,
          top: wz.height-1 },
          */
    csts = sh.xcfg.csts,
    hh = sz.height * 0.5,
    hw = sz.width * 0.5,
    x = pos.x,
    y = pos.y,
    bx= ccsx.bbox4(this.sprite);


    //PITCH
    if (bx.bottom >= B.top) {
      //y = 0 - hh;
      //y = hh + csts.TILE;
      if (this.vel.y > 0) {
        //wrap
        y = B.bottom - hh;
      }
    }
    else
    if (bx.top <= B.bottom) {
      //y = B.top + hh;
      //y = B.top - hh - csts.TILE;
      if (this.vel.y < 0) {
        //wrap
        y = B.top + hh;
      }
    }

    //YAW
    if (bx.right <= B.left) {
      //x = B.right + hw;
      //x = B.right - hw - csts.TILE;
      if (this.vel.x < 0) {
        x = B.right + hw;
      }
    }
    else
    if (bx.left >= B.right) {
      //x = B.left - hw;
      //x = B.left + hw + csts.TILE;
      if (this.vel.x > 0) {
        x = B.left - hw;
      }
    }

    this.lastPos= this.sprite.getPosition();
    this.sprite.setPosition(x,y);
  },

  update: function(dt) {
    if (cc.sys.capabilities["keyboard"]) {
      this.keypressed(dt);
    }
  },

  updatePosition: function(x,y) {
    var box = sh.main.getEnclosureRect(),
    sz = this.sprite.getContentSize(),
    hh= sz.height * 0.5,
    hw= sz.width * 0.5,
    pos,
    x, y, b2;

    this.lastPos= this.sprite.getPosition();
    this.sprite.setPosition(x,y);

    pos = this.sprite.getPosition();
    b2= ccsx.bbox4(this.sprite);
    x= pos.x;
    y= pos.y;

    //clamp down the entity to be inside the enclosure

    //YAW
    if (b2.right > box.right) {
      x= box.right - hw;
    }
    else
    if (b2.left < box.left) {
      x = box.left + hw;
    }

    //PITCH
    if (b2.bottom < box.bottom) {
      y = box.bottom + hh;
    }
    else
    if (b2.top > box.top) {
      y = box.top - hh;
    }

    this.sprite.setPosition(x,y);
  },

  injured: function(damage,from) {
  },

  keypressed: function(dt) {
  },

  reviveSprite: function() {
    if (this.sprite) {
      this.sprite.setPosition(this.startPos.x, this.startPos.y);
      this.sprite.setVisible(true);
    }
  },

  revive: function(x,y,options) {
    if (_.isObject(options)) { sjs.merge(this.options, options); }
    this.startPos = cc.p(x,y);
    this.reviveSprite();
  },

  hibernate: function() {
    if (this.sprite) {
      this.sprite.setVisible(false);
      this.sprite.setPosition(0,0);
    }
  },

  //tests if entity is hitting boundaries.
  traceEnclosure: function(dt) {
    var sz= this.sprite.getContentSize().height * 0.5,
    sw= this.sprite.getContentSize().width * 0.5,
    pos = this.sprite.getPosition(),
    bbox = sh.main.getEnclosureRect(),
    y = pos.y + dt * this.vel.y,
    x = pos.x + dt * this.vel.x,
    csts = sh.xcfg.csts,
    hit=false,
    wz = ccsx.screen();

    if (this.fixed) { return false; }

    if (y + sz > bbox.top) {
      //hitting top wall
      this.vel.y = - this.vel.y
      y = bbox.top - sz;
      hit=true;
    }
    else
    if (y - sz < bbox.bottom) {
      //hitting bottom wall
      this.vel.y = - this.vel.y
      y = bbox.bottom + sz;
      hit=true;
    }

    if (x + sw > bbox.right) {
      //hitting right wall
      this.vel.x = - this.vel.x;
      x = bbox.right - sw;
      hit=true;
    }
    else
    if (x - sw < bbox.left) {
      //hitting left wall
      this.vel.x = - this.vel.x;
      x = bbox.left + sw;
      hit=true;
    }

    //this.lastPos = this.sprite.getPosition();
    //no need to update the last pos
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

  dispose: function() {
    if (this.sprite) {
      this.sprite.getParent().removeChild(this.sprite,true);
      this.sprite=null;
    }
  },

  create: function() {
    sjs.tne("missing implementation.");
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
  get: function() { return this.guid; }
});
Object.defineProperty(asterix.XEntity.prototype, "height", {
  get: function() {
    if (this.sprite) { return this.sprite.getContentSize().height; }
  }
});
Object.defineProperty(asterix.XEntity.prototype, "width", {
  get: function() {
    if (this.sprite) { return this.sprite.getContentSize().width; }
  }
});
Object.defineProperty(asterix.XEntity.prototype, "OID", {
  get: function() {
    if (this.sprite) { return this.sprite.getTag(); }
  }
});


asterix.XEntityPool = sjs.Class.xtends({

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
      sjs.loggr.debug('getting object "' + rc.rtti() + '" from pool: oid = ' + rc.pid() );
    }
    return rc;
  },

  add: function(ent) {
    if (this.checkEntity(ent) && this.curSize < this.maxSize) {
      sjs.loggr.debug('putting object "' + ent.rtti() + '" into pool: oid = ' + ent.pid() );
      this.pool.push(ent);
      ent.hibernate();
      ++this.curSize;
      return true;
    } else {
      return false;
    }
  },


  ctor: function(options) {
    this.options = options || {};
    this.maxSize = this.options.maxSize || 1000;
    this.entType = this.options.entityProto;
    this.maxSize= 1000;
    this.curSize= 0;
    this.pool= [];
  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

