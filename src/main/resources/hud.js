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
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xscenes
 * @module zotohlab/p/hud
 */
define('zotohlab/p/hud', ['cherimoia/skarojs',
                         'zotohlab/asterix',
                         'zotohlab/asx/ccsx',
                         'zotohlab/asx/xscenes'],

  function(sjs, sh, ccsx, scenes) { "use strict";

    /** @alias module:zotohlab/p/hud */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @extends module:zotohlab/asx/xscenes.XLayer
     * @class BackLayer
     */
    BackLayer = scenes.XLayer.extend({

      /**
       * @method rtti
       */
      rtti() { return 'BackLayer'; },

      /**
       * @method pkInit
       * @protected
       */
      pkInit() {
        return this._super();
      }

    }),

    /**
     * @extends module:zotohlab/asx/xscenes.XGameHUDLayer
     * @class HUDLayer
     */
    HUDLayer = scenes.XGameHUDLayer.extend({

      /**
       * @method initAtlases
       * @protected
       */
      initAtlases() {
      },

      /**
       * @method initLabels
       * @protected
       */
      initLabels() {
        let offset = csts.TILE - csts.S_OFF,
        wz = ccsx.vrect();

        this.scoreLabel = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.TinyBoxBB'),
          text: '0',
          anchor: ccsx.acs.BottomRight,
          scale: 12/72
        });

        this.scoreLabel.setPosition(wz.width - offset,
          wz.height - offset - ccsx.getScaledHeight(this.scoreLabel));

        this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
      },

      /**
       * @method initIcons
       * @protected
       */
      initIcons() {
        const wz = ccsx.vrect();

        this.lives = new layers.XHUDLives( this, csts.TILE + csts.S_OFF,
          wz.height - csts.TILE - csts.S_OFF, {
          frames: ['health.png'],
          totalLives: 3
        });

        this.lives.create();
      },

      XXXinitCtrlBtns: function(s) {
        //this._super(32/48);
      }

    });

    exports = /** @lends exports# */ {

      /**
       * @property {BackLayer} BackLayer
       */
      BackLayer : BackLayer,

      /**
       * @property {HUDLayer} HUDLayer
       */
      HUDLayer : HUDLayer
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

