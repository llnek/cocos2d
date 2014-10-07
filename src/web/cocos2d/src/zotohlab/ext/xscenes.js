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
function moduleFactory(sjs, EventBus, sh, xlayers) {
var R = sjs.ramda,
undef;

//////////////////////////////////////////////////////////////////////////////
//
var XScene = cc.Scene.extend({

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
    rc = R.some(function(proto) {
      obj= new (proto)(this.options);
      obj.setParent(this);
      if ( obj instanceof xlayers.XGameLayer ) {
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
    }.bind(this), a);

    if (a.length > 0 && rc===false ) {
      return !!glptr ? glptr.init() : true;
    } else {
      return false;
    }
  },

  ctor: function(ls, options) {
    this.options = options || {};
    this.lays= ls || [];
    this.layers= {};
    this.ebus= new EventBus();
    this._super();
  }


});

//////////////////////////////////////////////////////////////////////////////
//
var XSceneFactory = sjs.Class.xtends({

  create: function(options) {
    var itemKey= 'layers',
    arr= this.layers,
    cfg;
    if (options && sjs.hasKey(options, itemKey ) &&
        sjs.isArray(options.layers)) {
      arr= options.layers;
      cfg= R.omit(itemKey, options);
    } else {
      cfg= options || {};
    }
    var scene = new XScene(arr, cfg);
    return scene.init() ? scene : null;
  },

  ctor: function(ls) {
    this.layers= ls || [];
  }

});



return {
  XSceneFactory: XSceneFactory,
  XScene: XScene
};



}


//////////////////////////////////////////////////////////////////////////////
// export
if (typeof module !== 'undefined' && module.exports) {}
else
if (typeof gDefine === 'function' && gDefine.amd) {

  gDefine("zotohlab/asx/xscenes",
          ['cherimoia/skarojs',
           'cherimoia/ebus',
           'zotohlab/asterix',
           'zotohlab/asx/xlayers'],
          moduleFactory);

} else {
}

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

