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

(function(undef) { "use strict"; var global= this, _ = global._ ,
asterix = global.ZotohLab.Asterix,
sh= asterix.Shell,
echt = global.SkaroJS.echt,
loggr = global.SkaroJS.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

//asterix.XConfig = global.SkaroJS.klass.merge(asterix.XCfgBase, {
asterix.XConfig = {

  urlPrefix: '/public/ig/',
  appid: '',
  color: '',

  getImagePath: function(key) {
    var url = this.assets.images[key] || '';
    return sh.sanitizeUrl(url);
  },

  getPListPath: function(key) {
    var url = this.assets.atlases[key] || '';
    return sh.sanitizeUrl(url + '.plist');
  },

  getAtlasPath: function(key) {
    var url = this.assets.atlases[key] || '';
    return sh.sanitizeUrl(url + '.png');
  },

  getSfxPath: function(key) {
    var url = this.assets.sounds[key];
    return url ? sh.sanitizeUrl( url + '.' + this.game.sfx) : '';
  },

  getSpritePath: function(key) {
    var obj = this.assets.sprites[key];
    return obj ? sh.sanitizeUrl(obj[0]) : '';
  },

  getTilesPath: function(key) {
    var url = this.assets.tiles[key] || '';
    return sh.sanitizeUrl(url);
  },

  getFontPath: function(key) {
    var obj = this.assets.fonts[key];
    return obj ? sh.sanitizeUrl(obj[0]) + obj[2] : '';
  },

  setGameSize: function(sz) {
    if (_.isString(sz)) {
      this.game.size = this.devices[sz];
    }
    else
    if (_.isObject(sz)) {
      this.game.size = sz;
    }
  },

  runOnce: function() {},

  levels: {
  },

  assets: {
    sprites: {
      'gui.audio' : [ 'media/cocos2d/btns/{{color}}/audio_onoff.png', 48,48, -1 ]
    },
    atlases : {
    },
    tiles: {
      'gui.ynbox' : 'game/{{appid}}/levels/blankscreen.tmx',
      'gui.mmenu' : 'game/{{appid}}/levels/mainmenu.tmx'
    },
    images: {
      'splash.splash' : 'media/{{appid}}/gui/splash.png',

      "gui.mmenu.replay" : 'media/cocos2d/btns/{{color}}/replay.png',
      "gui.mmenu.quit" : 'media/cocos2d/btns/{{color}}/quit.png',
      "gui.mmenu.back" : 'media/cocos2d/btns/{{color}}/go_back.png',
      "gui.mmenu.ok" : 'media/cocos2d/btns/{{color}}/go_ok.png',
      "gui.mmenu.menu" : 'media/cocos2d/btns/{{color}}/go_mmenu.png',

      /*
      'gui.mmenu.border16': 'media/cocos2d/game/cbox-borders_x16.png',
      'gui.mmenu.border8': 'media/cocos2d/game/cbox-borders_x8.png',
      */
      'gui.mmenu.menu.bg' : 'game/{{appid}}/levels/mainmenu.png',
      'gui.mmenu.bg' : 'game/{{appid}}/levels/bg.png',
      'gui.mmenu.border': 'game/{{appid}}/levels/{{border-tiles}}'

    },
    sounds: {
    },
    fonts: {
      'font.TinyBoxBB' : [ 'media/cocos2d/fon/{{lang}}/', 'TinyBoxBlackBitA8.png', 'TinyBoxBlackBitA8.fnt' ],
      'font.LaffRiotNF' : [ 'media/cocos2d/fon/{{lang}}/', 'LaffRiotNF.png', 'LaffRiotNF.fnt' ],
      'font.JellyBelly' : [ 'media/cocos2d/fon/{{lang}}/', 'JellyBelly.png', 'JellyBelly.fnt' ],
      'font.Subito' : [ 'media/cocos2d/fon/{{lang}}/', 'Subito.png', 'Subito.fnt' ],
      'font.OogieBoogie' : [ 'media/cocos2d/fon/{{lang}}/', 'OogieBoogie.png', 'OogieBoogie.fnt' ],
      'font.DigitalDream' : [ 'media/cocos2d/fon/{{lang}}/', 'DigitalDream.png', 'DigitalDream.fnt' ],
      'font.AutoMission' : [ 'media/cocos2d/fon/{{lang}}/', 'AutoMission.png', 'AutoMission.fnt' ],
      'font.ConvWisdom' : [ 'media/cocos2d/fon/{{lang}}/', 'ConvWisdom.png', 'ConvWisdom.fnt' ],
      'font.Ubuntu' : [ 'media/cocos2d/fon/{{lang}}/', 'Ubuntu.png', 'Ubuntu.fnt' ],
      'font.OCR' : [ 'media/cocos2d/fon/{{lang}}/', 'OCR.png', 'OCR.fnt' ],
      'font.Downlink' : [ 'media/cocos2d/fon/{{lang}}/', 'Downlink.png', 'Downlink.fnt' ]
    }
  },

  game: {
    borderTiles: 'cbox-borders_x8.png',
    preloadLevels: true,
    sfx: 'mp3',
    landscape: false,
    size: null,
    gravity: 0,
    version: "",
    trackingID: ""
  },

  smac: null,

  l10n: {
    "en-US" : {
      '%mobileStart' : 'Press Anywhere To Start!',
      '%webStart' : 'Press Spacebar To Start!',

      "%player2" : 'Player 2',
      "%player1" : 'Player 1',
      "%computer" : 'Computer',
      "%cpu" : "CPU",

      "%2players" : '2 Players',
      "%1player" : '1 Player',
      "%online" : 'Online',

      "%quit!" : 'Quit',
      "%back" : 'Back',
      "%ok" : 'OK',

      "%mmenu" : 'Main Menu',
      "%replay" : 'REPLAY',
      "%play" : 'PLAY',

      "%quit?" : 'Continue to quit game?'
    }
  },

  devices: {
    iphone:{width:240, height:160, scale:2},
    android:{width:240, height:160, scale:2},
    ipad:{width:240, height:160, scale:4},
    default:{width:240, height:160, scale:3}
  },

  csts: {
    // 1 = single player
    // 2 = 2 players
    // 3 = network, multi players
    GAME_MODE: 1,
    TILE: 8,
    S_OFF: 4
  },

  sound: {
    volume: 0.5,
    open: true,
    music: {
      volume: 0.5,
      track: null
    }
  },

  setDeviceSizes: function (obj) {
    if (_.isObject(obj)) { this.devices= obj; }
  },

  toggleSfx: function(override) {
    this.sound.open = echt(override) ? override : !this.sound.open;
    if (!cc.AudioEngine.getInstance()._soundSupported) {
      this.sound.open=false;
    }
  },

  sfxPlay: function(key) {
    var eng = cc.AudioEngine.getInstance(),
    url;
    if (this.sound.open) {
      url = this.getSfxPath(key);
      if (url) {
        eng.playEffect( url, false);
      }
    }
  },

  sfxInit: function() {
    var eng= cc.AudioEngine.getInstance();
    eng.setMusicVolume(this.sound.volume);
    if (!eng._soundSupported) {
      this.sound.open=false;
    }
  },

  sanitizeUrl: function(url) {
    // ensure we tell mustache not to escape html
    url = url || '';
    if (url.match(/^media/)) {
      url = '{{{media-ref}}}/' + url;
    }
    else
    if (url.match(/^game/)) {
      url = '{{{gamesource-ref}}}/' + url;
    }
    return Mustache.render( url, {
      'border-tiles' : this.game.borderTiles,
      'gamesource-ref' : '/public/ig/lib',
      'media-ref' : '/public/ig',
      'lang' : sh.lang,
      'color' : this.color,
      'appid' :  this.appid } );
  },

  newApplication: function() {
    var me=this; return {
      run: function() {
        cc.game.onStart= function() {
          loggr.info("About to create Cocos2D HTML5 Game");
          var app= new asterix.Cocos2dApp('StartScreen');
          sh.l10nInit(me.l10n);
          me.sfxInit();
          loggr.info("registered game start state - " + app.startScene);
          loggr.debug(JSON.stringify(me.game));
          loggr.info("loaded and running. OK");
        };
        cc.game.run();
      }
    };
  }

};

global.SkaroJS.klass.merge(asterix.XConfig.game, global.document.ccConfig);


}).call(this);


