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

"use strict"; /**
              * @requires zotohlab/asterix
              * @requires zotohlab/asx/ccsx
              * @requires zotohlab/asx/xcfg
              * @requires zotohlab/asx/xloader
              * @requires p/config
              * @requires i18n/l10n
              * @requires p/protos
              * @module zotohlab/p/boot
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cfg = require('zotohlab/asx/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _loader = require('zotohlab/asx/loader');

var _loader2 = _interopRequireDefault(_loader);

var _config = require('p/config');

var _config2 = _interopRequireDefault(_config);

var _l10n = require('i18n/l10n');

var _l10n2 = _interopRequireDefault(_l10n);

var _protos = require('p/protos');

var _protos2 = _interopRequireDefault(_protos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////
var ss1 = _cfg2.default.game.start || 'StartScreen',
    sjs = _asterix2.default.skarojs,

/** @alias module:zotohlab/p/boot */
xbox = {},
    R = sjs.ramda,
    undef = void 0;

//////////////////////////////////////////////////////////////////////////
/**
 * Sort out what resolution to use for this device.
 * @return {Array} - search paths
 */
var handleMultiDevices = function handleMultiDevices() {
  var searchPaths = jsb.fileUtils.getSearchPaths(),
      landscape = _cfg2.default.game.landscape,
      pcy = _cfg2.default.resolution.policy,
      fsz = _ccsx2.default.screen(),
      ps = void 0;

  // device window size or canvas size.
  sjs.loggr.info("view.frameSize = [" + fsz.width + ", " + fsz.height + "]");

  // if handler provided, call it and go.
  if (sjs.isfunc(_cfg2.default.handleDevices)) {
    return _cfg2.default.handleDevices();
  }

  // need to prefix "assets" for andriod
  if (fsz.width >= 2048 || fsz.height >= 2048) {
    ps = ['assets/res/hdr', 'res/hdr'];
    _cfg2.default.resolution.resDir = 'hdr';
    _ccsx2.default.setdr(landscape, 2048, 1536, pcy);
  } else if (fsz.width >= 1136 || fsz.height >= 1136) {
    ps = ['assets/res/hds', 'res/hds'];
    _cfg2.default.resolution.resDir = 'hds';
    _ccsx2.default.setdr(landscape, 1136, 640, pcy);
  } else if (fsz.width >= 1024 || fsz.height >= 1024) {
    ps = ['assets/res/hds', 'res/hds'];
    _cfg2.default.resolution.resDir = 'hds';
    _ccsx2.default.setdr(landscape, 1024, 768, pcy);
  } else if (fsz.width >= 960 || fsz.height >= 960) {
    ps = ['assets/res/hds', 'res/hds'];
    _cfg2.default.resolution.resDir = 'hds';
    _ccsx2.default.setdr(landscape, 960, 640, pcy);
  } else {
    ps = ['assets/res/sd', 'res/sd'];
    _cfg2.default.resolution.resDir = 'sd';
    _ccsx2.default.setdr(landscape, 480, 320, pcy);
  }

  ps = ps.concat(['assets/src', 'src']);

  for (var n = 0; n < ps.length; ++n) {
    searchPaths.push(ps[n]);
  }

  sjs.loggr.info("Resource search paths: " + searchPaths);
  return searchPaths;
};

//////////////////////////////////////////////////////////////////////////////
var pvLoadSound = function pvLoadSound(sh, xcfg, k, v) {
  return sh.sanitizeUrl(v + '.' + xcfg.game.sfx);
};
var pvLoadSprite = function pvLoadSprite(sh, xcfg, k, v) {
  return sh.sanitizeUrl(v[0]);
};
var pvLoadImage = function pvLoadImage(sh, xcfg, k, v) {
  return sh.sanitizeUrl(v);
};
var pvLoadTile = function pvLoadTile(sh, xcfg, k, v) {
  return sh.sanitizeUrl(v);
};
var pvLoadAtlas = function pvLoadAtlas(sh, xcfg, k, v) {
  return [sh.sanitizeUrl(v + '.plist'), sh.sanitizeUrl(v + '.png')];
};

//////////////////////////////////////////////////////////////////////////////
//
var pvLoadLevels = function pvLoadLevels(sjs, sh, xcfg) {
  var rc = [],
      f1 = function f1(k) {
    return function (v, n) {
      var a = sjs.reduceObj(function (memo, item, key) {
        var z = [k, n, key].join('.');
        switch (n) {
          case 'sprites':
            memo.push(pvLoadSprite(sh, xcfg, z, item));
            xcfg.assets.sprites[z] = item;
            break;
          case 'images':
            memo.push(pvLoadImage(sh, xcfg, z, item));
            xcfg.assets.images[z] = item;
            break;
          case 'tiles':
            memo.push(pvLoadTile(sh, xcfg, z, item));
            xcfg.assets.tiles[z] = item;
            break;
        }
        return memo;
      }, [], v);
      rc = rc.concat(a);
    };
  };

  sjs.eachObj(function (v, k) {
    sjs.eachObj(f1(k), v);
  }, xcfg.levels);
  return rc;
};

