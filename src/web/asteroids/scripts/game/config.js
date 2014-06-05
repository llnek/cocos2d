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

(function (undef) { "use strict"; var global= this, _ = global._ ,
asterix = global.ZotohLab.Asterix,
sh= asterix.Shell,
loggr = global.ZotohLab.logger;
asterix.Asteroids= {};

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.xcfg = global.ZotohLab.klass.merge( asterix.XConfig, {

  appid: 'asteroids',
  color: 'red',

  csts: {
    GRID_W: 60,
    GRID_H: 40
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
      fixtures: {
        BOULDERS: 5,
        ROCKS: 5,
        STONES: 10
      }
    }
  },

  runOnce: function() {
    cc.SpriteFrameCache.getInstance().addSpriteFrames( sh.xcfg.getPListPath('game-pics'));
  }


});


sh.xcfg.sfxInit();


}).call(this);



