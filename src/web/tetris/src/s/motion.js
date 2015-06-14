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
 * @requires n/cobjs
 * @requires n/gnodes
 * @requires s/utils
 * @module s/motion
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import gnodes from 'n/gnodes';
import utils from 's/utils';
import Rx from 'Rx';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class Motions
 */
Motions = sh.Ashley.sysDef({
  /**
   * @memberof module:s/motion
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.throttleWait= csts.THROTTLEWAIT;
    this.state = options;
  },
  /**
   * @memberof module:s/motion
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.stream=null;
    this.arena=null;
    this.evQ=null;
  },
  /**
   * @memberof module:s/motion
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.arena= engine.getNodeList(gnodes.ArenaNode);
    this.ops={};
    this.evQ=[];
  },
  /**
   * @method onceOnly
   * @private
   */
  onceOnly() {
    this.stream= Rx.Observable.merge(
      Rx.Observable.create( obj => {
        sh.main.signal('/touch/one/end', msg => {
          obj.onNext(msg);
        });
      }),
      Rx.Observable.create( obj => {
        sh.main.signal('/mouse/up', msg => {
          obj.onNext(msg);
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
   * @memberof module:s/motion
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const evt = this.evQ.length > 0 ? this.evQ.shift() : undef,
    node= this.arena.head;
    if (this.state.running &&
       !!node) {

      if (!this.inited) {
        this.onceOnly();
        this.inited=true;
      } else {
        this.doit(node, evt, dt);
      }

    }
  },
  /**
   * @method doit
   * @private
   */
  doit(node, evt, dt) {
    if (!!evt) { this.ongui(node,evt,dt); }
    this.onkey(node, dt);
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

}, {
/**
 * @memberof module:s/motion~Motions
 * @property {Number} Priority
 */
Priority: xcfg.ftypes.Motion
});

/** @alias module:s/motion */
const xbox= /** @lends xbox# */{
  /**
   * @property {Motions}  Motions
   */
  Motions : Motions
};
sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
///////////////////////////////////////////////////////////////////////////////
//EOF

