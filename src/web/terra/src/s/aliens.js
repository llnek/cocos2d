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
 * @requires s/utils
 * @requires n/gnodes
 * @module s/aliens
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import utils from 's/utils';
import gnodes from 'n/gnodes';


let sjs=sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/** * @class Aliens */
Aliens = sh.Ashley.sysDef({
  /**
   * @memberof module:s/aliens~Aliens
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/aliens~Aliens
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ships=null;
  },
  /**
   * @memberof module:s/aliens~Aliens
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ships = engine.getNodeList(gnodes.ShipMotionNode);
  },
  /**
   * @memberof module:s/aliens~Aliens
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node = this.ships.head;
    if (this.state.running &&
       !!node) {
      this.doit(node, this.state.secCount);
    }
  },
  /**
   * @memberof module:s/aliens~Aliens
   * @method doit
   * @param {Object} node
   * @param {Number} dt
   */
  doit(node, dt) {
    let enemies= sh.pools.Baddies,
    cfg= sh.main.getLCfg(),
    fc;

    if (enemies.actives() < cfg.enemyMax) {
      sjs.eachObj( v => {
        fc= () => {
          for (let t = 0; t < v.types.length; ++t) {
            this.addEnemyToGame(node, v.types[t]);
          }
        };
        if (v.style === "*" &&
            dt % v.time === 0) {
          fc();
        }
        if (v.style === "1" &&
            v.time >= dt) {
          v.style="0";
          fc();
        }
      }, cfg.enemies);
    }
  },
  /**
   * @memberof module:s/aliens~Aliens
   * @method dropBombs
   * @param {Object} enemy
   */
  dropBombs(enemy) {
    let bombs= sh.pools.Bombs,
    sp= enemy.sprite,
    sz= sp.getContentSize(),
    pos= sp.getPosition(),
    b = bombs.get();

    if (!b) {
      sh.factory.createBombs();
      b= bombs.get();
    }

    b.inflate({ x: pos.x, y: pos.y - sz.height * 0.2 });
    b.attackMode=enemy.attackMode;
  },
  /**
   * @memberof module:s/aliens~Aliens
   * @method getB
   * @param {Object} arg
   */
  getB(arg) {
    let enemies = sh.pools.Baddies,
    en,
    pred= e => {
      return (e.enemyType === arg.type
              &&
              e.status === false);
    };

    en= enemies.select(pred);
    if (!en) {
      sh.factory.createEnemies(1);
      en= enemies.select(pred);
    }

    if (!!en) {
      en.sprite.schedule(() => {
        this.dropBombs(en);
      }, en.delayTime);
      en.inflate();
    }

    return en;
  },
  /**
   * @memberof module:s/aliens~Aliens
   * @method addEnemyToGame
   * @param {Object} node
   * @param {Number} enemyType
   */
  addEnemyToGame(node, enemyType) {
    const arg = xcfg.EnemyTypes[enemyType],
    wz = ccsx.vrect(),
    en = this.getB(arg);

    if (!en) {return;}

    let sz= en.size(),
    epos= en.pos(),
    ship= node.ship,
    pos= ship.pos(),
    act, a0, a1;

    en.setPos(sjs.rand(80 + wz.width * 0.5), wz.height);
    switch (en.moveType) {

      case csts.ENEMY_MOVES.RUSH:
        act = cc.moveTo(1, cc.p(pos.x, pos.y));
      break;

      case csts.ENEMY_MOVES.VERT:
        act = cc.moveBy(4, cc.p(0, -wz.height - sz.height));
      break;

      case csts.ENEMY_MOVES.HORZ:
        a0 = cc.moveBy(0.5, cc.p(0, -100 - sjs.rand(200)));
        a1 = cc.moveBy(1, cc.p(-50 - sjs.rand(100), 0));
        const onComplete = cc.callFunc( p => {
          let a2 = cc.delayTime(1);
          let a3 = cc.moveBy(1, cc.p(100 + sjs.rand(100), 0));
          p.runAction(cc.sequence(a2, a3,
                                  a2.clone(),
                                  a3.reverse()).repeatForever());
        });
        act = cc.sequence(a0, a1, onComplete);
      break;

      case csts.ENEMY_MOVES.OLAP:
        const newX = (pos.x <= wz.width * 0.5) ? wz.width : -wz.width;
        a0 = cc.moveBy(4, cc.p(newX, -wz.width * 0.75));
        a1 = cc.moveBy(4,cc.p(-newX, -wz.width));
        act = cc.sequence(a0,a1);
      break;
    }

    en.sprite.runAction(act);
  }

}, {

/**
 * @memberof module:s/aliens~Aliens
 * @property {Number} Priority
 */
Priority : xcfg.ftypes.Motion
});


/** @alias module:s/aliens */
const xbox = /** @lends xbox# */{
  /**
   * @property {Aliens} Aliens
   */
  Aliens : Aliens
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

