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

(function (undef) { "use strict"; var global= this; var _ = global._ ,
asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
SkaroJS= global.SkaroJS;

asterix.Invaders= {};

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.xcfg = SkaroJS.merge( asterix.XConfig, {

  appid: 'invaders',
  color: 'red',

  csts: {
    GRID_W: 40,
    GRID_H: 60,

    COLS: 7,
    ROWS: 7,
    CELLS: 49,

    LEFT : 2,
    TOP: 6,
    OFF_X : 4,
    OFF_Y : 2
  },

  assets: {
    atlases: {
      'game-pics' : 'media/{{appid}}/game/sprites'
    },
    tiles: {
    },
    images: {
      'splash.play-btn' : 'media/cocos2d/btns/play_gray_x64.png'
    },
    sounds: {
      'game_end' : 'media/cocos2d/sfx/MineExplosion',
      'game_quit' : 'media/cocos2d/sfx/Death',
      'ship-missile' : 'media/{{appid}}/sfx/missile',
      'bugs-march' : 'media/{{appid}}/sfx/march',
      'xxx-explode' : 'media/{{appid}}/sfx/explode'
    },
    fonts: {
    }
  },

  devices: {
    iphone:{width:320, height:480, scale:1},
    android:{width:320, height:480, scale:1},
    ipad:{width:320, height:480, scale:2},
    default:{width:320, height:480, scale:1}
  },

  game: {
    size: {width:320, height:480, scale:1}
  },

  levels: {
    "gamelevel1" : {
      'tiles' : {
        'arena' : 'game/{{appid}}/levels/arena.tmx'
      },
      'images' : {
      },
      'sprites' : {
      }
    }
  },

  runOnce: function() {
    cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('game-pics'));
  }

});


global.document.ccConfig.initAppFiles(sh.xcfg.appid, [

      'game/invaders/entities/explode.js',
      'game/invaders/entities/missile.js',
      'game/invaders/entities/bomb.js',
      'game/invaders/entities/player.js',
      'game/invaders/entities/alien.js',
      'game/invaders/game.js',
      'game/invaders/mmenu.js',
      'game/invaders/splash.js'
]);


}).call(this);


