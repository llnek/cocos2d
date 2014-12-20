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

define('zotohlab/p/config',

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/xcfg'],

  function (sjs, sh, xcfg) { "use strict";

    sjs.merge( xcfg, {

      appKey: "d39bf198-518a-4de7-88a0-5e28c88571b0",

      appid: 'invaders',
      color: 'red',

      resolution: {
        policy: cc.ResolutionPolicy.FIXED_HEIGHT,
        resSize: [0,0]
      },

      csts: {
        //GRID_W: 40,
        //GRID_H: 60,

        P_MS: 'missiles',
        P_BS: 'bombs',
        P_ES: 'explosions',
        P_LMS: 'live-missiles',
        P_LBS: 'live-bombs',

        COLS: 6,
        ROWS: 7,
        CELLS: 42,

        LEFT : 2,
        TOP: 6,
        OFF_X : 4,
        OFF_Y : 2
      },

      assets: {
        atlases: {
          'lang-pics' : 'res/{{appid}}/l10n/{{lang}}/images',
          'game-pics' : 'res/{{appid}}/pics/images'
        },
        tiles: {
        },
        images: {
          'game.bg' : 'res/{{appid}}/pics/bg.png'
          //'splash.play-btn' : 'res/cocos2d/btns/play_gray_x64.png'
        },
        sounds: {
          'game_end' : 'res/cocos2d/sfx/MineExplosion',
          'game_quit' : 'res/cocos2d/sfx/Death',
          'ship-missile' : 'res/{{appid}}/sfx/missile',
          'bugs-march' : 'res/{{appid}}/sfx/march',
          'xxx-explode' : 'res/{{appid}}/sfx/explode'
        },
        fonts: {
          'font.SmallTypeWriting' : [ 'res/cocos2d/fon/{{lang}}', 'SmallTypeWriting.png', 'SmallTypeWriting.fnt' ],
          'font.AutoMission' : [ 'res/cocos2d/fon/{{lang}}', 'AutoMission.png', 'AutoMission.fnt' ],
          'font.Subito' : [ 'res/cocos2d/fon/{{lang}}', 'Subito.png', 'Subito.fnt' ],
          'font.CoffeeBuzzed' : [ 'res/cocos2d/fon/{{lang}}', 'CoffeeBuzzed.png', 'CoffeeBuzzed.fnt' ]
        }
      },

      game: {
        sd: {width:320, height:480 }
      },

      levels: {
        "gamelevel1" : {
          'tiles' : {
          },
          'images' : {
          },
          'sprites' : {
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

    return xcfg;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

