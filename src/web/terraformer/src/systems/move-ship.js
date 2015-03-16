// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define('zotohlab/p/s/moveship', ['zotohlab/p/components',
                                 'zotohlab/p/s/utils',
                                 'zotohlab/p/gnodes',
                                 'cherimoia/skarojs',
                                 'zotohlab/asterix',
                                 'zotohlab/asx/ccsx'],

  function (cobjs, utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
    MoveShip = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.ships=null;
      },

      addToEngine: function(engine) {
        this.ships = engine.getNodeList(gnodes.ShipMotionNode);
      },

      update: function (dt) {
        var node= this.ships.head;

        if (this.state.running &&
           !!node) {
          this.processKeys(node,dt);
        }
      },

      processKeys: function(node,dt) {
        var ship = node.ship,
        wz= ccsx.screen(),
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

    return MoveShip;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

