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

/**
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/moveship
 */
define('zotohlab/p/s/moveship',

       ['zotohlab/p/elements',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, utils, gnodes, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/moveship */
    let exports = {},
    sjs=sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
    /**
     * @class MoveShip
     */
    MoveShip = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/moveship~MoveShip
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/moveship~MoveShip
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.ships=null;
      },

      /**
       * @memberof module:zotohlab/p/s/moveship~MoveShip
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.ships = engine.getNodeList(gnodes.ShipMotionNode);
      },

      /**
       * @memberof module:zotohlab/p/s/moveship~MoveShip
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const node= this.ships.head;
        if (this.state.running &&
           !!node) {
          this.processKeys(node,dt);
        }
      },

      /**
       * @method processKeys
       * @private
       */
      processKeys(node,dt) {
        let ship = node.ship,
        wz= ccsx.vrect(),
        mot= node.motion,
        sp = ship.sprite,
        ok = false,
        pos = sp.getPosition(),
        x = pos.x,
        y = pos.y;

        if (mot.up && pos.y <= wz.height) {
          y = pos.y + dt * csts.SHIP_SPEED;
          ok= true;
        }
        if (mot.down && pos.y >= 0) {
          y = pos.y - dt * csts.SHIP_SPEED;
          ok= true;
        }
        if (mot.left && pos.x >= 0) {
          x = pos.x - dt * csts.SHIP_SPEED;
          ok= true;
        }
        if (mot.right && pos.x <= wz.width) {
          x = pos.x + dt * csts.SHIP_SPEED;
          ok= true;
        }

        if (ok) { sp.setPosition(x,y); }

        mot.right= false;
        mot.left=false;
        mot.down=false;
        mot.up=false;
      }

    });

    /**
     * @memberof module:zotohlab/p/s/moveship~MoveShip
     * @property {Number} Priority
     */
    MoveShip.Priority = sh.ftypes.Move;

    exports=MoveShip;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

