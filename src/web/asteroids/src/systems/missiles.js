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
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/missilecontrol
 */
define('zotohlab/p/s/missilecontrol',

       ['zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (utils,  gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/missilecontrol */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class MissileControl
     */
    MissileControl = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/missilecontrol~MissileControl
       * @method constructor
       * @param {Object} options
       */
      constructor: function (options) {
        this.state=options;
      },

      /**
       * @memberof module:zotohlab/p/s/missilecontrol~MissileControl
       * @method addToEngine
       * @param {Object} options
       */
      addToEngine: function (engine) {
        this.nodeList = engine.getNodeList(gnodes.CannonCtrlNode);
      },

      /**
       * @memberof module:zotohlab/p/s/missilecontrol~MissileControl
       * @method removeFromEngine
       * @param {Object} options
       */
      removeFromEngine: function (engine) {
        this.nodeList = null;
      },

      /**
       * @memberof module:zotohlab/p/s/missilecontrol~MissileControl
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
        ship=node.ship,
        lpr= node.looper,
        t= lpr.timers[0];

        if (! gun.hasAmmo) {
          if (ccsx.timerDone(t)) {
            gun.hasAmmo=true;
            lpr.timers[0]=null;
          }
          return;
        } else {
          this.scanInput(node,dt);
        }
      },

      /**
       * @private
       */
      scanInput: function (node, dt) {
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

        if (!hit) {
          return;
        }

        this.fireMissile(node,dt);
      },

      /**
       * @private
       */
      fireMissile: function(node,dt) {
        var p= sh.pools.Missiles,
        lpr= node.looper,
        ship= node.ship,
        gun= node.cannon,
        sz= ship.sprite.getContentSize(),
        pos= ship.sprite.getPosition(),
        top= ccsx.getTop(ship.sprite),
        deg= ship.sprite.getRotation(),
        tag,
        ent= p.get();

        if (!ent) {
          sh.factory.createMissiles(30);
          ent= p.get();
        }

        var rc= sh.calcXY(deg, sz.height * 0.5);
        ent.vel.x = rc[0];
        ent.vel.y = rc[1];
        ent.inflate({ x: pos.x + rc[0], y: pos.y + rc[1]});
        ent.sprite.setRotation(deg);

        lpr.timers[0] = ccsx.createTimer(sh.main, gun.coolDownWindow);
        gun.hasAmmo=false;
        //sh.sfxPlay('ship-missile');
      }

    });

    exports= MissileControl;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

