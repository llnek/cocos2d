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

define("zotohlab/p/s/supervisor", ["zotohlab/p/s/utils",
                                  "zotohlab/p/gnodes",
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    GameSupervisor = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state = options;
        this.inited=false;
      },

      removeFromEngine: function(engine) {
        this.arena=null;
      },

      addToEngine: function(engine) {
        engine.addEntity(sh.factory.createArena(sh.main, this.state));
        this.arena= engine.getNodeList(gnodes.ArenaNode);
      },

      update: function (dt) {
        var node = this.arena.head;
        if (this.state.running &&
            !!node) {
          if (! this.inited) {
            this.onceOnly(node);
            this.inited=true;
          }
        }
      },

      onceOnly: function (node) {
        var tiles= this.fakeTileMap();

        node.blocks.grid = this.initBlockMap(tiles);
        node.collision.tiles = tiles;

        sjs.loggr.info("collision tiles and blocks init'ed.");
      },

      initBlockMap: function(tiles) {
        var grid=[],
        rc,
        r;

        for (r= 0; r < tiles.length; ++r) {
          rc= sjs.makeArray(tiles[r].length, undef);
          grid.push(rc);
        }

        return grid;
      },

      //create our own collision map using cells
      fakeTileMap: function() {
        var hlen = csts.GRID_H,
        wlen = csts.GRID_W,
        map=[],
        r,
        rc;

        for (r = 0; r < hlen; ++r) {
          if (r === 0 || r === hlen-1) {
            rc = sjs.makeArray(wlen, 1);
          } else {
            rc = sjs.makeArray(wlen, 0);
            rc[0] = 1;
            rc[csts.FIELD_W + 1] = 1;
          }
          map[r] = rc;
        }
        return map;
      }

    });


    return GameSupervisor;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

