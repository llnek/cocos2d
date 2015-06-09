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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/cfg
 * @module p/config
 */

import sh from 'zotohlab/asx/asterix';
import xcfg from 'zotohlab/asx/cfg';

let sjs= sh.skarojs,
/** @alias module:p/config */
xbox = sjs.merge( xcfg, {

  appKey: "fa0860f9-76dc-4135-8bc7-bd5af3147d55",

  appid: 'pong',
  color: 'green',

  resolution: {
    policy: cc.ResolutionPolicy.FIXED_HEIGHT,
    resSize: [0,0]
  },

  csts: {

    BALL_SPEED: 150, // 25 incremental
    PADDLE_SPEED: 200, // 300
    NUM_POINTS: 4,

    GRID_W: 40,
    GRID_H: 60
  },

  assets: {
    atlases: {
      'lang-pics' : 'res/{{appid}}/l10n/{{lang}}/images',
      'game-pics' : 'res/{{appid}}/pics/images'
    },
    tiles: {
    },
    images: {
      'gui.mmenu.menu.bg' : 'res/{{appid}}/pics/bg.png',
      'game.bg' : 'res/{{appid}}/pics/bg.png'
    },
    sounds: {
      'game_end' : 'res/cocos2d/sfx/MineExplosion',
      'x_hit' : 'res/cocos2d/sfx/ElevatorBeep',
      'o_hit' : 'res/cocos2d/sfx/MineBeep' ,
      'game_quit' : 'res/cocos2d/sfx/Death'
    },
    fonts: {
      'font.SmallTypeWriting' : [ 'res/cocos2d/fon/{{lang}}', 'SmallTypeWriting.png', 'SmallTypeWriting.fnt' ],
      'font.AutoMission' : [ 'res/cocos2d/fon/{{lang}}', 'AutoMission.png', 'AutoMission.fnt' ],
      'font.Subito' : [ 'res/cocos2d/fon/{{lang}}', 'Subito.png', 'Subito.fnt' ],
      'font.CoffeeBuzzed' : [ 'res/cocos2d/fon/{{lang}}', 'CoffeeBuzzed.png', 'CoffeeBuzzed.fnt' ]
    }
  },

  game: {
    sd: {width:320, height: 480}
  },

  levels: {
    "1" : {
      'tiles' : {
        //'arena' : 'game/{{appid}}/levels/arena.tmx'
      },
      'images' : {
        //'p.paddle2' : 'res/{{appid}}/pics/green_paddle.png',
        //'p.paddle1' : 'res/{{appid}}/pics/red_paddle.png',
        //'ball' : 'res/{{appid}}/pics/pongball.png',
        //'arena' : 'game/{{appid}}/levels/arena.png'
      },
      'sprites' : {
      }
    }
  },

  handleResolution(rs) {
    //for default font, we use 48pt
    this.game.scale = 52/256 * rs.width /320;
  },

  runOnce() {
    cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('game-pics'));
    cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('lang-pics'));
  }

});


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

