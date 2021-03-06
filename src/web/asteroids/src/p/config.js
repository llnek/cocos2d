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
P_AS3= 'aster3',
P_AS2= 'aster2',
P_AS1= 'aster1';

/** @alias module:p/config */
const xbox = sjs.merge( xcfg, {

  appKey: "339a5c13-24b3-4069-9a0a-661820573fb3",

  appid: 'asteroids',
  color: 'red',

  resolution: {
    policy: cc.ResolutionPolicy.FIXED_HEIGHT,
    resSize: [0,0]
  },

  csts: {
    P_LMS: 'live-missiles',
    P_LLS: 'live-lasers',
    P_MS: 'missiles',
    P_LS: 'lasers',

    P_LAS: 'live-asteroids',
    P_AS3: 3,
    P_AS2: 2,
    P_AS1: 1,

    GRID_W: 60,
    GRID_H: 40
  },

  assets: {
    atlases: {
      'lang-pics' : 'res/{{appid}}/l10n/{{lang}}/images',
      'game-pics' : 'res/{{appid}}/pics/sprites'
    },
    tiles: {
    },
    images: {
      'gui.mmenus.menu.bg' : 'res/{{appid}}/pics/bg.png',
      'game.bg' : 'res/{{appid}}/pics/bg.png'
    },
    sounds: {
      'game_end' : 'res/cocos2d/sfx/MineExplosion',
      'game_quit' : 'res/cocos2d/sfx/Death'
    },
    fonts: {
    }
  },

  game: {
    sd: {height:320, width:480 }
  },

  levels: {
    "1" : {
      tiles : {
      },
      images : {
      },
      sprites : {
      },
      cfg: [
        null, // place holder, leave it
        [5, 'rock_large.png', 25],
        [5, 'rock_med.png', 50],
        [10, 'rock_small.png', 100]
      ]
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

