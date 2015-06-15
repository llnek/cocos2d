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
 * @module zotohlab/asx/cfg
 */

import sh from 'zotohlab/asx/asterix';

//////////////////////////////////////////////////////////////////////////////
let sjs= sh.skarojs,
R= sjs.ramda,
undef;

/** @alias module:zotohlab/asx/cfg */
const xbox = /** @lends xbox# */{

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {String} urlPreix
   */
  urlPrefix: '/public/ig/',

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {String} appid
   */
  appid: '',

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {String} color
   */
  color: '',

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {Object} resolution
   */
  resolution: {
    web: cc.ResolutionPolicy.SHOW_ALL,
    resDir: 'sd'
  },

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {Object} levels
   */
  levels: {
  },

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {Object} assets
   */
  assets: {

    sprites: {
      //'gui.audio' : [ 'res/cocos2d/btns/{{color}}/audio_onoff.png', 48,48, -1 ]
    },

    atlases : {
    },

    tiles: {
      //'gui.blank' : 'game/{{appid}}/levels/blankscreen.tmx',
      //'gui.mmenu' : 'game/{{appid}}/levels/mainmenu.tmx'
    },

    images: {
      //'gui.mmenu.border16': 'res/cocos2d/pics/cbox-borders_x16.png',
      //'gui.mmenu.border8': 'res/cocos2d/pics/cbox-borders_x8.png',
      //'gui.mmenu.border': 'game/{{appid}}/levels/{{border-tiles}}',
    },

    sounds: {
      'start_game' : 'res/cocos2d/sfx/PowerUp'
    },

    fonts: {
      'font.TinyBoxBB' : [ 'res/cocos2d/fon/{{lang}}', 'TinyBoxBlackBitA8.png', 'TinyBoxBlackBitA8.fnt' ],
      'font.OogieBoogie' : [ 'res/cocos2d/fon/{{lang}}', 'OogieBoogie.png', 'OogieBoogie.fnt' ],
      'font.JellyBelly' : [ 'res/cocos2d/fon/{{lang}}', 'JellyBelly.png', 'JellyBelly.fnt' ],
      'font.AgentOrange' : [ 'res/cocos2d/fon/{{lang}}', 'AgentOrange.png', 'AgentOrange.fnt' ],
      'font.Hiruko' : [ 'res/cocos2d/fon/{{lang}}', 'Hiruko.png', 'Hiruko.fnt' ],
      'font.OCR' : [ 'res/cocos2d/fon/{{lang}}', 'OCR.png', 'OCR.fnt' ]
    }
  },

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {Object} game
   */
  game: {
    borderTiles: 'cbox-borders_x8.png',
    start: sh.ptypes.start,
    preloadLevels: true,
    scale: 1,
    sfx: 'mp3',
    landscape: false,
    gravity: 0,
    version: "",
    trackingID: ""
  },

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {StateMachine} smac
   */
  smac: null,

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {Object} l10nTable
   */
  l10nTable: {
    "en" : {
      '%mobileStart' : 'Press Anywhere To Start!',
      '%webStart' : 'Press Spacebar To Start!',

      '%passwd' : 'Password',
      '%userid' : 'UserId',

      "%player2" : 'Player 2',
      "%player1" : 'Player 1',
      "%computer" : 'Computer',
      "%cpu" : "CPU",

      "%2players" : '2 Players',
      "%1player" : '1 Player',
      "%online" : 'Online',

      "%gameover" : 'Game Over',
      "%quit!" : 'Quit',
      "%back" : 'Back',
      "%ok" : 'OK',

      "%mmenu" : 'Main Menu',
      "%replay" : 'REPLAY',
      "%play" : 'PLAY',

      "%waitothers" : 'Waiting...\nfor other players.',
      "%waitother" : 'Waiting...\nfor another player.',
      "%signinplay" : 'Please sign in to play.',

      "%quit?" : 'Continue and quit game?'
    }
  },

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {Object} csts
   */
  csts: {
    CV_X: 'X'.charCodeAt(0),
    CV_O: 'O'.charCodeAt(0),

    P2_COLOR: 'O',
    P1_COLOR: 'X',

    NETP:   sh.gtypes.ONLINE_GAME,
    HUMAN:  sh.gtypes.P1_GAME,
    BOT:    sh.gtypes.P2_GAME,

    GAME_MODE: sh.gtypes.P1_GAME,
    TILE: 8,
    S_OFF: 4,
    GAME_ID: ''
  },

  /**
   * @enum {Number}
   * @readonly
   */
  ftypes: {
    PreUpdate:  100,
    NetPlay:    200,
    Select:     300,
    Motion:     400,
    Move:       500,
    Logic:   600,
    Collide:  700,
    Resolve:    800,
    Render:     900
  },

  /**
   * @memberof module:zotohlab/asx/cfg
   * @property {Object} sound
   */
  sound: {
    volume: 0.5,
    open: false,
    music: {
      volume: 0.5,
      track: null
    }
  },

  /**
   * @memberof module:zotohlab/asx/cfg
   * @method handleResolution
   * @param {cc.Size} rs
   */
  handleResolution(rs) {},

  /**
   * @memberof module:zotohlab/asx/cfg
   * @method runOnce
   */
  runOnce() {}

};

sjs.merge(exports, xbox);
sh.xcfg = xbox;
/*@@
return xbox;
@@*/

//////////////////////////////////////////////////////////////////////////////
//EOF

