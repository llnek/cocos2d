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

define('zotohlab/p/s/rendering', ['cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    Rendering = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      update: function (dt) {
        if (this.state.running) {
          this.processMovement(node,dt);
        }
      },

      processMovement: function(node,dt) {
        // background's moving rate is 16 pixel per second
        var locSkyHeight = this.state.backSkyDim.height,
        locBackSkyRe = this.state.backSkyRe,
        locBackSky = this.state.backSky,
        posy= locBackSky.sprite.getPositionY(),
        movingDist = 16 * dt,
        wz = ccsx.screen(),
        currPosY = posy - movingDist;

        if (locSkyHeight + currPosY <= wz.height) {

          if (!!locBackSkyRe) {
            throw "The memory is leaking at moving background";
          }

          this.state.backSkyRe = this.state.backSky;
          locBackSkyRe = this.state.backSky;

          //create a new background
          this.state.backSky = this.getOrCreate();
          locBackSky = this.state.backSky;
          locBackSky.sprite.setPositionY(currPosY + locSkyHeight - 2);
        } else {
          locBackSky.sprite.setPositionY(currPosY);
        }

        if (!!locBackSkyRe) {
          currPosY = locBackSkyRe.sprite.getPositionY() - movingDist;
          if (currPosY + locSkyHeight < 0) {
            locBackSkyRe.sprite.setVisible(false);
            locBackSkyRe.status=false;
            this.state.backSkyRe = null;
          } else {
            locBackSkyRe.sprite.setPositionY(currPosY);
          }
        }
      },

      getOrCreate: function () {
        var p = sh.pools.BackSkies,
        c= p.get();

        if (!c) {
          utils.createBackSkies(sh.main.getBackgd(), this.state);
          c= p.get();
        }

        if (!!c) {
          c.inflate(0,0);
        }
        return c;
      }


    });

    return Rendering;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

