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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/ccsx
 * @requires s/utils
 * @requires nodes/gnodes
 * @module s/rendering
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import utils from 's/utils';
import gnodes from 'nodes/gnodes';

//////////////////////////////////////////////////////////////////////////////
let sjs= sh.skarojs,
R = sjs.ramda,
xcfg= sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////////
/**
 * @class RenderSystem
 */
RenderSystem = sh.Ashley.sysDef({
  /**
   * @memberof module:s/rendering~RenderSystem
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/rendering~RenderSystem
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.board={};
  },
  /**
   * @memberof module:s/rendering~RenderSystem
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.board = engine.getNodeList(gnodes.BoardNode);
  },
  /**
   * @memberof module:s/rendering~RenderSystem
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node = this.board.head;
    if (this.state.running &&
        !!node) {
      this.process(node);
    }
  },
  /**
   * @method process
   * @private
   */
  process(node) {
    let values= node.grid.values,
    view= node.view,
    cs= view.cells,
    z,c, offset;

    R.forEachIndexed((v, pos) => {

      if (v !== csts.CV_Z) {
        c= this.xrefCell(pos, view.gridMap);
        if (!!c) {
          z=cs[pos];
          if (!!z) {
            z[0].removeFromParent();
          }
          cs[pos] = [utils.drawSymbol(view, c[0], c[1], v),
                     c[0], c[1], v];
        }
      }

    }, values);
  },
  /**
   * Given a cell, find the screen co-ordinates for that cell.
   * @method xrefCell
   * @private
   */
  xrefCell(pos, map) {
    let gg, x, y,
    delta=0;

    if (pos >= 0 && pos < csts.CELLS) {
      gg = map[pos];
      x = gg.left + (gg.right - gg.left  - delta) * 0.5;
      y = gg.top - (gg.top - gg.bottom - delta ) * 0.5;
      // the cell's center
      return [x, y];
    } else {
      return null;
    }
  }

});

/**
 * @memberof module:s/rendering~RenderSystem
 * @property {Number} Priority
 */
RenderSystem.Priority = xcfg.ftypes.Render;


/** @alias module:s/rendering */
const xbox = /** @lends xbox# */{
  /**
   * @property {RenderSystem} RenderSystem
   */
  RenderSystem : RenderSystem
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF
