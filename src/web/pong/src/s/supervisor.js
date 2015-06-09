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
 * @requires zotohlab/asx/odin
 * @requires nodes/gnodes
 * @module s/supervisor
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import odin from 'zotohlab/asx/odin';
import gnodes from 'nodes/gnodes';

let evts= odin.Events,
sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class GameSupervisor
 */
GameSupervisor = sh.Ashley.sysDef({
  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
    this.inited=false;
  },
  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.nodeList=null;
  },
  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.nodeList= engine.getNodeList(gnodes.PaddleNode);
  },
  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    if (! this.inited) {
      this.onceOnly();
      this.inited=true;
    } else {
    }
    //return this.state.wsock ? this.state.poked : true;
  },
  /**
   * @method onceOnly
   * @private
   */
  onceOnly() {
    const world = this.state.world,
    cw= ccsx.center(),
    ps = this.initPaddleSize(),
    bs = this.initBallSize(),
    // position of paddles
    // portrait
    p1y = Math.floor(world.top * 0.1 + bs.height + sh.hh(ps)),
    p2y = Math.floor(world.top * 0.9 - bs.height - sh.hh(ps)),
    // landscape
    p2x = Math.floor(world.right - bs.width - sh.hw(ps)),
    p1x = Math.floor(world.left + bs.width + sh.hw(ps));

    // game defaults for entities and timers.
    this.state.framespersec= cc.game.config[cc.game.CONFIG_KEY.frameRate];
    this.state.syncMillis= 3000;
    this.state.paddle= {height: Math.floor(ps.height),
             width: Math.floor(ps.width),
             speed: Math.floor(csts.PADDLE_SPEED)};
    this.state.ball= {height: Math.floor(bs.height),
           width: Math.floor(bs.width),
           x: Math.floor(cw.x),
           y: Math.floor(cw.y),
           speed: Math.floor(csts.BALL_SPEED) };
    if (ccsx.isPortrait()) {
      this.state.p1= {y: p1y, x: Math.floor(cw.x) };
      this.state.p2= {y: p2y, x: Math.floor(cw.x) };
    } else {
      this.state.p1= {x: p1x, y: Math.floor(cw.y) };
      this.state.p2= {x: p2x, y: Math.floor(cw.y) };
    }
    this.state.numpts= csts.NUM_POINTS;

    sh.factory.createPaddles(sh.main, this.state);
    sh.factory.createBall(sh.main, this.state);

    // mouse only for 1p or netplay
    if (xcfg.csts.GAME_MODE !== sh.gtypes.P2_GAME) {
      ccsx.onMouse(this);
    }
    ccsx.onTouchOne(this);
    sh.main.pkInput();
  },
  /**
   * @method fire
   * @private
   */
  fire(t, evt) {
    if (('/touch/one/move' === t || '/mouse/move' === t) &&
        this.state.running) {}
    else
    { return; }

    for (let node= this.nodeList.head; node; node=node.next) {
      if (ccsx.isPortrait()) {
        this.processP(node,evt);
      } else {
        this.processL(node,evt);
      }
    }
  },
  /**
   * @method processP
   * @private
   */
  processP(node, evt) {
    let pnum= node.player.pnum,
    p = node.paddle,
    pos = p.pos(),
    loc= evt.loc,
    cur,
    x=pos.x,
    y=pos.y,
    wz= ccsx.vrect();

    if (pnum === 2 && loc.y > pos.y ||
        pnum === 1 && loc.y < pos.y) {
      x = pos.x + evt.delta.x;
      cur= cc.pClamp(cc.p(x,y), cc.p(0, 0),
                     cc.p(wz.width, wz.height));
      p.setPos(cur.x, cur.y);
    }
  },
  /**
   * @method processL
   * @private
   */
  processL(node, evt) {
    let pnum= node.player.pnum,
    p = node.paddle,
    pos = p.pos(),
    loc= evt.loc,
    cur,
    x=pos.x,
    y=pos.y,
    wz= ccsx.vrect();

    if (pnum === 2 && loc.x > pos.x ||
        pnum === 1 && loc.x < pos.x) {
      y = pos.y + evt.delta.y;
      cur= cc.pClamp(cc.p(x,y), cc.p(0, 0),
                     cc.p(wz.width, wz.height));
      p.setPos(cur.x, cur.y);
    }
  },
  /**
   * @method initPaddleSize
   * @private
   */
  initPaddleSize() {
    return new cc.Sprite('#red_paddle.png').getContentSize();
  },
  /**
   * @method initBallSize
   * @private
   */
  initBallSize() {
    return new cc.Sprite('#pongball.png').getContentSize();
  }

});

/**
 * @memberof module:s/supervisor~GameSupervisor
 * @property {Number} Priority
 * @static
 */
GameSupervisor.Priority = xcfg.ftypes.PreUpdate;


/** @alias module:s/supervisor */
const xbox = /** @lends xbox# */{

  /**
   * @property {GameSupervisor}  GameSupervisor
   */
  GameSupervisor : GameSupervisor
};




sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

