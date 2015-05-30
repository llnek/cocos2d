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

    "/public/vendors/cherimoia/skaro.js",
    "/public/vendors/cherimoia/caesar.js",
    "/public/vendors/cherimoia/bus.js",
    "/public/vendors/cherimoia/zlab.js",

    "/public/ig/lib/zotohlab/ext/asterix.js",
    "/public/ig/lib/zotohlab/ext/xcfg.js",
    "/public/ig/lib/zotohlab/ext/cs2dx.js",
    "/public/ig/lib/zotohlab/ext/odin.js",

    "/public/ig/lib/zotohlab/ext/xscenes.js",
    "/public/ig/lib/zotohlab/ext/xpool.js",
    "/public/ig/lib/zotohlab/ext/xloader.js",

    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",

    '/public/ig/lib/game/terra/config.js',
    '/public/ig/lib/game/terra/i18n/game_en_US.js',

'/public/ig/lib/game/terra/elements/cobjs.js',
'/public/ig/lib/game/terra/nodes/gnodes.js',

'/public/ig/lib/game/terra/systems/utils.js',

'/public/ig/lib/game/terra/systems/factory.js',
'/public/ig/lib/game/terra/systems/supervisor.js',
'/public/ig/lib/game/terra/systems/motion.js',
'/public/ig/lib/game/terra/systems/move-missiles.js',
'/public/ig/lib/game/terra/systems/move-bombs.js',
'/public/ig/lib/game/terra/systems/move-ship.js',
'/public/ig/lib/game/terra/systems/levelmgr.js',
'/public/ig/lib/game/terra/systems/collision.js',
'/public/ig/lib/game/terra/systems/resolution.js',
'/public/ig/lib/game/terra/systems/rendering.js',
'/public/ig/lib/game/terra/systems/sysobjs.js',


'/public/ig/lib/game/terra/splash.js',
'/public/ig/lib/game/terra/hud.js',
'/public/ig/lib/game/terra/mmenu.js',
'/public/ig/lib/game/terra/game.js',

'/public/ig/lib/game/terra/protos.js',
'/public/ig/lib/zotohlab/ext/xboot.js'
  ]

};
