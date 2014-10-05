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

function moduleFactory(sjs, EventBus, asterix, xlayers, undef) { "use stricts";

var R = sjs.ramda,
sh= asterix;


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
(function () { "use strict"; var global=this, gDefine=global.define;


  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("cherimoia/zotohlab/asterix/xscenes",
            ['cherimoia/skarojs',
             'cherimoia/ebus',
             'cherimoia/zotohlab/asterix',
             'cherimoia/zotohlab/asterix/xlayers'],
            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {

    module.exports = moduleFactory(require('cherimoia/skarojs'),
                                   require('cherimoia/ebus'),
                                   require('cherimoia/zotohlab/asterix')
                                   require('cherimoia/zotohlab/asterix/xlayers'));
  } else {

    global['cherimoia']['zotohlab']['asterix']['xscene'] =
      moduleFactory(global.cherimoia.skarojs,
                    global.cherimoia.ebus,
                    global.cherimoia.zotohlab.asterix,
                    global.cherimoia.zotohlab.asterix.xlayers);
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF


