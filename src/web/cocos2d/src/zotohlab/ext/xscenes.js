// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/asx/xscenes", ['cherimoia/skarojs',
                               'cherimoia/ebus',
                               'zotohlab/asterix',
                               'zotohlab/asx/xlayers'],
  function (sjs, EventBus, sh, xlayers) { "use strict";

    var R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    var XScene = cc.Scene.extend({

      //ebus: global.ZotohLab.MakeEventBus(),
      //layers: {},
      //lays: [],
      //options : {},

      getLayers: function() {
        return this.layers;
      },

      init: function() {
        this._super();
        this.createLayers();
        return true;
      },

      createLayers: function() {
        var a = this.lays || [],
        glptr = undef,
        rc,
        obj;
        //hold off init'ing game layer, leave that as last
        rc = R.any(function(proto) {
          obj= new (proto)(this.options);
          if ( obj instanceof xlayers.XGameLayer ) {
            glptr = obj;
          }
          else
          if (obj instanceof xlayers.XLayer) {
            obj.init();
          }

          if (obj instanceof xlayers.XLayer) {
            obj.setParentScene(this);
          }

          this.layers[ obj.rtti() ] = obj;
          this.addChild(obj);
          return false;
        }.bind(this), a);

        if (a.length > 0 && rc===false ) {
          if (!!glptr) {
            glptr.init();
          }
        }
      },

      ctor: function(ls, options) {
        this.options = options || {};
        this._super();
        this.lays= ls || [];
        this.layers= {};
        this.ebus= new EventBus();
      }

    });

    //////////////////////////////////////////////////////////////////////////////
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
        scene.init()
        return scene;
      },

      ctor: function(ls) {
        this.layers= ls || [];
      }

    });

    return {
      XSceneFactory: XSceneFactory,
      XScene: XScene
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

