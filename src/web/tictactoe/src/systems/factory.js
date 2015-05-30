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
 * @requires zotohlab/p/c/board
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/asterix
 *
 * @module zotohlab/p/s/factory
 */
define("zotohlab/p/s/factory",

       ['zotohlab/p/elements',
        'zotohlab/p/c/board',
        'zotohlab/p/gnodes',
        'zotohlab/asterix'],

  function (cobjs, GameBoard, gnodes, sh) { "use strict";

    /** @alias module:zotohlab/p/s/factory */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////////
    // returns array of winning combinations.
    mapGoalSpace = (size) => {
      const ROWSPACE = [],
      COLSPACE = [],
      dx = [],
      dy = [];
      let h, v;

      for (let r=0; r < size; ++r) {
        h = [];
        v = [];
        for (let c=0; c < size; ++c) {
          h.push(r * size + c);
          v.push(c * size + r);
        }
        ROWSPACE.push(h);
        COLSPACE.push(v);
        dx.push(r * size + r);
        dy.push((size - r - 1) * size + r);
      }
      //var DAGSPACE = [dx, dy];
      return [dx, dy].concat(ROWSPACE, COLSPACE);
    },
    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class EntityFactory
     */
    EntityFactory = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method constructor
       * @param {Ash.Engine} engine
       */
      constructor(engine) {
        this.engine=engine;
      },
      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method reifyBoard
       * @param {cc.Layer} layer
       * @param {Object} options
       * @return {Ash.Entity}
       */
      reifyBoard(layer, options) {
        const goals= mapGoalSpace(options.size),
        bd= new GameBoard(options.size,
                          csts.CV_Z,
                          csts.CV_X,
                          csts.CV_O, goals),
        ent = sh.Ashley.newEntity();

        ent.add(new cobjs.Grid(options.size, options.seed));
        ent.add(new cobjs.Board(options.size, goals));
        ent.add(new cobjs.UISelection());
        ent.add(new cobjs.SmartAlgo(bd));
        ent.add(new cobjs.NetPlay());
        ent.add(new cobjs.GridView(options.size, layer));

        options.GOALSPACE=goals;
        return ent;
      }

    });

    exports= EntityFactory;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

