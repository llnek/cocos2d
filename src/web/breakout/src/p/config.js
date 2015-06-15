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

  appKey :  "7d943e06-0849-4bf4-a16d-64a401f72a3e",

  appid: 'breakout',
  color: 'yellow',

  resolution: {
    policy: cc.ResolutionPolicy.FIXED_HEIGHT,
    resSize: [0,0]
  },

  csts: {
    GRID_W: 40,
    GRID_H: 60,

    CANDIES: ['red_candy','amber_candy','white_candy','green_candy','yellow_candy','blue_candy',
              'purple_plus_candy', 'purple_minus_candy'],

    ROWS: 5,
    COLS: 9,
    TOP: 6,

    TOP_ROW: 10,

    PADDLE_OFF: 4,
    LEFT_OFF: 4
  },

  assets: {
    atlases: {
      'game-pics' : 'res/{{appid}}/pics/sprites',
      'lang-pics' : 'res/{{appid}}/l10n/{{lang}}/images'
    },
    tiles: {
    },
    images: {
      'gui.mmenus.menu.bg' : 'res/{{appid}}/pics/bg.png',
      'game.bg' : 'res/{{appid}}/pics/bg.png',
    },
    sounds: {
      'game_end' : 'res/cocos2d/sfx/MineExplosion',
      'game_quit' : 'res/cocos2d/sfx/Death',
      'ball-paddle' : 'res/cocos2d/sfx/ElevatorBeep',
      'ball-brick' : 'res/cocos2d/sfx/MineBeep'
    },
    fonts: {
    }
  },

  game: {
    sd: {width:320, height:480}
  },

  levels: {
    "1" : {
      'tiles' : {
      },
      'images' : {
      },
      'sprites' : {
      },
      'cfg' : [ 0, 1, 5, 3, 4]
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

