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
define("zotohlab/p/config", ['cherimoia/skarojs',
                            'zotohlab/asterix',
                            'zotohlab/asx/xcfg'],

  function (sjs, sh, xcfg) { "use strict";

    /** @alias module:zotohlab/p/config */
    let exports  = {},
    ENEMY_MOVE = {
      RUSH    : 0,
      VERT    : 1,
      HORZ    : 2,
      OLAP    : 3
    },
    ENEMY_ATTACK= {
      TSUIHIKIDAN : 2,
      NORMAL      : 1
    };

    exports = sjs.merge( xcfg, {

      appKey: '4d6b93c4-05d7-42f1-95cc-98ce8adeac0a',

      appid: 'terraformer',
      color: 'yellow',

      csts: {
        ENEMY_ATTACK: ENEMY_ATTACK,
        ENEMY_MOVE : ENEMY_MOVE,
        MISSILE_SPEED: 900,
        BOMB_SPEED: 200,
        SHIP_SPEED: 200,

        SHIP_ZX: 3000,

        menuHeight: 36,
        menuWidth: 123
      },

      game: {
        size: {width:320, height:480, scale:1}
      },

      assets: {
        atlases: {
          'tr-pics' : 'res/{{appid}}/pics/textureTransparentPack',
          'op-pics' : 'res/{{appid}}/pics/textureOpaquePack',
          'explosions' : 'res/{{appid}}/pics/explosion',
          'back-tiles' : 'res/{{appid}}/pics/b01'
        },
        sprites: {
        },
        tiles: {
        },
        images: {
          'splash.play-btn' : 'res/cocos2d/btns/play_gray_x64.png',

          'cocos2d_html5' : 'res/{{appid}}/pics/cocos2d-html5.png',
          'flare': 'res/{{appid}}/pics/flare.jpg',
          'gameOver': 'res/{{appid}}/pics/gameOver.png',
          'loading': 'res/{{appid}}/pics/loading.png',
          'logo': 'res/{{appid}}/pics/logo.png',
          'b01' : 'res/{{appid}}/pics/b01.png',

          'menu-btns': 'res/{{appid}}/fon/{{lang}}/menu.png',
          'menuTitle': 'res/{{appid}}/fon/{{lang}}/menuTitle.png'

        },
        sounds: {
          'bgMusic' : 'res/{{appid}}/sfx/bgMusic',
          'buttonEffect' : 'res/{{appid}}/sfx/buttonEffet',
          'explodeEffect' : 'res/{{appid}}/sfx/explodeEffect',
          'fireEffect' : 'res/{{appid}}/sfx/fireEffect',
          'mainMainMusic' : 'res/{{appid}}/sfx/mainMainMusic',
          'shipDestroyEffect' : 'res/{{appid}}/sfx/shipDestroyEffect'
        },
        fonts: {
          'font.arial' : [ 'res/{{appid}}/fon/{{lang}}', 'arial-14.png', 'arial-14.fnt' ]
        }
      },

      EnemyTypes: [ {
          attackMode: ENEMY_ATTACK.NORMAL,
          moveType: ENEMY_MOVE.RUSH,
          type: 0,
          textureName:"E0.png",
          bulletType:"W2.png",
          HP:1,
          scoreValue:15
        },
        {
          attackMode: ENEMY_ATTACK.NORMAL,
          moveType: ENEMY_MOVE.RUSH,
          type:1,
          textureName:"E1.png",
          bulletType:"W2.png",
          HP:2,
          scoreValue:40
        },
        {
          attackMode: ENEMY_ATTACK.TSUIHIKIDAN,
          moveType: ENEMY_MOVE.HORZ,
          type:2,
          textureName:"E2.png",
          bulletType:"W2.png",
          HP:4,
          scoreValue:60
        },
        {
          attackMode: ENEMY_ATTACK.NORMAL,
          moveType: ENEMY_MOVE.OLAP,
          type:3,
          textureName:"E3.png",
          bulletType:"W2.png",
          HP:6,
          scoreValue:80
        },
        {
          attackMode: ENEMY_ATTACK.TSUIHIKIDAN,
          moveType: ENEMY_MOVE.HORZ,
          type:4,
          textureName:"E4.png",
          bulletType:"W2.png",
          HP:10,
          scoreValue:150
        },
        {
          attackMode: ENEMY_ATTACK.NORMAL,
          moveType: ENEMY_MOVE.HORZ,
          type:5,
          textureName:"E5.png",
          bulletType:"W2.png",
          HP:15,
          scoreValue:200
        }
      ],

      levels: {
        "gamelevel1" : {
          sprites: {
          },
          tiles: {
          },
          images: {
          },
          cfg: {
            enemyMax: 6,
            enemies: [
              { style:"Repeat", time: 2, types:[0,1,2] },
              { style:"Repeat", time: 5, types:[3,4,5] } ]
          }

        }
      },

      runOnce() {
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('tr-pics'));
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('op-pics'));
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('explosions'));
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('back-tiles'));
      }

    });

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

