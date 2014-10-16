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

define('zotohlab/p/s/movesky', [
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/xcfg',
                                  'zotohlab/asx/ccsx',
                                  'ash-js'],

  function (sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    MovementSky = Ash.System.extend({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      update: function (dt) {
        var node= {};

        if (this.state.running &&
           !!node) {
          this.processMovement(node,dt);
        }
      },

      processMovement: function(node,dt) {
        var movingDist = 16 * dt;       // background's moving rate is 16 pixel per second

        var locSkyHeight = this.state.backSkyDim.height,
        locBackSkyRe = this.state.backSkyRe,
        locBackSky = this.state.backSky,
        pos= locBackSky.sprite.getPosition(),
        wz = ccsx.screen(),
        currPosY = pos.y - movingDist;
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
        var j, c = null;
        for (j = 0; j < this.state.backSkies.length; ++j) {
            c = this.state.backSkies[j];
            if (!c.status) {
              c.sprite.setVisible(true);
              c.status = true;
              return c;
            }
        }
        c = this.state.factory.createBackSky(sh.main.getBackgd(), this.state);
        c.status=true;
        this.state.backSkies.push(c);
        return c;
      }


    });

    return MovementSky;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

