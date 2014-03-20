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

(function (undef) { "use strict"; var global= this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var loggr = global.ZotohLabs.logger;
asterix.Pong= {};

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.xcfg = global.ZotohLabs.klass.merge( asterix.XConfig, {

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

  smac: StateMachine.create({
    events: [
        { name: 'genesis',  from: 'none',  to: 'StartScreen' },
        { name: 'play0',  from: 'StartScreen',  to: 'MainMenu' },
        { name: 'quit',  from: 'MainMenu',  to: 'StartScreen' },
        { name: 'play1',  from: 'MainMenu',  to: 'PlayGame' },
        { name: 'play2',  from: 'MainMenu',  to: 'PlayGame' },
        { name: 'play3',  from: 'MainMenu',  to: 'PlayGame' },
        { name: 'settings',  from: 'PlayGame',  to: 'MainMenu' },
        { name: 'back',  from: 'MainMenu',  to: 'PlayGame' },
        { name: 'replay',  from: 'PlayGame',  to: 'ReplayGame' },
        { name: 'resetplay',  from: 'ReplayGame',  to: 'PlayGame' }
    ],
    callbacks: {
        ongenesis: function(ev,fr,to) { sh.main.invoke('Splash'); },
        onplay0: function(ev,fr,to,mainObj) { sh.main.invoke('MMenu'); },
        onquit: function(ev,fr,to) { sh.main.invoke('Splash'); },
        onplay1: function(ev,fr,to) { sh.main.invoke('Arena', 'new-1'); },
        onplay2: function(ev,fr,to) { sh.main.invoke('Arena', 'new-2'); },
        onplay3: function(ev,fr,to) {},
        onsettings: function(ev,fr,to) { sh.main.invoke('MMenu'); },
        onback: function(ev,fr,to) { sh.main.invoke('Arena', 'continue'); },
        onreplay: function(ev,fr,to) { sh.main.invoke('Arena', 'replay'); },
        onresetplay: function(ev,fr,to) {}
    }
  })



});


sh.xcfg.sfxInit();


}).call(this);


