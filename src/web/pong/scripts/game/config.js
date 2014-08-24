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
sjs= global.SkaroJS;


asterix.Pong= {};

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.xcfg = sjs.mergeEx( asterix.XConfig, {

  appid: 'pong',
  color: 'green',

  csts: {
    GRID_W: 60,
    GRID_H: 40
  },

  assets: {
    tiles: {
    },
    images: {
      'splash.play-btn' : 'media/cocos2d/btns/play_gray_x64.png'
    },
    sounds: {
      'game_end' : 'media/cocos2d/sfx/MineExplosion',
      'x_hit' : 'media/cocos2d/sfx/ElevatorBeep',
      'o_hit' : 'media/cocos2d/sfx/MineBeep' ,
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
      'tiles' : {
        'arena' : 'game/{{appid}}/levels/arena.tmx'
      },
      'images' : {
        'paddle2' : 'media/{{appid}}/game/green_paddle.png',
        'paddle1' : 'media/{{appid}}/game/red_paddle.png',
        'ball' : 'media/{{appid}}/game/pongball.png',
        'arena' : 'game/{{appid}}/levels/arena.png'
      },
      'sprites' : {
      }
    }
  },

  runOnce: function() {
  }

});


global.document.ccConfig.init(sh.xcfg.appid, [

      'game/pong/entities/entity.js',
      'game/pong/entities/ball.js',
      'game/pong/entities/human.js',
      'game/pong/entities/robot.js',
      'game/pong/hud.js',
      'game/pong/arena.js',
      'game/pong/game.js',
      'game/pong/mmenu.js',
      'game/pong/splash.js'
], {} );


}).call(this);


