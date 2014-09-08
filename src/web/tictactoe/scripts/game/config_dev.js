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

asterix.TicTacToe= {};

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.xcfg = sjs.mergeEx( asterix.XConfig, {

  appid: 'tictactoe',
  color: 'sky',

  csts: {
    CV_X: 'X'.charCodeAt(0),
    CV_O: 'O'.charCodeAt(0),
    //GRID_SIZE: 3,
    //CELLS: 9,
    GRID_W: 40,
    GRID_H: 60,
    C_GAP: 1,
    R_GAP: 1,
    LEFT: 4,
    HOLE: 10,
    GAP: 10
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

  assets: {
    tiles: {
    },
    images: {
      'splash.play-btn' : 'res/cocos2d/btns/play_blue_x64.png'
    },
    sounds: {
      'game_end' : 'audio/cocos2d/sfx/MineExplosion',
      'x_pick' : 'audio/cocos2d/sfx/ElevatorBeep',
      'o_pick' : 'audio/cocos2d/sfx/MineBeep',
      'game_quit' : 'audio/cocos2d/sfx/Death'
    },
    fonts: {
    }
  },

  levels: {
    "gamelevel1" : {
      tiles: {
        'arena' : 'src/{{appid}}/levels/arena.tmx'
      },
      images: {
        'arena' : 'src/{{appid}}/levels/arena.png'
      },
      sprites: {
        'markers' : [ 'res/{{appid}}/game/markers.png', 72,72, -1]
      }
    }
  }

});

//////////////////////////////////////////////////////////////////////////////
//

//TODO: devicewebdiff
global.document['ccConfig'].init(sh.xcfg.appid, [
      'zotohlab/ext/negamax.js',
      'game/tictactoe/board.js',
      'game/tictactoe/hud.js',
      'game/tictactoe/game.js',
      'game/tictactoe/mmenu.js',
      'game/tictactoe/splash.js'
], {});


}).call(this);


