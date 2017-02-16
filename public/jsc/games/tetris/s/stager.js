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

"use strict"; /**
              * @requires zotohlab/asx/asterix
              * @requires zotohlab/asx/ccsx
              * @requires s/utils
              * @requires n/gnodes
              * @module s/stager
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class Stager */
Stager = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/stager~Stager
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
    this.inited = false;
  },

  /**
   * @memberof module:s/stager~Stager
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.arena = null;
  },

  /**
   * @memberof module:s/stager~Stager
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    engine.addEntity(_asterix2.default.factory.createArena(_asterix2.default.main, this.state));
    this.arena = engine.getNodeList(_gnodes2.default.ArenaNode);
  },

  /**
   * @memberof module:s/stager~Stager
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.arena.head;
    if (this.state.running && !!node) {
      if (!this.inited) {
        this.onceOnly(node);
        this.inited = true;
      }
    }
  },

  /**
   * @method onceOnly
   * @private
   */
  onceOnly: function onceOnly(node) {
    var cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox(),
        wz = _ccsx2.default.vrect(),
        fz = _ccsx2.default.csize('gray.png'),
        bz = _ccsx2.default.csize('0.png'),
        lf_boundary = cw.x - csts.FIELD_W * bz.width - fz.width,
        hfzh = fz.height * 0.5,
        hfzw = fz.width * 0.5;

    // attempt to draw the walls
    this.xh(fz, lf_boundary, cw.x, wb.bottom + hfzh);
    this.xv(fz, lf_boundary);
    this.xv(fz, cw.x);
    //this.xh(fz, cw.x + fz.width, wb.right + fz.width, cw.y);

    this.onceOnly_2(node, fz, bz, {
      left: lf_boundary + hfzw,
      right: cw.x - hfzw,
      top: wb.top,
      bottom: wb.bottom + fz.height
    });

    this.doCtrl(node);
    _asterix2.default.main.pkInput();
  },

  /**
   * @method doCtrl
   * @private
   */
  doCtrl: function doCtrl(node) {
    var hsps = node.cpad.hotspots,
        cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox(),
        wz = _ccsx2.default.vrect(),

    //sp= ccsx.createSprite('shadedLight09.png'),
    sp = _ccsx2.default.createSprite('shadedDark09.png'),
        cz = sp.getContentSize(),
        cbx = void 0,
        ch3 = cz.height / 3,
        cw3 = cz.width / 3,

    //x= cw.x + (wb.right - cw.x) * 0.5,
    x = wb.right * 0.75,
        y = wb.top * 0.25;

    sp.setPosition(x, y);
    _asterix2.default.main.addAtlasItem('game-pics', sp);

    cbx = _ccsx2.default.bbox4(sp);

    //calc hotspots for touch & mouse
    // rotate left right
    hsps.rr = { left: cbx.left + cw3,
      top: cbx.top,
      right: cbx.right - cw3,
      bottom: cbx.top - ch3 };

    hsps.rl = { left: cbx.left + cw3,
      top: cbx.top - 2 * ch3,
      right: cbx.right - cw3,
      bottom: cbx.bottom };

    // shifting left, right
    hsps.sl = { left: cbx.left,
      top: cbx.top - ch3,
      right: cbx.left + cw3,
      bottom: cbx.top - 2 * ch3 };

    hsps.sr = { left: cbx.left + 2 * cw3,
      top: cbx.top - ch3,
      right: cbx.right,
      bottom: cbx.top - 2 * ch3 };

    // fast drop down
    hsps.cd = { left: cbx.left + cw3,
      top: cbx.top - ch3,
      right: cbx.right - cw3,
      bottom: cbx.top - 2 * ch3 };
  },

  /**
   * Draw horizontal wall.
   * @method xh
   * @private
   */
  xh: function xh(fz, lf_bdy, rt_bdy, ypos) {
    var cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox(),
        wz = _ccsx2.default.vrect(),
        hfzw = fz.width * 0.5,
        f = void 0,
        x = void 0,
        y = void 0;

    y = ypos; //wb.bottom + fz.height * 0.5;
    x = lf_bdy;
    while (x < rt_bdy) {
      //}cw.x) {
      f = _ccsx2.default.createSprite('gray.png');
      f.setPosition(x, y);
      _asterix2.default.main.addAtlasItem('game-pics', f);
      x += fz.width;
    }
  },

  /**
   * Draw vertical wall.
   * @method xv
   * @private
   */
  xv: function xv(fz, x) {
    var cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox(),
        wz = _ccsx2.default.vrect(),
        f = void 0,
        y = void 0;

    y = wb.bottom;
    y += fz.height * 0.5;
    while (y < wb.top) {
      f = _ccsx2.default.createSprite('gray.png');
      f.setPosition(x, y);
      _asterix2.default.main.addAtlasItem('game-pics', f);
      y += fz.height;
    }
  },

  /**
   * @method onceOnly_2
   * @private
   */
  onceOnly_2: function onceOnly_2(node, fz, bz, box) {
    var tiles = this.fakeTileMap(bz, box);

    node.blocks.grid = this.initBlockMap(tiles);
    node.collision.tiles = tiles;
    node.gbox.box = box;

    csts.FENCE = fz.width;
    csts.TILE = bz.width;
    csts.CBOX = box;

    sjs.loggr.info("collision tiles and blocks init'ed.");
    sjs.loggr.info("tile size = " + csts.TILE);
  },

  /**
   * @method initBlockMap
   * @private
   */
  initBlockMap: function initBlockMap(tiles) {
    var grid = [];

    for (var r = 0; r < tiles.length; ++r) {
      var rc = sjs.makeArray(tiles[r].length, undef);
      grid.push(rc);
    }

    return grid;
  },

  /**
   * Create our own collision map using cells.
   * @method fakeTileMap
   * @private
   */
  fakeTileMap: function fakeTileMap(bz, box) {

    var hlen = Math.floor((box.top - box.bottom) / bz.height),
        wlen = Math.floor((box.right - box.left) / bz.width),
        map = [],
        rc = void 0;

    // use 1 to indicate wall
    for (var r = 0; r <= hlen; ++r) {
      if (r === 0) {
        rc = sjs.makeArray(wlen + 2, 1);
      } else {
        rc = sjs.makeArray(wlen + 2, 0);
        rc[0] = 1;
        rc[rc.length - 1] = 1;
      }
      map.push(rc);
    }
    return map;
  }
}, {
  /**
   * @memberof module:s/stager~Stager
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.PreUpdate
});

/** @alias module:s/stager */
var xbox = {
  /**
   * @property {Stager} Stager
   */
  Stager: Stager
};
sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF