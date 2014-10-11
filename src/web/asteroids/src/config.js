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

define('zotohlab/p/config', ['cherimoia/skarojs',
                            'zotohlab/asterix',
                            'zotohlab/asx/xcfg'],

  function (sjs, sh, xcfg) { "use strict";

    var P_AS3= 'aster3',
    P_AS2= 'aster2',
    P_AS1= 'aster1';

    sjs.merge( xcfg, {

      appKey: "339a5c13-24b3-4069-9a0a-661820573fb3",

      appid: 'asteroids',
      color: 'red',

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
          'game-pics' : 'res/{{appid}}/game/sprites'
        },
        tiles: {
        },
        images: {
          'splash.play-btn' : 'res/cocos2d/btns/play_gray_x64.png'
        },
        sounds: {
          'game_end' : 'res/cocos2d/sfx/MineExplosion',
          'game_quit' : 'res/cocos2d/sfx/Death'
        },
        fonts: {
        }
      },

      devices: {
        iphone:{height:320, width:480, scale:1},
        android:{height:320, width:480, scale:1},
        ipad:{height:320, width:480, scale:2},
        default:{height:320, width:480, scale:1}
      },

      game: {
        size: {height:320, width:480, scale:1}
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
          fixtures: [
            null,
            [5, 'rock_large.png'],
            [5, 'rock_med.png'],
            [10, 'rock_small.png']
          ]
        }
      },

      runOnce: function() {
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('game-pics'));
      }

    });

    return xcfg;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

