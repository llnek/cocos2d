// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global= this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var loggr = global.ZotohLabs.logger;
asterix.Asteroids= {
};
var smac = StateMachine.create({
  //initial: 'none',
  events: [
    { name: 'genesis',  from: 'none',  to: 'start_screen' },

    { name: 'play0',  from: 'start_screen',  to: 'main_menu' },
    { name: 'quit',  from: 'main_menu',  to: 'start_screen' },

    { name: 'play1',  from: 'main_menu',  to: 'play_game' },
    { name: 'play2',  from: 'main_menu',  to: 'play_game' },
    { name: 'play3',  from: 'main_menu',  to: 'play_game' },

    { name: 'settings',  from: 'play_game',  to: 'main_menu' },
    { name: 'back',  from: 'main_menu',  to: 'play_game' },

    { name: 'replay',  from: 'play_game',  to: 'replay_game' },
    { name: 'resetplay',  from: 'replay_game',  to: 'play_game' }
  ],
  callbacks: {
    ongenesis: function(ev,fr,to,start_screen) {
      loggr.debug("ongenesis() called.");
      asterix.Asteroids.startScreen= start_screen;
    },
    onplay0: function(ev,fr,to) {
      asterix.Asteroids.mainMenu = new (asterix.Asteroids.MainMenu)();
      ig.system.setDelegateEx(asterix.Asteroids.mainMenu);
    },
    onquit: function(ev,fr,to) {
      ig.system.setDelegateEx(asterix.Asteroids.startScreen);
    },
    onplay1: function(ev,fr,to) {
      asterix.Asteroids.mainGame = new (sh.xcfg.game.proto)(1);
      ig.system.setDelegateEx(asterix.Asteroids.mainGame);
    },
    onplay2: function(ev,fr,to) {
      asterix.Asteroids.mainGame = new (sh.xcfg.game.proto)(2);
      ig.system.setDelegateEx(asterix.Asteroids.mainGame);
    },
    onplay3: function(ev,fr,to) {
    },
    onsettings: function(ev,fr,to) {
      ig.system.setDelegateEx(asterix.Asteroids.mainMenu);
    },
    onback: function(ev,fr,to) {
      ig.system.setDelegateEx(asterix.Asteroids.mainGame);
    },
    onreplay: function(ev,fr,to) {
      asterix.Asteroids.mainGame.restart();
    },
    onresetplay: function(ev,fr,to) {
      loggr.debug("onresetplay() called.");
    }
  }
});

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.xcfg = ig.merge( asterix.XConfig, {

  csts: {

    BTN_SIZE: 32,
    GRID_W: 80,
    GRID_H: 60,
    TILE: 8,
    SIDE: 1
  },

  devices: {
    iphone:{width:640, height:480, scale:1},
    android:{width:640, height:480, scale:1},
    ipad:{width:640, height:480, scale:1},
    default:{width:640, height:480, scale:1}
  },

  levels: {
    startscreen : {
      main: 'startscreen.js'
    },
    confirmbox : {
      main: 'blankscreen.js'
    },
    mainmenu : {
      main: 'mainmenu.js'
    },
    asteroids : {
      main: 'arena.js'
    }
  },

  stages: {
    "1" : {
      BOULDERS: 5,
      ROCKS: 3,
      STONES: 5
    }
  },

  smac: smac

});



}).call(this);


