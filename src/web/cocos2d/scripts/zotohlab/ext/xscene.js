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
klass= global.ZotohLab.klass,
echt= global.ZotohLab.echt,
loggr= global.ZotohLab.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XScene = cc.Scene.extend({

  ebus: new global.ZotohLab.EventBus(),
  layers: {},

  init: function() {
    if ( this._super()) {
      return this.createLayers();
    } else {
      return false;
    }
  },

  createLayers: function() {
    var a = this.options.layers || [],
    glptr = undef,
    ok,
    rc,
    obj;
    // look for failures, hold off init'ing game layer, leave that as last
    rc = _.some(a, function(proto) {
      obj= new (proto)(this.options);
      if ( obj instanceof asterix.XGameLayer ) {
        glptr = obj;
        ok=true
      } else {
        ok= obj.init();
      }
      if (! ok) { return true; } else {
        this.layers[ obj.rtti() ] = obj;
        this.addChild(obj);
        return false;
      }
    }, this);
    if (a.length > 0 && rc===false ) {
      return echt(glptr) ? glptr.init() : true;
    } else {
      return false;
    }
  },

  ctor: function(options) {
    this.options = options || {};
    this._super();
  }

});

asterix.XSceneFactory = klass.extends({

  create: function(options) {
    if (_.isObject(options)) {
      this.options = klass.merge(this.options, options );
    }
    var scene = new asterix.XScene(this.options);
    return scene.init() ? scene : null;
  },

  ctor: function(options) {
    this.options= options || {};
  }

});



}).call(this);

