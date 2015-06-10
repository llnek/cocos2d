document.ccConfig = {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 30,

  // 0(default), 1(Canvas only), 2(WebGL only)
  renderMode: 0,
  debugMode: 1,

  id: 'gameArea',

  engineDir: ['/public/extlibs/cocos2d-html5'],
  modules: [ 'cocos2d', 'ccui' ],

  jsList: [

    "/public/vendors/ramda/ramda.js",
    "/public/vendors/l10njs/l10n.js",
    "/public/vendors/mustache/mustache.js",
    "/public/vendors/helpers/dbg.js",

    "/public/vendors/js-signals/signals.js",
    "/public/vendors/ash-js/ash.js",

    "/public/vendors/rxjs/rx.all.js",

    "/public/vendors/cherimoia/skaro.js",
    "/public/vendors/cherimoia/caesar.js",
    "/public/vendors/cherimoia/ebus.js",

    "/public/ig/lib/zotohlab/asx/asterix.js",
    "/public/ig/lib/zotohlab/asx/cfg.js",
    "/public/ig/lib/zotohlab/asx/ccsx.js",
    "/public/ig/lib/zotohlab/asx/odin.js",

    "/public/ig/lib/zotohlab/asx/scenes.js",
    "/public/ig/lib/zotohlab/asx/pool.js",
    "/public/ig/lib/zotohlab/asx/loader.js",

    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",

    '/public/ig/lib/game/terra/p/config.js',
    '/public/ig/lib/game/terra/i18n/l10n.js',

'/public/ig/lib/game/terra/n/cobjs.js',
'/public/ig/lib/game/terra/n/gnodes.js',

'/public/ig/lib/game/terra/s/utils.js',

'/public/ig/lib/game/terra/s/factory.js',
'/public/ig/lib/game/terra/s/supervisor.js',
'/public/ig/lib/game/terra/s/motion.js',
'/public/ig/lib/game/terra/s/movemissiles.js',
'/public/ig/lib/game/terra/s/movebombs.js',
'/public/ig/lib/game/terra/s/moveship.js',
'/public/ig/lib/game/terra/s/levelmgr.js',
'/public/ig/lib/game/terra/s/collision.js',
'/public/ig/lib/game/terra/s/resolution.js',
'/public/ig/lib/game/terra/s/rendering.js',
'/public/ig/lib/game/terra/s/sysobjs.js',


'/public/ig/lib/game/terra/p/splash.js',
'/public/ig/lib/game/terra/p/hud.js',
'/public/ig/lib/game/terra/p/mmenu.js',
'/public/ig/lib/game/terra/p/game.js',
'/public/ig/lib/game/terra/p/protos.js',


'/public/ig/lib/zotohlab/p/boot.js'
  ]

};

