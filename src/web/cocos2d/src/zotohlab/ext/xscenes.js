// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires cherimoia/skarojs
 * @requires cherimoia/ebus
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/xlayers
 * @module zotohlab/asx/xscenes
 */
define("zotohlab/asx/xscenes",

       ['cherimoia/skarojs',
        'cherimoia/ebus',
        'zotohlab/asterix',
        'zotohlab/asx/xlayers'],

  function (sjs, ebus, sh, xlayers) { "use strict";

    /** @alias module:zotohlab/asx/xscenes */
    var exports = {},
    R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends cc.Scene
     * @class XScene
     */
    var XScene = cc.Scene.extend({

      /**
       * @memberof module:zotohlab/asx/xscenes~XScene
       * @method getLayers
       * @return {Array}
       */
      getLayers: function() {
        return this.layers;
      },

      /**
       * @memberof module:zotohlab/asx/xscenes~XScene
       * @method init
       */
      init: function() {
        this._super();
        this.createLayers();
        return true;
      },

      /**
       * @memberof module:zotohlab/asx/xscenes~XScene
       * @method createLayers
       */
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

      /**
       * @memberof module:zotohlab/asx/xscenes~XScene
       * @method onmsg
       * @chainable
       * @param {String} topic
       * @param {Function} cb
       * @return {cc.Scene}
       */
      onmsg: function(topic, cb) {
        this.ebus.on(topic, cb);
        return this;
      },

      /**
       * @memberof module:zotohlab/asx/xscenes~XScene
       * @method ctor
       * @param {Array} ls - list of layers
       * @param {Object} options
       */
      ctor: function(ls, options) {
        this.options = options || {};
        this._super();
        this.lays= ls || [];
        this.layers= {};
        this.ebus= ebus.reify();
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class XSceneFactory
     */
    var XSceneFactory = sjs.mixes({

      /**
       * @memberof module:zotohlab/asx/xscenes~XSceneFactory
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify: function(options) {
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

      /**
       * @memberof module:zotohlab/asx/xscenes~XSceneFactory
       * @method ctor
       * @param {Array} list of layers
       */
      ctor: function(ls) {
        this.layers= ls || [];
      }

    });

    exports = {
      /**
       * @property {XSceneFactory.Class} XSceneFactory
       * @static
       */
      XSceneFactory: XSceneFactory,
      /**
       * @property {XScene.Class} XScene
       * @static
       */
      XScene: XScene
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

