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
 * @module s/stager
 */

import sh from 'zotohlab/asx/asterix';
import gnodes from 'n/gnodes';
import ccsx from 'zotohlab/asx/ccsx';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/** * @class Stager */
Stager = sh.Ashley.sysDef({
  /**
   * @memberof module:s/stager~Stager
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/stager~Stager
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.paddleMotions=null;
  },
  /**
   * @memberof module:s/stager~Stager
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.paddles = engine.getNodeList(gnodes.PaddleMotionNode);
  },
  /**
   * @memberof module:s/stager~Stager
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    if (ccsx.isTransitioning()) { return false; }
    if (! this.inited) {
      this.onceOnly();
      this.inited=true;
    }
  },
  /**
   * @memberof module:s/stager~Stager
   * @method initBrickSize
   */
  initBrickSize() {
    this.state.candySize= ccsx.csize('red_candy.png');
  },
  /**
   * @memberof module:s/stager~Stager
   * @method initBallSize
   */
  initBallSize() {
    this.state.ballSize= ccsx.csize('ball.png');
  },
  /**
   * @method onceOnly
   * @private
   */
  onceOnly() {
    this.initBrickSize();
    this.initBallSize();
    sh.factory.createBricks();
    sh.factory.createPaddle();
    sh.factory.createBall();

    ccsx.onTouchOne(this);
    ccsx.onMouse(this);
    sh.main.pkInput();
  },
  /**
   * @method fire
   * @private
   */
  fire(t, evt) {
    if ('/touch/one/move' === t ||
        '/mouse/move' === t) {} else {
      return;
    }
    if (this.state.running &&
        !!this.paddles.head) {
      let p = this.paddles.head.paddle,
      pos = p.pos(),
      x=pos.x,
      y=pos.y,
      wz= ccsx.vrect(),
      cur= cc.pAdd(pos, cc.p(evt.delta.x,0));
      cur= cc.pClamp(cur, cc.p(0, 0),
                     cc.p(wz.width, wz.height));
      p.setPos(cur.x, cur.y);
    }
  }

}, {


/**
 * @memberof module:s/stager~Stager
 * @property {Number} Priority
 */
Priority: xcfg.ftypes.PreUpdate
});


/** @alias module:s/stager */
const xbox = /** @lends xbox# */{

  /**
   * @property {Stager} Stager
   */
  Stager : Stager
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

