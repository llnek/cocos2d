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
 * @requires nodes/gnodes
 * @module s/motion
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import gnodes from 'nodes/gnodes';
import Rx from 'Rx';

let sjs=sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class Motions
 */
Motions = sh.Ashley.sysDef({
  /**
   * @memberof module:s/motions~Motions
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/motions~Motions
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ships=null;
    this.evQ=null;
  },
  /**
   * @memberof module:s/motions~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ships= engine.getNodeList(gnodes.ShipMotionNode);
    this.evQ=[];
    return;
    this.stream= Rx.Observable.merge(
      Rx.Observable.create( obj => {
        sh.main.signal('/touch/one/move', (t,m) => {
          obj.onNext(m);
        });
      }),
      Rx.Observable.create( obj => {
        sh.main.signal('/mouse/move', (t,m) => {
          obj.onNext(m);
        });
      })
    );
    this.stream.subscribe( msg => {
      if (!!this.evQ) {
        this.evQ.push(msg);
      }
    });
  },
  /**
   * @memberof module:s/motions~Motions
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node = this.ships.head;
    this.process(node,dt);
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
      if (ccsx.hasKeyPad()) {
        this.onkey(node, dt);
      }
    }
  },
  /**
   * @method ongui
   * @private
   */
  ongui(node,evt,dt) {
    let pos = node.ship.pos(),
    wz= ccsx.vrect(),
    cur= cc.pAdd(pos, evt.delta);
    cur= cc.pClamp(cur, cc.p(0, 0),
                   cc.p(wz.width, wz.height));
    node.ship.setPos(cur.x, cur.y);
    cur=null;
  },
  /**
   * @method onkey
   * @private
   */
  onkey(node,dt) {
    if (sh.main.keyPoll(cc.KEY.right)) {
      node.motion.right = true;
    }
    if (sh.main.keyPoll(cc.KEY.left)) {
      node.motion.left= true;
    }

    if (sh.main.keyPoll(cc.KEY.down)) {
      node.motion.down = true;
    }
    if (sh.main.keyPoll(cc.KEY.up)) {
      node.motion.up= true;
    }
  }

});

/**
   * @memberof module:s/motions~Motions
   * @property {Number} Priority
   */
Motions.Priority = xcfg.ftypes.Motion;


/** @alias module:s/motions */
const xbox = /** @lends xbox# */{
  /**
   * @property {Motions} Motions
   */
  Motions : Motions
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

