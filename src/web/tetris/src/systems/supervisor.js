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

define("zotohlab/p/s/supervisor",

       ['zotohlab/p/s/priorities',
         "zotohlab/p/s/utils",
        "zotohlab/p/gnodes",
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

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

      onceOnly: function(node) {
        var cw = ccsx.center(),
        wb= ccsx.vbox(),
        wz= ccsx.vrect(),
        fz= ccsx.createSpriteFrame('gray.png').getContentSize(),
        bz= ccsx.createSpriteFrame('0.png').getContentSize(),
        lf_boundary= cw.x - csts.FIELD_W * bz.width - fz.width,
        hfzh= fz.height * 0.5,
        hfzw= fz.width * 0.5;

        this.xh(fz, lf_boundary);
        this.xv(fz, lf_boundary);
        this.xv(fz, cw.x);

        this.onceOnly_2(node, fz, bz, {
          left: lf_boundary + hfzw,
          right:  cw.x - hfzw,
          top:  wb.top,
          bottom: wb.bottom + fz.height
        });
      },

      xh: function(fz, lf_bdy) {
        var cw = ccsx.center(),
        wb= ccsx.vbox(),
        wz= ccsx.vrect(),
        hfzw = fz.width * 0.5,
        f, x, y;

        y = wb.bottom + fz.height * 0.5;
        x = lf_bdy;
        while (x < cw.x) {
          f=ccsx.createSpriteFrame('gray.png');
          f.setPosition(x, y);
          sh.main.addAtlasItem('game-pics',f);
          x += fz.width;
        }
      },

      xv: function(fz, x) {
        var cw = ccsx.center(),
        wb= ccsx.vbox(),
        wz= ccsx.vrect(),
        f, y;

        y= wb.bottom;
        y += fz.height * 0.5;
        while (y < wb.top) {
          f=ccsx.createSpriteFrame('gray.png');
          f.setPosition(x, y);
          sh.main.addAtlasItem('game-pics',f);
          y += fz.height;
        }
      },

      onceOnly_2: function (node, fz, bz, box) {
        var tiles= this.fakeTileMap(bz, box);

        node.blocks.grid = this.initBlockMap(tiles);
        node.collision.tiles = tiles;
        node.gbox.box= box;

        csts.FENCE= fz.width;
        csts.TILE= bz.width;
        csts.CBOX= box;

        sjs.loggr.info("collision tiles and blocks init'ed.");
        sjs.loggr.info("tile size = " + csts.TILE);
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
      fakeTileMap: function(bz, box) {

        var hlen = Math.floor( (box.top - box.bottom) / bz.height),
        wlen = Math.floor((box.right - box.left) / bz.width),
        map=[],
        r,
        rc;

        for (r = 0; r <= hlen; ++r) {
          if (r===0) {
            rc = sjs.makeArray(wlen+2, 1);
          } else {
            rc = sjs.makeArray(wlen+2, 0);
            rc[0]=1;
            rc[rc.length-1]=1;
          }
          map.push(rc);
        }
        return map;
      }

    });

    GameSupervisor.Priority= pss.PreUpdate;
    return GameSupervisor;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

