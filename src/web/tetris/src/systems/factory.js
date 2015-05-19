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
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/s/utils
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/factory
 */
define("zotohlab/p/s/factory",

       ['zotohlab/p/elements',
        'zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, utils, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/factory */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class EntityFactory
     */
    EntityFactory = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method constructor
       * @param {Ash.Engine} engine
       */
      constructor: function(engine) {
        this.engine=engine;
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createArena
       * @param {cc.Layer} layer
       * @param {Object} options
       * @return {Ash.Entity}
       */
      createArena: function(layer, options) {
        var ent = sh.Ashley.newEntity();
        ent.add(new cobjs.FilledLines());
        ent.add(new cobjs.ShapeShell());
        ent.add(new cobjs.BlockGrid());
        ent.add(new cobjs.TileGrid());
        ent.add(new cobjs.Motion());
        ent.add(new cobjs.Dropper());
        ent.add(new cobjs.Pauser());
        ent.add(new cobjs.GridBox());
        ent.add(new cobjs.CtrlPad());
        return ent;
      }

    });

    exports= EntityFactory;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

