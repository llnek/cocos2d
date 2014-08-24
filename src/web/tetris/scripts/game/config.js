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

(function (undef) { "use strict"; var global= this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs = global.SkaroJS;

asterix.Bricks= {};

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.xcfg = sjs.mergeEx( asterix.XConfig, {

  appid: 'tetris',
  color: 'silver',

  csts: {
    BLOCK_COLORS: 8,
    FIELD_SIDE: 1,
    FIELD_TOP: 1,
    FIELD_W: 12,
    FIELD_BOTTOM: 1,
    BTN_SIZE: 32,
    GRID_W: 30,
    GRID_H: 20,
    TILE: 16
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
      'game_quit' : 'media/cocos2d/sfx/Death'
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
    size: {height:320, width:480, scale:1},
    borderTiles: 'cbox-borders_x16.png'
  },

  levels: {
    "gamelevel1" : {
      'tiles' : {
        'arena' : 'game/{{appid}}/levels/arena.tmx'
      },
      'images' : {
        'arena' : 'game/{{appid}}/levels/arena.png'
      },
      'sprites' : {
      }
    }
  },

  runOnce: function() {
    cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('game-pics'));
  }

});

//////////////////////////////////////////////////////////////////////////////
// js files
//////////////////////////////////////////////////////////////////////////////

global.document['ccConfig'].init(sh.xcfg.appid, [

      'game/tetris/entities/block.js',
      'game/tetris/entities/shape.js',
      'game/tetris/entities/box.js',
      'game/tetris/entities/line.js',
      'game/tetris/entities/nub.js',
      'game/tetris/entities/elx.js',
      'game/tetris/entities/el.js',
      'game/tetris/entities/stx.js',
      'game/tetris/entities/st.js',
      'game/tetris/hud.js',
      'game/tetris/game.js',
      'game/tetris/mmenu.js',
      'game/tetris/splash.js'
], {} );


}).call(this);


