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
 * @module s/resolution
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import utils from 's/utils';
import gnodes from 'nodes/gnodes';

//////////////////////////////////////////////////////////////////////////////
let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////////
/**
 * @class ResolutionSystem
 */
ResolutionSystem = sh.Ashley.sysDef({
  /**
   * @memberof module:s/resolution~ResolutionSystem
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/resolution~ResolutionSystem
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.board=null;
  },
  /**
   * @memberof module:s/resolution~ResolutionSystem
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.board = engine.getNodeList(gnodes.BoardNode);
  },
  /**
   * @memberof module:s/resolution~ResolutionSystem
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node= this.board.head;
    if (this.state.running &&
        !!node) {
      this.process(node, dt);
    }
  },
  /**
   * @method process
   * @private
   */
  process(node, dt) {
    let values= node.grid.values,
    msg,
    rc,
    res;

    if (R.find((p) => {
        if (!!p) {
          rc= this.checkWin(p,values);
          if (rc) {
            return res=[p, rc];
          }
        }
      }, this.state.players)) {
      this.doWin(node, res[0], res[1]);
    }
    else
    if (this.checkDraw(values)) {
      this.doDraw(node);
    }
    else
    if (this.state.msgQ.length > 0) {
      msg = this.state.msgQ.shift();
      if ("forfeit" === msg) {
        this.doForfeit(node);
      }
    }
  },
  /**
   * @method doWin
   * @private
   */
  doWin(node, winner, combo) {
    sh.fire('/hud/score/update',
            {color: winner.color,
             score: 1});
    this.doDone(node, winner, combo);
  },
  /**
   * @method doDraw
   * @private
   */
  doDraw(node) {
    this.doDone(node, null, []);
  },
  /**
   * @method doForfeit
   * @private
   */
  doForfeit(node) {
    let other = this.state.actor===1 ? 2 : this.state.actor===2 ? 1 : 0,
    tv = this.state.players[this.state.actor],
    win= this.state.players[other],
    cs = node.view.cells,
    v2= -1,
    layer= node.view.layer;

    if (!!tv) {
      v2 = tv.value;
    }

    sh.fire('/hud/score/update',
            {color: win.color,
             score: 1});

    //gray out the losing icons
    R.forEachIndexed((z, n) => {
      if (!!z && z[4] === v2) {
        layer.removeItem(z[0]);
        z[0] = utils.drawSymbol(node.view, z[1], z[2], z[3]+2);
      }
    }, cs);

    this.doDone(node, win, null);
  },
  /**
   * Flip all other icons except for the winning ones.
   * @method showWinningIcons
   * @private
   */
  showWinningIcons(view, combo) {
    const layer= view.layer,
    cs = view.cells;

    if (combo===null) { return; }

    R.forEachIndexed((z, n) => {
      if (! R.contains(n, combo)) { if (!!z && z[3] !== csts.CV_Z) {
        layer.removeAtlasItem('markers', z[0]);
        z[0] = utils.drawSymbol(view, z[1], z[2], z[3], true);
      } }
    }, cs);
  },
  /**
   * @method doDone
   * @private
   */
  doDone(node, pobj, combo) {

    const pnum = !!pobj ? pobj.pnum : 0;

    this.showWinningIcons(node.view, combo);
    sh.fire('/hud/timer/hide');
    sh.sfxPlay('game_end');
    sh.fire('/hud/end', { winner: pnum });

    this.state.lastWinner = pnum;
    this.state.running=false;
  },
  /**
   * @method checkDraw
   * @private
   */
  checkDraw(values) {
    return ! (csts.CV_Z === R.find((v) => {
      return (v === csts.CV_Z);
    }, values));
  },
  /**
   * @method checkWin
   * @private
   */
  checkWin(actor, game) {
    //sjs.loggr.debug('checking win for ' + actor.color);
    let combo, rc= R.any((r) => {
      combo=r;
      return R.all((n) => {
        return actor.value === n;
      },
      R.map((i) => { return game[i]; }, r));
    },
    this.state.GOALSPACE);

    return rc ? combo : null;
  }

});

/**
 * @memberof module:s/resolution~ResolutionSystem
 * @property {Number} Priority
 */
ResolutionSystem.Priority= xcfg.ftypes.Resolve;


/** @alias module:s/resolution */
const xbox = {
  /**
   * @property {ResolutionSystem} ResolutionSystem
   */
  ResolutionSystem: ResolutionSystem
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

