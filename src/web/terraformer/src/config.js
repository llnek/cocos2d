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

define("zotohlab/p/config", ['cherimoia/skarojs',
                            'zotohlab/asterix',
                            'zotohlab/asx/xcfg'],

  function (sjs, sh, xcfg) { "use strict";

    sjs.merge( xcfg, {

      appKey: '4d6b93c4-05d7-42f1-95cc-98ce8adeac0a',


      appid: 'terraformer',
      color: 'yellow',

      csts: {
      },

      game: {
        size: {width:320, height:480, scale:1}
      },

      assets: {
        atlases: {
          'tr-pics' : 'res/{{appid}}/pics/textureTransparentPack',
          'op-pics' : 'res/{{appid}}/pics/textureOpaquePack',
          'explosions' : 'res/{{appid}}/pics/explosion',
          'b01' : 'res/{{appid}}/pics/b01'
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

      runOnce: function() {
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('tr-pics'));
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('op-pics'));
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('explosions'));
        cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('b01'));
      }

    });


    return xcfg;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

