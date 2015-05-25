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
define('zotohlab/p/hud',

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xscenes'],

  function(sjs, sh, ccsx, scenes) { "use strict";

    /** @alias module:zotohlab/p/hud */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
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
        this.regoAtlas('back-tiles');
        this.regoAtlas('tr-pics');
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
        this.hudAtlas= 'tr-pics';
        this.regoAtlas(this.hudAtlas);
      },

      /**
       * @method initLabels
       * @protected
       */
      initLabels() {
        let wz = ccsx.vrect();

        this.scoreLabel = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.TinyBoxBB'),
          text: '0',
          anchor: ccsx.AnchorBottomRight,
          scale: 12/72
        });
        this.scoreLabel.setPosition( wz.width - csts.TILE - csts.S_OFF,
          wz.height - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));

        this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
      },

      /**
       * @method initIcons
       * @protected
       */
      initIcons() {
        let wz = ccsx.vrect();

        this.lives = new scenes.XHUDLives( this, csts.TILE + csts.S_OFF,
          wz.height - csts.TILE - csts.S_OFF, {
          frames: ['ship01.png'],
          scale: 0.4,
          totalLives: 3
        });

        this.lives.create();
      },

      XXinitCtrlBtns(s) {
        //this._super(32/48);
      }

    });

    exports= /** @lends exports# */{

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

