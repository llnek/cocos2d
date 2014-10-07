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

(function () { "use strict"; var global=this, gDefine=global.define;
//////////////////////////////////////////////////////////////////////////////
//
function moduleFactory(sjs, sh) {
var GID_SEED = 0,
undef;

//////////////////////////////////////////////////////////////////////////////
//
function _revive(sprite,x,y) {
  if (!!sprite) {
    sprite.setPosition(x,y);
    sprite.setVisible(true);
  }
}
function _hide(sprite) {
  if (!!sprite) {
    sprite.setVisible(false);
    sprite.setPosition(0,0);
  }
}

//////////////////////////////////////////////////////////////////////////////
//
var XEntity = {

  injured: function(damage,from) {
  },

  inflate: function(options) {
  },

  deflate: function() {
    _hide(this.sprite);
  },

  rtti: function() {
    return 'no-rtti-defined';
  },

  dispose: function() {
    if (!!this.sprite) {
      this.sprite.getParent().removeChild(this.sprite,true);
      this.sprite=null;
    }
  },

  height: function() {
    if (!!this.sprite) {
      return this.sprite.getContentSize().height;
    }
  },

  width: function() {
    if (!!this.sprite) {
      return this.sprite.getContentSize().width;
    }
  },

  pid: function() {
    if (!!this.sprite) { return this.sprite.getTag(); }
  },

  ctor: function() {
    this.health= 0;
    this.speed= 0;
    this.value= 0;
    this.sprite= null;
    this.status=true;
  }

};

//////////////////////////////////////////////////////////////////////////////
//
var XEntityPool = sjs.Class.xtends({

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
      ent.deflate();
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


return {
  XEntityPool: XEntityPool,
  XEntity: XEntity
};

}


//////////////////////////////////////////////////////////////////////////////
// export
if (typeof module !== 'undefined' && module.exports) {}
else
if (typeof gDefine === 'function' && gDefine.amd) {

  gDefine("zotohlab/asx/xentity",
          ['cherimoia/skarojs', 'zotohlab/asterix'],
          moduleFactory);

} else {
}

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

