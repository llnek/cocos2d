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
 * @requires zotohlab/asx/xcfg
 * @module p/config
 */

import sh from 'zotohlab/asx/asterix';
import xcfg from 'zotohlab/asx/xcfg';


const MOVES = { RUSH: 0, VERT: 1, HORZ: 2, OLAP: 3 },
ATTACKS= { TSUIHIKIDAN: 2, NORMAL: 1 },
sjs=sh.skarojs;

/** @alias module:p/config */
const xbox = sjs.merge( xcfg, {

  appKey: '4d6b93c4-05d7-42f1-95cc-98ce8adeac0a',

  color: 'yellow',
  appid: 'terra',

  csts: {
    ENEMY_ATTACK: ATTACKS,
    ENEMY_MOVES: MOVES,
    MISSILE_SPEED: 900,
    BOMB_SPEED: 200,
    SHIP_SPEED: 200,

    SHIP_ZX: 3000,

    menuHeight: 36,
    menuWidth: 123,
    flareY: 445
  },

  game: {
    sd: {width:320, height:480}
  },

  assets: {
    atlases: {
      'game-pics' : 'res/{{appid}}/pics/textureTransparentPack',
      'lang-pics' : 'res/{{appid}}/l10n/{{lang}}/images',
      'op-pics' : 'res/{{appid}}/pics/textureOpaquePack',
      'explosions' : 'res/{{appid}}/pics/explosion',
      'back-tiles' : 'res/{{appid}}/pics/b01'
    },
    sprites: {
    },
    tiles: {
    },
    images: {
      'flare': 'res/{{appid}}/pics/flare.jpg',
      'bg' : 'res/{{appid}}/pics/bg.png'
    },
    sounds: {
      'bgMusic' : 'res/{{appid}}/sfx/bgMusic',
      'btnEffect' : 'res/{{appid}}/sfx/buttonEffet',
      'explodeEffect' : 'res/{{appid}}/sfx/explodeEffect',
      'fireEffect' : 'res/{{appid}}/sfx/fireEffect',
      'mainMusic' : 'res/{{appid}}/sfx/mainMainMusic',
      'shipDestroyEffect' : 'res/{{appid}}/sfx/shipDestroyEffect'
    },
    fonts: {
      'font.arial' : [ 'res/{{appid}}/l10n/{{lang}}', 'arial-14.png', 'arial-14.fnt' ]
    }
  },

  EnemyTypes: [ {
      attackMode: ATTACKS.NORMAL,
      moveType: MOVES.RUSH,
      type: 0,
      textureName:"E0.png",
      bulletType:"W2.png",
      HP:1,
      scoreValue:15
    },
    {
      attackMode: ATTACKS.NORMAL,
      moveType: MOVES.RUSH,
      type:1,
      textureName:"E1.png",
      bulletType:"W2.png",
      HP:2,
      scoreValue:40
    },
    {
      attackMode: ATTACKS.TSUIHIKIDAN,
      moveType: MOVES.HORZ,
      type:2,
      textureName:"E2.png",
      bulletType:"W2.png",
      HP:4,
      scoreValue:60
    },
    {
      attackMode: ATTACKS.NORMAL,
      moveType: MOVES.OLAP,
      type:3,
      textureName:"E3.png",
      bulletType:"W2.png",
      HP:6,
      scoreValue:80
    },
    {
      attackMode: ATTACKS.TSUIHIKIDAN,
      moveType: MOVES.HORZ,
      type:4,
      textureName:"E4.png",
      bulletType:"W2.png",
      HP:10,
      scoreValue:150
    },
    {
      attackMode: ATTACKS.NORMAL,
      moveType: MOVES.HORZ,
      type:5,
      textureName:"E5.png",
      bulletType:"W2.png",
      HP:15,
      scoreValue:200
    }
  ],

  levels: {
    "1" : {
      sprites: {
      },
      tiles: {
      },
      images: {
      },
      cfg: {
        enemyMax: 6,
        enemies: [
          { style:"*", time: 2, types:[0,1,2] },
          { style:"*", time: 5, types:[3,4,5] } ]
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
    cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('op-pics'));
    cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('explosions'));
    cc.spriteFrameCache.addSpriteFrames( sh.getPListPath('back-tiles'));
  }

});

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

