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
define("zotohlab/p/config",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/xcfg'],

  function (sjs, sh, xcfg) { "use strict";

    /** @alias module:zotohlab/p/config */
    var exports= {};

    //////////////////////////////////////////////////////////////////////////////
    //merge stuff in-place.
    exports= sjs.merge( xcfg, {

      appKey : "bd5f79bb-eb41-4ed5-bb44-2529dc27ed3c",

      appid: 'tictactoe',
      color: 'white',

      resolution: {
        policy: cc.ResolutionPolicy.FIXED_HEIGHT,
        resSize: [0,0]
      },

      csts: {
        PLAYER_THINK_TIME: 7,
        GRID_SIZE: 3,
        CELLS: 9,
        CV_Z: 0
      },

      game: {
        //hdr: { width: 960, height: 1440 },
        //hds: { width: 640, height: 960 },
        sd : { width: 320, height: 480 }
      },

      assets: {
        atlases: {
          'lang-pics' : 'res/{{appid}}/l10n/{{lang}}/images',
          'game-pics' : 'res/{{appid}}/pics/images'
        },
        tiles: {
        },
        images: {
          'gui.edit.orange': 'res/cocos2d/pics/orange_edit.png',
          'game.bg' : 'res/{{appid}}/pics/bg.png',
          'gui.mmenu.menu.bg' : 'res/{{appid}}/pics/bg.png'
        },
        sounds: {
          'game_end' : 'res/cocos2d/sfx/MineExplosion',
          'x_pick' : 'res/cocos2d/sfx/ElevatorBeep',
          'o_pick' : 'res/cocos2d/sfx/MineBeep',
          'game_quit' : 'res/cocos2d/sfx/Death'
        },
        fonts: {
          'font.SmallTypeWriting' : [ 'res/cocos2d/fon/{{lang}}', 'SmallTypeWriting.png', 'SmallTypeWriting.fnt' ],
          'font.AutoMission' : [ 'res/cocos2d/fon/{{lang}}', 'AutoMission.png', 'AutoMission.fnt' ],
          'font.Subito' : [ 'res/cocos2d/fon/{{lang}}', 'Subito.png', 'Subito.fnt' ],
          'font.CoffeeBuzzed' : [ 'res/cocos2d/fon/{{lang}}', 'CoffeeBuzzed.png', 'CoffeeBuzzed.fnt' ]
        }
      },

      levels: {
        "gamelevel1" : {
          tiles: {
          },
          images: {
          },
          sprites: {
          }
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

