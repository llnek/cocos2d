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

(function(undef) { "use stricts"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
sjs= global.SkaroJS,
SEED= 0;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XLayer = cc.Layer.extend({

  lastTag: 0,
  lastZix: 0,

  pkInit: function() {
    this.pkInput();
    return true;
  },

  pkInput: function() {
  },

  rtti: function() {
    return "" + Number(SEED++);
  },

  getNode: function() {
    return this;
  },

  removeAllItems: function(c) {
    this.getNode().removeAllChildren(c || true);
  },

  removeItem: function(n,c) {
    this.getNode().removeChild(n,c || true);
  },

  addItem: function(n,zx,tag) {
    var zOrder = sjs.echt(zx) ? zx : this.lastZix,
    p= this.getNode(),
    ptag = tag;

    if (! sjs.echt(ptag)) {
      ptag = ++this.lastTag;
    }

    if (n instanceof cc.Sprite &&
        p instanceof cc.SpriteBatchNode) {
      n.setBatchNode(p);
    }

    p.addChild(n, zOrder, ptag);
  },

  setParent: function(par) {
    this.parScene=par;
  },

  init: function() {
    return this._super() ? this.pkInit() : false;
  },

  ctor: function(options) {
    this.options = options || {};
    this._super();
  }

});


}).call(this);


