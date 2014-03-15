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
asterix.Bricks= {
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
      asterix.Bricks.startScreen= start_screen;
    },
    onplay0: function(ev,fr,to) {
      asterix.Bricks.mainMenu = new (asterix.Bricks.MainMenu)();
      ig.system.setDelegateEx(asterix.Bricks.mainMenu);
    },
    onquit: function(ev,fr,to) {
      ig.system.setDelegateEx(asterix.Bricks.startScreen);
    },
    onplay1: function(ev,fr,to) {
      asterix.Bricks.mainGame = new (sh.xcfg.game.proto)(1);
      ig.system.setDelegateEx(asterix.Bricks.mainGame);
    },
    onplay2: function(ev,fr,to) {
      asterix.Bricks.mainGame = new (sh.xcfg.game.proto)(2);
      ig.system.setDelegateEx(asterix.Bricks.mainGame);
    },
    onplay3: function(ev,fr,to) {
    },
    onsettings: function(ev,fr,to) {
      ig.system.setDelegateEx(asterix.Bricks.mainMenu);
    },
    onback: function(ev,fr,to) {
      ig.system.setDelegateEx(asterix.Bricks.mainGame);
    },
    onreplay: function(ev,fr,to) {
      asterix.Bricks.mainGame.restart();
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
    BLOCK_COLORS: 7,
    FIELD_SIDE: 1,
    FIELD_TOP: 1,
    FIELD_W: 12,
    FIELD_BOTTOM: 1,
    BTN_SIZE: 32,
    GRID_W: 30,
    GRID_H: 20,
    TILE: 16,
    SIDE: 1
  },

  devices: {
    iphone:{width:480, height:320, scale:1},
    android:{width:480, height:320, scale:1},
    ipad:{width:480, height:320, scale:2},
    default:{width:480, height:320, scale:1}
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
    bricks : {
      main: 'arena.js'
    }
  },

  stages: {
    "1" : {
    }
  },

  smac: smac

});



}).call(this);


