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
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/supervisor
 */
define("zotohlab/p/s/supervisor",

       ['zotohlab/p/s/priorities',
        "zotohlab/p/s/utils",
        "zotohlab/p/gnodes",
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/supervisor */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class GameSupervisor
     */
    GameSupervisor = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state = options;
        this.inited=false;
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.arena=null;
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        engine.addEntity(sh.factory.createArena(sh.main, this.state));
        this.arena= engine.getNodeList(gnodes.ArenaNode);
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method update
       * @param {Number} dt
       */
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

      /**
       * @private
       */
      onceOnly: function(node) {
        var cw = ccsx.center(),
        wb= ccsx.vbox(),
        wz= ccsx.vrect(),
        fz= ccsx.createSpriteFrame('gray.png').getContentSize(),
        bz= ccsx.createSpriteFrame('0.png').getContentSize(),
        lf_boundary= cw.x - csts.FIELD_W * bz.width - fz.width,
        hfzh= fz.height * 0.5,
        hfzw= fz.width * 0.5;

        // attempt to draw the walls
        this.xh(fz, lf_boundary, cw.x, wb.bottom + hfzh);
        this.xv(fz, lf_boundary);
        this.xv(fz, cw.x);
        //this.xh(fz, cw.x + fz.width, wb.right + fz.width, cw.y);

        this.onceOnly_2(node, fz, bz, {
          left: lf_boundary + hfzw,
          right:  cw.x - hfzw,
          top:  wb.top,
          bottom: wb.bottom + fz.height
        });

        this.doCtrl(node);
      },

      /**
       * @private
       */
      doCtrl: function(node) {
        var hsps= node.cpad.hotspots,
        cw = ccsx.center(),
        wb= ccsx.vbox(),
        wz= ccsx.vrect(),
        //sp= ccsx.createSpriteFrame('shadedLight09.png'),
        sp= ccsx.createSpriteFrame('shadedDark09.png'),
        cz= sp.getContentSize(),
        cbx,
        ch3= cz.height / 3,
        cw3= cz.width / 3,
        //x= cw.x + (wb.right - cw.x) * 0.5,
        x= wb.right * 0.75,
        y= wb.top * 0.25;

        sp.setPosition(x,y);
        sh.main.addAtlasItem('game-pics', sp);

        cbx= ccsx.bbox4(sp);

        //calc hotspots for touch & mouse
        hsps.rr= { left: cbx.left + cw3,
              top: cbx.top,
              right: cbx.right - cw3,
              bottom: cbx.top - ch3 };

        hsps.rl= { left: cbx.left + cw3,
              top: cbx.top- 2* ch3,
              right: cbx.right - cw3,
              bottom: cbx.bottom };

        hsps.sl= { left: cbx.left,
              top: cbx.top - ch3,
              right: cbx.left + cw3,
              bottom: cbx.top - 2 * ch3 };

        hsps.sr= { left: cbx.left + 2 * cw3,
              top: cbx.top - ch3,
              right: cbx.right,
              bottom: cbx.top - 2 * ch3 };

        hsps.cd= { left: cbx.left + cw3,
              top: cbx.top - ch3,
              right: cbx.right - cw3,
              bottom: cbx.top - 2 * ch3 };
      },

      /**
       * Draw horizontal wall.
       *
       * @private
       */
      xh: function(fz, lf_bdy, rt_bdy, ypos) {
        var cw = ccsx.center(),
        wb= ccsx.vbox(),
        wz= ccsx.vrect(),
        hfzw = fz.width * 0.5,
        f, x, y;

        y = ypos;//wb.bottom + fz.height * 0.5;
        x = lf_bdy;
        while (x < rt_bdy){ //}cw.x) {
          f=ccsx.createSpriteFrame('gray.png');
          f.setPosition(x, y);
          sh.main.addAtlasItem('game-pics',f);
          x += fz.width;
        }
      },

      /**
       * Draw vertical wall.
       *
       * @private
       */
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

      /**
       * @private
       */
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

      /**
       * @private
       */
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

      /**
       * Create our own collision map using cells.
       * @private
       */
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

    /**
     * @property {Number} Priority
     */
    GameSupervisor.Priority= pss.PreUpdate;

    exports= GameSupervisor;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

