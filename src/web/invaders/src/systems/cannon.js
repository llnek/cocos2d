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

define('zotohlab/p/s/cannon',

       ['zotohlab/p/s/priorities',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/cannon */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class CannonControl
     */
    CannonControl = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/cannon~CannonControl
       * @method constructor
       * @param {Object} options
       */
      constructor: function (options) {
        this.state = options;
      },

      /**
       * @memberof module:zotohlab/p/s/cannon~CannonControl
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function (engine) {
        this.nodeList = engine.getNodeList(gnodes.CannonCtrlNode);
      },

      /**
       * @memberof module:zotohlab/p/s/cannon~CannonControl
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function (engine) {
        this.nodeList = null;
      },

      /**
       * @memberof module:zotohlab/p/s/cannon~CannonControl
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var node = this.nodeList.head;
        if (this.state.running &&
           !!node) {
          this.process(node, dt);
        }
      },

      /**
       * @private
       */
      process: function(node,dt) {
        var gun = node.cannon,
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
       * @private
       */
      checkInput: function() {
        var hit=false;
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
       * @private
       */
      scanInput: function (node, dt) {
        var hit= this.checkInput();
        if (hit) {
          this.fireMissile(node,dt);
        }
      },

      /**
       * @private
       */
      fireMissile: function(node,dt) {
        var top= ccsx.getTop(node.ship.sprite),
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
    CannonControl.Priority= pss.Motion;
    exports = CannonControl;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

