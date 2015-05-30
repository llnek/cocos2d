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
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/hud
 */
define('zotohlab/p/hud',

       ['zotohlab/asx/xscenes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function(scenes, sh, ccsx ) { "use strict";

    /** @alias module:zotohlab/p/hud */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
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
        this.regoAtlas(this.hudAtlas());
      },
      /**
       * @method hudAtlas
       * @protected
       */
      hudAtlas() {
        return 'game-pics';
      },
      /**
       * @method initLabels
       * @protected
       */
      initLabels() {
        const wz = ccsx.vrect();

        this.scoreLabel = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.TinyBoxBB'),
          text: '0',
          anchor: ccsx.acs.BottomRight,
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
        const wz = ccsx.vrect();

        this.lives = new scenes.XHUDLives( this, csts.TILE + csts.S_OFF,
          wz.height - csts.TILE - csts.S_OFF, {
          frames: ['ship01.png'],
          scale: 0.4,
          totalLives: 3
        });

        this.lives.create();
      },
      /**
       * @method resetAsNew
       * @protected
       */
      resetAsNew() {
        this.reset();
        this.score=0;
      },
      /**
       * @method ctor
       * @constructs
       * @param {Object} options
       */
      ctor(options) {
        this._super(options);
        this.options.i_menu= {
          cb() { sh.fire('/hud/showmenu'); },
          nnn: '#icon_menu.png',
          where: ccsx.acs.Bottom,
          scale: 32/48
        };
        this.options.i_replay = {
          cb() { sh.fire('/hud/replay'); },
          where: ccsx.acs.Bottom,
          nnn: '#icon_replay.png',
          scale : 32/48,
          visible: false
        };
      }

    });

    exports= /** @lends exports# */{
      /**
       * @property {HUDLayer} HUDLayer
       */
      HUDLayer : HUDLayer
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF
