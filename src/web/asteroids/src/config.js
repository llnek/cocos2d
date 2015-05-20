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
 * @requires zotohlab/asx/xcfg
 * @module zotohlab/p/config
 */
define('zotohlab/p/config',

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/xcfg'],

  function (sjs, sh, xcfg) { "use strict";

    /** @alias module:zotohlab/p/config */
    var exports = {},
    P_AS3= 'aster3',
    P_AS2= 'aster2',
    P_AS1= 'aster1';

    exports = sjs.merge( xcfg, {

      appKey: "339a5c13-24b3-4069-9a0a-661820573fb3",

      appid: 'asteroids',
      color: 'red',

      resolution: {
        policy: cc.ResolutionPolicy.FIXED_HEIGHT,
        resSize: [0,0]
      },

      csts: {
        P_LMS: 'live-missiles',
        P_LLS: 'live-lasers',
        P_MS: 'missiles',
        P_LS: 'lasers',

        P_LAS: 'live-asteroids',
        P_AS3: 3,
        P_AS2: 2,
        P_AS1: 1,

        GRID_W: 60,
        GRID_H: 40
      },

      assets: {
        atlases: {
          'lang-pics' : 'res/{{appid}}/l10n/{{lang}}/images',
          'game-pics' : 'res/{{appid}}/pics/images'
        },
        tiles: {
        },
        images: {
          'splash.play-btn' : 'res/cocos2d/btns/play_gray_x64.png',
          'arena' : 'res/{{appid}}/pics/arena.png',
          'gui.mmenu.menu.bg' : 'res/{{appid}}/pics/bg.png',
          'game.bg' : 'res/{{appid}}/pics/bg.png'
        },
        sounds: {
          'game_end' : 'res/cocos2d/sfx/MineExplosion',
          'game_quit' : 'res/cocos2d/sfx/Death'
        },
        fonts: {
        }
      },

      game: {
        sd: {height:320, width:480 }
      },

      levels: {
        "gamelevel1" : {
          tiles : {
            'hudwall' : 'game/{{appid}}/levels/hudwall.tmx',
            'arena' : 'game/{{appid}}/levels/arena.tmx'
          },
          images : {
            'arena' : 'game/{{appid}}/levels/arena.png'
          },
          sprites : {
          },
          cfg: [
            null, // place holder, leave it
            [5, 'rock_large.png', 25],
            [5, 'rock_med.png', 50],
            [10, 'rock_small.png', 100]
          ]
        }
      },

      handleResolution: function(rs) {
        //for default font, we use 48pt
        this.game.scale = 52/256 * rs.width /320;
      },

      runOnce: function() {
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('game-pics'));
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('lang-pics'));
      }

    });

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

