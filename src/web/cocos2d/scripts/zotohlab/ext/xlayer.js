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

(function(undef) { "use stricts"; var global = this, _ = global._ ,
asterix= global.ZotohLab.Asterix,
sh = asterix.Shell,
loggr= global.ZotohLab.logger;

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
    if (_.has(sys.capabilities, 'keyboard')) {
      this.setKeyboardEnabled(true);
    }
    if (_.has(sys.capabilities, 'mouse')) {
      this.setMouseEnabled(true);
    }
    if (_.has(sys.capabilities, 'touches')) {
      this.setTouchEnabled(true);
      this.setTouchMode(cc.TOUCH_ONE_BY_ONE);
    }
  },

  rtti: function() {
    return "";
  },

  getNode: function() {
    return this;
  },

  removeItem: function(n,c) {
    this.getNode().removeChild(n,c || true);
  },

  addItem: function(n) {
    this.getNode().addChild(n, this.lastZix, ++this.lastTag);
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


