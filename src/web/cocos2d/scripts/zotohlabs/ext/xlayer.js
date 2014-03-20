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

(function(undef) { "use stricts"; var global = this ; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XLayer = cc.Layer.extend({

  lastTag: 0,
  lastZix: 0,

  pkInit: function() {

    if (sys.capabilities.hasOwnProperty('keyboard')) {
      this.setKeyboardEnabled(true);
    }

    if (sys.capabilities.hasOwnProperty('mouse')) {
      this.setMouseEnabled(true);
    }

    if (sys.capabilities.hasOwnProperty('touches')) {
      this.setTouchEnabled(true);
      this.setTouchMode(cc.TOUCH_ONE_BY_ONE);
    }

    return true;
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


