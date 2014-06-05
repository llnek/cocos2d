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
var asterix = global.ZotohLab.Asterix;
var sh= asterix.Shell;
var loggr = global.ZotohLab.logger;
asterix.Invaders= {};

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.xcfg = global.ZotohLab.klass.merge( asterix.XConfig, {

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
    cc.SpriteFrameCache.getInstance().addSpriteFrames( sh.xcfg.getPListPath('game-pics'));
  }

});


sh.xcfg.sfxInit();


}).call(this);


