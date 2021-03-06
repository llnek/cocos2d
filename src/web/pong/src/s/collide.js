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
 * @module s/collide
 */

import sh from 'zotohlab/asx/asterix';
import gnodes from 'n/gnodes';
import ccsx from 'zotohlab/asx/ccsx';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class Collide
 */
Collide = sh.Ashley.sysDef({
  /**
   * @memberof module:s/collide~Collide
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state = options;
  },
  /**
   * @memberof module:s/collide~Collide
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.nodeList=null;
    this.fauxs=null;
    this.balls=null;
  },
  /**
   * @memberof module:s/collide~Collide
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.fauxs= engine.getNodeList(gnodes.FauxPaddleNode);
    this.nodeList= engine.getNodeList(gnodes.PaddleNode);
    this.balls= engine.getNodeList(gnodes.BallNode);
  },
  /**
   * @memberof module:s/collide~Collide
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const bnode = this.balls.head;

    if (this.state.running &&
       !!bnode) {
      this.checkNodes(this.nodeList, bnode);
      this.checkNodes(this.fauxs, bnode);
    }
  },
  /**
   * @method checkNodes
   * @private
   */
  checkNodes(nl, bnode) {
    for (let node=nl.head; node; node=node.next) {
      if (ccsx.collide0(node.paddle.sprite,
                        bnode.ball.sprite)) {
        this.check(node, bnode);
      }
    }
  },
  /**
   * Ball hits paddle.
   * @method check
   * @private
   */
  check(node, bnode) {
    let pos = bnode.ball.sprite.getPosition(),
    bb4 = ccsx.bbox4(node.paddle.sprite),
    velo = bnode.velocity,
    x= pos.x,
    y= pos.y,
    hw2= ccsx.halfHW(bnode.ball.sprite);

    if (ccsx.isPortrait()) {
      velo.vel.y = - velo.vel.y;
    } else {
      velo.vel.x = - velo.vel.x;
    }

    if (node.paddle.color === csts.P1_COLOR) {
      if (ccsx.isPortrait()) {
        y=bb4.top + hw2[1];
      } else {
        x=bb4.right + hw2[0];
      }
    } else {
      if (ccsx.isPortrait()) {
        y = bb4.bottom - hw2[1];
      } else {
        x = bb4.left - hw2[0];
      }
    }

    bnode.ball.sprite.setPosition(x,y);
    sh.sfxPlay(node.paddle.snd);
  }

}, {

/**
 * @memberof module:s/collide~Collide
 * @property {Number} Priority
 */
Priority : xcfg.ftypes.Collide
});


/** @alias module:s/collide */
const xbox = /** @lends xbox# */{
  /**
   * @property {Collide} Collide
   */
  Collide : Collide
};



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
///////////////////////////////////////////////////////////////////////////////
//EOF

