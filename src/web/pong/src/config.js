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

  appKey: "fa0860f9-76dc-4135-8bc7-bd5af3147d55",

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
      'splash.play-btn' : 'res/cocos2d/btns/play_gray_x64.png'
    },
    sounds: {
      'game_end' : 'res/cocos2d/sfx/MineExplosion',
      'x_hit' : 'res/cocos2d/sfx/ElevatorBeep',
      'o_hit' : 'res/cocos2d/sfx/MineBeep' ,
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
      'tiles' : {
        'arena' : 'game/{{appid}}/levels/arena.tmx'
      },
      'images' : {
        'paddle2' : 'res/{{appid}}/game/green_paddle.png',
        'paddle1' : 'res/{{appid}}/game/red_paddle.png',
        'ball' : 'res/{{appid}}/game/pongball.png',
        'arena' : 'game/{{appid}}/levels/arena.png'
      },
      'sprites' : {
      }
    }
  },

  runOnce: function() {
  }

});


}).call(this);


//////////////////////////////////////////////////////////////////////////////
//EOF

