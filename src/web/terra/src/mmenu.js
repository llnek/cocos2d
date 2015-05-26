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
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asx/xmmenus
 * @module zotohlab/p/mmenu
 */
define('zotohlab/p/mmenu',

       ['zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xscenes',
        'zotohlab/asx/xmmenus'],

  function (utils, sjs, sh, ccsx, scenes, mmenus) { "use strict";

    /** @alias module:zotohlab/p/mmenu */
    let exports= {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @extends module:zotohlab/asx/xmmenus.XMenuLayer
     * @class MainMenuLayer
     */
    MainMenuLayer = mmenus.XMenuLayer.extend({

      /**
       * @method onNewGame
       * @private
       */
      onNewGame() {
        sh.sfxCancel();
        sh.fire('/mmenu/newgame', { mode: sh.gtypes.P1_GAME });
      },

      /**
       * @method pkInit
       * @protected
       */
      pkInit() {
      },

      /**
       * @method update
       * @protected
       */
      update() {
      }

    });

    exports= /** @lends exports# */{

      /**
       * @property {String} rtti
       */
      rtti : sh.ptypes.mmenu,

      /**
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        return new scenes.XSceneFactory([
          MainMenuLayer
        ]).reify(options).onmsg('/mmenu/newgame', (topic, msg) => {
            cc.director.runScene( sh.protos[sh.ptypes.game].reify(msg));
          });
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

