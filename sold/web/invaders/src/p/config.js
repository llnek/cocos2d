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


const sjs= sh.skarojs,
/** @alias module:p/config */
xbox = sjs.merge( xcfg, {

  appKey: "d39bf198-518a-4de7-88a0-5e28c88571b0",

  appid: 'invaders',
  color: 'red',

  resolution: {
    policy: cc.ResolutionPolicy.FIXED_HEIGHT,
    resSize: [0,0]
  },

  csts: {
    //GRID_W: 40,
    //GRID_H: 60,

    P_MS: 'missiles',
    P_BS: 'bombs',
    P_ES: 'explosions',
    P_LMS: 'live-missiles',
    P_LBS: 'live-bombs',

    COLS: 6,
    ROWS: 7,
    CELLS: 42,

    LEFT : 2,
    TOP: 6,
    OFF_X : 4,
    OFF_Y : 2
  },

  assets: {
    atlases: {
      'lang-pics' : 'res/{{appid}}/l10n/{{lang}}/images',
      'game-pics' : 'res/{{appid}}/pics/images'
    },
    tiles: {
    },
    images: {
      'gui.mmenus.menu.bg' : 'res/{{appid}}/pics/bg.png',
      'game.bg' : 'res/{{appid}}/pics/bg.png'
    },
    sounds: {
      'game_end' : 'res/cocos2d/sfx/MineExplosion',
      'game_quit' : 'res/cocos2d/sfx/Death',
      'ship-missile' : 'res/{{appid}}/sfx/missile',
      'bugs-march' : 'res/{{appid}}/sfx/march',
      'xxx-explode' : 'res/{{appid}}/sfx/explode'
    },
    fonts: {
      'font.SmallTypeWriting' : [ 'res/cocos2d/fon/{{lang}}', 'SmallTypeWriting.png', 'SmallTypeWriting.fnt' ],
      'font.AutoMission' : [ 'res/cocos2d/fon/{{lang}}', 'AutoMission.png', 'AutoMission.fnt' ],
      'font.Subito' : [ 'res/cocos2d/fon/{{lang}}', 'Subito.png', 'Subito.fnt' ],
      'font.CoffeeBuzzed' : [ 'res/cocos2d/fon/{{lang}}', 'CoffeeBuzzed.png', 'CoffeeBuzzed.fnt' ]
    }
  },

  game: {
    sd: {width:320, height:480 }
  },

  levels: {
    "1" : {
      'tiles' : {
      },
      'images' : {
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
    cc.spriteFrameCache.addSpriteFrames( sh.getPList('game-pics'));
    cc.spriteFrameCache.addSpriteFrames( sh.getPList('lang-pics'));
  }

});



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

