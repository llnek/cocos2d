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
 * @requires nodes/cobjs
 * @requires nodes/gnodes
 * @requires s/utils
 * @module s/motion
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'nodes/cobjs';
import gnodes from 'nodes/gnodes';
import utils from 's/utils';
import Rx from 'Rx';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class MotionCtrlSystem
 */
MotionCtrlSystem = sh.Ashley.sysDef({
  /**
   * @memberof module:s/motioncontrol
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.throttleWait= csts.THROTTLEWAIT;
    this.state = options;
  },
  /**
   * @memberof module:s/motioncontrol
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.stream=null;
    this.arena=null;
    this.evQ=null;
  },
  /**
   * @memberof module:s/motioncontrol
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.arena= engine.getNodeList(gnodes.ArenaNode);
    this.ops={};
    this.evQ=[];
    this.stream= Rx.Observable.merge(
      Rx.Observable.create( obj => {
        sh.main.signal('/touch/one/end', (t,m) => {
          obj.onNext(m);
        });
      }),
      Rx.Observable.create( obj => {
        sh.main.signal('/mouse/up', (t,m) => {
          obj.onNext(m);
        });
      })
    );
    this.stream.subscribe( msg => {
      if (!!this.evQ) {
        this.evQ.push(msg);
      }
    });
    if (ccsx.hasKeyPad()) {
      this.initKeyOps();
    }
  },
  /**
   * @process
   * @private
   */
  process(node, dt) {
    let evt;
    if (this.evQ.length > 0) {
      evt = this.evQ.shift();
    }
    if (this.state.running &&
       !!node) {
      if (!!evt) {
        this.ongui(node,evt,dt);
      }
      this.onkey(node, dt);
    }
  },
  /**
   * @memberof module:s/motioncontrol
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node= this.arena.head;
    this.process(node, dt);
  },
  /**
   * @method obgui
   * @private
   */
  ongui(node, evt,dt) {
    const hsps= node.cpad.hotspots,
    px= evt.loc.x,
    py= evt.loc.y;

    if (ccsx.pointInBox(hsps.rr, px,py)) {
      this.ops.rotRight(node, dt);
    }

    if (ccsx.pointInBox(hsps.rl, px,py)) {
      this.ops.rotLeft(node, dt);
    }

    if (ccsx.pointInBox(hsps.sr, px,py)) {
      this.ops.sftRight(node, dt);
    }

    if (ccsx.pointInBox(hsps.sl, px,py)) {
      this.ops.sftLeft(node, dt);
    }

    if (ccsx.pointInBox(hsps.cd, px,py)) {
      this.ops.sftDown(node, dt);
    }
  },
  /**
   * @onkey
   * @private
   */
  onkey(node, dt) {

    if (this.keyPoll(cc.KEY.right)) {
      this.ops.sftRight(node, dt);
    }
    if (this.keyPoll(cc.KEY.left)) {
      this.ops.sftLeft(node, dt);
    }
    if (this.keyPoll(cc.KEY.down)) {
      this.ops.rotRight(node, dt);
    }
    if (this.keyPoll(cc.KEY.up)) {
      this.ops.rotLeft(node, dt);
    }
    if (this.keyPoll(cc.KEY.space)) {
      this.ops.sftDown(node, dt);
    }

  },
  /**
   * @method keyPoll
   * @private
   */
  keyPoll(kp) {
    return sh.main.keyPoll(kp);
  },
  /**
   * @method shiftRight
   * @private
   */
  shiftRight(node, dt) {
    node.motion.right=true;
  },
  /**
   * @method shiftLeft
   * @private
   */
  shiftLeft(node, dt) {
    node.motion.left=true;
  },
  /**
   * @method shiftDown
   * @private
   */
  shiftDown(node, dt) {
    node.motion.down=true;
  },
  /**
   * @method rotateRight
   * @private
   */
  rotateRight(node, dt) {
    node.motion.rotr=true;
  },
  /**
   * @method rotateLeft
   * @private
   */
  rotateLeft(node, dt) {
    node.motion.rotl=true;
  },
  /**
   * @method bindKey
   * @private
   */
  bindKey(func, fid) {
    this.ops[fid] = sh.throttle(func,
                                this.throttleWait,
                                { trailing:false });
  },
  /**
   * @method initKeyOps
   * @private
   */
  initKeyOps() {
    sjs.eachObj((v, k) => {
      this.bindKey(v,k);
    },
    {'sftRight' : this.shiftRight.bind(this),
     'sftLeft' : this.shiftLeft.bind(this),
     'rotRight' : this.rotateRight.bind(this),
     'rotLeft' : this.rotateLeft.bind(this),
     'sftDown' : this.shiftDown.bind(this)} );
  }

});

/**
 * @memberof module:s/motioncontrol~MotionCtrlSystem
 * @property {Number} Priority
 */
MotionCtrlSystem.Priority= xcfg.ftypes.Motion;

/** @alias module:s/motioncontrol */
const xbox= /** @lends xbox# */{
  /**
   * @property {MotionCtrlSystem}  MotionCtrlSystem
   */
  MotionCtrlSystem : MotionCtrlSystem
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
///////////////////////////////////////////////////////////////////////////////
//EOF

