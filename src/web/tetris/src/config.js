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

define("zotohlab/p/config",

       ["cherimoia/skarojs",
        'zotohlab/asterix',
        'zotohlab/asx/xcfg'],

  function (sjs, sh, xcfg) { "use strict";

    sjs.merge( xcfg, {

      appKey: "fb0fdd0b-1821-42d9-b6f7-26b11218b40d",

      appid: 'tetris',
      color: 'silver',

      resolution: {
        policy: cc.ResolutionPolicy.FIXED_WIDTH,
        resSize: [0,0]
      },

      csts: {
        BLOCK_COLORS: 8,
        //FIELD_SIDE: 1,
        //FIELD_TOP: 1,
        FIELD_W: 12,
        //FIELD_BOTTOM: 1,

        THROTTLEWAIT: 100,
        DROPSPEED: 1000,

        BTN_SIZE: 32,
        //GRID_W: 30,
        //GRID_H: 20,
        CBOX: null,
        FENCE: 0,
        TILE: 0 // set via code
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
        },
        sounds: {
          'game_end' : 'res/cocos2d/sfx/MineExplosion',
          'game_quit' : 'res/cocos2d/sfx/Death'
        },
        fonts: {
          'font.SmallTypeWriting' : [ 'res/cocos2d/fon/{{lang}}', 'SmallTypeWriting.png', 'SmallTypeWriting.fnt' ],
          'font.AutoMission' : [ 'res/cocos2d/fon/{{lang}}', 'AutoMission.png', 'AutoMission.fnt' ],
          'font.Subito' : [ 'res/cocos2d/fon/{{lang}}', 'Subito.png', 'Subito.fnt' ],
          'font.CoffeeBuzzed' : [ 'res/cocos2d/fon/{{lang}}', 'CoffeeBuzzed.png', 'CoffeeBuzzed.fnt' ]
        }
      },

      game: {
        sd: {height:320, width:480, scale:1},
        landscape: true
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
        this.game.scale = 12/72 * rs.width /480;
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

