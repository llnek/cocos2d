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
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/cannon
 */
define('zotohlab/p/s/cannon',

       ['zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (utils, gnodes, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/cannon */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @class CannonControl
     */
    CannonControl = sh.Ashley.sysDef({
      /**
       * @memberof module:zotohlab/p/s/cannon~CannonControl
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state = options;
      },
      /**
       * @memberof module:zotohlab/p/s/cannon~CannonControl
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.nodeList = engine.getNodeList(gnodes.CannonCtrlNode);
      },
      /**
       * @memberof module:zotohlab/p/s/cannon~CannonControl
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.nodeList = null;
      },
      /**
       * @memberof module:zotohlab/p/s/cannon~CannonControl
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const node = this.nodeList.head;
        if (this.state.running &&
           !!node) {
          this.process(node, dt);
        }
      },
      /**
       * @method process
       * @private
       */
      process(node,dt) {
        const gun = node.cannon,
        lpr= node.looper,
        ship=node.ship,
        t= lpr.timers[0];

        if (! gun.hasAmmo) {
          if (ccsx.timerDone(t)) {
            ship.sprite.setSpriteFrame(ship.frames[0]);
            gun.hasAmmo=true;
            lpr.timers[0]=ccsx.releaseTimer(t);
          }
        } else {
          this.scanInput(node,dt);
        }
      },
      /**
       * @method checkInput
       * @private
       */
      checkInput() {
        let hit=false;
        if (cc.sys.capabilities['keyboard'] &&
            !cc.sys.isNative) {
          hit= sh.main.keyPoll(cc.KEY.space);
        }
        else
        if (cc.sys.capabilities['mouse']) {
        }
        else
        if (cc.sys.capabilities['touches']) {
        }
        return hit;
      },
      /**
       * @method scanInput
       * @private
       */
      scanInput(node, dt) {
        const hit= this.checkInput();
        if (hit) {
          this.fireMissile(node,dt);
        }
      },
      /**
       * @method fireMissile
       * @private
       */
      fireMissile(node,dt) {
        let top= ccsx.getTop(node.ship.sprite),
        p= sh.pools.Missiles,
        ship=node.ship,
        pos= ship.pos(),
        lpr= node.looper,
        gun= node.cannon,
        ent= p.get();

        if (!ent) {
          sh.factory.createMissiles(36);
          ent= p.get();
        }

        ent.inflate({ x: pos.x, y: top+4 });

        lpr.timers[0] = ccsx.createTimer(sh.main, gun.coolDownWindow);
        gun.hasAmmo=false;
        ship.sprite.setSpriteFrame(ship.frames[1]);
        sh.sfxPlay('ship-missile');
      }

    });

    /**
     * @memberof module:zotohlab/p/s/cannon~CannonControl
     * @property {Number} Priority
     */
    CannonControl.Priority= xcfg.ftypes.Motion;

    exports = CannonControl;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

