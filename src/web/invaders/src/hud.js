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
 * @requires zotohlab/asx/xlayers
 * @module zotohlab/p/hud
 */
define('zotohlab/p/hud',

       ['cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx',
       'zotohlab/asx/xlayers'],

  function(sjs, sh, ccsx, layers) { "use strict";

    /** @alias module:zotohlab/p/hud */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class BackLayer
     */
    BackLayer = layers.XLayer.extend({

      rtti() { return 'BackLayer'; },

      pkInit() {
        this.centerImage(sh.getImagePath('game.bg'));
      }
    }),

    /**
     * @class HUDLayer
     */
    HUDLayer = layers.XGameHUDLayer.extend({

      initAtlases() {
        this.regoAtlas('game-pics');
      },

      initLabels() {
        const wb = ccsx.vbox();

        this.scoreLabel = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.SmallTypeWriting'),
          text: '0',
          anchor: ccsx.acs.BottomRight,
          scale: xcfg.game.scale// * 2
        });
        this.scoreLabel.setPosition(wb.right - csts.TILE - csts.S_OFF,
          wb.top - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));

        this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
      },

      initIcons: function() {
        const wb = ccsx.vbox();

        this.lives = new layers.XHUDLives( this, csts.TILE + csts.S_OFF,
          wb.top - csts.TILE - csts.S_OFF, {
          frames: ['health.png'],
          totalLives: 3
        });

        this.lives.reify();
      },

      ctor(options) {
        const color= cc.color(255,255,255),
        scale=1;

        this._super(options);

        this.options.i_replay= {
          imgPath: '#icon_replay.png',
          where: ccsx.acs.Bottom,
          color: color,
          scale : scale,
          visible: false,
          cb() {
            sh.fire('/hud/replay');
          }
        };

        this.options.i_menu= {
          imgPath: '#icon_menu.png',
          where: ccsx.acs.Bottom,
          color: color,
          scale: scale,
          cb() {
            sh.fire('/hud/showmenu');
          }
        };

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

