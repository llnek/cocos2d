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

define("zotohlab/asx/xcfg", ['cherimoia/skarojs',
                            'zotohlab/asterix'],
  function (sjs, sh) { "use strict";

    var R= sjs.ramda,
    undef,
    config = {

      urlPrefix: '/public/ig/',
      appid: '',
      color: '',

      levels: {
      },

      assets: {
        sprites: {
          'gui.audio' : [ 'res/cocos2d/btns/{{color}}/audio_onoff.png', 48,48, -1 ]
        },
        atlases : {
        },
        tiles: {
          'gui.blank' : 'game/{{appid}}/levels/blankscreen.tmx',
          'gui.mmenu' : 'game/{{appid}}/levels/mainmenu.tmx'
        },
        images: {
          'splash.splash' : 'res/{{appid}}/ui/splash.png',

          "gui.mmenu.replay" : 'res/cocos2d/btns/{{color}}/replay.png',
          "gui.mmenu.quit" : 'res/cocos2d/btns/{{color}}/quit.png',
          "gui.mmenu.back" : 'res/cocos2d/btns/{{color}}/go_back.png',
          "gui.mmenu.ok" : 'res/cocos2d/btns/{{color}}/go_ok.png',
          "gui.mmenu.menu" : 'res/cocos2d/btns/{{color}}/go_mmenu.png',

          /*
          'gui.mmenu.border16': 'res/cocos2d/pics/cbox-borders_x16.png',
          'gui.mmenu.border8': 'res/cocos2d/pics/cbox-borders_x8.png',
          */
          'gui.mmenu.menu.bg' : 'game/{{appid}}/levels/mainmenu.png',
          'gui.mmenu.bg' : 'game/{{appid}}/levels/bg.png',
          'gui.mmenu.border': 'game/{{appid}}/levels/{{border-tiles}}',

          'gui.edit.orange' : 'res/cocos2d/pics/orange_edit.png',
          'gui.edit.green' : 'res/cocos2d/pics/green_edit.png',
          'gui.edit.yellow' : 'res/cocos2d/pics/yellow_edit.png'

        },
        sounds: {
          'start_game' : 'res/cocos2d/sfx/PowerUp'
        },
        fonts: {
          'font.TinyBoxBB' : [ 'res/cocos2d/fon/{{lang}}', 'TinyBoxBlackBitA8.png', 'TinyBoxBlackBitA8.fnt' ],
          'font.LaffRiotNF' : [ 'res/cocos2d/fon/{{lang}}', 'LaffRiotNF.png', 'LaffRiotNF.fnt' ],
          'font.JellyBelly' : [ 'res/cocos2d/fon/{{lang}}', 'JellyBelly.png', 'JellyBelly.fnt' ],
          'font.Subito' : [ 'res/cocos2d/fon/{{lang}}', 'Subito.png', 'Subito.fnt' ],
          'font.OogieBoogie' : [ 'res/cocos2d/fon/{{lang}}', 'OogieBoogie.png', 'OogieBoogie.fnt' ],
          'font.DigitalDream' : [ 'res/cocos2d/fon/{{lang}}', 'DigitalDream.png', 'DigitalDream.fnt' ],
          'font.AutoMission' : [ 'res/cocos2d/fon/{{lang}}', 'AutoMission.png', 'AutoMission.fnt' ],
          'font.ConvWisdom' : [ 'res/cocos2d/fon/{{lang}}', 'ConvWisdom.png', 'ConvWisdom.fnt' ],
          'font.Ubuntu' : [ 'res/cocos2d/fon/{{lang}}', 'Ubuntu.png', 'Ubuntu.fnt' ],
          'font.OCR' : [ 'res/cocos2d/fon/{{lang}}', 'OCR.png', 'OCR.fnt' ],
          'font.Downlink' : [ 'res/cocos2d/fon/{{lang}}', 'Downlink.png', 'Downlink.fnt' ]
        }
      },

      game: {
        borderTiles: 'cbox-borders_x8.png',
        preloadLevels: true,
        sfx: 'mp3',
        landscape: false,
        size: {},
        gravity: 0,
        version: "",
        trackingID: ""
      },

      smac: null,

      l10nTable: {
        "en-US" : {
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

          "%waitothers" : 'Waiting for other players to join...',
          "%waitother" : 'Waiting for another player to join...',
          "%signinplay" : 'Please sign in to play.',

          "%quit?" : 'Continue to quit game?'
        }
      },

      csts: {
        // 1 = single player
        // 2 = 2 players
        // 3 = network, multi players
        GAME_MODE: sh.P1_GAME,
        TILE: 8,
        S_OFF: 4,
        GAME_ID: ''
      },

      sound: {
        volume: 0.5,
        open: false,
        music: {
          volume: 0.5,
          track: null
        }
      },

      runOnce: function() {}

    };


    return sh.xcfg=config;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

