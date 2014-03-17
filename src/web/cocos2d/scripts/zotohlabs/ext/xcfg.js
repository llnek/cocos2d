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

(function(undef) { "use strict"; var global= this; var _ = global._;
var asterix = global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var loggr = global.ZotohLabs.logger;
var echt = global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XConfig = global.ZotohLabs.klass.merge(asterix.XCfgBase, {

  urlPrefix: '/public/ig/',
  appid: '',

  getImagePath: function(key) {
    var url = this.assets.images[key] || '';
    return sh.sanitizeUrl(url);
  },

  getSfxPath: function(key) {
    var obj = this.assets.sounds[key];
    return obj ? sh.sanitizeUrl(obj[0]) : '';
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
    this.screenHeight = this.VisibleRect.rect().height;
    this.screenWidth = this.VisibleRect.rect().width;
    if (_.isString(sz)) {
      this.game.size = this.devices[sz];
    }
    else
    if (_.isObject(sz)) {
      this.game.size = sz;
    }
  },

  levels: {
  },

  assets: {
    sprites: {
      'gui.audio' : [ 'media/cocos2d/btns/audio_onoff_white.png', 48,48, -1 ]
    },
    tiles: {
      'gui.ynbox' : 'game/{{appid}}/levels/blankscreen.tmx',
      'gui.mmenu' : 'game/{{appid}}/levels/mainmenu.tmx'
    },
    images: {
      'splash.play-btn' : 'media/cocos2d/btns/play_amber_x64.png',
      'splash.splash' : 'media/{{appid}}/gui/splash.png',
      'gui.mmenu.border': 'media/cocos2d/game/{{border-tiles}}',

      "gui.mmenu.replay" : 'media/cocos2d/btns/replay.png',
      "gui.mmenu.quit" : 'media/cocos2d/btns/quit.png',
      "gui.mmenu.back" : 'media/cocos2d/btns/go_back.png',
      "gui.mmenu.ok" : 'media/cocos2d/btns/go_ok.png',
      "gui.mmenu.menu" : 'media/cocos2d/btns/go_mmenu.png',

      /*
      'gui.mmenu.border16': 'media/cocos2d/game/cbox-borders_x16.png',
      'gui.mmenu.border8': 'media/cocos2d/game/cbox-borders_x8.png',
      */
      'gui.mmenu.menu.bg' : 'game/{{appid}}/levels/mainmenu.png',
      'gui.mmenu.bg' : 'game/{{appid}}/levels/bg.png'

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
      'font.Downlink' : [ 'media/cocos2d/fon/{{lang}}/', 'Downlink.png', 'Downlink.fnt' ]
    }
  },

  game: {
    borderTiles: 'cbox-borders_x8.png',
    preloadLevels: true,
    landscape: false,
    size: null,
    gravity: 0,
    version: "",
    trackingID: ""
  },

  smac: null,

  l10n: {
    '%mobileStart' : 'Press Anywhere To Start!',
    '%webStart' : 'Press Spacebar To Start!'
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
    var eng = cc.AudioEngine.getInstance();
    if (this.sound.open) {
      eng.playEffect( this.getSfxPath(key),false);
    }
  },

  AnchorPointCenter: new cc.Point(0.5, 0.5),
  AnchorPointTop: new cc.Point(0.5, 1),
  AnchorPointTopRight: new cc.Point(1, 1),
  AnchorPointRight: new cc.Point(1, 0.5),
  AnchorPointBottomRight: new cc.Point(1, 0),
  AnchorPointBottom: new cc.Point(0.5, 0),
  AnchorPointBottomLeft: new cc.Point(0, 0),
  AnchorPointLeft: new cc.Point(0, 0.5),
  AnchorPointTopLeft: new cc.Point(0, 1),

  s_rcVisible: cc.RectZero(),
  s_ptCenter: cc.PointZero(),
  s_ptTop: cc.PointZero(),
  s_ptTopRight: cc.PointZero(),
  s_ptRight: cc.PointZero(),
  s_ptBottomRight: cc.PointZero(),
  s_ptBottom: cc.PointZero(),
  s_ptLeft: cc.PointZero(),
  s_ptTopLeft: cc.PointZero(),
  s_ptBottomLeft: cc.PointZero(),

  VisibleRect: {
    rect: function () {
      if (sh.xcfg.s_rcVisible.width === 0) {
        var s = cc.Director.getInstance().getWinSize();
        sh.xcfg.s_rcVisible = cc.rect(0, 0, s.width, s.height);
      }
      return sh.xcfg.s_rcVisible;
    },
    center: function () {
      if (sh.xcfg.s_ptCenter.x === 0) {
        var rc = this.rect();
        sh.xcfg.s_ptCenter.y = rc.y + rc.height / 2;
        sh.xcfg.s_ptCenter.x = rc.x + rc.width / 2;
      }
      return sh.xcfg.s_ptCenter;
    },
    top: function () {
      if (sh.xcfg.s_ptTop.x === 0) {
        var rc = this.rect();
        sh.xcfg.s_ptTop.x = rc.x + rc.width / 2;
        sh.xcfg.s_ptTop.y = rc.y + rc.height;
      }
      return sh.xcfg.s_ptTop;
    },
    topRight: function () {
      if (sh.xcfg.s_ptTopRight.x === 0) {
        var rc = this.rect();
        sh.xcfg.s_ptTopRight.y = rc.y + rc.height;
        sh.xcfg.s_ptTopRight.x = rc.x + rc.width;
      }
      return sh.xcfg.s_ptTopRight;
    },
    right: function () {
      if (sh.xcfg.s_ptRight.x === 0) {
        var rc = this.rect();
        sh.xcfg.s_ptRight.y = rc.y + rc.height / 2;
        sh.xcfg.s_ptRight.x = rc.x + rc.width;
      }
      return sh.xcfg.s_ptRight;
    },
    bottomRight: function () {
      if (sh.xcfg.s_ptBottomRight.x === 0) {
        var rc = this.rect();
        sh.xcfg.s_ptBottomRight.x = rc.x + rc.width;
        sh.xcfg.s_ptBottomRight.y = rc.y;
      }
      return sh.xcfg.s_ptBottomRight;
    },
    bottom: function () {
      if (sh.xcfg.s_ptBottom.x === 0) {
        var rc = this.rect();
        sh.xcfg.s_ptBottom.x = rc.x + rc.width / 2;
        sh.xcfg.s_ptBottom.y = rc.y;
      }
      return sh.xcfg.s_ptBottom;
    },
    bottomLeft: function () {
      return sh.xcfg.s_ptBottomLeft;
    },
    left: function () {
      if (sh.xcfg.s_ptLeft.x === 0) {
        var rc = this.rect();
        sh.xcfg.s_ptLeft.y = rc.y + rc.height / 2;
        sh.xcfg.s_ptLeft.x = rc.x;
      }
      return sh.xcfg.s_ptLeft;
    },
    topLeft: function () {
      if (sh.xcfg.s_ptTopLeft.x === 0) {
        var rc = this.rect();
        sh.xcfg.s_ptTopLeft.y = rc.y + rc.height;
        sh.xcfg.s_ptTopLeft.x = rc.x;
      }
      return sh.xcfg.s_ptTopLeft;
    }
  },

  sfxInit: function() {
    var eng= cc.AudioEngine.getInstance();
    eng.setMusicVolume(this.sound.volume);
    if (!cc.AudioEngine.getInstance()._soundSupported) {
      this.sound.open=false;
    }
  },

  protos: {}

});

global.ZotohLabs.klass.merge(asterix.XConfig.game, global.document.ccConfig);


}).call(this);


