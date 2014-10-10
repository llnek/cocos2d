// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

define('zotohlab/p/s/moveship', ['zotohlab/p/gnodes',
                                'cherimoia/skarojs',
                                'zotohlab/asterix',
                                'zotohlab/asx/xcfg',
                                'zotohlab/asx/ccsx',
                                'ash-js'],

  function (gnodes, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    MovementShip = Ash.System.extend({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.shipMotions=null;
      },

      addToEngine: function(engine) {
        this.shipMotions = engine.getNodeList(gnodes.ShipMotionNode)
      },

      update: function (dt) {
        var node = this.shipMotions.head;
        if (this.state.running &&
           !!node) {
          this.processShipMotions(node, dt);
        }
      },

      processShipMotions: function(node,dt) {
        var motion = node.motion,
        sv = node.velocity,
        ship= node.ship,
        pos = ship.sprite.getPosition(),
        x= pos.x,
        y= pos.y;

        if (motion.right) {
          x = pos.x + dt * sv.vel.x;
        }

        if (motion.left) {
          x = pos.x - dt * sv.vel.x;
        }

        ship.sprite.setPosition(x,y);
        this.clamp(ship);

        motion.right=false;
        motion.left=false;
      },

      clamp: function(ship) {
        var sz= ship.sprite.getContentSize(),
        pos= ship.sprite.getPosition(),
        wz = ccsx.screen();

        if (ccsx.getRight(ship.sprite) > wz.width - csts.TILE) {
          ship.sprite.setPosition(wz.width - csts.TILE - sz.width * 0.5, pos.y);
        }
        if (ccsx.getLeft(ship.sprite) < csts.TILE) {
          ship.sprite.setPosition( csts.TILE + sz.width * 0.5, pos.y);
        }
      }


    });

    return MovementShip;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

