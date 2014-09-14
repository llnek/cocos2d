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
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XScene = cc.Scene.extend({

  //ebus: global.ZotohLab.MakeEventBus(),
  //layers: {},
  //lays: [],
  //options : {},

  getLayers: function() {
    return this.layers;
  },

  init: function() {
    return this._super() ? this.createLayers() : false;
  },

  createLayers: function() {
    var a = this.lays || [],
    glptr = undef,
    ok,
    rc,
    obj;
    // look for failures, hold off init'ing game layer, leave that as last
    rc = _.some(a, function(proto) {
      obj= new (proto)(this.options);
      obj.setParent(this);
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
      return sjs.echt(glptr) ? glptr.init() : true;
    } else {
      return false;
    }
  },

  ctor: function(ls, options) {
    this.ebus= global.ZotohLab.MakeEventBus();
    this.options = options || {};
    this.lays= ls || [];
    this.layers= {};
    this._super();
  }


});

asterix.XSceneFactory = sjs.Class.xtends({

  create: function(options) {
    var arr= this.layers,
    cfg;
    if (options && _.has(options,'layers') &&
        _.isArray(options.layers)) {
      arr= options.layers;
      cfg= _.omit(options, 'layers');
    } else {
      cfg= options || {};
    }
    var scene = new asterix.XScene(arr, cfg);
    return scene.init() ? scene : null;
  },

  ctor: function(ls) {
    this.layers= ls || [];
  }

});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

