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
 * @requires n/gnodes
 * @module s/resolve
 */

import sh from 'zotohlab/asx/asterix';
import gnodes from 'n/gnodes';
import ccsx from 'zotohlab/asx/ccsx';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/** * @class Resolve */
Resolve = sh.Ashley.sysDef({
  /**
   * @memberof module:s/resolve~Resolve
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state = options;
  },
  /**
   * @memberof module:s/resolve~Resolve
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.nodeList=null;
    this.fauxs=null;
    this.balls=null;
  },
  /**
   * @memberof module:s/resolve~Resolve
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.fauxs= engine.getNodeList(gnodes.FauxPaddleNode);
    this.nodeList= engine.getNodeList(gnodes.PaddleNode);
    this.balls= engine.getNodeList(gnodes.BallNode);
    this.engine=engine;
  },
  /**
   * @memberof module:s/resolve~Resolve
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    let bnode = this.balls.head,
    rc;

    if (this.state.mode === sh.gtypes.ONLINE_GAME) {
      return;
    }

    if (this.state.running &&
       !!bnode) {

      rc=this.checkNodes(this.nodeList, bnode);
      if (rc !== false) {
        rc=this.checkNodes(this.fauxs, bnode);
      }
    }

    return rc;
  },
  /**
   * @method checkNodes
   * @private
   */
  checkNodes(nl, bnode) {
    for (let node=nl.head; node; node=node.next) {
      const winner =this.check(node,bnode);
      if (winner) {
        this.onWin(winner);
        return false;
      }
    }
  },
  /**
   * @method onWin
   * @private
   */
  onWin(winner) {
    const bnode= this.balls.head;
    //sjs.loggr.debug("winner ====== " + winner);
    bnode.ball.sprite.setPosition(
      this.state.ball.x,
      this.state.ball.y);
    bnode.velocity.vel.x = this.state.ball.speed * sjs.randSign();
    bnode.velocity.vel.y = this.state.ball.speed * sjs.randSign();
    sh.fire('/hud/score/update', { score: 1, color: winner });
  },
  //check win
  /**
   * @method check
   * @private
   */
  check(node,bnode) {
    const b= bnode.ball,
    pd= node.paddle,
    pc= pd.color,
    bp= b.sprite.getPosition();

    if (ccsx.isPortrait()) {

      if (pc === csts.P1_COLOR) {
        return bp.y < ccsx.getBottom(pd.sprite) ?
          csts.P2_COLOR : undef;
      } else {
        return bp.y > ccsx.getTop(pd.sprite) ?
          csts.P1_COLOR : undef;
      }

    } else {

      if (pc === csts.P1_COLOR) {
        return bp.x < ccsx.getLeft(pd.sprite) ?
          csts.P2_COLOR : undef;
      } else {
        return bp.x > ccsx.getRight(pd.sprite) ?
          csts.P1_COLOR : undef;
      }

    }
  }

}, {

/**
 * @memberof module:s/resolve~Resolve
 * @property {Number} Priority
 */
Priority : xcfg.ftypes.Resolve
});



/** @alias module:s/resolve */
const xbox = /** @lends xbox# */{
  /**
   * @property {Resolve}  Resolve
   */
  Resolve : Resolve
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
///////////////////////////////////////////////////////////////////////////////
//EOF