/////////////////////////////////////////////////////////////////////////////
var pvGatherPreloads = function pvGatherPreloads(sjs, sh, xcfg) {
  var assets = xcfg.assets,
      p = void 0,
      rc = [R.values(R.mapObjIndexed(function (v, k) {
    return pvLoadSprite(sh, xcfg, k, v);
  }, assets.sprites)), R.values(R.mapObjIndexed(function (v, k) {
    return pvLoadImage(sh, xcfg, k, v);
  }, assets.images)), R.values(R.mapObjIndexed(function (v, k) {
    return pvLoadSound(sh, xcfg, k, v);
  }, assets.sounds)), sjs.reduceObj(function (memo, v, k) {
    // value is array of [ path, image , xml ]
    p = sh.sanitizeUrl(v[0]);
    return memo.concat([p + '/' + v[1], p + '/' + v[2]]);
  }, [], assets.fonts), sjs.reduceObj(function (memo, v, k) {
    return memo.concat(pvLoadAtlas(sh, xcfg, k, v));
  }, [], assets.atlases), R.values(R.mapObjIndexed(function (v, k) {
    return pvLoadTile(sh, xcfg, k, v);
  }, assets.tiles)), xcfg.game.preloadLevels ? pvLoadLevels(sjs, sh, xcfg) : []];

  return R.reduce(function (memo, v) {
    sjs.loggr.info('Loading ' + v);
    memo.push(v);
    return memo;
  }, [], R.flatten(rc));
};

/////////////////////////////////////////////////////////////////////////////
/**
 * @class MyLoaderScene
 */
var MyLoaderScene = cc.Scene.extend( /** @lends MyLoaderScene# */{
  init: function init() {
    return true;
  },
  _startLoading: function _startLoading() {
    var res = this.resources,
        self = this;

    self.unschedule(self._startLoading);
    cc.loader.load(res, function (result, count, loadedCount) {}, function () {
      if (sjs.isfunc(self.cb)) {
        self.cb();
      }
    });
  },
  initWithResources: function initWithResources(resources, cb) {
    this.resources = resources || [];
    this.cb = cb;
  },
  onEnter: function onEnter() {
    var self = this;
    cc.Node.prototype.onEnter.call(self);
    self.schedule(self._startLoading, 0.3);
  },
  onExit: function onExit() {
    cc.Node.prototype.onExit.call(this);
  }
});

//////////////////////////////////////////////////////////////////////////////
var preLaunchApp = function preLaunchApp(sjs, sh, xcfg, ldr, ss1) {
  var fz = _ccsx2.default.screen(),
      paths = void 0,
      sz = void 0,
      pfx = void 0,
      rs = void 0,
      pcy = void 0;

  if (cc.sys.isNative) {
    paths = handleMultiDevices();
    if (!!paths) {
      jsb.fileUtils.setSearchPaths(paths);
    }
  } else {
    sz = xcfg.game[xcfg.resolution.resDir];
    pcy = xcfg.resolution.web;
    cc.view.setDesignResolutionSize(sz.width, sz.height, pcy);
  }

  rs = cc.view.getDesignResolutionSize();
  xcfg.handleResolution(rs);
  sjs.loggr.info('DesignResolution, = [' + rs.width + ", " + rs.height + "]" + ", scale = " + xcfg.game.scale);

  cc.director.setProjection(cc.Director.PROJECTION_2D);
  if (cc.sys.isNative) {
    pfx = "";
  } else {
    cc.view.resizeWithBrowserSize(true);
    cc.view.adjustViewPort(true);
    pfx = "/public/ig/res/";
  }

  //cc.director.setAnimationInterval(1 / sh.xcfg.game.frameRate);
  if (xcfg.game.debug) {
    cc.director.setDisplayStats(xcfg.game.showFPS);
  }

  rs = [pfx + 'cocos2d/pics/preloader_bar.png', pfx + 'cocos2d/pics/ZotohLab.png'];
  // hack to suppress the showing of cocos2d's logo
  cc.loaderScene = new MyLoaderScene();
  cc.loaderScene.init();
  cc.loaderScene.initWithResources(rs, function () {
    ldr.preload(pvGatherPreloads(sjs, sh, xcfg), function () {
      xcfg.runOnce();
      cc.director.runScene(sh.protos[ss1].reify());
    });
  });
  cc.director.runScene(cc.loaderScene);
};

sjs.loggr.info("About to create Cocos2D HTML5 Game");

preLaunchApp(sjs, _asterix2.default, _cfg2.default, _loader2.default, ss1);
_asterix2.default.l10nInit(), _asterix2.default.sfxInit();

//sjs.merge(me.xcfg.game, global.document.ccConfig);
sjs.loggr.debug(sjs.jsonfy(_cfg2.default.game));
sjs.loggr.info("Registered game start state - " + ss1);
sjs.loggr.info("Loaded and running. OK");


return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF