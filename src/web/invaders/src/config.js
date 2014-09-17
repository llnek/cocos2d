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

(function (undef) { "use strict"; var global= this; var _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS;

asterix.Invaders= {};

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.xcfg = sjs.mergeEx( asterix.XConfig, {

  appKey: "d39bf198-518a-4de7-88a0-5e28c88571b0",

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
      'game-pics' : 'res/{{appid}}/game/sprites'
    },
    tiles: {
    },
    images: {
      'splash.play-btn' : 'res/cocos2d/btns/play_gray_x64.png'
    },
    sounds: {
      'game_end' : 'res/cocos2d/sfx/MineExplosion',
      'game_quit' : 'res/cocos2d/sfx/Death',
      'ship-missile' : 'res/{{appid}}/sfx/missile',
      'bugs-march' : 'res/{{appid}}/sfx/march',
      'xxx-explode' : 'res/{{appid}}/sfx/explode'
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


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF
